$response = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/cms/data' -Method Get
$stats = $response.globalConfig.stats

Write-Host "Stats from API:"
foreach ($stat in $stats) {
  Write-Host ("  - " + $stat.label + ": " + $stat.value)
}
Write-Host ""
Write-Host ("Total stats: " + $stats.Count)
