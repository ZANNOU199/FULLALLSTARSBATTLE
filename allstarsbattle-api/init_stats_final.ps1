$PSDefaultParameterValues['*:Encoding'] = 'UTF8'

$body = @'
{
  "globalConfig": {
    "contact": {
      "email": "contact@ASB.com",
      "phone": "+228 90 00 00 00",
      "address": "Lome, Togo"
    },
    "socials": {
      "instagram": "https://instagram.com/allstarsbattle",
      "facebook": "https://facebook.com/allstarsbattle",
      "twitter": "https://twitter.com/allstarsbattle",
      "youtube": "https://youtube.com/allstarsbattle"
    },
    "seo": {
      "title": "All Star Battle International 2026",
      "description": "La plus grande competition de danse urbaine en Afrique.",
      "keywords": "danse, battle, hip-hop, breaking, togo, lome"
    },
    "hero": {
      "title": "All STAR BATTLE INTERNATIONAL",
      "subtitle": "Le Throne. Le Respect. La Legende.",
      "location": "TOGO 2026",
      "backgroundImage": "https://images.unsplash.com/photo-1547153760-18fc86324498",
      "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4"
    },
    "competition": {
      "dateStart": "14 - 16 AOUT 2026",
      "location": "PALAIS DES CONGRES DE LOME, TOGO",
      "description": "L'elite mondiale du breaking et du hip-hop se reunit sur les terres du Togo pour la plus grande battle d'Afrique."
    },
    "eventDate": "2026-08-14T00:00:00",
    "stats": [
      {"label": "Danseurs Qualifies", "value": "16"},
      {"label": "Nations Representees", "value": "12"},
      {"label": "Juges Internationaux", "value": "8"}
    ],
    "dancers": {
      "sectionTitle": "LES DANSEURS",
      "sectionSubtitle": "Featured"
    },
    "programmation": {
      "sectionTitle": "PROGRAMMATION"
    },
    "vip": {
      "sectionTitle": "EXPERIENCE VIP",
      "sectionDescription": "Plongez au coeur de l'action avec un acces privilegie.",
      "features": []
    },
    "partners": {
      "sectionTitle": "PARTENAIRES & SPONSORS"
    },
    "blog": {
      "sectionTitle": "ACTUALITES & NEWS"
    },
    "footer": {
      "description": "L'evenement de breakdance ultime qui definit le throne de la culture urbaine en Afrique.",
      "copyright": "© 2026 All STAR BATTLE INTERNATIONAL. TOUS DROITS RESERVES."
    }
  }
}
'@

Write-Host "Initializing globalConfig with 3 stats..."
$response = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/cms/data' -Method Post -Body $body -ContentType 'application/json; charset=utf-8'
Write-Host "Response: " ($response.message)
Write-Host "Stats saved successfully!"
