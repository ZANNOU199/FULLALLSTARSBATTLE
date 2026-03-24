#!/usr/bin/env bash
# railway-set-env.sh
# Usage:
#   npm install -g railway
#   railway login
#   cd allstarsbattle-api
#   railway link
#   chmod +x railway-set-env.sh
#   ./railway-set-env.sh

ENV_FILE=.env
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Fichier $ENV_FILE introuvable. Crée le d'abord et relance."
  exit 1
fi

set -o allexport
while IFS='=' read -r key value; do
  # skip commented and empty lines
  [[ "$key" =~ ^\s*# ]] && continue
  [[ -z "$key" ]] && continue
  key=$(echo "$key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
  value=$(echo "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
  if [[ -z "$key" ]]; then
    continue
  fi
  echo "railway variables set $key (value hidden)"
  railway variables set "$key" "$value"
done < <(grep -v '^\s*$' "$ENV_FILE" | grep -v '^\s*#')
set +o allexport

echo "✅ Variables envoyées. Vérifie avec : railway variables list"
echo "Puis : railway up && railway run php artisan migrate --force && curl https://fullallstarsbattle-production.up.railway.app/api/health"