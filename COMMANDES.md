# 🎮 Commandes Essentielles - TP CI/CD

## Commandes npm Disponibles

### Tests
```bash
npm test                      # Exécute tous les tests (incluant alarm)
npm run test:allure          # Tests avec coverage complet
npm run test:trigger-alarm   # Lance uniquement les tests d'alarme
```

### Monitoring
```bash
npm run exporter             # Lance l'exporteur Prometheus (port 9464)
npm start                    # Lance le serveur Express (port 3000)
```

### Qualité de Code
```bash
npm run lint                 # Vérification ESLint
```

---

## URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| Exporteur Prometheus | http://localhost:9464/metrics | Métriques des tests |
| Health Check | http://localhost:9464/health | Statut de l'exporteur |
| Prometheus | http://localhost:9090 | Interface Prometheus |
| Grafana | http://localhost:3000 | Dashboards et alertes |
| Serveur Express | http://localhost:3000/hello | API de l'app |

---

## Workflows PowerShell

### 1. Démarrer l'Infrastructure Complète

```powershell
# Terminal 1 : Exporteur
npm run exporter

# Terminal 2 : Prometheus (si installé)
prometheus --config.file=prometheus.yml

# Terminal 3 : Grafana (si installé)
# Windows : Service démarre automatiquement
# macOS : brew services start grafana

# Terminal 4 : Tests en continu
while ($true) { npm test; Start-Sleep 30 }
```

### 2. Vérification Rapide

```powershell
# Santé de l'exporteur
Invoke-WebRequest http://localhost:9464/health

# Voir les métriques
(Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_"

# Compter les fichiers Allure
(Get-ChildItem allure-results -Filter *.json).Count

# Vérifier la coverage
Get-Content coverage/coverage-summary.json | ConvertFrom-Json | Select-Object -ExpandProperty total
```

### 3. Nettoyage

```powershell
# Supprimer les résultats de tests
Remove-Item allure-results/* -Force
Remove-Item coverage/* -Recurse -Force

# Réinstaller les dépendances
Remove-Item node_modules -Recurse -Force
npm install
```

### 4. Debug Prometheus

```powershell
# Vérifier la config
Get-Content prometheus.yml

# Vérifier les processus sur les ports
Get-NetTCPConnection -LocalPort 9464,9090,3000 | Format-Table

# Tuer un processus sur un port
$port = 9464
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}
```

---

## Requêtes PromQL Essentielles

### Dans Prometheus (http://localhost:9090)

```promql
# Métriques de base
tests_total
tests_passed
tests_failed
tests_skipped
tests_avg_duration_ms

# Taux de réussite
(tests_passed / tests_total) * 100

# Variation depuis 1 minute
tests_avg_duration_ms - tests_avg_duration_ms offset 1m

# Moyenne sur 5 minutes
avg_over_time(tests_avg_duration_ms[5m])
```

---

## Queries Grafana

### Pour les Panels du Dashboard

```promql
# Panel 1 : Total Tests (Stat)
tests_total

# Panel 2 : Tests Passed (Stat)
tests_passed

# Panel 3 : Tests Failed (Stat)
tests_failed

# Panel 4 : Tests Skipped (Stat)
tests_skipped

# Panel 5 : Average Duration (Time Series)
tests_avg_duration_ms

# Panel 6 : Success Rate (Gauge)
(tests_passed / tests_total) * 100
```

### Pour les Alertes

```promql
# Alerte 1 : Tests Skipped
tests_skipped > 0

# Alerte 2 : Tests Failed
tests_failed > 0

# Alerte 3 : Slow Execution
tests_avg_duration_ms > 150
```

---

## Scripts de Test Automatique

### Test Complet

```powershell
# Créer et exécuter validate.ps1
@"
Write-Host "=== VALIDATION INFRASTRUCTURE ===" -ForegroundColor Cyan

# Test exporteur
try {
    `$response = Invoke-WebRequest http://localhost:9464/health -ErrorAction Stop
    Write-Host "✅ Exporteur OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Exporteur KO" -ForegroundColor Red
}

# Test métriques
`$metrics = (Invoke-WebRequest http://localhost:9464/metrics).Content
if (`$metrics -match "tests_total") {
    Write-Host "✅ Métriques OK" -ForegroundColor Green
    `$metrics | Select-String "tests_" | ForEach-Object { Write-Host `$_ -ForegroundColor Gray }
} else {
    Write-Host "❌ Métriques KO" -ForegroundColor Red
}

# Test Prometheus
try {
    Invoke-WebRequest http://localhost:9090/-/ready -ErrorAction Stop | Out-Null
    Write-Host "✅ Prometheus OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Prometheus non accessible" -ForegroundColor Yellow
}

# Test Grafana
try {
    Invoke-WebRequest http://localhost:3000/api/health -ErrorAction Stop | Out-Null
    Write-Host "✅ Grafana OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Grafana non accessible" -ForegroundColor Yellow
}
"@ | Out-File validate.ps1

# Exécuter
.\validate.ps1
```

### Boucle de Tests Continue

```powershell
$count = 0
while ($true) {
    $count++
    Clear-Host
    Write-Host "=== RUN #$count à $(Get-Date -Format 'HH:mm:ss') ===" -ForegroundColor Cyan
    
    # Lancer tests
    npm test 2>&1 | Select-String "Test Suites|Tests:"
    
    # Afficher métriques
    Write-Host "`n=== MÉTRIQUES ===" -ForegroundColor Yellow
    (Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_" | ForEach-Object {
        Write-Host $_ -ForegroundColor Gray
    }
    
    Write-Host "`nProchain run dans 30s... (Ctrl+C pour arrêter)" -ForegroundColor DarkGray
    Start-Sleep -Seconds 30
}
```

---

## Scénarios de Démonstration

### Scénario 1 : Tests Normaux (Sans Alertes)

```powershell
# Exclure les tests d'alarme
npm test -- --testPathIgnorePatterns=alarm

# Vérifier métriques
(Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_failed|tests_skipped"
```

**Résultat attendu :**
- `tests_failed 0`
- `tests_skipped 0`
- Alertes Grafana : Normal (vert)

### Scénario 2 : Déclencher les Alertes

```powershell
# Lancer les tests d'alarme
npm run test:trigger-alarm

# Attendre 10 secondes
Start-Sleep -Seconds 10

# Vérifier métriques
(Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_"
```

**Résultat attendu :**
- `tests_failed 2`
- `tests_skipped 2`
- `tests_avg_duration_ms` élevé
- Alertes Grafana : Firing (rouge) 🔥

### Scénario 3 : Retour à la Normale

```powershell
# Re-lancer tests normaux
npm test -- --testPathIgnorePatterns=alarm

# Vérifier retour à la normale
Start-Sleep -Seconds 15

# Alertes devraient repasser à Normal
```

---

## Commandes Git (Optionnel)

### Si vous voulez commit les changements

```powershell
# Voir les modifications
git status

# Ajouter les nouveaux fichiers
git add src/prometheusExporter.js
git add prometheus.yml
git add tests/alarm/
git add *.md
git add grafana-dashboard.json

# Commit
git commit -m "feat: Add Prometheus exporter and Grafana monitoring

- Add Prometheus metrics exporter
- Add test alarm suite
- Add comprehensive documentation
- Add Grafana dashboard template
- Update package.json with new scripts"

# Push
git push origin tp-prometheus
```

---

## Raccourcis Utiles

### Alias PowerShell à Ajouter

Ajoutez ces alias dans votre profil PowerShell (`$PROFILE`) :

```powershell
# Alias pour le TP
function Start-TPExporter { npm run exporter }
function Start-TPTests { npm test }
function Start-TPAlarm { npm run test:trigger-alarm }
function Get-TPMetrics { (Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_" }
function Get-TPHealth { Invoke-WebRequest http://localhost:9464/health | Select-Object -ExpandProperty Content }

Set-Alias tpe Start-TPExporter
Set-Alias tpt Start-TPTests
Set-Alias tpa Start-TPAlarm
Set-Alias tpm Get-TPMetrics
Set-Alias tph Get-TPHealth
```

**Usage après rechargement du profil :**
```powershell
tpe    # Lance l'exporteur
tpt    # Lance les tests
tpa    # Lance les tests d'alarme
tpm    # Affiche les métriques
tph    # Health check
```

---

## Troubleshooting Rapide

### Port déjà utilisé

```powershell
# Trouver le processus sur un port
$port = 9464
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    $pid = $process.OwningProcess
    Write-Host "Port $port utilisé par PID $pid"
    Get-Process -Id $pid | Select-Object Name, Id
    
    # Tuer si nécessaire
    # Stop-Process -Id $pid -Force
}
```

### Réinitialisation Complète

```powershell
# Arrêter tous les processus Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Nettoyer
Remove-Item allure-results -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item coverage -Recurse -Force -ErrorAction SilentlyContinue

# Réinstaller
npm ci

# Relancer
npm run exporter
```

---

## Documentation Rapide

| Besoin | Fichier |
|--------|---------|
| Démarrer rapidement | **DEMARRAGE_RAPIDE.md** |
| Guide complet | **PROMETHEUS_GRAFANA_TP.md** |
| Dashboard Grafana | **GRAFANA_DASHBOARD.md** |
| Alertes | **GRAFANA_ALERTS.md** |
| Tests | **TESTS_VALIDATION.md** |
| Requêtes PromQL | **PROMETHEUS_QUERIES.md** |
| Résumé | **TP_RECAPITULATIF.md** |

---

**🎯 Ce fichier contient toutes les commandes essentielles pour le TP !**

Bookmark : **[COMMANDES.md](./COMMANDES.md)**
