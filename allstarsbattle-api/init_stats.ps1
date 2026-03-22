$body = @'
{
  "globalConfig": {
    "contact": {
      "email": "contact@asbi.com",
      "phone": "+228 90 00 00 00",
      "address": "Lomé, Togo"
    },
    "socials": {
      "instagram": "https://instagram.com/allstarsbattle",
      "facebook": "https://facebook.com/allstarsbattle",
      "twitter": "https://twitter.com/allstarsbattle",
      "youtube": "https://youtube.com/allstarsbattle"
    },
    "seo": {
      "title": "All Stars Battle International 2026",
      "description": "La plus grande compétition de danse urbaine en Afrique.",
      "keywords": "danse, battle, hip-hop, breaking, togo, lomé"
    },
    "hero": {
      "title": "ALL STARS BATTLE INTERNATIONAL",
      "subtitle": "Le Trône. Le Respect. La Légende.",
      "location": "TOGO 2026",
      "backgroundImage": "https://images.unsplash.com/photo-1547153760-18fc86324498",
      "videoUrl": "https://vjs.zencdn.net/v/oceans.mp4"
    },
    "competition": {
      "dateStart": "14 - 16 AOÛT 2026",
      "location": "PALAIS DES CONGRÈS DE LOMÉ, TOGO",
      "description": "L'élite mondiale du breaking et du hip-hop se réunit sur les terres du Togo pour la plus grande battle d'Afrique."
    },
    "eventDate": "2026-08-14T00:00:00",
    "stats": [
      {"label": "Danseurs Qualifiés", "value": "16"},
      {"label": "Nations Représentées", "value": "12"},
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
      "sectionTitle": "EXPÉRIENCE VIP",
      "sectionDescription": "Plongez au cœur de l'action avec un accès privilégié.",
      "features": []
    },
    "partners": {
      "sectionTitle": "PARTENAIRES & SPONSORS"
    },
    "blog": {
      "sectionTitle": "ACTUALITÉS & NEWS"
    },
    "footer": {
      "description": "L'événement de breakdance ultime qui définit le trône de la culture urbaine en Afrique.",
      "copyright": "© 2026 ALL STARS BATTLE INTERNATIONAL. TOUS DROITS RÉSERVÉS."
    }
  }
}
'@

Write-Host "Initializing globalConfig with 3 stats..."
$response = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/cms/data' -Method Post -Body $body -ContentType 'application/json'
Write-Host "Response: " ($response.message)
Write-Host "Stats saved successfully!"
