$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting initial API data..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count
Write-Host "Initial count: $initialCount" -ForegroundColor Green

# Simulate what the CORRECTED frontend SceneArtistique.handleAdd sends:
# Existing companies WITH IDs + New companies WITHOUT ID field at all

Write-Host ""
Write-Host "Simulating frontend correction: existing companies with IDs + new without ID field" -ForegroundColor Cyan

# Existing companies (keep with IDs)
$existingCompanies = @($initialData.companies)

# New company (NO id field at all, just partial object)
$newCompany = @{
    name = "Frontend Created " + (Get-Date -Format 'HHmmss')
    choreographer = "Frontend Test"
    pieceTitle = "Frontend Test Piece"
    description = "Created by frontend"
    bio = "Test bio"
    mainImage = "https://picsum.photos/seed/new/800/600"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "20:00"
}

# Build companies array like the corrected frontend does
$companiesArray = @()
$companiesArray += $existingCompanies
$companiesArray += $newCompany

Write-Host "Companies to send: " + @($companiesArray).Count -ForegroundColor Green
Write-Host "  - Existing with IDs: " + @($existingCompanies).Count -ForegroundColor Yellow
Write-Host "  - New without ID: 1" -ForegroundColor Yellow

# Build full payload
$payload = @{
    companies = $companiesArray
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "Sending POST..."
$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers @{"Content-Type" = "application/json"}
Write-Host ("Status: " + $response.StatusCode) -ForegroundColor Green

Write-Host ""
Write-Host "Verifying persistence..."
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$newCount = @($verifyData.companies).Count

Write-Host ("Before: " + $initialCount) -ForegroundColor Cyan
Write-Host ("After: " + $newCount) -ForegroundColor Cyan

if ($newCount -gt $initialCount) {
    Write-Host ""
    Write-Host "SUCCESS! New company persisted to database!" -ForegroundColor Green
    Write-Host "Count increased by: " + ($newCount - $initialCount) -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "FAILED - count did not increase" -ForegroundColor Red
}
