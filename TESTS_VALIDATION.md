# 🧪 Script de Test Complet - TP Prometheus + Grafana

## Test Automatique de l'Infrastructure

Ce guide permet de vérifier rapidement que toute l'infrastructure fonctionne.

---

## 🚀 Étape 1 : Préparer les Terminaux

Ouvrez **4 terminaux PowerShell** dans VS Code.

---

## 📋 Étape 2 : Commandes à Exécuter

### Terminal 1 : Exporteur Prometheus
```powershell
npm run exporter
```

**Résultat attendu :**
```
📊 Prometheus exporter running on http://localhost:9464/metrics
💚 Health check available at http://localhost:9464/health
🔄 Metrics will update when tests are run
```

✅ **Check :** Terminal reste ouvert sans erreur

---

### Terminal 2 : Tests de Validation

#### Test 1 : Vérifier l'exporteur
```powershell
Invoke-WebRequest http://localhost:9464/health | Select-Object -ExpandProperty Content
```

**Résultat attendu :**
```json
{"status":"ok","timestamp":"2025-12-10T..."}
```

#### Test 2 : Vérifier les métriques (avant tests)
```powershell
(Invoke-WebRequest http://localhost:9464/metrics).Content
```

**Résultat attendu :** Métriques à 0 ou valeurs précédentes

#### Test 3 : Lancer les tests normaux
```powershell
npm test
```

**Résultat attendu :**
```
Test Suites: 1 failed, 3 passed, 4 total
Tests:       2 failed, 2 skipped, 54 passed, 58 total
```

Note : Les tests d'alarme échouent volontairement.

#### Test 4 : Vérifier les métriques (après tests)
```powershell
$metrics = (Invoke-WebRequest http://localhost:9464/metrics).Content
Write-Host "=== MÉTRIQUES COLLECTÉES ===" -ForegroundColor Green
$metrics | Select-String "tests_"
```

**Résultat attendu :**
```
tests_total 58
tests_passed 54
tests_failed 2
tests_skipped 2
tests_avg_duration_ms 116
```

#### Test 5 : Vérifier allure-results
```powershell
Write-Host "`n=== FICHIERS ALLURE ===" -ForegroundColor Green
Write-Host "Nombre de fichiers : $((Get-ChildItem allure-results -Filter *.json).Count)"
Get-ChildItem allure-results -Filter *-result.json | Select-Object -First 3 Name
```

**Résultat attendu :** ~58 fichiers JSON

---

### Terminal 3 : Prometheus (si installé)

```powershell
# Vérifier que prometheus.yml existe
Test-Path .\prometheus.yml

# Lancer Prometheus
prometheus --config.file=prometheus.yml
```

**Résultat attendu :**
```
level=info msg="Server is ready to receive web requests."
```

#### Vérification Web
Ouvrir dans le navigateur : http://localhost:9090

1. Aller dans **Status** → **Targets**
2. Vérifier que `test-metrics (0/1 up)` ou `test-metrics (1/1 up)` si l'exporteur tourne

3. Aller dans **Graph**
4. Taper dans la query : `tests_total`
5. Cliquer **Execute**
6. Voir la valeur : 58

---

### Terminal 4 : Tests Continus (Optionnel)

Pour voir les métriques se mettre à jour en temps réel :

```powershell
while ($true) {
    Clear-Host
    Write-Host "=== TEST RUN à $(Get-Date -Format 'HH:mm:ss') ===" -ForegroundColor Cyan
    npm test 2>&1 | Select-String "Test Suites|Tests:"
    
    Write-Host "`n=== MÉTRIQUES ACTUELLES ===" -ForegroundColor Yellow
    (Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_"
    
    Write-Host "`nProchain run dans 30 secondes... (Ctrl+C pour arrêter)" -ForegroundColor Gray
    Start-Sleep -Seconds 30
}
```

---

## 🎯 Checklist de Validation

### Infrastructure

- [ ] Terminal 1 : Exporteur tourne sans erreur
- [ ] Health check répond : `{"status":"ok"}`
- [ ] Métriques accessibles sur http://localhost:9464/metrics
- [ ] Prometheus (si installé) : http://localhost:9090 accessible
- [ ] Prometheus : Target `test-metrics` est UP

### Tests

- [ ] `npm test` s'exécute correctement
- [ ] 54 tests passent
- [ ] 2 tests échouent (volontairement)
- [ ] 2 tests sautés (volontairement)
- [ ] `allure-results/` contient ~58 fichiers JSON

### Métriques

- [ ] `tests_total` = 58
- [ ] `tests_passed` = 54
- [ ] `tests_failed` = 2
- [ ] `tests_skipped` = 2
- [ ] `tests_avg_duration_ms` > 0

### Prometheus (si installé)

- [ ] Query `tests_total` retourne une valeur
- [ ] Query `tests_passed` retourne une valeur
- [ ] Query `(tests_passed / tests_total) * 100` retourne ~93%
- [ ] Graph s'affiche correctement

---

## 🔥 Test des Alertes

### Scénario 1 : Tests Normaux (Sans Alertes)

```powershell
# Lancer uniquement les tests qui passent
npm test -- --testPathIgnorePatterns=alarm
```

**Résultat attendu :**
- `tests_failed` = 0
- `tests_skipped` = 0
- Alertes Grafana : **Normal** (vert)

### Scénario 2 : Tests d'Alarme (Avec Alertes)

```powershell
# Lancer tous les tests incluant les alarmes
npm test
```

**Résultat attendu :**
- `tests_failed` = 2
- `tests_skipped` = 2
- Alertes Grafana : **Firing** (rouge) 🔥

### Scénario 3 : Uniquement Tests d'Alarme

```powershell
npm run test:trigger-alarm
```

**Résultat attendu :**
- 2 tests échouent
- 2 tests sautés
- 3 tests lents (durée élevée)
- Toutes les alertes se déclenchent

---

## 📊 Vérification Grafana (si installé)

### 1. Vérifier la Data Source

```powershell
# Ouvrir Grafana
Start-Process "http://localhost:3000"
```

1. Login : admin/admin
2. **☰** → **Connections** → **Data sources**
3. Cliquer sur **Prometheus**
4. En bas : **Save & Test** → ✅ "Data source is working"

### 2. Tester les Queries

Dans Grafana, **Explore** :

```promql
# Query 1 : Total
tests_total

# Query 2 : Taux de réussite
(tests_passed / tests_total) * 100

# Query 3 : Temps moyen
tests_avg_duration_ms
```

Toutes devraient retourner des valeurs.

### 3. Vérifier le Dashboard

Si créé :
1. **☰** → **Dashboards**
2. Ouvrir "Test Metrics Dashboard"
3. Vérifier que les 5 panels affichent des données

---

## 🆘 Troubleshooting Rapide

### Problème : "Impossible de se connecter" (exporteur)

**Solution :**
```powershell
# Vérifier le processus
Get-NetTCPConnection -LocalPort 9464 -ErrorAction SilentlyContinue

# Si aucun résultat, relancer :
npm run exporter
```

### Problème : Métriques à 0

**Solution :**
```powershell
# Relancer les tests
npm test

# Attendre 5 secondes
Start-Sleep -Seconds 5

# Re-vérifier
(Invoke-WebRequest http://localhost:9464/metrics).Content | Select-String "tests_"
```

### Problème : Prometheus ne voit pas l'exporteur

**Solution :**
```powershell
# Vérifier prometheus.yml
Get-Content .\prometheus.yml

# Vérifier la ligne :
#   - targets: ['localhost:9464']

# Redémarrer Prometheus (Ctrl+C puis relancer)
```

### Problème : Tests en échec (autres que alarm)

**Solution :**
```powershell
# Lancer uniquement les tests unitaires
npm test -- tests/unit/greeting.test.js

# Si ça passe, le problème vient des tests alarm (normal)
```

---

## 📝 Script de Validation Complet

Copiez ce script dans un fichier `validate.ps1` :

```powershell
# validate.ps1 - Script de validation du TP

Write-Host "=== VALIDATION TP PROMETHEUS + GRAFANA ===" -ForegroundColor Cyan

# Test 1 : Exporteur
Write-Host "`n[1/5] Test de l'exporteur..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest http://localhost:9464/health -ErrorAction Stop
    Write-Host "✅ Exporteur accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Exporteur non accessible" -ForegroundColor Red
    Write-Host "Lancez : npm run exporter" -ForegroundColor Gray
    exit 1
}

# Test 2 : Métriques
Write-Host "`n[2/5] Test des métriques..." -ForegroundColor Yellow
$metrics = (Invoke-WebRequest http://localhost:9464/metrics).Content
if ($metrics -match "tests_total") {
    Write-Host "✅ Métriques disponibles" -ForegroundColor Green
} else {
    Write-Host "❌ Métriques manquantes" -ForegroundColor Red
    exit 1
}

# Test 3 : Fichiers Allure
Write-Host "`n[3/5] Test des résultats Allure..." -ForegroundColor Yellow
$allureFiles = (Get-ChildItem allure-results -Filter *.json -ErrorAction SilentlyContinue).Count
if ($allureFiles -gt 0) {
    Write-Host "✅ $allureFiles fichiers Allure trouvés" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aucun fichier Allure (lancez npm test)" -ForegroundColor Yellow
}

# Test 4 : Prometheus (optionnel)
Write-Host "`n[4/5] Test de Prometheus..." -ForegroundColor Yellow
try {
    $prom = Invoke-WebRequest http://localhost:9090/-/ready -ErrorAction Stop
    Write-Host "✅ Prometheus accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Prometheus non installé ou non lancé (optionnel)" -ForegroundColor Yellow
}

# Test 5 : Grafana (optionnel)
Write-Host "`n[5/5] Test de Grafana..." -ForegroundColor Yellow
try {
    $grafana = Invoke-WebRequest http://localhost:3000/api/health -ErrorAction Stop
    Write-Host "✅ Grafana accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Grafana non installé ou non lancé (optionnel)" -ForegroundColor Yellow
}

# Résumé
Write-Host "`n=== RÉSUMÉ ===" -ForegroundColor Cyan
Write-Host "Exporteur : ✅" -ForegroundColor Green
Write-Host "Métriques : ✅" -ForegroundColor Green
Write-Host "Allure : $(if ($allureFiles -gt 0) { '✅' } else { '⚠️' })" -ForegroundColor $(if ($allureFiles -gt 0) { 'Green' } else { 'Yellow' })

Write-Host "`n✅ Configuration de base validée !" -ForegroundColor Green
Write-Host "Consultez DEMARRAGE_RAPIDE.md pour les prochaines étapes" -ForegroundColor Gray
```

**Exécution :**
```powershell
.\validate.ps1
```

---

## 🎯 Checklist Finale

Pour considérer le TP comme réussi :

### Obligatoire
- [ ] Exporteur tourne et répond sur port 9464
- [ ] Tests s'exécutent correctement
- [ ] Métriques sont exposées au format Prometheus
- [ ] `allure-results/` contient les fichiers JSON

### Recommandé
- [ ] Prometheus installé et configuré
- [ ] Prometheus scrape les métriques (target UP)
- [ ] Requêtes PromQL fonctionnent

### Bonus
- [ ] Grafana installé et accessible
- [ ] Data source Prometheus connectée
- [ ] Dashboard créé avec les 5 panels
- [ ] Alertes configurées
- [ ] Tests d'alarme déclenchent les alertes

---

**✅ Si tous les tests passent, votre infrastructure est prête ! 🚀**

Consultez **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** pour configurer Grafana.
