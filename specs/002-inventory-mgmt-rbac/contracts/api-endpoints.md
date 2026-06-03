# API Contracts: REST Endpoints

Base URL: `/api`

## 1. Authentication

### `POST /auth/login`
Authenticates a user and returns a JWT.

- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGci...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "cargo": "GERENTE"
    }
  }
  ```

---

## 2. Inventory (Products)

### `GET /produtos`
List all active products.
- **Role**: All
- **Success Response (200 OK)**: `Array<Product>`

### `POST /produtos`
Create a new product.
- **Role**: GERENTE only
- **Request Body**: `ProductInput`

### `PUT /produtos/{id}`
Update product details.
- **Role**: GERENTE only

### `DELETE /produtos/{id}`
Soft delete a product.
- **Role**: GERENTE only

---

## 3. Movements

### `GET /movimentacoes`
List movement history (last 50 or filtered).
- **Role**: All

### `POST /movimentacoes`
Register an entry or exit.
- **Role**: All
- **Request Body**:
  ```json
  {
    "produto_id": 10,
    "tipo": "SAIDA",
    "quantidade": 5,
    "observacao": "Venda balcão"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  { "detail": "Estoque insuficiente para esta operação." }
  ```

---

## 4. Dashboard (Manager Only)

### `GET /dashboard/stats`
Get summary metrics.
- **Success Response (200 OK)**:
  ```json
  {
    "total_valor_risco": 1500.50,
    "custo_desperdicio": 200.00,
    "produto_mais_vendido": "Pão Francês",
    "alertas_vencimento": 3,
    "alertas_estoque_baixo": 5
  }
  ```
