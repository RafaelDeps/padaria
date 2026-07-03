"""
Script para popular o banco de dados com dados de exemplo.
Executar com: python seed.py
"""
import os
import sys
from datetime import datetime, timedelta
from decimal import Decimal

# Setup path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from models.database import engine, SessionLocal
from models.base import Base
from models.user import User
from models.product import Product, RecipeIngredient
from models.movement import Movement
from auth.jwt_utils import get_password_hash


def create_tables():
    """Cria todas as tabelas"""
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas!")


def seed_users(db):
    """Cria usuários de exemplo"""
    users = [
        User(nome="Admin", username="admin", senha_hash=get_password_hash("admin123"), cargo="gerente"),
        User(nome="Lucas Almeida", username="lucas", senha_hash=get_password_hash("123456"), cargo="gerente"),
        User(nome="Maria Oliveira", username="maria", senha_hash=get_password_hash("123456"), cargo="funcionario"),
        User(nome="João Silva", username="joao", senha_hash=get_password_hash("123456"), cargo="funcionario"),
    ]

    for user in users:
        existing = db.query(User).filter(User.username == user.username).first()
        if not existing:
            db.add(user)

    db.commit()
    print(f"{len(users)} usuários criados (ou já existem)")


def seed_products(db):
    """Cria produtos de exemplo"""
    produtos = [
        # Pães
        {"nome": "Pão Francês", "categoria": "Pão", "estoque_minimo": 50, "preco_unitario": 0.80, "quantidade_atual": 100, "data_validade": (datetime.now() + timedelta(days=5)).date()},
        {"nome": "Pão de Milho", "categoria": "Pão", "estoque_minimo": 30, "preco_unitario": 1.20, "quantidade_atual": 45, "data_validade": (datetime.now() + timedelta(days=7)).date()},
        {"nome": "Pão Integral", "categoria": "Pão", "estoque_minimo": 20, "preco_unitario": 1.50, "quantidade_atual": 25, "data_validade": (datetime.now() + timedelta(days=10)).date()},

        # Bolos
        {"nome": "Bolo de Chocolate", "categoria": "Bolo", "estoque_minimo": 10, "preco_unitario": 25.00, "quantidade_atual": 8, "data_validade": (datetime.now() + timedelta(days=3)).date()},
        {"nome": "Bolo de Cenoura", "categoria": "Bolo", "estoque_minimo": 10, "preco_unitario": 22.00, "quantidade_atual": 12, "data_validade": (datetime.now() + timedelta(days=4)).date()},
        {"nome": "Bolo de Milho", "categoria": "Bolo", "estoque_minimo": 10, "preco_unitario": 20.00, "quantidade_atual": 5, "data_validade": (datetime.now() + timedelta(days=2)).date()},

        # Salgados
        {"nome": "Coxinha", "categoria": "Salgado", "estoque_minimo": 50, "preco_unitario": 2.50, "quantidade_atual": 80, "data_validade": (datetime.now() + timedelta(days=2)).date()},
        {"nome": "Pastel", "categoria": "Salgado", "estoque_minimo": 40, "preco_unitario": 2.00, "quantidade_atual": 60, "data_validade": (datetime.now() + timedelta(days=2)).date()},
        {"nome": "Pão de Queijo", "categoria": "Salgado", "estoque_minimo": 30, "preco_unitario": 1.80, "quantidade_atual": 100, "data_validade": (datetime.now() + timedelta(days=5)).date()},
        {"nome": "Esfiha", "categoria": "Salgado", "estoque_minimo": 30, "preco_unitario": 2.20, "quantidade_atual": 20, "data_validade": (datetime.now() + timedelta(days=3)).date()},

        # Bebidas
        {"nome": "Café", "categoria": "Bebida", "estoque_minimo": 100, "preco_unitario": 0.50, "quantidade_atual": 200, "data_validade": (datetime.now() + timedelta(days=30)).date()},
        {"nome": "Suco de Laranja", "categoria": "Bebida", "estoque_minimo": 20, "preco_unitario": 3.00, "quantidade_atual": 30, "data_validade": (datetime.now() + timedelta(days=5)).date()},
        {"nome": "Refrigerante", "categoria": "Bebida", "estoque_minimo": 24, "preco_unitario": 4.00, "quantidade_atual": 48, "data_validade": (datetime.now() + timedelta(days=90)).date()},
    ]

    for prod in produtos:
        existing = db.query(Product).filter(Product.nome == prod["nome"]).first()
        if not existing:
            db.add(Product(**prod, is_ativo=True))

    db.commit()
    print(f"{len(produtos)} produtos criados (ou já existem)")


def seed_raw_materials(db):
    """Cria matérias-primas para produção"""
    raw_materials = [
        {"nome": "Farinha de Trigo", "categoria": "Matéria Prima", "estoque_minimo": 50, "preco_unitario": 5.00, "quantidade_atual": 100, "data_validade": (datetime.now() + timedelta(days=180)).date(), "is_manufactured": False},
        {"nome": "Sal", "categoria": "Matéria Prima", "estoque_minimo": 20, "preco_unitario": 2.00, "quantidade_atual": 50, "data_validade": (datetime.now() + timedelta(days=365)).date(), "is_manufactured": False},
        {"nome": "Fermento", "categoria": "Matéria Prima", "estoque_minimo": 10, "preco_unitario": 8.00, "quantidade_atual": 20, "data_validade": (datetime.now() + timedelta(days=90)).date(), "is_manufactured": False},
        {"nome": "Água", "categoria": "Matéria Prima", "estoque_minimo": 100, "preco_unitario": 0.10, "quantidade_atual": 200, "data_validade": (datetime.now() + timedelta(days=365)).date(), "is_manufactured": False},
    ]

    for mat in raw_materials:
        existing = db.query(Product).filter(Product.nome == mat["nome"]).first()
        if not existing:
            db.add(Product(**mat, is_ativo=True))

    db.commit()
    print(f"{len(raw_materials)} matérias-primas criadas (ou já existem)")


def seed_recipes(db):
    """Cria receitas vinculando produtos fabricados aos ingredientes"""
    # Busca produtos
    pao_frances = db.query(Product).filter(Product.nome == "Pão Francês").first()
    farinha = db.query(Product).filter(Product.nome == "Farinha de Trigo").first()
    sal = db.query(Product).filter(Product.nome == "Sal").first()
    fermento = db.query(Product).filter(Product.nome == "Fermento").first()
    agua = db.query(Product).filter(Product.nome == "Água").first()

    if not pao_frances:
        # Create Pão Francês as manufactured product
        pao_frances = Product(
            nome="Pão Francês",
            categoria="Pão",
            estoque_minimo=50,
            preco_unitario=0.80,
            quantidade_atual=100,
            data_validade=(datetime.now() + timedelta(days=5)).date(),
            is_ativo=True,
            is_manufactured=True
        )
        db.add(pao_frances)
        db.commit()
        db.refresh(pao_frances)

    if pao_frances and all([farinha, sal, fermento, agua]):
        # Check if recipe already exists
        existing = db.query(RecipeIngredient).filter(RecipeIngredient.product_id == pao_frances.id).first()
        if not existing:
            recipes = [
                RecipeIngredient(product_id=pao_frances.id, ingredient_id=farinha.id, quantity=0.25),  # 250g flour per bread
                RecipeIngredient(product_id=pao_frances.id, ingredient_id=sal.id, quantity=0.005),  # 5g salt per bread
                RecipeIngredient(product_id=pao_frances.id, ingredient_id=fermento.id, quantity=0.01),  # 10g yeast per bread
                RecipeIngredient(product_id=pao_frances.id, ingredient_id=agua.id, quantity=0.15),  # 150ml water per bread
            ]
            for recipe in recipes:
                db.add(recipe)
            db.commit()
            print(f"Receita do Pão Francês criada com {len(recipes)} ingredientes")
        else:
            print("Receita do Pão Francês já existe")


def seed_movements(db):
    """Cria movimentações de exemplo"""
    # Busca usuários e produtos
    usuarios = db.query(User).all()
    produtos = db.query(Product).all()

    if not usuarios or not produtos:
        print("Necesário criar usuários e produtos primeiro!")
        return

    movimentacoes = [
        # Entradas de ontem
        {"produto_id": 1, "tipo": "ENTRADA", "quantidade": 50, "observacao": "Fornecedor", "dias_atras": 1},
        {"produto_id": 2, "tipo": "ENTRADA", "quantidade": 30, "observacao": "Fornecedor", "dias_atras": 1},
        {"produto_id": 3, "tipo": "ENTRADA", "quantidade": 20, "observacao": "Fornecedor", "dias_atras": 1},
        {"produto_id": 4, "tipo": "ENTRADA", "quantidade": 10, "observacao": "Fornecedor", "dias_atras": 2},
        {"produto_id": 5, "tipo": "ENTRADA", "quantidade": 15, "observacao": "Fornecedor", "dias_atras": 2},

        # Saídas dos últimos dias
        {"produto_id": 1, "tipo": "SAIDA", "quantidade": 20, "observacao": "Venda", "dias_atras": 0},
        {"produto_id": 2, "tipo": "SAIDA", "quantidade": 10, "observacao": "Venda", "dias_atras": 0},
        {"produto_id": 3, "tipo": "SAIDA", "quantidade": 5, "observacao": "Venda", "dias_atras": 1},
        {"produto_id": 4, "tipo": "SAIDA", "quantidade": 5, "observacao": "Venda", "dias_atras": 1},
        {"produto_id": 5, "tipo": "SAIDA", "quantidade": 3, "observacao": "Venda", "dias_atras": 2},
        {"produto_id": 6, "tipo": "SAIDA", "quantidade": 5, "observacao": "Venda", "dias_atras": 2},
        {"produto_id": 7, "tipo": "SAIDA", "quantidade": 30, "observacao": "Venda", "dias_atras": 0},
        {"produto_id": 8, "tipo": "SAIDA", "quantidade": 25, "observacao": "Venda", "dias_atras": 1},
        {"produto_id": 9, "tipo": "SAIDA", "quantidade": 15, "observacao": "Venda", "dias_atras": 2},
        {"produto_id": 10, "tipo": "SAIDA", "quantidade": 10, "observacao": "Venda", "dias_atras": 3},

        # Movimentações mais antigas (para testar inatividade)
        {"produto_id": 12, "tipo": "ENTRADA", "quantidade": 50, "observacao": "Fornecedor", "dias_atras": 20},
        {"produto_id": 13, "tipo": "ENTRADA", "quantidade": 30, "observacao": "Fornecedor", "dias_atras": 25},

        # Desperdício/Vencido
        {"produto_id": 6, "tipo": "SAIDA", "quantidade": 3, "observacao": "Vencido", "dias_atras": 1},
        {"produto_id": 4, "tipo": "SAIDA", "quantidade": 2, "observacao": "Vencido", "dias_atras": 3},
    ]

    count = 0
    for mov in movimentacoes:
        data_hora = datetime.now() - timedelta(days=mov.pop("dias_atras"))
        mov["data_hora"] = data_hora
        mov["usuario_id"] = usuarios[0].id  # usa o primeiro usuário

        db.add(Movement(**mov))
        count += 1

    db.commit()
    print(f"{count} movimentações criadas")


def main():
    """Função principal"""
    print("=" * 50)
    print("POPULANDO BANCO DE DADOS")
    print("=" * 50)

    # Cria tabelas
    create_tables()

    # Abre sessão
    db = SessionLocal()

    try:
        # Seed dados
        seed_users(db)
        seed_products(db)
        seed_raw_materials(db)
        seed_recipes(db)
        seed_movements(db)

        print("=" * 50)
        print("Banco populado com sucesso!")
        print("=" * 50)

    except Exception as e:
        print(f"Erro: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()