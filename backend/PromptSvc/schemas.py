from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class QueryRequest(BaseModel):
    url: str


class QueryResponse(BaseModel):
    id: str
    site_url: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    prompts: Optional[List[str]] = None
    answers: Optional[List[List[str]]] = None
    error: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)


class ScrapeResponse(BaseModel):
    site_url: str
    response: dict
    final_score: int
