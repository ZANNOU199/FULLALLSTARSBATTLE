# Test login en local
Write-Host "=== TEST LOGIN LOCAL ===" -ForegroundColor Cyan

# Test 1: Vérifier que l'API répond
Write-Host "`n1. Test connection à l'API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/api/health" -ErrorAction Stop
    Write-Host "✅ API répond: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API ne répond pas à http://localhost/api/health" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test OPTIONS préflightielle CORS
Write-Host "`n2. Test requête OPTIONS (CORS preflight)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/api/auth/login" `
        -Method OPTIONS `
        -Headers @{
            'Origin' = 'http://localhost:5173'
            'Access-Control-Request-Method' = 'POST'
        } -ErrorAction Stop
    Write-Host "✅ CORS preflight OK: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response Headers:" -ForegroundColor Cyan
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like '*Access-Control*' } | ForEach-Object {
        Write-Host "   $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ CORS preflight échoué" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test login POST
Write-Host "`n3. Test login POST..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = 'ad@allstarbattle.dance'
        password = 'admin123'
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost/api/auth/login" `
        -Method POST `
        -Headers @{
            'Content-Type' = 'application/json'
            'Origin' = 'http://localhost:5173'
        } `
        -Body $loginData `
        -ErrorAction Stop
    
    Write-Host "✅ Login réussi: $($response.StatusCode)" -ForegroundColor Green
    $json = $response.Content | ConvertFrom-Json
    Write-Host "   Message: $($json.message)" -ForegroundColor Cyan
    if ($json.token) {
        Write-Host "   Token: $($json.token.Substring(0, 20))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Login échoué: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
    Write-Host "   Response: $($_.Exception.Response)" -ForegroundColor Red
    try {
        $errorBody = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()).ReadToEnd()
        Write-Host "   Body: $errorBody" -ForegroundColor Red
    } catch {}
}

# Test 4: Vérifier que l'utilisateur admin existe
Write-Host "`n4. Vérifier l'utilisateur admin en base..." -ForegroundColor Yellow
Write-Host "   Commande: php artisan tinker" -ForegroundColor Gray
Write-Host "   Puis: User::where('email', 'ad@allstarbattle.dance')->first()" -ForegroundColor Gray
