from pydantic import BaseModel
from typing import Optional

# For user registration
class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str]
    password: str
    role: str

# For login
class UserLogin(BaseModel):
    email: str
    password: str

# For API response (NO password)
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    zone_id: Optional[int]

    class Config:
        from_attributes = True

# For JWT token
from typing import Optional, Dict, Any
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[Dict[str, Any]] = None

# Token + user (for frontend login redirect) - ensures role is sent
class TokenWithUser(Token):
    user: UserOut
