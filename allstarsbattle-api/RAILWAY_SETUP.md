# Configuration Railway pour All STAR BATTLE API

## Structure Déploiement

```
Railway
├── Service Web (Laravel)
│   └── Built from: Dockerfile
│   └── Port: 80
├── Service Database (MySQL)
│   └── Port: 3306
└── Environment Variables
```

## Variables Requises

### Base de données (auto-configurées par Railway MySQL)
- `DB_HOST` → Railway MySQL internal URL
- `DB_PORT` → 3306
- `DB_DATABASE` → railway
- `DB_USERNAME` → root
- `DB_PASSWORD` → auto-générée

### Application
- `APP_KEY` → Généré avec `php artisan key:generate`
- `APP_ENV` → production
- `APP_DEBUG` → false
- `APP_URL` → https://votre-app.up.railway.app

### Stockage (Cloudflare R2)
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `CLOUDFLARE_R2_ACCOUNT_ID`

### Email (SMTP)
- `MAIL_MAILER=smtp`
- `MAIL_HOST=smtp.gmail.com`
- `MAIL_USERNAME=votre@email.com`
- `MAIL_PASSWORD=app-password` (pas le vrai mot de passe)

## Commandes Migration

```bash
# Après le déploiement
railway run php artisan migrate
railway run php artisan cache:clear
railway run php artisan config:cache
```

## Logs & Monitoring

```bash
# Voir les logs en temps réel
railway logs

# Lancer une commande artisan
railway run php artisan tinker
```

## Health Check

API endpoint pour vérifier le status:
```
GET /api/health
```

Doit retourner:
```json
{
  "status": "ok",
  "database": "connected"
}
```
