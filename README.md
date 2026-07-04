# Sistema de Gestão de Estoque para Padaria

Este sistema foi desenvolvido para oferecer um controle preciso e eficiente do inventário de uma padaria, garantindo a integridade dos dados através de Controle de Acesso Baseado em Funções (RBAC).

A aplicação foi completamente empacotada ("conteinerizada") utilizando processos de *multi-stage build* e proxy reverso com Nginx, estando pronta para ser executada em qualquer ambiente corporativo.

## 🚀 Visão Geral

O sistema permite a gestão completa do catálogo de produtos, matérias-primas e o registro de todas as movimentações de entrada e saída, com suporte a fichas técnicas de produção.

*   **Controle de Estoque Rigoroso:** Bloqueio automático de saídas que resultariam em estoque negativo e suporte a decimais para consumo exato de ingredientes em receitas.
*   **Gestão de Produção (Ficha Técnica):** Integração automática onde a produção de um item manufaturado desconta automaticamente as matérias-primas baseadas na receita cadastrada.
*   **RBAC (Role-Based Access Control):** Diferenciação entre perfis de **Gerente** (acesso total, CRUD de produtos, dashboard) e **Atendente** (registro de movimentações e consulta).
*   **Alertas Inteligentes:** Destaque visual para produtos próximos ao vencimento (7 dias) ou com estoque abaixo do mínimo.
*   **Dashboard Financeiro (BI):** Visualização de métricas de valor em risco, custo de desperdício e produtos mais vendidos.
*   **Preservação de Histórico:** Uso de *Soft Delete* para produtos, mantendo a integridade do histórico de movimentações.

---

## 🐳 Como Rodar o Sistema (Avaliação via Docker)

A maneira oficial e mais rápida de avaliar este projeto é utilizando a imagem consolidada disponível publicamente no **Docker Hub**. O banco de dados (`SQLite`) já vem embutido na imagem e preconfigurado.

### 📋 Pré-requisitos
*   **Docker Desktop** (ou Docker Engine) instalado e rodando em sua máquina.

### 🖥️ Acesso pelo Docker Desktop (Interface Gráfica)

1. Inicie o **Docker Desktop**.
2. Acesse **https://hub.docker.com/r/rafaeladeps/padaria-app** e clique em **“Run in Docker Desktop”** para fazer o pull da imagem (caso ainda não tenha).
3. No Docker Desktop, execute (**Run**) a imagem.
4. Na tela de criação do contêiner, defina um número de porta.
5. Clique no link exibido abaixo do nome do contêiner, com a porta selecionada, para abrir o site.

### 🏃 Passo a Passo (Terminal)

1.  Abra o seu terminal (Prompt de Comando, PowerShell, WSL ou terminal do macOS/Linux).
2.  Execute o comando abaixo. O Docker irá baixar a imagem mais recente do repositório no Docker Hub e iniciar o sistema isolado em sua máquina:

    ```bash
    docker run -d --name padaria-app -p 8085:8080 rafaeladeps/padaria-app:latest
    ```

3.  Assim que o terminal confirmar a criação do contêiner, abra o seu navegador e acesse:
    👉 **http://localhost:8085**

**Nota:** Para interromper e remover o sistema da sua máquina após a avaliação, basta executar: `docker rm -f padaria-app`.

---

## 🔑 Acesso Inicial (Credenciais Embutidas)

O banco de dados integrado já possui perfis pré-configurados para facilitar o teste das funcionalidades (RBAC). Utilize as credenciais abaixo na tela de login:

| Perfil | Usuário | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Gerente** (Master) | `admin` | `admin123` | Acesso Total (Dashboard, Fichas Técnicas, CRUD completo) |
| **Gerente** | `lucas` | `123456` | Acesso Total |
| **Atendente** | `maria` | `123456` | Apenas Movimentações e Consultas |
| **Atendente** | `joao` | `123456` | Apenas Movimentações e Consultas |

---
