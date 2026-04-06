$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting current data..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json

Write-Host "Building payload..." -ForegroundColor Cyan
$newCompany = @{
    name = "Test Company $(Get-Date -Format 'HHmmss')"
    choreographer = "Test"
    pieceTitle = "Test"
    description = "Test"
    bio = "Test"
    mainImage = "https://test.com/img.jpg"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00"
}

$companiesArray = @()
$companiesArray += $initialData.companies[0]  # Add existing
$companiesArray += $newCompany  # Add new

Write-Host "Companies to send: $(@($companiesArray).Count)"

$payload = @{
    companies = $companiesArray
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "Payload structure (first 300 chars):"
$payload.Substring(0, 300)

Write-Host ""
Write-Host "Companies array in JSON:"
$payload | Select-String -Pattern '"companies"' -Context 0,5

Write-Host ""
Write-Host "Sending POST..."
$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers @{"Content-Type" = "application/json"}
Write-Host "Response status: $($response.StatusCode)"
