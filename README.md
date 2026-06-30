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

A maneira mais rápida de subir o ambiente completo é utilizando o Docker Compose e o backend dentro do WSL/Linux.

1.  **Certifique-se de ter o Docker e Docker Compose instalados.**
2.  **Na raiz do projeto, construa as imagens do Docker:**
    ```bash
    docker compose build
    ```
3.  **Crie a venv local no backend e instale as dependências usando Docker:**
    ```bash
    docker compose run --rm backend sh -c 'python -m venv .venv && . .venv/bin/activate && pip install --no-cache-dir -r requirements.txt'
    ```
    > Esse comando cria a venv em `backend/.venv` e instala os pacotes do `requirements.txt`.

4.  **Se preferir criar a venv diretamente no WSL/Linux e já ativar no shell atual:**
    ```bash
    source backend/setup_venv.sh
    ```
    > Use `source` para ativar no mesmo shell. Não execute com `bash backend/setup_venv.sh` se quiser manter o ambiente ativado.

5.  **Popular o banco de dados com dados iniciais:**
    ```bash
    docker compose run --rm backend sh -c 'python seed.py'
    ```
    > O `seed.py` cria as tabelas e insere usuários, produtos e movimentações de exemplo.

6.  **Inicie o projeto com Docker Compose:**
    ```bash
    docker compose up
    ```

7.  **Acesse as aplicações:**
    *   **Frontend:** `http://localhost:3000`
    *   **Backend (API):** `http://localhost:8000`

8.  **Para parar o Docker Compose:**
    ```bash
    docker compose down
    ```

**Nota:** O `docker-compose.yml` não exige mais `backend/.env`. O backend funciona com valores padrão se não houver arquivo de ambiente.

**Opcional:** se quiser usar configurações customizadas, crie `backend/.env` a partir do modelo:
```bash
cp backend/.env.example backend/.env
```

### Resumo dos comandos e ordem de uso

| Passo | Comando | Descrição |
| --- | --- | --- |
| 1 | `docker compose build` | Constrói as imagens Docker necessárias |
| 2 | `docker compose run --rm backend sh -c 'python -m venv .venv && . .venv/bin/activate && pip install --no-cache-dir -r requirements.txt'` | Cria a venv e instala dependências no backend |
| 3 | `source backend/setup_venv.sh` | Cria e ativa a venv no shell WSL atual (opcional) |
| 4 | `docker compose run --rm backend sh -c 'python seed.py'` | Popula o banco com dados iniciais |
| 5 | `docker compose up` | Sobe o frontend e backend |
| 6 | `docker compose down` | Para o ambiente Docker |

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
| **Gerente** | `lucas` | `123456` |
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
- 3 usuários (lucas/maria/joao com senha 123456)
- 13 produtos (pães, bolos, salgados, bebidas)
- Movimentações de exemplo (entradas, saídas, vendas, vencidos)
