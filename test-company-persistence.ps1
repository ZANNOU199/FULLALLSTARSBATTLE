# Test Company Persistence

$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "1. Getting current companies count..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count
Write-Host "   Current companies: $initialCount" -ForegroundColor Green

Write-Host ""
Write-Host "2. Creating test data payload..." -ForegroundColor Cyan
# Get current data and add a new test company
$testCompany = @{
    id = 999
    name = "Test Company " + (Get-Date -Format "HHmmss")
    choreographer = "Test Choreographer"
    pieceTitle = "Test Piece"
    description = "This is a test company for persistence testing"
    bio = "Test bio"
    mainImage = "https://picsum.photos/seed/test/800/600"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00:00"
}

# Create payload with updated companies array
$companies = @($initialData.companies) + @($testCompany)
$payload = @{
    companies = $companies
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
} | ConvertTo-Json -Depth 10

Write-Host "   Test company name: $($testCompany.name)"

Write-Host ""
Write-Host "3. Sending POST request with new company..." -ForegroundColor Cyan
$headers = @{"Content-Type" = "application/json"}
$postResponse = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers $headers -ErrorAction Stop
Write-Host "   POST Status: $($postResponse.StatusCode)" -ForegroundColor Green

Write-Host ""
Write-Host "4. Verifying new company persisted..." -ForegroundColor Cyan
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$verifyCount = @($verifyData.companies).Count
Write-Host "   New companies count: $verifyCount" -ForegroundColor Green

$testFound = $verifyData.companies | Where-Object { $_.id -eq 999 }
if ($testFound) {
    Write-Host "   ✅ TEST COMPANY FOUND IN DATABASE!" -ForegroundColor Green
    Write-Host "   Company name: $($testFound.name)" -ForegroundColor Green
    Write-Host "   Performance date: $($testFound.performanceDate)" -ForegroundColor Green
} else {
    Write-Host "   ❌ TEST COMPANY NOT FOUND - PERSISTENCE FAILED!" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Cleaning up test company..." -ForegroundColor Cyan
$cleanup = @{
    companies = @($initialData.companies)
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
} | ConvertTo-Json -Depth 10

$cleanupResponse = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $cleanup -Headers $headers
Write-Host "   Cleanup Status: $($cleanupResponse.StatusCode)" -ForegroundColor Green

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan
