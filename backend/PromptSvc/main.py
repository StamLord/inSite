from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException, status, Request, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from uuid import uuid4
from db.db import SessionLocal, engine
from db.models import Base, QueryRecord, UserRecord, IPRecord
from datetime import date
from api.schemas.query import QueryRequest, QueryResponse
from api.schemas.scrape import ScrapeResponse
from api.schemas.user import UserCreateRequest, UserLoginRequest, UserRegisterResponse, GetUserResponse
from api.openai_client import get_brand_recognition, get_prompts_chatgpt, ask_chatgpt, get_optimization_score
from api.score import get_score
from datetime import datetime
from api.url_utils import minimize_url, maximize_url
from api.scraper import scrape_site
from api.encrypt import hash_password, verify_password
from api.auth import create_access_token, verify_access_token
import os
from dotenv import load_dotenv

# Creates all models registered under Base
Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()
origins = [
    os.getenv("CROSS_ORIGIN_FRONTEND_URL"),
]

cookie_domain = os.getenv("COOKIE_DOMAIN")
MAX_DAILY_QUERIES = int(os.getenv("MAX_DAILY_QUERIES", 5))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

epoch = datetime(1970, 1, 1)  # Default time for "Not Found" responses


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_ip(req):
    ip = req.client.host

    forwarded = req.headers.get("X-Forwarded-For")
    if forwarded:
        ip = forwarded.split(",")[0]

    return ip


def increment_ip_count(db, ip):
    stmt = insert(IPRecord).values(ip=ip, date=date.today(), count=1)
    stmt = stmt.on_conflict_do_update(
        index_elements={"ip", "date"},
        set_={"count": IPRecord.count + 1}
    ).returning(IPRecord.count)

    new_count = db.execute(stmt).scalar_one()
    db.commit()
    return new_count


@app.post("/query", response_model=QueryResponse)
def submit_query(req: QueryRequest, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    print(f"Got new query request: {req}")

    ip = get_ip(request)
    count = increment_ip_count(db, ip)
    print(f"From: {ip} uses: {count}/{MAX_DAILY_QUERIES}")

    if count > MAX_DAILY_QUERIES:
        raise HTTPException(status_code=429, detail="Max daily limit reached")

    qid = str(uuid4())
    entry = QueryRecord(id=qid, site_url=req.url)
    db.add(entry)
    db.commit()
    background_tasks.add_task(run_llm_query_task, qid, req.url)
    return QueryResponse.from_orm(entry)


def run_llm_query_task(query_id: str, url: str):
    max_url = maximize_url(url)
    min_url = minimize_url(url)
    db = SessionLocal()
    try:
        entry = db.query(QueryRecord).get(query_id)
        try:
            print("run_llm_query_task: Getting brand recognition...")
            brand_recognition = get_brand_recognition(min_url)
            if brand_recognition:
                entry.known = brand_recognition["known"]
                entry.summary = brand_recognition["summary"]
                entry.confidence = brand_recognition["confidence"]
                entry.reasoning = brand_recognition["reasoning"]

            if brand_recognition["known"]:
                print("run_llm_query_task: Getting prompts...")
                prompts = get_prompts_chatgpt(min_url)
                if prompts:
                    print("run_llm_query_task: Prompt received.")
                    entry.prompts = prompts

                    print("run_llm_query_task: Getting answers...")
                    answers = []
                    scores = []
                    for prompt in prompts:
                        answer = ask_chatgpt(prompt)
                        answers.append(answer)
                        scores.append(get_score(min_url, prompt, answer))

                    print("run_llm_query_task: Answers received.")
                    entry.answers = answers
                    entry.scores = scores
            else:
                print("run_llm_query_task: Brand not known!")

            print("run_llm_query_task: Scraping site...")
            summary, technical_scan = scrape(max_url)
            if summary:
                entry.scrape = summary
            if technical_scan:
                entry.technical_scan = technical_scan

            print("run_llm_query_task: Query completed.")
            entry.status = "complete"
            entry.completed_at = datetime.utcnow()

        except Exception as e:
            print("run_llm_query_task failed: ", e)
            entry.status = "error"
            entry.error = str(e)
        db.commit()
    finally:
        db.close()


@app.get("/query/{query_id}", response_model=QueryResponse)
def get_query(query_id: str, db: Session = Depends(get_db)):
    entry = db.query(QueryRecord).get(query_id)

    if not entry:
        return QueryResponse(
            id="-1",
            site_url="",
            created_at=epoch,
            status="",
            error=["Query not found"]
        )
    return QueryResponse.from_orm(entry)


@app.post("/scrape", response_model=ScrapeResponse)
def submit_scrape(req: QueryRequest, background_tasks: BackgroundTasks):
    print(f"Got new scrape request: {req}")
    summary, technical_scan = scrape(req.url)

    return ScrapeResponse(
            site_url=req.url,
            summary=summary,
            technical_scan=technical_scan,
        )


@app.post("/upvote/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
def upvote(query_id: str, db: Session = Depends(get_db)):
    report = db.get(QueryRecord, query_id)

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.feedback = 1
    db.commit()


@app.post("/downvote/{query_id}", status_code=status.HTTP_204_NO_CONTENT)
def downvote(query_id: str, db: Session = Depends(get_db)):
    report = db.get(QueryRecord, query_id)

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.feedback = -1
    db.commit()


def scrape(url: str):
    url = maximize_url(url)
    scraped, technical_scan = scrape_site(url)
    summary = get_optimization_score(scraped)

    return summary, technical_scan


@app.post("/register", response_model=UserRegisterResponse)
def register(user: UserCreateRequest, db: Session = Depends(get_db)):
    # User already exists
    if db.query(UserRecord).filter(UserRecord.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    qid = str(uuid4())
    new_user = UserRecord(
        id=qid,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserRegisterResponse(message="success")


@app.post("/login")
def login(user: UserLoginRequest, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(UserRecord).filter(UserRecord.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.id})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=3600,
        domain=cookie_domain
    )

    return {"message": "Logged in successfully"}


JWT_EXCEPTION = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_token_from_cookie(access_token: str = Cookie(None)):
    if not access_token:
        raise JWT_EXCEPTION
    return access_token


@app.get("/get_me", response_model=GetUserResponse)
def get_me(token: str = Depends(get_token_from_cookie), db: Session = Depends(get_db)):
    payload = verify_access_token(token)
    if payload is None:
        raise JWT_EXCEPTION

    user_id = payload.get("sub")
    if user_id is None:
        raise JWT_EXCEPTION

    db_user = db.get(UserRecord, user_id)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return GetUserResponse(
        user_id=user_id,
        email=db_user.email
    )
