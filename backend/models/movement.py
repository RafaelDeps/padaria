from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from .base import Base

class Movement(Base):
    __tablename__ = "historico_movimentacoes"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String(10), nullable=False) # 'ENTRADA' or 'SAIDA'
    quantidade = Column(Integer, nullable=False)
    data_hora = Column(DateTime(timezone=True), server_default=func.now())
    observacao = Column(String, nullable=True)

    __table_args__ = (
        CheckConstraint(tipo.in_(['ENTRADA', 'SAIDA']), name='check_tipo_movimentacao'),
    )
