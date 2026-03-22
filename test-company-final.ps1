$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "1. Getting current data from API..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count
Write-Host "   Current companies: $initialCount" -ForegroundColor Green
$idList = ($initialData.companies | Select-Object -ExpandProperty id) -join ', '
Write-Host "   Company IDs: $idList" -ForegroundColor Yellow

Write-Host ""
Write-Host "2. Creating NEW company (WITHOUT ID to let backend auto-generate)..." -ForegroundColor Cyan

$newCompany = @{
    name = "New Dance Crew " + (Get-Date -Format 'HHmmss')
    choreographer = "Test Choreographer"
    pieceTitle = "Test Piece Title"
    description = "Test description"
    bio = "Test bio"
    mainImage = "https://picsum.photos/seed/new/800/600"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00:00"
}

$companiesArray = @($initialData.companies) + @($newCompany)
$countToSend = @($companiesArray).Count
Write-Host "   Companies to send: $countToSend" -ForegroundColor Yellow

$payload = @{
    companies = $companiesArray
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "3. Sending POST request with new company..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers @{"Content-Type" = "application/json"}
Write-Host ("   Status: " + $response.StatusCode) -ForegroundColor Green

Write-Host ""
Write-Host "4. Reloading data from API..." -ForegroundColor Cyan
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$newCount = @($verifyData.companies).Count
Write-Host ("   New company count: " + $newCount + " (was " + $initialCount + ")") -ForegroundColor Green
$newIdList = ($verifyData.companies | Select-Object -ExpandProperty id) -join ', '
Write-Host ("   Company IDs: " + $newIdList) -ForegroundColor Yellow

if ($newCount -gt $initialCount) {
    Write-Host ""
    Write-Host "SUCCESS! New company was created and persisted!" -ForegroundColor Green
    $allIds = @($verifyData.companies | Select-Object -ExpandProperty id | ForEach-Object { [int]$_ })
    $maxId = $allIds | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum
    $latestCompany = $verifyData.companies | Where-Object { [int]$_.id -eq $maxId }
    Write-Host ("   Latest Company ID: " + $latestCompany.id) -ForegroundColor Green
    Write-Host ("   Name: " + $latestCompany.name) -ForegroundColor Green
    Write-Host "   This company will survive page reloads!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "FAILED! Company count did not increase." -ForegroundColor Red
}
