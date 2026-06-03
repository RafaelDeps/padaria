# Data Model: PostgreSQL Schema

## Entity-Relationship Diagram (Conceptual)

- `usuarios` (1) --- (n) `historico_movimentacoes`
- `produtos` (1) --- (n) `historico_movimentacoes`

## Tables

### 1. `usuarios`
Stores system users and their access levels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier. |
| `nome` | VARCHAR(100) | NOT NULL | Full name. |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Login name. |
| `senha_hash` | TEXT | NOT NULL | Bcrypt/Argon2 hashed password. |
| `cargo` | VARCHAR(20) | NOT NULL | RBAC role: 'GERENTE' or 'ATENDENTE'. |
| `criado_em` | TIMESTAMP | DEFAULT NOW() | Record creation date. |

### 2. `produtos`
Stores the inventory items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier. |
| `nome` | VARCHAR(255) | NOT NULL | Item name. |
| `categoria` | VARCHAR(100) | NOT NULL | e.g., 'Pães', 'Frios'. |
| `quantidade_atual` | INTEGER | DEFAULT 0 | Current units in stock. |
| `estoque_minimo` | INTEGER | NOT NULL | Threshold for low stock alert. |
| `preco_unitario` | DECIMAL(10,2) | NOT NULL | Price per unit. |
| `data_validade` | DATE | NOT NULL | Expiration date. |
| `is_ativo` | BOOLEAN | DEFAULT TRUE | Soft Delete flag. |
| `criado_em` | TIMESTAMP | DEFAULT NOW() | |

### 3. `historico_movimentacoes`
Audit log of all stock changes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | |
| `produto_id` | INTEGER | FOREIGN KEY (`produtos.id`) | Affected product. |
| `usuario_id` | INTEGER | FOREIGN KEY (`usuarios.id`) | User who performed the action. |
| `tipo` | VARCHAR(10) | CHECK (tipo IN ('ENTRADA', 'SAIDA')) | Movement direction. |
| `quantidade` | INTEGER | NOT NULL | Amount changed (always positive). |
| `data_hora` | TIMESTAMP | DEFAULT NOW() | When it happened. |
| `observacao` | TEXT | | Optional context (e.g., 'Vencido'). |

## Constraints & Business Logic
- **Hard Block on Negative Stock**: Before inserting into `historico_movimentacoes` where `tipo = 'SAIDA'`, the backend must check if `produtos.quantidade_atual - quantidade >= 0`.
- **Soft Delete**: Queries for the "Estoque" table must always include `WHERE is_ativo = TRUE`.
- **Unique Users**: `username` must be unique to prevent duplicates.
