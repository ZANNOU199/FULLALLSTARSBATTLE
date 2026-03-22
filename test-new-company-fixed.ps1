# Test New Company Persistence with corrected logic

$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "1. Getting current data from API..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count
Write-Host "   Current companies: $initialCount" -ForegroundColor Green
Write-Host "   Company IDs: $(($initialData.companies | Select-Object -ExpandProperty id) -join ', ')" -ForegroundColor Yellow

Write-Host ""
Write-Host "2. Creating NEW company (WITHOUT ID to let backend auto-generate)..." -ForegroundColor Cyan
# NEW company without ID - just like the frontend would send
$newCompany = @{
    # NO ID - Frontend doesn't send ID for new companies
    name = "New Dance Crew $(Get-Date -Format 'HHmmss')"
    choreographer = "Test Choreographer"
    pieceTitle = "Test Piece Title"
    description = "Test description"
    bio = "Test bio"
    mainImage = "https://picsum.photos/seed/new/800/600"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00:00"
}

# Build complete payload
$companiesArray = @($initialData.companies) + @($newCompany)
Write-Host "   Companies to send: $(@($companiesArray).Count)" -ForegroundColor Yellow
Write-Host "   (Existing companies with IDs + 1 new company without ID)" -ForegroundColor Yellow

$payload = @{
    companies = $companiesArray
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "3. Sending POST request with new company..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers @{"Content-Type" = "application/json"}
Write-Host "   Status: $($response.StatusCode) ✓" -ForegroundColor Green

Write-Host ""
Write-Host "4. Reloading data from API..." -ForegroundColor Cyan
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$newCount = @($verifyData.companies).Count
Write-Host "   New company count: $newCount (was $initialCount)" -ForegroundColor Green
Write-Host "   Company IDs: $(($verifyData.companies | Select-Object -ExpandProperty id) -join ', ')" -ForegroundColor Yellow

# Find the new company (should have the highest ID if auto-generated)
$allIds = @($verifyData.companies | Select-Object -ExpandProperty id | ForEach-Object { [int]$_ })
if ($allIds.Count -gt 0) {
    $maxId = $allIds | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum
    $latestCompany = $verifyData.companies | Where-Object { [int]$_.id -eq $maxId }
    
    if ($newCount -gt $initialCount) {
        Write-Host ""
        Write-Host "SUCCESS! New company was created and persisted!" -ForegroundColor Green
        Write-Host "   Latest Company ID: $($latestCompany.id)" -ForegroundColor Green
        Write-Host "   Name: $($latestCompany.name)" -ForegroundColor Green
        Write-Host "   This company will survive page reloads!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "FAILED! Company count did not increase." -ForegroundColor Red
        Write-Host ("   Expected count: " + ($initialCount + 1) + ", Got: " + $newCount) -ForegroundColor Red
    }
}
