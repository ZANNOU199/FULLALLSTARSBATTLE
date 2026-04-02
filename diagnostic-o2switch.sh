# Diagnostic complet pour o2switch
echo "=== DIAGNOSTIC O2SWITCH ==="
echo ""

# 1. Vérifier la configuration PHP
echo "1. Configuration PHP:"
php -v
echo ""

# 2. Vérifier les extensions PHP
echo "2. Extensions PHP:"
php -m | grep -E "(pgsql|pdo|mbstring|openssl)"
echo ""

# 3. Vérifier la connexion à la base de données
echo "3. Test connexion PostgreSQL:"
php -r "
try {
    \$pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=sc4crilin10_allstarsbattle', 'sc4crilin10_admn', ']zvai0myZmryPN@X');
    echo '✅ Connexion PostgreSQL réussie' . PHP_EOL;

    // Test requête simple
    \$stmt = \$pdo->query('SELECT COUNT(*) as count FROM users');
    \$result = \$stmt->fetch(PDO::FETCH_ASSOC);
    echo '✅ Table users accessible: ' . \$result['count'] . ' utilisateurs' . PHP_EOL;

} catch (Exception \$e) {
    echo '❌ Erreur PostgreSQL: ' . \$e->getMessage() . PHP_EOL;
}
"
echo ""

# 4. Vérifier les permissions des fichiers
echo "4. Permissions des fichiers:"
ls -la storage/
ls -la bootstrap/cache/
echo ""

# 5. Vérifier la configuration Laravel
echo "5. Configuration Laravel:"
cd /home/sc4crilin10/api.allstarbattle.dance
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✅ Cache Laravel régénéré"
echo ""

# 6. Test des routes API
echo "6. Test des routes API:"
curl -s -o /dev/null -w "Health check: %{http_code}\n" https://api.allstarbattle.dance/api/health
curl -s -o /dev/null -w "CMS data: %{http_code}\n" https://api.allstarbattle.dance/api/cms/data
echo ""

# 7. Vérifier les logs Laravel
echo "7. Dernières erreurs Laravel:"
tail -20 storage/logs/laravel.log 2>/dev/null || echo "Pas de fichier de log trouvé"
echo ""

echo "=== FIN DIAGNOSTIC ==="