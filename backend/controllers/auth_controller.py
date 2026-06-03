from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from auth.jwt_utils import verify_password, create_access_token

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.senha_hash):
        return False
    return user

def login_for_access_token(db: Session, username: str, password: str):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username, "cargo": user.cargo, "id": user.id, "nome": user.nome}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nome": user.nome,
            "cargo": user.cargo
        }
    }
