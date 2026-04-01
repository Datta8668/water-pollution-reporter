from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentCreate(BaseModel):
    title: str
    description: Optional[str]
    latitude: float
    longitude: float
    address: Optional[str]
    photo_url: Optional[str]

class IncidentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    latitude: float
    longitude: float
    address: Optional[str]
    photo_url: Optional[str]

    pollution_type: str
    severity: str
    status: str

    created_at: datetime

    class Config:
        from_attributes = True




class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    assigned_officer_id: Optional[int] = None
