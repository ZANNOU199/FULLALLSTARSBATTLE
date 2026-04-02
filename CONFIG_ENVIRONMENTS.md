# Configuration des environnements - All Star Battle

## 🏠 **Architecture**

```
Frontend Vercel (allstarbattle.dance)
         ↓
    [CORS Check]
         ↓
API o2switch (api.allstarbattle.dance)
         ↓
    Database PostgreSQL
```

---

## 📱 **Frontend - Vercel Environment Variables**

**Ajoute dans Vercel Settings → Environment Variables:**

```
VITE_API_URL=https://api.allstarbattle.dance/api
VITE_API_BASE_URL=https://api.allstarbattle.dance
```

---

## 🖥️ **Backend - o2switch (.env)**

À mettre sur le serveur o2switch:

```bash
# APP SETTINGS
APP_NAME="All Star Battle International"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:ZG5ZCc36m/CY9DFtCmUXZy94Q6+ZIn7kc9LtrvNv9Yk=
APP_URL=https://api.allstarbattle.dance

# LOCALE
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

# LOGGING
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug

# DATABASE (PostgreSQL o2switch)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sc4crilin10_allstarsbattle
DB_USERNAME=sc4crilin10_admn
DB_PASSWORD=]zvai0myZmryPN@X

# SESSION CONFIGURATION - CRITICAL FOR PRODUCTION
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.allstarbattle.dance
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# SANCTUM - Must match frontend domain
SANCTUM_STATEFUL_DOMAINS=www.allstarbattle.dance,allstarbattle.dance

# CORS - Frontend URL for CORS config
FRONTEND_URL=https://allstarbattle.dance

# CACHE & QUEUE
CACHE_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
BROADCAST_CONNECTION=log

# EMAIL
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=zannoharry@gmail.com
MAIL_PASSWORD=bkmlrpoouzcwtoue
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=zannoharry@gmail.com
MAIL_FROM_NAME="All Stars Battle"

# REDIS (local on o2switch)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_CLIENT=phpredis

# CLOUDFLARE R2 (Storage)
CLOUDFLARE_R2_ACCOUNT_ID=3dc81df555e9106f9b2bbe072abb497b
CLOUDFLARE_R2_ACCESS_KEY_ID=76afb1e0d654f85f27e4b14d94098b85
CLOUDFLARE_R2_SECRET_ACCESS_KEY=cac7e059fc806c56607e99584ff15ee94bf8d86d6b8134824ebc8f0d27d09c02
CLOUDFLARE_R2_BUCKET_NAME=allstarsbattle-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev

R2_ACCESS_KEY_ID=76afb1e0d654f85f27e4b14d94098b85
R2_ACCOUNT_ID=3dc81df555e9106f9b2bbe072abb497b
R2_BUCKET_NAME=allstarsbattle-media
R2_PUBLIC_URL=https://pub-e66e8acef13f47bf90ce3de0d7240052.r2.dev
R2_SECRET_ACCESS_KEY=cac7e059fc806c56607e99584ff15ee94bf8d86d6b8134824ebc8f0d27d09c02

# FILESYSTEM
FILESYSTEM_DISK=local

# MAINTENANCE
APP_MAINTENANCE_DRIVER=file

# SECURITY
BCRYPT_ROUNDS=12
```

---

## 💻 **Local Development - .env.local (n'oublies pas !)**

À utiliser **EN LOCAL** sur ta machine (créer le fichier `.env.local`):

```bash
# Pointe vers localhost pour les tests locaux
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database locale
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432

# Session para local
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=false
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Pas de Sanctum obligatoire en local
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,localhost:3000,127.0.0.1:3000

# Frontend URL pour CORS local
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

**Et le `.env` du frontend local (ALLSTARSBATTLE/.env.local):**

```bash
# Test contre localhost
VITE_API_URL=http://localhost/api
VITE_API_BASE_URL=http://localhost
```

---

## ✅ **Checklist de sécurité production**

- [ ] `APP_ENV=production` ✅
- [ ] `APP_DEBUG=false` ✅
- [ ] `SESSION_SECURE_COOKIE=true` ✅ (HTTPS only)
- [ ] `SESSION_HTTP_ONLY=true` ✅ (No JS access)
- [ ] `SANCTUM_STATEFUL_DOMAINS` = frontend domains ✅
- [ ] `FRONTEND_URL` défini pour CORS ✅
- [ ] `APP_KEY` généré unique ✅
- [ ] Database credentials sécurisées ✅
- [ ] R2 credentials présents ✅

---

## 🚀 **Commandes de déploiement**

```bash
# Sur o2switch, après push:
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan migrate --force

# Si besoin de créer l'admin:
php artisan tinker
> User::create([
    'name' => 'Admin',
    'email' => 'ad@allstarbattle.dance',
    'password' => bcrypt('admin123'),
    'is_admin' => true
])
```

---

## 🐛 **Debug si CORS échoue**

```bash
# Vérifier les headers CORS retournés
curl -X OPTIONS https://api.allstarbattle.dance/api/auth/login \
  -H "Origin: https://allstarbattle.dance" \
  -H "Access-Control-Request-Method: POST" -v

# Les réponses doivent inclure:
# Access-Control-Allow-Origin: https://allstarbattle.dance
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: POST, GET, PUT, DELETE
```

