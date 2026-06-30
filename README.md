# Sistema de Gestão de Estoque para Padaria

Este sistema foi desenvolvido para oferecer um controle preciso e eficiente do inventário de uma padaria, garantindo a integridade dos dados através de Controle de Acesso Baseado em Funções (RBAC) e prevenindo perdas com alertas inteligentes e bloqueios de estoque negativo.

## 🚀 Visão Geral

O sistema permite a gestão completa do catálogo de produtos e o registro de todas as movimentações de entrada e saída.

*   **Controle de Estoque Rigoroso:** Bloqueio automático de saídas que resultariam em estoque negativo.
*   **RBAC (Role-Based Access Control):** Diferenciação entre perfis de **Gerente** (acesso total, CRUD de produtos, dashboard) e **Atendente** (registro de movimentações e consulta).
*   **Alertas Inteligentes:** Destaque visual para produtos próximos ao vencimento (7 dias) ou com estoque abaixo do mínimo.
*   **Dashboard Financeiro (BI):** Visualização de métricas de valor em risco, custo de desperdício e produtos mais vendidos.
*   **Preservação de Histórico:** Uso de *Soft Delete* para produtos, mantendo a integridade do histórico de movimentações.

## 🐳 Como Rodar com Docker (Recomendado)

A maneira mais rápida de subir o ambiente completo é utilizando o Docker Compose:

1.  **Certifique-se de ter o Docker e Docker Compose instalados.**
2.  **Na raiz do projeto, na primeira vez que for rodar, execute:**
    ```bash
    docker compose build
    docker compose up
    ```

3.  **Para criar um ambiente virtual local `.venv` no backend e instalar as dependências usando Docker:**
    ```bash
    docker compose run --rm backend sh -c 'python -m venv .venv && . .venv/bin/activate && pip install --no-cache-dir -r requirements.txt'
    ```

4.  **Para criar o ambiente virtual local no backend com um comando direto:**
    ```bash
    bash backend/setup_venv.sh
    ```

5.  **Acesse as aplicações:**
    *   **Frontend:** `http://localhost:3000`
    *   **Backend (API):** `http://localhost:8000`

6.  **Para parar o Docker Compose:**
    ```bash
    docker compose down
    ```

7.  **Para iniciar novamente depois do build:**
    ```bash
    docker compose up
    ```

**Nota:** O `docker-compose.yml` não exige mais `backend/.env`. O backend funciona com valores padrão se não houver arquivo de ambiente.

**Opcional:** se quiser usar configurações customizadas, crie `backend/.env` a partir do modelo:
```bash
cp backend/.env.example backend/.env
```

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
*   **Python 3.11** ou superior
*   **Node.js 18** ou superior
*   **npm** (geralmente instalado com o Node.js)

---

## ⚙️ Como Rodar o Backend

1.  **Acesse o diretório do backend:**
    ```bash
    cd backend
    ```

2.  **Crie um ambiente virtual (venv):**
    ```bash
    python3 -m venv venv
    ```

3.  **Ative o ambiente virtual:**
    *   No Linux/macOS: `source venv/bin/activate`
    *   No Windows: `venv\Scripts\activate`

4.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Execute as Migrations do banco de dados:**
    ```bash
    alembic upgrade head
    ```

6.  **Popule o banco com dados iniciais (Seed):**
    ```bash
    python seed.py
    ```

7.  **Inicie o servidor:**
    ```bash
    uvicorn main:app --reload
    ```
    O backend estará rodando em: `http://localhost:8000`

---

## 💻 Como Rodar o Frontend

1.  **Acesse o diretório do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie a aplicação:**
    ```bash
    npm start
    ```
    A aplicação abrirá automaticamente em: `http://localhost:3000`

---

## 🔑 Acesso Inicial (Credenciais de Teste)

Após rodar o script de `seed.py`, você poderá acessar o sistema com os seguintes usuários:

| Perfil | Usuário | Senha |
| :--- | :--- | :--- |
| **Gerente** | `rafael` | `123456` |
| **Atendente** | `maria` | `123456` |
| **Atendente** | `joao` | `123456` |

---

## 🧪 Testes

Para rodar os testes unitários do backend:
```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest
```

---

## 📦 Popular Banco com Dados de Exemplo

Para criar dados de exemplo (usuários, produtos, movimentações):

```bash
cd backend
python seed.py
```

Este script cria:
- 3 usuários (rafael/maria/joao com senha 123456)
- 13 produtos (pães, bolos, salgados, bebidas)
- Movimentações de exemplo (entradas, saídas, vendas, vencidos)
