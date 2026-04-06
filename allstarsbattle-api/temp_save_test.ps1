$body = @'
{
  "globalConfig": {
    "contact": {
      "email": "test123@example.com",
      "phone": "+22812345678",
      "address": "Test City"
    },
    "socials": {
      "instagram": "https://instagram.com/test",
      "facebook": "https://facebook.com/test",
      "twitter": "https://twitter.com/test",
      "youtube": "https://youtube.com/test"
    },
    "seo": {
      "title": "Test SEO Title",
      "description": "Test SEO Description",
      "keywords": "test,seo"
    },
    "hero": {
      "title": "Test Hero",
      "subtitle": "Test Subtitle",
      "location": "Test Location",
      "backgroundImage": "https://test.image",
      "videoUrl": "https://test.video"
    },
    "competition": {
      "dateStart": "01 - 02 JAN 2027",
      "location": "Test Location",
      "description": "Test competition description"
    },
    "eventDate": "2027-01-01T12:00:00",
    "stats": [
      {"label": "Stat X", "value": "99"}
    ]
  }
}
'@

Write-Host "Sending POST to /api/cms/data..."
$response = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/cms/data' -Method Post -Body $body -ContentType 'application/json'
$response | ConvertTo-Json
