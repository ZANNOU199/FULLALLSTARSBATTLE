# railway-set-env.ps1
# Usage:
#   1) npm install -g railway
#   2) railway login
#   3) cd allstarsbattle-api
#   4) railway link (choisis ton projet existant)
#   5) .\railway-set-env.ps1

$envFile = ".env"
if (-Not (Test-Path $envFile)) {
    Write-Error "Fichier $envFile introuvable. Crée le d'abord, puis relance."
    exit 1
}

# Lecture et export vers Railway
Get-Content $envFile | ForEach-Object {
    # Strip comments and espace
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }

    if ($_ -match '^\s*([^=]+?)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()

        # Ne pas pousser les valeurs vides (sauf nécessaires)
        if ([string]::IsNullOrEmpty($key)) { return }

        Write-Host "railway variable set --service FULLALLSTARSBATTLE $key=******"
        railway variable set --service FULLALLSTARSBATTLE "$key=$value"
    }
}

Write-Host "✅ Toutes les variables de .env ont été poussées vers Railway (si la commande a réussi)."
Write-Host "Maintenant : railway variable list --service FULLALLSTARSBATTLE ; railway up ; railway run php artisan migrate --force ; curl https://fullallstarsbattle-production.up.railway.app/api/health"