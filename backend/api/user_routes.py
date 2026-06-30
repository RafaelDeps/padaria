from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from models.database import get_db
from models.user import User
from auth.middleware import manager_only

router = APIRouter(prefix="/usuarios", tags=["Users"])

class UserResponse(BaseModel):
    id: int
    nome: str
    username: str
    cargo: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db), current_user=Depends(manager_only)):
    return db.query(User).all()