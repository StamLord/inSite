from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class QueryRequest(BaseModel):
    url: str


class QueryResponse(BaseModel):
    id: str
    site_url: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    known: Optional[bool] = None
    summary: Optional[str] = None
    confidence: Optional[str] = None
    reasoning: Optional[str] = None
    prompts: Optional[List[str]] = None
    answers: Optional[List[List[str]]] = None
    scores: Optional[List[int]] = None
    scrape: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ScrapeResponse(BaseModel):
    site_url: str
    response: dict
