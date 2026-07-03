from sqlalchemy import Column, Integer, String, DECIMAL, Date, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
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
    is_manufactured = Column(Boolean, default=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships for recipes
    ingredients = relationship("RecipeIngredient", foreign_keys="RecipeIngredient.product_id", back_populates="product")
    used_as_ingredient = relationship("RecipeIngredient", foreign_keys="RecipeIngredient.ingredient_id", back_populates="ingredient")


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("produtos.id"))
    ingredient_id = Column(Integer, ForeignKey("produtos.id"))
    quantity = Column(Float)

    product = relationship("Product", foreign_keys=[product_id], back_populates="ingredients")
    ingredient = relationship("Product", foreign_keys=[ingredient_id], back_populates="used_as_ingredient")
