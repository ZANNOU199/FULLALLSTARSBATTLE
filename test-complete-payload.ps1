$baseUrl = "http://localhost:8000/api/cms/data"

Write-Host "Getting initial data..." -ForegroundColor Cyan
$initialResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$initialData = $initialResponse.Content | ConvertFrom-Json
$initialCount = @($initialData.companies).Count

Write-Host "Initial companies: $initialCount"
Write-Host "IDs: $(($initialData.companies | Select-Object -ExpandProperty id) -join ', ')"

Write-Host ""
Write-Host "Creating payload with ALL fields (like saveData does)..." -ForegroundColor Cyan

# Create new company without ID (like the corrected handleAdd does)
$newCompany = @{
    name = "New Company $(Get-Date -Format 'HHmmss')"
    choreographer = "Test"
    pieceTitle = "Test Piece"
    description = "Test desc"
    bio = "Test bio"
    mainImage = "https://picsum.photos/seed/new/800/600"
    gallery = @()
    performanceDate = "2026-12-25"
    performanceTime = "19:00"
}

#Build companies array with existing (with IDs) and new (without ID)
$companiesArray = @()
$companiesArray += $initialData.companies  # Existing companies
$companiesArray += $newCompany  # New company (no ID field)

# Build COMPLETE payload like cmsService.saveData does
$payload = @{
    companies = $companiesArray
    featuredPiece = $initialData.featuredPiece
    participants = $initialData.participants
    program = $initialData.program
    categories = $initialData.categories
    blog = $initialData.blog
    competition = $initialData.competition
    ticketing = $initialData.ticketing
    history = $initialData.history
    contact = $initialData.contact
    partners = $initialData.partners
    media = $initialData.media
    globalConfig = $initialData.globalConfig
    theme = $initialData.theme
    pageBackgrounds = $initialData.pageBackgrounds
    siteAssets = $initialData.siteAssets
    participate = $initialData.participate
    organizers = $initialData.organizers
    organizersConfig = $initialData.organizersConfig
} |ConvertTo-Json -Depth 10

Write-Host "Companies array size in payload: $((Select-String -InputObject $payload -Pattern '"companies"' -Context 0,2) | Measure-Object | Select-Object -ExpandProperty Count)"

Write-Host ""
Write-Host "Sending POST with complete payload..."
$response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $payload -Headers @{"Content-Type" = "application/json"}
Write-Host "Status: $($response.StatusCode)"

Write-Host ""
Write-Host "Reloading data..."
$verifyResponse = Invoke-WebRequest -Uri $baseUrl -Method GET
$verifyData = $verifyResponse.Content | ConvertFrom-Json
$newCount = @($verifyData.companies).Count

Write-Host "Initial count: $initialCount"
Write-Host "After save count: $newCount"

if ($newCount -gt $initialCount) {
    Write-Host "SUCCESS! New company created!" -ForegroundColor Green
} else {
    Write-Host "FAILED - count didn't increase" -ForegroundColor Red
}
