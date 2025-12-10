# 🚀 DÉMARRAGE RAPIDE - TP Prometheus + Grafana

## ✅ Ce qui a été préparé

Tous les fichiers nécessaires ont été créés :
- ✅ `src/prometheusExporter.js` - Exporteur de métriques
- ✅ `prometheus.yml` - Configuration Prometheus
- ✅ `tests/alarm/alarm.test.js` - Tests pour déclencher les alertes
- ✅ Scripts npm ajoutés (`npm run exporter`, `npm run test:trigger-alarm`)
- ✅ Documentation complète

---

## 🎯 Guide Étape par Étape

### 📋 Étape 1 : Installer Prometheus et Grafana

**Prometheus :**
- Windows : https://prometheus.io/download/
- macOS : `brew install prometheus`
- Linux : `sudo apt-get install prometheus`

**Grafana OSS :**
- Windows : https://grafana.com/grafana/download (choisir OSS)
- macOS : `brew install grafana`
- Linux : `sudo apt-get install grafana`

---

### 🔧 Étape 2 : Lancer les Services

**Terminal 1 - Exporteur Prometheus :**
```powershell
npm run exporter
```
✅ Devrait afficher : `📊 Prometheus exporter running on http://localhost:9464/metrics`

**Terminal 2 - Prometheus :**
```powershell
prometheus --config.file=prometheus.yml
```
✅ Visitez http://localhost:9090 pour vérifier

**Terminal 3 - Grafana :**
```powershell
# Windows : le service démarre automatiquement après installation
# macOS/Linux :
brew services start grafana
# ou
sudo systemctl start grafana-server
```
✅ Visitez http://localhost:3000 (admin/admin)

---

### ▶️ Étape 3 : Exécuter les Tests

**Terminal 4 - Tests normaux :**
```powershell
npm test
```
✅ 51 tests devraient passer (+ les tests d'alarme qui échouent volontairement)

---

### 🔌 Étape 4 : Connecter Prometheus à Grafana

1. Ouvrir http://localhost:3000
2. Se connecter (admin/admin)
3. **☰** → **Connections** → **Data sources**
4. **Add data source** → **Prometheus**
5. URL : `http://localhost:9090`
6. **Save & Test** ✅

---

### 📊 Étape 5 : Créer le Dashboard

Suivre le guide détaillé : **[GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)**

**Résumé rapide :**
1. **☰** → **Dashboards** → **New** → **New Dashboard**
2. Créer 5 panels avec ces requêtes :
   - `tests_total` (Stat)
   - `tests_passed` (Stat)
   - `tests_failed` (Stat)
   - `tests_skipped` (Stat)
   - `tests_avg_duration_ms` (Time series graph)
3. Sauvegarder le dashboard

---

### 🚨 Étape 6 : Configurer les Alertes

Suivre le guide détaillé : **[GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)**

**Résumé rapide :**
1. **☰** → **Alerting** → **Contact points** → Créer un contact point
2. **Alert rules** → Créer 3 règles :
   - `tests_skipped > 0`
   - `tests_failed > 0`
   - `tests_avg_duration_ms > 150` (ajuster selon votre baseline)
3. Sauvegarder les alertes

---

### 🔥 Étape 7 : Tester les Alertes

```powershell
npm run test:trigger-alarm
```

**Résultat attendu :**
- ❌ 2 tests échouent
- ⏭️ 2 tests sautés
- 🐌 3 tests lents

**Vérifier dans Grafana :**
- **☰** → **Alerting** → **Alert rules**
- Les alertes devraient être en état **Firing** 🔥

---

## 📊 Vérifications Rapides

### 1. Vérifier l'exporteur
```powershell
Invoke-WebRequest http://localhost:9464/metrics
```
Devrait afficher les métriques au format Prometheus

### 2. Vérifier Prometheus
Aller sur http://localhost:9090 → **Status** → **Targets**
- `test-metrics` doit être **UP** (vert)

### 3. Vérifier Grafana
- Dashboard affiche les valeurs
- Alertes configurées
- Data source connectée

---

## 🎯 Objectifs du TP - Checklist

- [ ] Rapports Allure générés (`allure-results/`)
- [ ] Exporteur Prometheus fonctionne (port 9464)
- [ ] Prometheus collecte les métriques (port 9090)
- [ ] Grafana accessible (port 3000)
- [ ] Data source Prometheus connectée
- [ ] Dashboard créé avec 5 panels :
  - [ ] Total Tests
  - [ ] Tests Passed
  - [ ] Tests Failed
  - [ ] Tests Skipped
  - [ ] Average Duration (graph)
- [ ] 3 alertes configurées :
  - [ ] Tests Skipped > 0
  - [ ] Tests Failed > 0
  - [ ] Slow execution (+30%)
- [ ] Test des alertes réussi (`npm run test:trigger-alarm`)

---

## 🎓 Démo pour le Rendu

### Scénario de démonstration :

1. **Montrer l'infrastructure :**
   - Exporteur : http://localhost:9464/metrics
   - Prometheus : http://localhost:9090/targets
   - Grafana dashboard : http://localhost:3000

2. **Tests normaux :**
   ```powershell
   npm test
   ```
   - Montrer le dashboard : tous les tests passent ✅
   - Alertes en état "Normal" (vert)

3. **Déclencher les alertes :**
   ```powershell
   npm run test:trigger-alarm
   ```
   - Attendre 10-15 secondes
   - Refresh le dashboard
   - Montrer les métriques qui changent :
     - `tests_failed` : 2
     - `tests_skipped` : 2
     - `tests_avg_duration_ms` : augmenté
   - Montrer les alertes en état "Firing" 🔥

4. **Retour à la normale :**
   ```powershell
   npm test
   ```
   - Dashboard revient à la normale
   - Alertes repassent en "Normal"

---

## 🆘 Troubleshooting Rapide

### Problème : Exporteur ne démarre pas
```powershell
# Vérifier le port
netstat -ano | findstr :9464
# Tuer le processus si occupé
Stop-Process -Id <PID> -Force
```

### Problème : Prometheus ne voit pas l'exporteur
1. Vérifier que l'exporteur tourne
2. Vérifier `prometheus.yml` contient `localhost:9464`
3. Redémarrer Prometheus

### Problème : Dashboard vide
1. Vérifier la time range (15 dernières minutes)
2. Lancer `npm test` pour générer des données
3. Attendre 5-10 secondes pour le scraping
4. Refresh le dashboard

### Problème : Alertes ne se déclenchent pas
1. Vérifier les queries dans Prometheus directement
2. Vérifier les seuils (thresholds)
3. Attendre le délai d'évaluation (10s)
4. Vérifier les logs Grafana

---

## 📚 Documentation Complète

- **[PROMETHEUS_GRAFANA_TP.md](./PROMETHEUS_GRAFANA_TP.md)** - Guide complet du TP
- **[GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)** - Création du dashboard
- **[GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)** - Configuration des alertes

---

## 🎯 Résumé des Métriques Exposées

```prometheus
tests_total           # Nombre total de tests
tests_passed          # Tests réussis
tests_failed          # Tests échoués
tests_skipped         # Tests sautés
tests_avg_duration_ms # Temps moyen d'exécution (ms)
```

---

## 🔗 URLs Importantes

| Service | URL | Identifiants |
|---------|-----|--------------|
| Exporteur | http://localhost:9464/metrics | - |
| Health Check | http://localhost:9464/health | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3000 | admin/admin |

---

## ⏱️ Temps Estimé

- Installation Prometheus + Grafana : 10-15 min
- Lancement des services : 2 min
- Configuration Grafana : 10 min
- Création dashboard : 15 min
- Configuration alertes : 15 min
- Tests : 5 min

**Total : ~1 heure**

---

## 🎉 Félicitations !

Une fois tous les objectifs validés, vous aurez mis en place une stack complète de monitoring :
- 📊 Rapports Allure visuels
- 📈 Métriques collectées en temps réel
- 📊 Dashboard Grafana interactif
- 🚨 Système d'alertes automatique

**C'est exactement ce qui est utilisé en production dans les vraies équipes DevOps !**

---

## 🚀 Pour Aller Plus Loin (Optionnel)

### Améliorations possibles :

1. **Notifications :**
   - Configurer Slack/Discord/Email
   - Recevoir les alertes en temps réel

2. **Métriques avancées :**
   - Temps par type de test (unit/integration/e2e)
   - Historique des tendances
   - Comparaison entre branches

3. **CI/CD :**
   - Intégrer Prometheus dans GitHub Actions
   - Publier les métriques après chaque build
   - Générer des rapports de tendance

4. **Alertes avancées :**
   - Alertes sur dégradation progressive
   - Alertes sur anomalies (ML-based)
   - Corrélation avec déploiements

---

**✅ Tout est prêt ! Bon TP ! 🔥**
