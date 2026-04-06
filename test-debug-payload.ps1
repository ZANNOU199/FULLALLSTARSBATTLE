# Debug test: Check what's actually being sent

$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting initial API data..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count
Write-Host "Initial count: $initialCount" -ForegroundColor Green

# Test 1: Send with simple payload containing just companies
Write-Host "`nTest 1: Minimal payload with just companies array" -ForegroundColor Magenta
$test1Companies = $initialData.companies + @{
    name = "Test Company " + (Get-Date -Format 'HHmmss')
    choreographer = "Test Choreographer"
    pieceTitle = "Test Piece"
    description = "Test Description"
    bio = "Test Bio"
    mainImage = "https://example.com/image.jpg"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "20:00"
}

$test1Payload = @{ companies = $test1Companies } | ConvertTo-Json -Depth 10

Write-Host "Payload companies count in object: " $test1Companies.Count -ForegroundColor Yellow
Write-Host "JSON string length: " $test1Payload.Length -ForegroundColor Yellow
Write-Host "First 200 chars of JSON: " $test1Payload.Substring(0, [Math]::Min(200, $test1Payload.Length)) -ForegroundColor Yellow

$test1Response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $test1Payload -Headers @{"Content-Type" = "application/json"}
Write-Host "Response status: " $test1Response.StatusCode -ForegroundColor Green

# Verify
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$afterCount = @($verifyData.companies).Count
Write-Host "Count after Test 1: $afterCount (was $initialCount, change: " ($afterCount - $initialCount) ")" -ForegroundColor Cyan
