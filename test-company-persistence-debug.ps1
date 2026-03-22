# Test Company Persistence - DEBUG VERSION

$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting initial data..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCompanyCount = @($initialData.companies).Count
Write-Host "Initial companies: $initialCompanyCount" -ForegroundColor Green

# Create test company
$testCompany = @{
    id = 999
    name = "DEBUG Test Company"
    choreographer = "Debug Choreographer"
    pieceTitle = "Debug Piece"
    description = "This is a debug test"
    bio = "Debug bio"
    mainImage = "https://example.com/debug.jpg"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00:00"
}

# Build complete payload with ALL existing data plus the new company
$companies = @($initialData.companies) + @($testCompany)

# Build full payload
$payloadObject = @{
    companies = $companies
    history = $initialData.history
    competition = $initialData.competition
    partners = $initialData.partners
}

# Verify payload structure BEFORE conversion
Write-Host ""
Write-Host "Payload object structure:" -ForegroundColor Cyan
Write-Host "  companies count: $(@($payloadObject.companies).Count)" -ForegroundColor Yellow
Write-Host "  First company ID: $($payloadObject.companies[0].id)" -ForegroundColor Yellow
Write-Host "  Last company ID: $($payloadObject.companies[-1].id)" -ForegroundColor Yellow

# Convert to JSON
$Json = $payloadObject | ConvertTo-Json -Depth 10

# Check JSON size and content
Write-Host ""
Write-Host "JSON Payload size: $($Json.Length) bytes" -ForegroundColor Cyan
Write-Host "JSON companies section (first 500 chars):" -ForegroundColor Cyan
$Json.Substring(0, [Math]::Min(500, $Json.Length))

# Send POST
Write-Host ""
Write-Host "Sending POST request..." -ForegroundColor Cyan
$headers = @{
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $Json -Headers $headers -ErrorAction Stop
Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
Write-Host "Response content (first 200 chars):"
$response.Content.Substring(0, [Math]::Min(200, $response.Content.Length))

# Verify persistence
Write-Host ""
Write-Host "Checking if company persisted..." -ForegroundColor Cyan
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$finalCount = @($verifyData.companies).Count
Write-Host "Final companies count: $finalCount" -ForegroundColor Green

$testFound = $verifyData.companies | Where-Object { $_.id -eq 999 }
if ($testFound) {
    Write-Host "✅ Company 999 FOUND!" -ForegroundColor Green
    Write-Host "   Name: $($testFound.name)" -ForegroundColor Green
} else {
    Write-Host "❌ Company 999 NOT FOUND!" -ForegroundColor Red
    Write-Host "Available IDs: $(($verifyData.companies | Select-Object -ExpandProperty id) -join ', ')" -ForegroundColor Red
}
