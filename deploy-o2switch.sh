#!/bin/bash
# Script de déploiement API sur o2switch
# USAGE: bash deploy-o2switch.sh

set -e  # Exit on error

echo "=== DEPLOYMENT API o2switch ==="
echo ""

# 1. Git push
echo "1️⃣  Pushing to GitHub..."
git add .
git commit -m "Production deployment: Fix CORS/Sanctum configuration for o2switch"
git push

echo "✅ Pushed to GitHub"
echo ""

# 2. SSH into o2switch (you'll need to configure this manually)
echo "2️⃣  Next steps on o2switch:"
echo ""
echo "   SSH into your o2switch server and run:"
echo "   cd /path/to/allstarsbattle-api"
echo "   git pull origin main"
echo ""

echo "3️⃣  On o2switch, update .env variables:"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - APP_URL=https://api.allstarbattle.dance"
echo "   - FRONTEND_URL=https://allstarbattle.dance"
echo "   - SESSION_DOMAIN=.allstarbattle.dance"
echo "   - SESSION_SECURE=true"
echo "   - SESSION_HTTP_ONLY=true"
echo ""

echo "4️⃣  Run migrations on o2switch:"
echo "   php artisan migrate --force"
echo "   php artisan cache:clear"
echo "   php artisan config:clear"
echo "   php artisan route:clear"
echo ""

echo "5️⃣  Test the API:"
echo "   curl -X POST https://api.allstarbattle.dance/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Origin: https://allstarbattle.dance' \\"
echo "     -d '{\"email\":\"ad@allstarbattle.dance\",\"password\":\"admin123\"}'"
echo ""

echo "6️⃣  Update Vercel environment variables:"
echo "   VITE_API_URL=https://api.allstarbattle.dance/api"
echo "   VITE_API_BASE_URL=https://api.allstarbattle.dance"
echo ""

echo "🚀 Once complete, test login at: https://allstarbattle.dance/admin"
