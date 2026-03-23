from pydantic import BaseModel

class ZoneOut(BaseModel):
    id: int
    name: str
    city: str
    state: str
    risk_score: float

    class Config:
        orm_mode = True
