from dotenv import load_dotenv
import os
from sqlalchemy import Column, String, DateTime, Text, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

username = os.getenv("DATABASE_USER")
password = os.getenv("DATABASE_PASS")
host = os.getenv("DATABASE_HOST")
port = os.getenv("DATABASE_PORT")
dbname = os.getenv("DATABASE_NAME")

DATABASE_URL = f"postgresql://postgres:{password}@db.{username}.supabase.co:{port}/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
