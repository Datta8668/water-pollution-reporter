from pydantic import BaseModel

class ZoneOut(BaseModel):
    id: int
    name: str
    city: str
    state: str
    risk_score: float

    class Config:
        from_attributes = True
