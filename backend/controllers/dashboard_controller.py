from sqlalchemy.orm import Session
from sqlalchemy import func
from models.product import Product
from models.movement import Movement
from models.user import User
from datetime import datetime, timedelta

def get_stats(db: Session):
    today = datetime.now().date()
    seven_days_later = today + timedelta(days=7)

    # total_valor_risco: Sum of (preco_unitario * quantidade_atual) for products expiring in <= 7 days
    total_valor_risco = db.query(func.sum(Product.preco_unitario * Product.quantidade_atual)).filter(
        Product.is_ativo == True,
        Product.data_validade <= seven_days_later
    ).scalar() or 0.0

    # alertas_vencimento: count products expiring in <= 7 days
    alertas_vencimento = db.query(func.count(Product.id)).filter(
        Product.is_ativo == True,
        Product.data_validade <= seven_days_later
    ).scalar() or 0

    # alertas_estoque_baixo: count products where quantidade_atual <= estoque_minimo
    alertas_estoque_baixo = db.query(func.count(Product.id)).filter(
        Product.is_ativo == True,
        Product.quantidade_atual <= Product.estoque_minimo
    ).scalar() or 0

    # produto_mais_vendido: product with most SAIDA movements by quantity
    best_seller = db.query(Product.nome, func.sum(Movement.quantidade).label('total_qtd')).join(
        Movement, Movement.produto_id == Product.id
    ).filter(
        Movement.tipo == 'SAIDA'
    ).group_by(Product.nome).order_by(func.sum(Movement.quantidade).desc()).first()

    # custo_desperdicio: Sum of (preco_unitario * quantidade) for movements with observacao containing 'Vencido'
    custo_desperdicio = db.query(func.sum(Product.preco_unitario * Movement.quantidade)).join(
        Movement, Movement.produto_id == Product.id
    ).filter(
        Movement.observacao.ilike('%Vencido%')
    ).scalar() or 0.0

    # alertas_inatividade: products with no movements in the last 15 days
    fifteen_days_ago = datetime.now() - timedelta(days=15)
    recent_movement_ids = db.query(Movement.produto_id).filter(
        Movement.data_hora >= fifteen_days_ago
    ).distinct().all()
    recent_ids = [m[0] for m in recent_movement_ids]
    alertas_inatividade = db.query(func.count(Product.id)).filter(
        Product.is_ativo == True,
        ~Product.id.in_(recent_ids)
    ).scalar() or 0

    return {
        "total_valor_risco": float(total_valor_risco),
        "custo_desperdicio": float(custo_desperdicio),
        "produto_mais_vendido": best_seller[0] if best_seller and best_seller[0] else "N/A",
        "alertas_vencimento": alertas_vencimento,
        "alertas_estoque_baixo": alertas_estoque_baixo,
        "alertas_inatividade": alertas_inatividade
    }
