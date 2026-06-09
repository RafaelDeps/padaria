from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db
from models.user import User
from controllers.auth_controller import login_for_access_token
from auth.middleware import manager_only
from auth.jwt_utils import get_password_hash

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class UserRegisterRequest(BaseModel):
    nome: str
    username: str
    password: str
    cargo: str

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    return login_for_access_token(db, login_data.username, login_data.password)

@router.post("/register")
def register(user_data: UserRegisterRequest, db: Session = Depends(get_db), current_user=Depends(manager_only)):
    # Verify if user already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = User(
        nome=user_data.nome,
        username=user_data.username,
        senha_hash=get_password_hash(user_data.password),
        cargo=user_data.cargo
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}
