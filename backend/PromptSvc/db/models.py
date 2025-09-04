from sqlalchemy import Column, String, DateTime, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from db.db import Base


class QueryRecord(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True)
    site_url = Column(String, index=True, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    known = Column(JSONB, nullable=True)
    summary = Column(JSONB, nullable=True)
    confidence = Column(JSONB, nullable=True)
    reasoning = Column(JSONB, nullable=True)
    prompts = Column(JSONB, nullable=True)
    answers = Column(JSONB, nullable=True)
    scores = Column(JSONB, nullable=True)
    scrape = Column(JSONB, nullable=True)
    technical_scan = Column(JSONB, nullable=True)
    error = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("status IN ('pending', 'complete', 'error')", name="status_check"),
    )


class UserRecord(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, nullable=True)
