from sqlalchemy import Column, Integer, String, DECIMAL, Date, Boolean, DateTime
from sqlalchemy.sql import func
from .base import Base

class Product(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    categoria = Column(String(100), nullable=False)
    quantidade_atual = Column(Integer, default=0)
    estoque_minimo = Column(Integer, nullable=False)
    preco_unitario = Column(DECIMAL(10, 2), nullable=False)
    data_validade = Column(Date, nullable=False)
    is_ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
