# ALLSTARSBATTLE API - Database Structure & Documentation

## Overview
This Laravel API backend serves the React frontend application. The frontend uses ONE main API endpoint:
- **GET /api/cms/data** - Retrieves ALL CMS data in a single request (matches `cmsService.getData()` from React)
- **POST /api/cms/data** - Saves CMS data updates

## Database Tables & Structure

### 1. companies
```sql
id (bigint, primary key)
name (string) - e.g., "Pockemon Crew"
choreographer (string) - e.g., "Riyad Fghani"
piece_title (string)
description (text)
bio (text)
main_image (string) - URL
gallery (json) - Array of image URLs
performance_date (date)
performance_time (time)
created_at, updated_at
```

### 2. featured_pieces
```sql
id (bigint, primary key)
title (string)
image (string) - URL
duration (string) - e.g., "45 MIN"
choreographer (string)
music (string)
description (text)
full_synopsis (longtext)
intention_quote (text)
intention_author (string)
performers (string) - e.g., "8 B-Boys & B-Girls"
technology (string) - e.g., "Motion Capture Live"
created_at, updated_at
```

### 3. participants
```sql
id (bigint, primary key)
name (string)
country (string)
country_code (string) - e.g., "fr", "jp"
specialty (string) - e.g., "Breaking", "DJ"
bio (text)
photo (string) - URL
social_links (json) - {instagram, facebook, twitter, youtube}
category (enum: 'b-boy', 'b-girl', 'crew', 'judge', 'dj', 'mc')
created_at, updated_at
```

### 4. organizers
```sql
id (bigint, primary key)
name (string)
role (string)
bio (text)
photo (string) - URL
social_links (json) - {instagram, facebook, twitter, linkedin}
created_at, updated_at
```

### 5. articles
```sql
id (bigint, primary key)
title (string)
content (longtext)
category (string) - e.g., "OFFICIEL", "TALENTS"
cover_image (string) - URL
date (date)
tag (string) - e.g., "EVENT", "BILLETTERIE"
created_at, updated_at
```

### 6. program_days
```sql
id (bigint, primary key)
date (date)
label (string) - e.g., "JOUR 01"
created_at, updated_at
```

### 7. activities
```sql
id (bigint, primary key)
program_day_id (bigint, foreign key to program_days)
time (string) - e.g., "10:00 - 16:00"
title (string)
location (string)
description (text)
category (string) - e.g., "Workshop", "Competition"
created_at, updated_at
```

### 8. tickets
```sql
id (bigint, primary key)
name (string)
price (string)
period (string) - e.g., "CFA"
tag (string) - e.g., "Accès Standard"
features (json) - Array of features
button_text (string)
color (string) - e.g., "primary", "accent-red"
recommended (boolean)
payment_link (string) - URL
created_at, updated_at
```

### 9. f_a_q_s
```sql
id (bigint, primary key)
question (text)
answer (longtext)
created_at, updated_at
```

### 10. bracket_matches
```sql
id (bigint, primary key)
player1 (string)
player2 (string)
score1 (string)
score2 (string)
country1 (string)
country2 (string)
country_code1 (string)
country_code2 (string)
round (enum: 'huitiemes', 'quarts', 'semis', 'final')
pool (string) - 'A' or 'B'
created_at, updated_at
```

### 11. timeline_events
```sql
id (bigint, primary key)
year (string)
title (string)
champion (string)
description (text)
image (string) - URL
created_at, updated_at
```

### 12. legends
```sql
id (bigint, primary key)
name (string)
bio (text)
photo (string) - URL
title (string) - e.g., "B-Boy Champion 2023"
category (string) - e.g., "bboy", "bgirl", "crew"
year (integer)
type (string) - e.g., "champion-1v1", "crew-vs-crew"
created_at, updated_at
```

### 13. partners
```sql
id (bigint, primary key)
name (string)
logo (string) - URL
category (string) - Institutional, Main, Media
tier (string) - e.g., "Sponsor Platine"
created_at, updated_at
```

### 14. media_items
```sql
id (bigint, primary key)
year (integer)
type (enum: 'photo', 'video')
url (string) - URL
title (string)
description (text)
thumbnail (string) - URL (for videos)
duration (string) - e.g., "12:45"
tag (string) - e.g., "archive", "Replay"
created_at, updated_at
```

### 15. global_configs
```sql
id (bigint, primary key)
contact_email (string)
contact_phone (string)
contact_address (string)
social_instagram (string)
social_facebook (string)
social_twitter (string)
social_youtube (string)
seo_title (string)
seo_description (string)
seo_keywords (string)
hero_image (string) - URL
hero_video (string) - URL
created_at, updated_at
```

### 16. page_backgrounds
```sql
id (bigint, primary key)
page (string) - 'hero', 'artisticScene', 'dancers', 'media', 'contact'
image_url (string)
video_url (string) - nullable
width (integer)
height (integer)
last_modified (timestamp)
created_at, updated_at
```

### 17. competitions
```sql
id (bigint, primary key)
rules (longtext)
prize_pool (json) - Array of {category, prize}
created_at, updated_at
```

### 18. bracket_rounds
```sql
id (bigint, primary key)
title (string)
competition_id (bigint, foreign key)
created_at, updated_at
```

## API Response Format

All responses follow the CMSData structure from React types.ts:

```json
{
  "companies": [...],
  "featuredPiece": {...},
  "participants": [...],
  "program": [...],
  "categories": [...],
  "blog": {"articles": [...]},
  "competition": {...},
  "ticketing": {"tickets": [...], "faqs": [...]},
  "history": {"timeline": [...], "legends": [...]},
  "contact": {...},
  "partners": {...},
  "media": [...],
  "globalConfig": {...},
  "theme": {...},
  "pageBackgrounds": {...},
  "siteAssets": {...},
  "participate": {...},
  "organizers": [...],
  "organizersConfig": {...}
}
```

## Frontend Integration

The React frontend uses `cmsService.ts` which:
1. ~~Previously read from localStorage~~
2. **Now** fetches from `http://localhost:8000/api/cms/data`
3. Caches the response in state
4. No code changes needed in frontend

## Authentication
- Currently no authentication required for GET /api/cms/data
- Admin endpoints (POST, PUT, DELETE) will use Laravel Sanctum tokens
- To be implemented: Admin login endpoint

## Cloudflare R2 Integration
- Update .env with R2 credentials:
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_BUCKET
  - Configure in `config/filesystems.php`

## Image Compression
- To add: Laravel Intervention Image
- Automatic compression on upload to R2
- WebM format for videos

## Running the API

```bash
# Install dependencies
composer install

# Create database
mysql -u root -p
CREATE DATABASE allstarsbattle;

# Run migrations
php artisan migrate

# Seed initial data (optional)
php artisan db:seed

# Start server
php artisan serve

# Visit
http://localhost:8000/api/cms/data
```
