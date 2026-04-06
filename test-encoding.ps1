# Check if the API response itself has encoding issues

$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting API data..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri $baseUrl -Method GET
$responseText = $response.Content

# Check if there are any weird characters
Write-Host "`nResponse encoding:" $response.Encoding
Write-Host "`nFirst 500 chars of response:" 
$responseText.Substring(0, 500)

# Try to parse it
$data = $responseText | ConvertFrom-Json
Write-Host "`nFirst company name:" $data.companies[0].name
Write-Host "French char check (should contain accents):" $data.companies[0].pieceTitle

# Save response to file for inspection
$responseText | Out-File -Path "api_response_raw.txt" -Encoding UTF8
Write-Host "`nRaw response saved to api_response_raw.txt"

# Now send it back
Write-Host "`nNow converting back to JSON..."
$testCompany = @{
    name = "Test - " + (Get-Date -Format 'HHmmss')
    choreographer = "Test"
    pieceTitle = $data.companies[0].pieceTitle  # Use existing data with accents
    description = "Test"
    bio = "Test"
    mainImage = "https://test.com/img"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "20:00"
}

$payload = @{ companies = @($data.companies[0], $testCompany) } | ConvertTo-Json -Depth 10
Write-Host "`nPayload contains special chars (checking for ï¿½):" 
if ($payload.IndexOf("ï¿½") -ge 0) {
    Write-Host "YES - Malformed UTF-8 detected in payload!" -ForegroundColor Red
} else {
    Write-Host "No - Payload looks OK" -ForegroundColor Green
}

$payload | Out-File -Path "payload_sent.txt" -Encoding UTF8
Write-Host "Payload saved to payload_sent.txt"
