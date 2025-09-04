from pydantic import BaseModel


class ScrapeResponse(BaseModel):
    site_url: str
    summary: dict
    technical_scan: dict

