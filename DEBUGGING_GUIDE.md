# 🔍 Guide de Diagnostic: Images qui ne persistent pas en Base de Données

## Problème
Les images s'uploadent sur R2 mais ne se sauvegardent que localement (localStorage). Après rafraîchir la page ou se connecter sur un autre navigateur, les images disparaissent.

## Solutions Applied
✅ Corrigé l'ordre: envoi au serveur **AVANT** mise à jour locale
✅ Ajouté logging partout pour tracer le flux
✅ Amélioré la gestion d'erreur (affiche les erreurs à l'utilisateur)

## 📋 Teste Maintenant

### 1️⃣ Ouvrir la Console du Navigateur
```
Appuie sur: F12  ou  Ctrl+Shift+I
Va à l'onglet: Console
```

### 2️⃣ Teste l'Upload d'Image
1. Accès à Admin → Images de Fond
2. Clique sur "Éditer" pour une page (ex: Home ou Competition)
3. Upload une **NOUVELLE** image (très important!)
4. Clique "Enregistrer"

### 3️⃣ **Regarde la Console Navigateur**
Tu devrais voir des logs comme:

#### ✅ Si ça marche:
```
[BackgroundImages] handleSave: Starting save for page: home
[BackgroundImages] Sending data to backend via onSave...
[Admin Dashboard] manualSave called
[Admin Dashboard] Calling cmsService.saveData...
[CMS Service] Making POST request to /cms/data
[CMS Service] POST response status: 200
[CMS Service] Fresh backend data loaded: {...}
✓ Enregistré!
```

#### ❌ Si ça échoue:
```
[CMS Service] Failed to save CMS data to API:
[CMS Service] Error response: {...error details...}
[CMS Service] Error message: Network error / 404 / 500 / etc.
```

### 4️⃣ Rafraîchis la Page
- F5 ou Ctrl+R
- Si l'image persiste → ✅ Problème résolu!
- Si l'image disparaît → ❌ Continue au step 5

### 5️⃣ Vérifies les Logs du Serveur Laravel
```bash
# Dans le terminal allstarsbattle-api:
cd c:\Users\LATITUDE 3520\TEST\allstarsbattle-api

# Regarde les derniers logs:
Get-Content storage/logs/laravel.log -Tail 100 | ConvertFrom-Json -ErrorAction SilentlyContinue | Format-List
```

### 6️⃣ Teste depuis un Autre Navigateur (ou Incognito)
```
Ouvre Chrome/Firefox/Edge en mode Incognito
Va à http://localhost:3000/admin
Connecte-toi
Si l'image apparaît → ✅ Données persistent correctement
Si l'image n'apparaît pas → ❌ Pas sauvegardé en base de données
```

## 🐛 Possibles Causes Détectées

### A. Erreur Réseau
**Symptôme**: `[CMS Service] Error: Network Error` ou `Failed to fetch`
- Vérifier que le serveur Laravel tourne sur port 8000
- Vérifier CORS dans `allstarsbattle-api/config/cors.php`

### B. Erreur 404
**Symptôme**: `[CMS Service] Error status: 404`
- L'endpoint `/api/cms/data` n'existe pas ou route mal configurée

### C. Erreur 500
**Symptôme**: `[CMS Service] Error status: 500`
- Erreur PHP sur le serveur → vérifier les logs Laravel
- Problème avec la base de données

### D. Status !== 200/201
**Symptôme**: Logs montrent status: 201 ou autre
- Vérifier que le backend retourne bien 200
- Vérifier que getThumbnail ne retourne jamais 404

## 📝 Logs à Copier ici Après Test

Copie-colle les logs importants de:
1. **Console Navigateur** (tout entre [BackgroundImages] et [Admin Dashboard])
2. **Laravel logs** (dernières 30 lignes de storage/logs/laravel.log)
3. **Response Status Code** du POST /cms/data

Ça va m'aider à diagnostiquer le problème exactement!

---

## 🔧 Commandes Rapides pour Tester

### Vérifier que Laravel répond
```bash
Invoke-WebRequest -Uri "http://localhost:8000/api/cms/data" -Headers @{Authorization="Bearer TOKEN"} | Select-Object StatusCode
```

### Vérifier les données en base
```bash
cd allstarsbattle-api
php artisan tinker
DB::table('global_config')->where('key', 'pageBackgrounds')->first();
exit
```

### Voir les logs en temps réel
```bash
cd allstarsbattle-api
Get-Content storage/logs/laravel.log -Tail 0 -Wait
```

---

**Reviens avec les logs et je pourrai fixer le problème! 🚀**
