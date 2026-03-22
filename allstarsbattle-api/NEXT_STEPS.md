# 🚀 Next Steps - Get Everything Running

## ⏰ Time Required: ~10 minutes

## Step 1: Prepare MySQL Database (2 min)

Open MySQL Command Line or any MySQL client:

```bash
# Option A: Command line
mysql -u root -p
CREATE DATABASE allstarsbattle;
EXIT;

# Option B: Using MySQL Workbench
# 1. Connect to MySQL
# 2. Right-click → Create New Database
# 3. Name: allstarsbattle
# 4. Click Create Database
```

✅ **Result**: Empty database ready

## Step 2: Run Database Migrations (2 min)

In PowerShell/Terminal:

```bash
cd c:\Users\LATITUDE 3520\TEST\allstarsbattle-api
php artisan migrate
```

Expected output:
```
✓ Creating table companies
✓ Creating table featured_pieces
✓ Creating table participants
... (18 tables total)

Migration table created successfully.
Migrated: 2026_03_20_080115_create_companies_table (...ms)
...
Done in X seconds ✓
```

✅ **Result**: All 18 tables created in MySQL

## Step 3: Start Laravel Backend (1 min)

**Keep this terminal running!**

```bash
cd c:\Users\LATITUDE 3520\TEST\allstarsbattle-api
php artisan serve
```

Expected output:
```
Starting Laravel development server: http://127.0.0.1:8000

Press Ctrl+C to quit
```

✅ **Result**: API running on http://localhost:8000

## Step 4: Start React Frontend (1 min)

**In NEW Terminal:**

```bash
cd c:\Users\LATITUDE 3520\TEST\ALLSTARSBATTLE
npm run dev
```

Expected output:
```
VITE v6.4.1  building...

➜  Local:   http://localhost:5173/
```

✅ **Result**: Frontend running on http://localhost:5173

## Step 5: Verify Integration (3 min)

### Test A: Direct API Test
Open browser, visit:
```
http://localhost:8000/api/cms/data
```

Should see JSON response with all your CMS data!

### Test B: Check Frontend Network
1. Open React at http://localhost:5173
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh page (F5)
5. Look for `/api/cms/data` request
6. Check Response tab - should show JSON ✅

### Test C: Check Console for Errors
In DevTools → Console tab:
- Should see **no CORS errors**
- Should see **no 404 errors**
- Page should load normally

✅ **Result**: Full integration confirmed!

## What You Should See

### In API (http://localhost:8000/api/cms/data)
```json
{
  "companies": [
    {
      "id": "1",
      "name": "Company Name",
      ...
    }
  ],
  "participants": [...],
  "organizers": [...],
  "featuredPiece": {...},
  "program": [...],
  "blog": {"articles": [...]},
  "ticketing": {"tickets": [...], "faqs": [...]},
  ...
}
```

### In Browser Console
```javascript
// No errors!
// Network tab shows successful /api/cms/data request
// Status: 200 OK
// Response Type: JSON
```

## Troubleshooting

### ❌ Migrate Error: "Unknown column in field list"
**Solution**: 
```bash
php artisan migrate:reset
php artisan migrate
```

### ❌ Port 8000 Already in Use
**Solution**:
```bash
# Use different port
php artisan serve --port 8001

# Then visit http://localhost:8001/api/cms/data
```

### ❌ CORS Error in Console
**Solution**:
1. Verify Laravel is running on port 8000
2. Check `config/cors.php` has `http://localhost:5173`
3. Restart Laravel server

### ❌ MySQL Connection Error
**Solution**:
1. Verify MySQL is running
2. Check `.env` database credentials
3. Create database manually: `CREATE DATABASE allstarsbattle;`

### ❌ React shows 404 for API
**Solution**:
1. Check server is running: visit `http://localhost:8000` in browser
2. Check `src/services/api.ts` has correct URL
3. Check DevTools Console for exact error

## Success Checklist

```
[ ] MySQL database 'allstarsbattle' created
[ ] Migrations ran without errors (18 tables)
[ ] Laravel server running on port 8000
[ ] React server running on port 5173
[ ] Browser shows http://localhost:8000/api/cms/data → JSON
[ ] React loads page without errors
[ ] DevTools Network shows /api/cms/data → 200 OK
[ ] DevTools Console has no errors
```

If all checked ✅ = Full integration complete!

## Optional: Add Sample Data

If you want to populate tables with sample data:

```bash
# Create seeders (optional)
php artisan make:seeder CompanySeeder
php artisan make:seeder ParticipantSeeder
# ... etc

# Then run seeders
php artisan db:seed
```

*You can skip this for now - the API works with empty tables*

## Commands Reference

**Useful Laravel commands:**

```bash
# See all database tables
php artisan tinker
> Schema::getTables()

# Check if specific table exists
php artisan tinker
> DB::table('companies')->count()

# View all API routes
php artisan route:list | grep api

# Factory reset (warning: deletes all data!)
php artisan migrate:reset
php artisan migrate
```

## Next Steps After Testing

Once everything works:

1. **Add Seeders** - Populate database with initial data
2. **Setup R2** - Configure Cloudflare R2 for images
3. **Implement Auth** - Add admin login
4. **Add Validation** - Validate inputs
5. **Write Tests** - Create unit tests

## Still Need Help?

Check these files for detailed info:

- `API_DOCUMENTATION.md` - Database schema details
- `SETUP.md` - Installation walthrough
- `PROJECT_STATUS.md` - Project status & todos
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `routes/api.php` - Available endpoints
- `app/Http/Controllers/Api/CMSController.php` - Main API logic

## Summary of What's Running

```
Frontend (React)              Backend (Laravel)              Database (MySQL)
http://localhost:5173    →    http://localhost:8000    →    allstarsbattle
      ↓                             ↓                              ↓
  App.tsx                    CMSController.php              companies table
  Pages                      Models (18)                     participants
  cmsService.ts              routes/api.php                organizers
                                                            + 15 more tables
```

**Open 2 terminals, run 2 commands, check results = Complete! ✅**

---

**Time to Full Integration**: ~10 minutes  
**Code Changes Needed**: **ZERO** (so elegant!) ✨
