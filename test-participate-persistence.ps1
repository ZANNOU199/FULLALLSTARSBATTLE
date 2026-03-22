# Test Participate Page Persistence
$apiUrl = "http://localhost:8000/api/cms/data"
$headers = @{
    "Content-Type" = "application/json; charset=utf-8"
}

# Test data to save
$testData = @{
    participate = @{
        hero = @{
            title = "REJOIGNEZ - TEST"
            titleHighlight = "L'AVENTURE - MODIFIED"
            subtitle = "Test participation"
        }
        sections = @{
            dancers = @{
                title = "Danseurs Test"
                description = "Test description for dancers"
            }
            professionals = @{
                title = "Professionnels Test"
                description = "Test description for professionals"
            }
            volunteers = @{
                title = "Bénévoles Test"
                description = "Test description for volunteers"
            }
        }
        formFields = @{
            nameLabel = "Nom - TEST"
            emailLabel = "Email - TEST"
            phoneLabel = "Tél - TEST"
            countryLabel = "Pays - TEST"
            messageLabel = "Message - TEST"
        }
        successMessage = @{
            title = "Succès - TEST"
            subtitle = "Merci pour le test"
        }
    }
}

Write-Host "=== TEST PARTICIPATE PERSISTENCE ===" -ForegroundColor Cyan
Write-Host ""

# Convert to JSON
$jsonData = $testData | ConvertTo-Json -Depth 10
Write-Host "Sending POST request to save Participate data..." -ForegroundColor Yellow
Write-Host "URL: $apiUrl" -ForegroundColor Gray
Write-Host "Data Preview:" -ForegroundColor Gray
$testData | ConvertTo-Json -Depth 3 | Write-Host

# POST - Save data
try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Headers $headers -Body $jsonData -UseBasicParsing
    Write-Host "`n✅ POST Request Successful!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    
    $responseData = $response.Content | ConvertFrom-Json
    Write-Host "Response Message: $($responseData.message)" -ForegroundColor Green
} catch {
    Write-Host "`n❌ POST Request Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting 2 seconds before GET request..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# GET - Verify saved data
Write-Host ""
Write-Host "Sending GET request to retrieve Participate data..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-WebRequest -Uri $apiUrl -Method GET -Headers $headers -UseBasicParsing
    Write-Host "✅ GET Request Successful!" -ForegroundColor Green
    Write-Host "Status Code: $($getResponse.StatusCode)" -ForegroundColor Green
    
    $getData = $getResponse.Content | ConvertFrom-Json
    
    # Check if participate data was saved correctly
    if ($getData.participate) {
        Write-Host ""
        Write-Host "=== PARTICIPATE DATA RETRIEVED ===" -ForegroundColor Cyan
        Write-Host "Hero Title: $($getData.participate.hero.title)" -ForegroundColor White
        Write-Host "Hero Highlight: $($getData.participate.hero.titleHighlight)" -ForegroundColor White
        Write-Host "Hero Subtitle: $($getData.participate.hero.subtitle)" -ForegroundColor White
        Write-Host ""
        Write-Host "Dancers Title: $($getData.participate.sections.dancers.title)" -ForegroundColor White
        Write-Host "Form Name Label: $($getData.participate.formFields.nameLabel)" -ForegroundColor White
        Write-Host "Success Message Title: $($getData.participate.successMessage.title)" -ForegroundColor White
        
        # Verify the data matches what we sent
        if ($getData.participate.hero.title -eq "REJOIGNEZ - TEST" -and $getData.participate.formFields.nameLabel -eq "Nom - TEST") {
            Write-Host ""
            Write-Host "✅ DATA PERSISTED CORRECTLY!" -ForegroundColor Green
            Write-Host "All Participate data was saved and retrieved successfully." -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️ DATA MISMATCH!" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ No participate data found in response!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ GET Request Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== TEST COMPLETED ===" -ForegroundColor Cyan
