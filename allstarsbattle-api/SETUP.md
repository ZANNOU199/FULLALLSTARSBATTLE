# Setup Guide - Laravel API Backend

## Step-by-Step Setup

### Step 1: Install PHP Dependencies
```bash
cd c:\Users\LATITUDE 3520\TEST\allstarsbattle-api
composer install
```

### Step 2: Setup Environment File
```bash
cp .env.example .env
php artisan key:generate
```

### Step 3: Configure Database (Edit .env)
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=allstarsbattle
DB_USERNAME=root
DB_PASSWORD=
```

### Step 4: Create MySQL Database
```bash
# On Windows Command Prompt or PowerShell:
mysql -u root -p

# Then in MySQL:
CREATE DATABASE allstarsbattle;
EXIT;
```

### Step 5: Run Database Migrations
```bash
php artisan migrate
```

### Step 6: Start the Laravel Development Server
```bash
php artisan serve
```

Server starts at: **http://localhost:8000**

### Step 7: Test API Endpoint
Visit in browser: **http://localhost:8000/api/cms/data**

Should see JSON response with all CMS data!

## What Got Created

✅ **18 Database Tables**:
- companies, featured_pieces, participants, organizers
- articles, program_days, activities, tickets, faqs
- bracket_matches, bracket_rounds, timeline_events, legends
- partners, media_items, global_configs, page_backgrounds
- competitions

✅ **Controllers**:
- `CMSController` - Main endpoint for all CMS data
- `CompanyController`, `ParticipantController`, `OrganizerController`, `ArticleController`

✅ **Routes** (api.php):
- `GET /api/cms/data` - Get all CMS data (PUBLIC)
- Other endpoints - Protected with Sanctum (future)

✅ **Models** - One for each table with relationships

## Frontend Integration

The React app doesn't need ANY changes!

Currently in React frontend (`src/services/api.ts`):
```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';
```

The `cmsService.ts` will automatically:
1. Try to fetch from `http://localhost:8000/api/cms/data`
2. Fall back to localStorage if API isn't available

## Next Steps

1. **Populate Database**: Create seeders to add sample data
2. **Setup Cloudflare R2**: Configure image storage
3. **Add Image Compression**: Install Intervention Image package
4. **Implement Authentication**: Setup Sanctum for admin endpoints
5. **Deploy**: Deploy to production server

## Running Both Frontend & Backend

### Terminal 1 - React Frontend
```bash
cd c:\Users\LATITUDE 3520\TEST\ALLSTARSBATTLE
npm run dev
# Frontend: http://localhost:5173
```

### Terminal 2 - Laravel API
```bash
cd c:\Users\LATITUDE 3520\TEST\allstarsbattle-api
php artisan serve
# API: http://localhost:8000
```

Both running = Full integration! ✅

## Troubleshooting

### MySQL Connection Refused
- Make sure MySQL is running
- Check credentials in .env
- Try: `mysql -u root -p` to verify connection

### Key Generation Error
- May happen if .env already exists
- Delete .env and rerun: `php artisan key:generate`

### Port 8000 Already in Use
Use different port:
```bash
php artisan serve --port 8001
```

### CORS Errors in Frontend
- Check that API server is running on port 8000
- Configure CORS in `config/cors.php` (will implement next)

## File Locations

Important files created:
- `app/Http/Controllers/Api/CMSController.php` - Main API logic
- `routes/api.php` - API routes
- `database/migrations/*` - Table definitions
- `app/Models/*` - Database models
- `API_DOCUMENTATION.md` - Full database schema
- `.env` - Configuration (create this!)

## Testing API

### Using Browser
Open: http://localhost:8000/api/cms/data

### Using PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/cms/data" -Method GET | Select-Object -ExpandProperty Content
```

###Using cURL
```bash
curl http://localhost:8000/api/cms/data
```

## Environment Variables Needed

Create `.env` with these minimal settings:
```ini
APP_NAME="ASBI API"
APP_ENV=local
APP_KEY=base64:_generated_by_php_artisan_key:generate_
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=allstarsbattle
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
```

## Success Indicators

✅ `php artisan serve` runs without errors  
✅ No 500 errors when visiting http://localhost:8000/api/cms/data  
✅ Response is valid JSON with CMS structure  
✅ React frontend fetches from API (check DevTools Network tab)  

## Reference

- [API Documentation](API_DOCUMENTATION.md) - Full schema details
- [Laravel Documentation](https://laravel.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
