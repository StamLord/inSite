from sqlalchemy import Column, String, DateTime, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from db import Base


class QueryRecord(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True)
    site_url = Column(String, index=True, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    prompts = Column(JSONB, nullable=True)
    answers = Column(JSONB, nullable=True)
    scores = Column(JSONB, nullable=True)
    error = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("status IN ('pending', 'complete', 'error')", name="status_check"),
    )
