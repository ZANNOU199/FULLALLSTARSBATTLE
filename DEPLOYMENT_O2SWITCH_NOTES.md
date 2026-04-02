# Configuration pour déploiement o2switch

## 📋 Configuration finale avant déploiement

### Backend (API) - o2switch / api.allstarbattle.dance

Accéder à: https://api.allstarbattle.dance

Variables d'environnement à configurer dans le panneau o2switch:

```env
# Application
APP_NAME=ASB
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:w9EFBsrIqCgIhN8cKDClzgH5J8/xxNluWeuqRDdS52c=
APP_URL=https://api.allstarbattle.dance
FRONTEND_URL=https://allstarbattle.dance

# Database (Render PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=dpg-d71sl50gjchc739opfl0-a
DB_PORT=5432
DB_DATABASE=allstarsbattle
DB_USERNAME=allstarsbattle_user
DB_PASSWORD=9r4NvUdRXZdh1ZuHrILuUToYwDq1v84S

# Sessions / Cookies (important pour Sanctum)
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=.allstarbattle.dance
SESSION_SECURE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=Lax

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=zannoharry@gmail.com
MAIL_PASSWORD=bkmlrpoouzcwtoue
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=zannoharry@gmail.com
MAIL_FROM_NAME="All Stars Battle"

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=76afb1e0d654f85f27e4b14d94098b85
CLOUDFLARE_R2_ACCOUNT_ID=3dc81df555e9106f9b2bbe072abb497b
CLOUDFLARE_R2_BUCKET_NAME=allstarsbattle-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev
CLOUDFLARE_R2_SECRET_ACCESS_KEY=cac7e059fc806c56607e99584ff15ee94bf8d86d6b8134824ebc8f0d27d09c02
```

### Frontend (SPA) - Vercel / allstarbattle.dance

Accéder à: https://www.vercel.com/dashboard

Dans le projet **allstarsbattle**:
1. Aller à **Settings** → **Environment Variables**
2. Ajouter/mettre à jour:

```env
VITE_API_URL=https://api.allstarbattle.dance/api
VITE_API_BASE_URL=https://api.allstarbattle.dance
```

## ✅ Vérifications avant déploiement

### En local (avant push):
```bash
# Tester login avec API locale
npm run dev  # Frontend sur localhost:5173
php artisan serve  # API sur localhost:8000 ou localhost

# Ouvrir http://localhost:5173/admin
# Tester login: ad@allstarbattle.dance / admin123
```

### Après déploiement sur o2switch:
```bash
# 1. SSH dans o2switch et vérifier:
cd /var/www/html/allstarsbattle-api  # ou votre chemin

# 2. Exécuter les migrations
php artisan migrate --force

# 3. Vérifier les logs
tail -f storage/logs/laravel.log

# 4. Tester l'API
curl -X POST https://api.allstarbattle.dance/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://allstarbattle.dance" \
  -d '{"email":"ad@allstarbattle.dance","password":"admin123"}'

# 5. Vérifier Sanctum
curl https://api.allstarbattle.dance/api/sanctum/csrf-cookie \
  -H "Origin: https://allstarbattle.dance"
```

### Vérifier les logs sur o2switch:
```bash
# Erreurs Laravel
tail -f storage/logs/laravel.log

# Erreurs PHP
tail -f /var/log/php-fpm/error.log  # ou check hosting panel

# Erreurs CORS (apache)
tail -f /var/log/apache2/error.log
```

## 🔐 Sécurité - Points à vérifier

✅ Login.tsx: `credentials: 'include'`
✅ api.ts: `withCredentials: true`
✅ config/cors.php: `supports_credentials: true`
✅ config/sanctum.php: Domaines stateful corrects
✅ config/sanctum.php: `guard: ['web']` pour les cookies
✅ .env: `APP_ENV=production`, `APP_DEBUG=false`
✅ .env: `SESSION_SECURE=true`, `SESSION_HTTP_ONLY=true`

## 📝 Notes importantes

- Les cookies sont **essentiels** pour Sanctum en mode stateful (1ère partie SPA)
- CORS avec `supports_credentials: true` pose des restrictions strictes:
  - Les origines doivent être exactes (pas de wildcard)
  - Les headers doivent être explicites
  - Les domaines doivent être dans Sanctum stateful list
- Si erreur 503 on o2switch: vérifier permutations, espace disque, memory limit
- Si erreur CORS: vérifier .env APP_URL et FRONTEND_URL sur production
