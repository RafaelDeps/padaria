# ESTÁGIO 1: Build do Frontend (React)
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ESTÁGIO 2: Ambiente de Execução (Python + Nginx)
FROM python:3.10-slim
WORKDIR /app

# Instalar o Nginx para gerenciar as rotas de forma isolada
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Configurar o Nginx para escutar na 8080 e repassar para o Python se não for arquivo estático
RUN echo 'server {\n\
    listen 8080;\n\
    root /var/www/html;\n\
    index index.html;\n\
    location /api/ {\n\
        proxy_pass http://127.0.0.1:8000/api/;\n\
        proxy_set_header Host $http_host;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Instalar dependências do Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código do backend original (sem mexer no main.py!)
COPY backend/ /app/

# Mover os arquivos compilados do React para a pasta pública do Nginx
COPY --from=frontend-builder /app/frontend/build /var/www/html

# Porta exigida pelo script do professor
EXPOSE 8080

# Inicializa o Nginx em segundo plano e o Uvicorn no plano principal
CMD nginx && uvicorn main:app --host 127.0.0.1 --port 8000