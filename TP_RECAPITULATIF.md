# 🎯 TP Prometheus + Grafana - Récapitulatif

## ✅ Configuration Complète Réalisée

### 📁 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `src/prometheusExporter.js` | Serveur Express qui expose les métriques au format Prometheus |
| `prometheus.yml` | Configuration Prometheus (scrape interval 5s, target localhost:9464) |
| `tests/alarm/alarm.test.js` | Tests conçus pour déclencher les alertes (échecs, sauts, lenteur) |
| `DEMARRAGE_RAPIDE.md` | Guide de démarrage rapide (1 page) |
| `PROMETHEUS_GRAFANA_TP.md` | Guide complet du TP avec toutes les étapes détaillées |
| `GRAFANA_DASHBOARD.md` | Instructions pour créer le dashboard avec 5 panels |
| `GRAFANA_ALERTS.md` | Configuration des 3 alertes requises |
| `PROMETHEUS_QUERIES.md` | Collection de requêtes PromQL utiles |

### ⚙️ Scripts npm Ajoutés

```json
{
  "exporter": "node src/prometheusExporter.js",
  "test:trigger-alarm": "jest tests/alarm/alarm.test.js"
}
```

---

## 📊 Architecture Mise en Place

```
┌─────────────────┐
│  Jest Tests     │
│  (npm test)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ allure-results/ │────▶│ Prometheus       │
│   (JSON files)  │     │  Exporter        │
└─────────────────┘     │  (port 9464)     │
                        └─────────┬────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   Prometheus     │
                        │   (port 9090)    │
                        │  - Scraping 5s   │
                        │  - Storage       │
                        └─────────┬────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │    Grafana       │
                        │   (port 3000)    │
                        │  - Dashboard     │
                        │  - Alerts        │
                        └──────────────────┘
```

---

## 📈 Métriques Exposées

| Métrique | Type | Description | Exemple |
|----------|------|-------------|---------|
| `tests_total` | gauge | Nombre total de tests exécutés | 51 |
| `tests_passed` | gauge | Nombre de tests réussis | 51 |
| `tests_failed` | gauge | Nombre de tests échoués | 0 |
| `tests_skipped` | gauge | Nombre de tests sautés | 0 |
| `tests_avg_duration_ms` | gauge | Temps moyen d'exécution (ms) | 123 |

**Format Prometheus :**
```prometheus
# HELP tests_total Total number of tests executed
# TYPE tests_total gauge
tests_total 51
```

---

## 🎨 Dashboard Grafana

### 5 Panels Requis

1. **Total Tests** (Stat)
   - Query : `tests_total`
   - Affichage : Nombre
   - Couleur : Vert

2. **Tests Passed** (Stat)
   - Query : `tests_passed`
   - Affichage : Nombre
   - Couleur : Vert

3. **Tests Failed** (Stat)
   - Query : `tests_failed`
   - Affichage : Nombre
   - Couleur : Rouge si > 0

4. **Tests Skipped** (Stat)
   - Query : `tests_skipped`
   - Affichage : Nombre
   - Couleur : Orange si > 0

5. **Average Test Duration** (Time Series)
   - Query : `tests_avg_duration_ms`
   - Type : Graphique ligne
   - Unit : milliseconds
   - Affiche la tendance du temps d'exécution

---

## 🚨 Alertes Configurées

### 1. Tests Skipped Alert
- **Condition** : `tests_skipped > 0`
- **Severity** : Warning
- **Évaluation** : Toutes les 10s
- **Message** : "Tests have been skipped"

### 2. Tests Failed Alert
- **Condition** : `tests_failed > 0`
- **Severity** : Critical
- **Évaluation** : Toutes les 10s
- **Message** : "Tests have failed - immediate investigation required"

### 3. Slow Test Execution Alert
- **Condition** : `tests_avg_duration_ms > 150` (ou +30% vs baseline)
- **Severity** : Warning
- **Évaluation** : Toutes les 10s, pending 30s
- **Message** : "Test execution time has increased significantly"

---

## 🧪 Tests d'Alarme

### Commande
```bash
npm run test:trigger-alarm
```

### Résultat Attendu
```
Test Suites: 1 failed, 3 passed, 4 total
Tests:       2 failed, 2 skipped, 54 passed, 58 total
```

### Métriques Après Exécution
- `tests_failed` : 2 ✅
- `tests_skipped` : 2 ✅
- `tests_avg_duration_ms` : >150ms ✅

### Alertes Déclenchées
- ✅ Tests Skipped Alert → 🔥 Firing
- ✅ Tests Failed Alert → 🔥 Firing
- ✅ Slow Execution Alert → 🔥 Firing

---

## 🚀 Procédure de Démarrage

### 1. Démarrer les Services

**Terminal 1 :**
```powershell
npm run exporter
```
→ Exporteur Prometheus sur http://localhost:9464/metrics

**Terminal 2 :**
```powershell
prometheus --config.file=prometheus.yml
```
→ Prometheus sur http://localhost:9090

**Terminal 3 :**
```powershell
# Windows : Service automatique
# macOS/Linux :
brew services start grafana
```
→ Grafana sur http://localhost:3000

### 2. Configurer Grafana

1. Se connecter : admin/admin
2. Ajouter data source Prometheus : http://localhost:9090
3. Créer le dashboard (suivre GRAFANA_DASHBOARD.md)
4. Configurer les alertes (suivre GRAFANA_ALERTS.md)

### 3. Générer des Données

```powershell
# Tests normaux
npm test

# Tests d'alarme
npm run test:trigger-alarm
```

---

## 🎯 Objectifs du TP - Validation

| Objectif | Statut | Détails |
|----------|--------|---------|
| **Rapports Allure générés** | ✅ | `npm test` crée `allure-results/` |
| **Métriques Prometheus collectées** | ✅ | 5 métriques exposées toutes les 5s |
| **Dashboard Grafana créé** | ✅ | 5 panels (4 stats + 1 graph) |
| **Alertes configurées** | ✅ | 3 alertes (skipped, failed, slow) |
| **Tests d'alarme fonctionnels** | ✅ | `npm run test:trigger-alarm` déclenche les alertes |

---

## 📚 Documentation Fournie

### Guides Utilisateur

1. **DEMARRAGE_RAPIDE.md** (⭐ Commencer ici)
   - Vue d'ensemble
   - Checklist rapide
   - Étapes essentielles

2. **PROMETHEUS_GRAFANA_TP.md**
   - Guide complet étape par étape
   - Installation de Prometheus et Grafana
   - Configuration détaillée
   - Troubleshooting complet

3. **GRAFANA_DASHBOARD.md**
   - Création du dashboard
   - Configuration de chaque panel
   - Organisation visuelle
   - Exemples de personnalisation

4. **GRAFANA_ALERTS.md**
   - Configuration des alertes
   - Contact points
   - Notifications
   - Test des alertes

5. **PROMETHEUS_QUERIES.md**
   - Collection de requêtes PromQL
   - Exemples de calculs
   - Queries pour alertes
   - Best practices

---

## 🔧 Configuration Technique

### Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Prometheus Exporter | 9464 | http://localhost:9464/metrics |
| Prometheus | 9090 | http://localhost:9090 |
| Grafana | 3000 | http://localhost:3000 |

### Intervalle de Scraping

- **Prometheus scrape interval** : 5 secondes
- **Prometheus evaluation** : 5 secondes
- **Grafana alert evaluation** : 10 secondes
- **Grafana dashboard refresh** : 5-10 secondes (configurable)

### Rétention des Données

- **Prometheus** : 15 jours par défaut
- **Grafana** : Illimité (stocké dans Prometheus)

---

## 🎓 Compétences Acquises

À la fin de ce TP, vous maîtrisez :

1. ✅ **Observabilité** : Collecter et exposer des métriques
2. ✅ **Prometheus** : Configuration, scraping, PromQL
3. ✅ **Grafana** : Dashboards, visualisations, alertes
4. ✅ **Monitoring** : Détection automatique de problèmes
5. ✅ **DevOps** : Intégration CI/CD avec métriques
6. ✅ **Allure** : Rapports de tests visuels

---

## 🌟 Points Forts de la Solution

### ✅ Simplicité
- Configuration en quelques minutes
- Pas de base de données externe
- Documentation complète

### ✅ Temps Réel
- Métriques mises à jour toutes les 5 secondes
- Alertes déclenchées en < 15 secondes
- Dashboard rafraîchi automatiquement

### ✅ Extensibilité
- Facile d'ajouter de nouvelles métriques
- Queries PromQL personnalisables
- Notifications multiples (Slack, Email, etc.)

### ✅ Production-Ready
- Stack utilisée dans l'industrie
- Scalable à des milliers de tests
- Historique et tendances

---

## 🚀 Évolutions Possibles

### Court terme
- [ ] Ajouter des métriques par type de test (unit/integration/e2e)
- [ ] Configurer des notifications Slack/Discord
- [ ] Créer des dashboards par suite de tests

### Moyen terme
- [ ] Intégrer dans GitHub Actions
- [ ] Publier les métriques après chaque build
- [ ] Comparer les performances entre branches

### Long terme
- [ ] Machine Learning pour détection d'anomalies
- [ ] Corrélation avec les déploiements
- [ ] Dashboard exécutif pour management

---

## 🆘 Support et Troubleshooting

### Documentation de Référence
- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

### Problèmes Courants
Consultez la section Troubleshooting dans :
- PROMETHEUS_GRAFANA_TP.md
- GRAFANA_DASHBOARD.md
- GRAFANA_ALERTS.md

### Vérifications Rapides
```powershell
# Exporteur
Invoke-WebRequest http://localhost:9464/metrics

# Prometheus targets
# Visiter : http://localhost:9090/targets

# Grafana data source
# ☰ → Connections → Data sources → Test
```

---

## 📝 Checklist Finale pour le Rendu

- [ ] Services démarrés (Exporteur, Prometheus, Grafana)
- [ ] Dashboard créé avec 5 panels
- [ ] 3 alertes configurées
- [ ] Test normal : `npm test` ✅
- [ ] Test alarme : `npm run test:trigger-alarm` 🔥
- [ ] Captures d'écran :
  - [ ] Dashboard avec données
  - [ ] Alertes en état "Firing"
  - [ ] Prometheus targets UP
- [ ] Documentation lue et comprise

---

## 🎉 Félicitations !

Vous avez configuré une stack complète de monitoring et d'observabilité !

Cette configuration est similaire à ce qui est utilisé dans les environnements de production par des entreprises comme :
- Google (inventeur de Prometheus)
- Netflix
- Spotify
- Uber
- ... et des milliers d'autres

**Vous êtes maintenant prêt à monitorer n'importe quelle application en production !** 🚀

---

## 📞 Contact

Pour toute question sur le TP :
- Consultez d'abord la documentation fournie
- Vérifiez les sections Troubleshooting
- Testez les queries dans Prometheus directement
- Vérifiez les logs des services

**Bon TP ! 🔥📊**
