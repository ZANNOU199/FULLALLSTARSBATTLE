# Configuration Cloudflare R2 pour l'upload d'images

## Prérequis

1. **Créer un compte Cloudflare** : https://www.cloudflare.com/
2. **Activer R2** : Dans votre dashboard Cloudflare, allez dans R2 et créez un bucket
3. **Générer des tokens API** : Dans R2 -> Manage R2 API Tokens

## Configuration

### 1. Créer un bucket R2

1. Allez dans votre [dashboard Cloudflare](https://dash.cloudflare.com/)
2. Cliquez sur "R2" dans le menu latéral
3. Cliquez sur "Create bucket"
4. Donnez un nom à votre bucket (ex: `allstarsbattle-media`)
5. Notez le nom de votre bucket

### 2. Générer les tokens API

1. Dans R2, cliquez sur "Manage R2 API Tokens"
2. Cliquez sur "Create API token"
3. Donnez un nom au token (ex: `allstarsbattle-upload`)
4. Permissions : `Object Read & Write` pour votre bucket
5. Cliquez sur "Create Token"
6. **IMPORTANT** : Copiez et sauvegardez immédiatement :
   - `Access Key ID`
   - `Secret Access Key`

### 3. Récupérer l'Account ID

1. Dans votre dashboard Cloudflare, allez dans "R2"
2. Votre Account ID est visible en haut à droite ou dans l'URL

### 4. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env` et remplissez les valeurs :

```bash
# Copier le fichier
cp .env.example .env

# Éditer .env avec vos vraies valeurs
VITE_R2_ACCOUNT_ID=votre-account-id-ici
VITE_R2_ACCESS_KEY_ID=votre-access-key-id-ici
VITE_R2_SECRET_ACCESS_KEY=votre-secret-access-key-ici
VITE_R2_BUCKET_NAME=votre-nom-de-bucket-ici
VITE_R2_PUBLIC_URL=https://votre-bucket-name.votre-account-id.r2.cloudflarestorage.com
```

### 5. Configurer les CORS (OBLIGATOIRE pour les uploads)

**IMPORTANT** : Cette étape est obligatoire pour que les uploads fonctionnent depuis votre frontend !

Dans votre dashboard Cloudflare :

1. Allez dans **R2** -> **Settings** -> **CORS**
2. Cliquez sur **"Add CORS Policy"**
3. Ajoutez cette configuration :

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://votredomaine.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedHeaders": [
      "authorization",
      "x-amz-date",
      "x-amz-content-sha256",
      "content-type",
      "content-length"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

**Explication des champs :**
- `AllowedOrigins` : URLs autorisées (localhost pour développement, votre domaine pour production)
- `AllowedMethods` : Méthodes HTTP autorisées (PUT requis pour l'upload)
- `AllowedHeaders` : Headers nécessaires pour l'authentification AWS S3
- `MaxAgeSeconds` : Cache de la réponse preflight (24h = 86400s)

### 6. Vérifier la configuration

Après avoir configuré CORS, testez l'upload. Si vous avez encore des erreurs CORS :

1. **Vérifiez l'URL d'origine** : Assurez-vous que `http://localhost:3000` est dans `AllowedOrigins`
2. **Vérifiez les headers** : Tous les headers AWS S3 doivent être autorisés
3. **Vérifiez le cache** : Les règles CORS peuvent être mises en cache, patientez quelques minutes

## Utilisation

Une fois configuré, vous pouvez :

1. **Ajouter des photos** : Dans l'admin -> Médias, cliquez "Ajouter média" -> Type "Photo" -> Sélectionnez un fichier image
2. **Éditer des photos** : Cliquez sur une photo existante -> Modifiez le fichier si besoin
3. **Les vidéos** : Continuent à utiliser des URLs externes comme avant

## Avantages

- ✅ **Performance** : Images servies par le CDN Cloudflare (ultra-rapide)
- ✅ **Stockage gratuit** : 10GB inclus gratuitement
- ✅ **Transfert gratuit** : Pas de frais de bande passante
- ✅ **Sécurisé** : Authentification AWS S3 compatible
- ✅ **Évolutif** : Peut gérer des millions d'images

## Dépannage

### Erreur "Configuration Cloudflare R2 manquante"
- Vérifiez que toutes les variables `VITE_R2_*` sont définies dans `.env`
- Redémarrez le serveur de développement

### Erreur "Upload failed"
- Vérifiez vos credentials R2
- Vérifiez que le bucket existe
- Vérifiez les permissions du token API

### Images ne s'affichent pas
- Vérifiez l'URL publique dans `VITE_R2_PUBLIC_URL`
- Vérifiez que les CORS sont configurés
- Vérifiez que le bucket est public (pas nécessaire avec les tokens)

## Sécurité

⚠️ **Important** : Ne commitez jamais le fichier `.env` avec vos vraies credentials dans Git !

Ajoutez `.env` à votre `.gitignore`.