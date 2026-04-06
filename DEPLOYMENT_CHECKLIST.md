# DEPLOYMENT_CHECKLIST.md - All Star Battle

## Pre-Deployment Checks

### Frontend (ALLSTARSBATTLE)
- [ ] Build test local: `npm run build`
- [ ] No build errors
- [ ] dist/ folder generated
- [ ] .nvmrc specifies Node 18.17.0
- [ ] vercel.json exists avec config réwrite

### Backend (allstarsbattle-api)
- [ ] Dockerfile créé et testé
- [ ] Procfile créé
- [ ] railway.json configuré
- [ ] Routes API testées localement
- [ ] /api/health est accessible
- [ ] .env.example mis à jour

### Configuration Git
- [ ] Tous les commits sont poussés
- [ ] Branch main est à jour
- [ ] Pas de fichiers .env exposés (vérifié dans .gitignore)

---

## Deployment Vercel

### 1. Créer le projet Vercel
```bash
- Aller sur https://vercel.com
- New Project → GitHub
- Select FULLALLSTARSBATTLE repository
- Root Directory: ALLSTARSBATTLE
```

### 2. Build Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Environment Variables
```
VITE_API_URL=https://allstarsbattle-api.up.railway.app/api
```

### 4. Deploy
- Cliquer Deploy
- Attendre 2-3 minutes
- Vérifier que le site charge

### 5. Custom Domain (optionnel)
- Settings → Domains
- Ajouter votre domaine
- Suivre les instructions DNS

---

## Deployment Railway

### 1. Créer le projet Railway
```bash
- Aller sur https://railway.app
- Dashboard → New Project
```

### 2. Ajouter une Base de Données MySQL
```bash
- Select "MySQL" from template
- Railway génère automatiquement les credentials
```

### 3. Ajouter le Backend
```bash
- New → GitHub Repo
- Select FULLALLSTARSBATTLE/allstarsbattle-api
- Railway détecte le Dockerfile automatiquement
```

### 4. Configuration des Variables

#### De MySQL (copier depuis Railway):
```
DB_HOST=[MYSQL_SERVICE_HOST]
DB_PORT=3306
DB_DATABASE=[MYSQL_DB]
DB_USERNAME=[MYSQL_USER]
DB_PASSWORD=[MYSQL_PASSWORD]
```

#### App Configuration:
```
APP_NAME=AllStarsBattle
APP_ENV=production
APP_DEBUG=false
APP_KEY=[Générer via: php artisan key:generate]
APP_URL=https://[YOUR_RAILWAY_DOMAIN].up.railway.app

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=[YOUR_EMAIL]
MAIL_PASSWORD=[YOUR_APP_PASSWORD]
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=[YOUR_EMAIL]
MAIL_FROM_NAME=All Star Battle

CLOUDFLARE_R2_ACCOUNT_ID=[YOUR_R2_ACCOUNT_ID]
CLOUDFLARE_R2_ACCESS_KEY_ID=[YOUR_R2_KEY]
CLOUDFLARE_R2_SECRET_ACCESS_KEY=[YOUR_R2_SECRET]
CLOUDFLARE_R2_BUCKET_NAME=allstarsbattle-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-[YOUR_ID].r2.dev

R2_ACCESS_KEY_ID=[YOUR_R2_KEY]
R2_SECRET_ACCESS_KEY=[YOUR_R2_SECRET]
R2_BUCKET_NAME=allstarsbattle-media
R2_PUBLIC_URL=https://pub-[YOUR_ID].r2.dev
R2_ACCOUNT_ID=[YOUR_R2_ACCOUNT_ID]

FRONTEND_URL=https://[YOUR_VERCEL_DOMAIN].vercel.app
```

### 5. Générer APP_KEY
```bash
# Localement avant de pousser:
php artisan key:generate
# Copy la valeur générée dans .env
```

Ou sur Railway via console:
```bash
railway run php artisan key:generate
```

### 6. Lancer les Migrations
```bash
# Via Railway CLI (après installation)
railway run php artisan migrate

# Ou via console web Railway:
# Settings → Command override → Execute Command
# php artisan migrate
```

### 7. Obtenir l'URL du déploiement
```bash
- Va dans le service Web
- Copier l'URL générée (ex: https://allstarsbattle-api.up.railway.app)
- Mettre à jour VITE_API_URL dans Vercel
```

---

## Post-Deployment Testing

### 1. Test de l'API
```bash
# Health check
curl https://[YOUR_RAIL_URL]/api/health

# Récupérer les données CMS
curl https://[YOUR_RAIL_URL]/api/cms/data
```

### 2. Test du Frontend
```bash
- Aller sur https://allstarsbattle.vercel.app
- Console browser → Vérifier pas d'erreurs CORS
- Vérifier que les données CMS se chargent
```

### 3. Test des images
```bash
- Vérifier que les images Cloudflare R2 se chargent
- Vérifier les logos, images de fond
```

### 4. Test des formulaires
```bash
- Tester upload de fichiers → R2
- Tester contact form → SMTP
```

---

## Monitoring

### Vercel
- Dashboard → Deployments → Voir logs
- Analytics → Performance metrics
- Error tracking

### Railway
- Metrics → CPU, Memory, Network
- Logs → Grep erreurs
- Database → Connexion status

---

## Limites Gratuites

| Service | Limite | Info |
|---------|--------|------|
| **Vercel** | 100GB/mois bande passante | Généreux pour un site statique |
| **Railway** | $5/mois crédit gratuit | Suffisant pour petit Laravel |
| **Railway MySQL** | 5GB stockage | Augmentable |
| **Cloudflare R2** | 10GB/mois trafic gratuit | R2 est illimité en stockage |

---

## Troubleshooting

### ❌ Vercel: "404 Not Found" sur routes
```
✅ Solution: vercel.json avec rewrites est en place
```

### ❌ Railway: "502 Bad Gateway"
```
✅ Solutions:
- Vérifier que PHP version est bonne
- Vérifier les logs: railway logs
- Vérifier variables d'env manquantes
```

### ❌ CORS Error entre Vercel et Railway
```
✅ Solution: 
- Vérifier cors.php permet le domaine Vercel
- Vérifier FRONTEND_URL en .env
```

### ❌ Images ne se chargent pas
```
✅ Solution:
- Vérifier Cloudflare R2 credentials
- Vérifier CLOUDFLARE_R2_PUBLIC_URL
```

### ❌ MySQL ne se connecte pas
```
✅ Solution:
- Vérifier DB_HOST is: ${{ services.mysql.host }}
- Vérifier DB_PASSWORD contains special chars → quote it
```

---

## Redirection Domaine Personnalisé

### Option 1: Acheter domaine sur Namecheap/Google Domains
1. Acheter domaine (ex: allstarsbattle.com)
2. Vercel → Settings → Domains → Add custom domain
3. Suivre les instructions DNS
4. Railway → Services → Web → Domain → Add
5. Copier les records DNS Railway
6. Coller dans gestionnaire domaine

### Option 2: Sous-domaine gratuit
```
api.allstarsbattle.com → Railway
allstarsbattle.vercel.app → Vercel (gratuit, rénamable si custom domain)
```

---

## Sécurité Checklist

- [ ] `.env` jamais commité (vérifier .gitignore)
- [ ] `APP_DEBUG=false` en production
- [ ] Secrets stockés dans Railway/Vercel environment variables
- [ ] HTTPS automatique (vercel + railway)
- [ ] APP_KEY généré et unique
- [ ] CORS restrictif (seulement domaines autorisés)
- [ ] Rate limiting sur API (optionnel mais recommandé)

---

## Coûts Finaux

- Vercel Frontend: **$0** (free tier suffisant)
- Railway Backend: **$0-5/mois** (free tier + crédit)
- Domaine personnalisé: **$10-15/an** (optionnel)
- Cloudflare R2: **$0-0.015/GB** (très cheap)

**Total: 100% Gratuit pour démarrer!** 🚀
