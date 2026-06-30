FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .

# Cria ambiente virtual e instala dependências
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Cria arquivo .env com valores padrão (se não existir)
RUN if [ ! -f .env ]; then \
    echo "# Backend" > .env && \
    echo "DATABASE_URL=sqlite:///./padaria.db" >> .env && \
    echo "SECRET_KEY=9a4f6d7c8e9f0a1b2c3d4e5f6a7b8c9d" >> .env && \
    echo "ALGORITHM=HS256" >> .env && \
    echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env && \
    echo "CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000" >> .env; \
    fi

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
