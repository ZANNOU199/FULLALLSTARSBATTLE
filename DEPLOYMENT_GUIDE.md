# Guide de Déploiement Gratuit - All STAR BATTLE

## Frontend (React) → Vercel

### Étape 1: Préparer le code
```bash
cd ALLSTARSBATTLE
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Étape 2: Créer un compte Vercel
1. Aller sur https://vercel.com
2. S'inscrire avec GitHub (recommandé)
3. Autoriser Vercel à accéder à vos repos GitHub

### Étape 3: Importer le projet
1. Dans Vercel Dashboard → "Add New..." → "Project"
2. Sélectionner le repo GitHub: `FULLALLSTARSBATTLE`
3. Root Directory: `ALLSTARSBATTLE`
4. Configuration:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Étape 4: Variables d'environnement Vercel
Aller dans Project Settings → Environment Variables et ajouter:
- `VITE_API_URL` = `https://your-railway-backend-url.up.railway.app/api`

### Étape 5: Déployer
- Cliquer sur "Deploy" → Attendre ~2-3 minutes
- URL du site: `https://allstarsbattle.vercel.app` (à personnaliser avec custom domain)

---

## Backend (Laravel) → Railway

### Étape 1: Préparer le code
```bash
cd allstarsbattle-api
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Étape 2: Créer un compte Railway
1. Aller sur https://railway.app
2. S'inscrire avec GitHub (recommandé)
3. Autoriser Railway à accéder à vos repos

### Étape 3: Créer une application MySQL
1. Dashboard → "New" → "Database" → "MySQL"
2. Prendre note du connection string généré

### Étape 4: Déployer le Backend
1. Dashboard → "New" → "GitHub Repo"
2. Sélectionner: `FULLALLSTARSBATTLE/allstarsbattle-api`
3. Railway va automatiquement détecter le Dockerfile

### Étape 5: Configuration des variables d'environnement

Dans Railway Settings → Variables:

**Base de données** (généré automatiquement):
- Copier les variables du service MySQL

**App Configuration**:
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-domain.up.railway.app
DB_CONNECTION=mysql
DB_HOST=(depuis Railway MySQL)
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=(depuis Railway MySQL)
DB_PASSWORD=(depuis Railway MySQL)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre-email@gmail.com
MAIL_FROM_NAME=All Star Battle
CLOUDFLARE_R2_ACCOUNT_ID=votre-id
CLOUDFLARE_R2_ACCESS_KEY_ID=votre-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre-secret
CLOUDFLARE_R2_BUCKET_NAME=allstarsbattle-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
FRONTEND_URL=https://allstarsbattle.vercel.app
```

### Étape 6: Lancer les migrations
```bash
# Dans la console Railway:
php artisan migrate
php artisan db:seed (optionnel)
```

### Étape 7: Obtenir l'URL du déploiement
- Railway génère automatiquement une URL: `https://xxxx.up.railway.app`
- Mettre à jour cette URL dans Vercel pour `VITE_API_URL`

---

## Configuration CORS Final

### Sur Laravel (allstarsbattle-api/config/cors.php):
```php
'allowed_origins' => [
    'https://allstarsbattle.vercel.app',
    'https://votre-domain-custom.com',
    'http://localhost:5173' // dev local
],
```

### Sur .env:
```
FRONTEND_URL=https://allstarsbattle.vercel.app
```

---

## Coûts

✅ **Vercel Frontend**: Gratuit (jusqu'à 100GB bande passante/mois)
✅ **Railway Backend**: Gratuit (crédit gratuit $5/mois, généralement suffisant)
✅ **MySQL Railway**: Gratuit (5GB)
✅ **Cloudflare R2**: Gratuit (10GB/mois)

**Total**: **100% GRATUIT** pour commencer! 🎉

---

## Post-Déploiement

1. **Tester l'API**:
   ```
   curl https://votre-railway-url.up.railway.app/api/home
   ```

2. **Vérifier les logs**:
   - Railway: Settings → Logs
   - Vercel: Deployments → Logs

3. **Domain personnalisé** (optionnel):
   - Vercel: Settings → Domains → Add
   - Railway: Settings → Domain → Add

4. **SSL/HTTPS**: Automatique sur Vercel et Railway ✅

---

## Troubleshooting

**Vercel - Erreur "404 Not Found"?**
→ Le `vercel.json` avec rewrites est configuré pour redirect les routes au index.html

**Railway - Erreur "502 Bad Gateway"?**
→ Vérifier les logs, généralement un problème de variable d'environnement manquante

**CORS Errors?**
→ S'assurer que FRONTEND_URL et cors.php sont à jour

---

## Checklist Final

- [ ] Frontend buildé et testé localement
- [ ] Config Vercel créée avec variables env
- [ ] Backend prêt avec Dockerfile et Procfile
- [ ] Railway MySQL créée
- [ ] Variables d'environnement Railway configurées
- [ ] Migrations lancées sur Railway
- [ ] CORS configuré
- [ ] URLs de déploiement mises à jour dans les configs
- [ ] Tests API fonctionnels
- [ ] Custom domain (optionnel)
