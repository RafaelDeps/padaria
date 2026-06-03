from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .base import Base

class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    cargo = Column(String(20), nullable=False) # 'GERENTE' or 'ATENDENTE'
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
