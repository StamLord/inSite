from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from uuid import uuid4
from db import SessionLocal, engine
from models import Base, QueryRecord
from schemas import QueryRequest, QueryResponse, ScrapeResponse
from openai_client import get_brand_recognition, get_prompts_chatgpt, ask_chatgpt, get_optimization_score
from score import get_score
from datetime import datetime
from url_utils import minimize_url, maximize_url
from scraper import scrape_site
import os
from dotenv import load_dotenv

# Creates all models registered under Base
Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()
origins = [
    os.getenv("CROSS_ORIGIN_FRONTEND_URL"),
]

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


@app.post("/query", response_model=QueryResponse)
def submit_query(req: QueryRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    print(f"Got new query request: {req}")
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


def scrape(url: str):
    url = maximize_url(url)
    scraped, technical_scan = scrape_site(url)
    summary = get_optimization_score(scraped)

    return summary, technical_scan
