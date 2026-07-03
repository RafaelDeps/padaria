from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db
from models.product import Product, RecipeIngredient
from models.movement import Movement
from controllers import product_controller
from auth.middleware import manager_only, all_roles
from pydantic import BaseModel, condecimal
from datetime import date

router = APIRouter(prefix="/produtos", tags=["Products"])

class ProductBase(BaseModel):
    nome: str
    categoria: str
    estoque_minimo: float
    preco_unitario: float
    data_validade: date
    is_manufactured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    quantidade_atual: float
    is_ativo: bool
    is_manufactured: bool = False

    class Config:
        from_attributes = True

class ProduceRequest(BaseModel):
    quantity: float

class RecipeItem(BaseModel):
    ingredient_id: int
    quantity: float

class RecipeUpdate(BaseModel):
    recipe: List[dict]

@router.get("/", response_model=List[ProductResponse])
def read_products(stagnant: bool = False, db: Session = Depends(get_db), user=Depends(all_roles)):
    return product_controller.get_products(db, active_only=not stagnant, stagnant=stagnant)

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.create_product(db, product.dict())

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.update_product(db, product_id, product.dict())

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.delete_product(db, product_id)

@router.post("/{product_id}/produce")
def produce_product(product_id: int, request: ProduceRequest, db: Session = Depends(get_db), user=Depends(all_roles)):
    # 1. Fetch Product by product_id. If not is_manufactured, raise 400.
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or not product.is_manufactured:
        raise HTTPException(status_code=400, detail="Product is not manufactured or does not exist")

    # 2. Iterate product.ingredients. Calculate required amount. Check if ingredient.quantidade_estoque >= required.
    if not product.ingredients:
        raise HTTPException(status_code=400, detail="No recipe ingredients defined for this product")

    for recipe in product.ingredients:
        ingredient = recipe.ingredient
        required = recipe.quantity * request.quantity
        if ingredient.quantidade_atual < required:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for ingredient: {ingredient.nome} (required: {required}, available: {ingredient.quantidade_atual})"
            )

    # 3. Deduct quantidade_atual for each ingredient. Create 'SAIDA' record in Movement table.
    for recipe in product.ingredients:
        ingredient = recipe.ingredient
        required = recipe.quantity * request.quantity
        ingredient.quantidade_atual -= required

        movement = Movement(
            produto_id=ingredient.id,
            usuario_id=user["id"],
            tipo="SAIDA",
            quantidade=int(required),
            observacao=f"Produção de {product.nome}"
        )
        db.add(movement)

    # 4. Increase quantidade_atual for the manufactured product. Create 'ENTRADA' record in Movement table.
    product.quantidade_atual += request.quantity

    movement = Movement(
        produto_id=product.id,
        usuario_id=user["id"],
        tipo="ENTRADA",
        quantidade=int(request.quantity),
        observacao=f"Produção própria"
    )
    db.add(movement)

    # 5. Execute db.commit()
    db.commit()
    db.refresh(product)

    return {"message": f"Produced {request.quantity} units of {product.nome}", "product": product}

@router.post("/{product_id}/ingredients")
def add_ingredient_to_recipe(product_id: int, request: RecipeItem, db: Session = Depends(get_db), user=Depends(manager_only)):
    # 1. Fetch Product by product_id. Raise 404 if not found.
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Fetch ingredient Product by request.ingredient_id. Raise 404 if not found.
    ingredient = db.query(Product).filter(Product.id == request.ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # 3. Create RecipeIngredient
    recipe = RecipeIngredient(
        product_id=product.id,
        ingredient_id=request.ingredient_id,
        quantity=request.quantity
    )
    db.add(recipe)

    # 4. db.commit()
    db.commit()
    db.refresh(recipe)

    return {"message": f"Added {ingredient.nome} to {product.nome} recipe", "recipe": recipe}

@router.get("/{product_id}/receita")
def get_recipe(product_id: int, db: Session = Depends(get_db), user=Depends(all_roles)):
    recipe_items = db.query(
        RecipeIngredient.ingredient_id,
        RecipeIngredient.quantity,
        Product.nome.label("ingredient_nome")
    ).join(
        Product, RecipeIngredient.ingredient_id == Product.id
    ).filter(
        RecipeIngredient.product_id == product_id
    ).all()

    return [
        {
            "ingredient_id": item.ingredient_id,
            "quantity": item.quantity,
            "ingredient_nome": item.ingredient_nome
        }
        for item in recipe_items
    ]

@router.put("/{product_id}/receita")
def update_recipe(product_id: int, request: RecipeUpdate, db: Session = Depends(get_db), user=Depends(manager_only)):
    # Delete existing recipe ingredients
    db.query(RecipeIngredient).filter(RecipeIngredient.product_id == product_id).delete()

    # Insert new recipe ingredients
    for item in request.recipe:
        new_recipe = RecipeIngredient(
            product_id=product_id,
            ingredient_id=item["ingredient_id"],
            quantity=item["quantity"]
        )
        db.add(new_recipe)

    db.commit()
    return {"message": "Receita atualizada com sucesso"}
