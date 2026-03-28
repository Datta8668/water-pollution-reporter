from pydantic import BaseModel
from datetime import datetime

class NotificationOut(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: datetime
    incident_id: int

    class Config:
        from_attributes = True
