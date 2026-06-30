#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VENV_DIR=".venv"
PYTHON_CMD="python3"

if ! command -v "$PYTHON_CMD" >/dev/null 2>&1; then
  PYTHON_CMD="python"
fi

if ! command -v "$PYTHON_CMD" >/dev/null 2>&1; then
  echo "Erro: python3 ou python não encontrado. Instale o Python antes de executar este script." >&2
  exit 1
fi

echo "Criando ambiente virtual em $VENV_DIR..."
"$PYTHON_CMD" -m venv "$VENV_DIR"

if [ ! -f "$VENV_DIR/bin/pip" ]; then
  echo "Erro: pip não encontrado no ambiente virtual." >&2
  exit 1
fi

echo "Atualizando pip e instalando dependências..."
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install --no-cache-dir -r requirements.txt

echo "Ambiente virtual criado com sucesso em backend/$VENV_DIR"
echo "Use: source backend/.venv/bin/activate"
