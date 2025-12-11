# TP CI/CD - Monitoring avec Prometheus & Grafana

Application Node.js avec monitoring complet des tests via Prometheus et Grafana.

---

## Objectifs du TP

1.  Générer des rapports Allure pour les tests
2.  Collecter les métriques de tests avec Prometheus
3.  Visualiser les métriques dans Grafana (dashboard + alertes)
4.  Tester le système d'alertes

---

## Prérequis

- **Node.js** ≥22.19.0
- **Prometheus** : [Télécharger](https://prometheus.io/download/)
- **Grafana OSS** : [Télécharger](https://grafana.com/grafana/download)

---

##  Installation

### 1. Cloner et installer les dépendances

```bash
git clone <repo-url>
cd cicd-tp
npm install
```

### 2. Installer Prometheus et Grafana

**Windows :**
- Prometheus : Télécharger, extraire, lancer avec `prometheus --config.file=prometheus.yml`
- Grafana : Installer le .msi, le service démarre automatiquement

**macOS :**
```bash
brew install prometheus grafana
brew services start grafana
```

**Linux :**
```bash
sudo apt-get install prometheus grafana
sudo systemctl start grafana-server
```

---

## Démarrage Rapide

### Terminal 1 : Exporteur Prometheus
```bash
npm run exporter
```
 Démarre sur http://localhost:9464/metrics

### Terminal 2 : Prometheus
```bash
prometheus --config.file=prometheus.yml
```
 Interface sur http://localhost:9090

### Terminal 3 : Tests
```bash
npm test
```
 Génère les métriques

### Grafana
 Déjà démarré sur http://localhost:3000 (login: admin/admin)

---

## Configuration Grafana

### 1. Connecter Prometheus

1. Grafana → **☰** → **Connections** → **Data sources**
2. **Add data source** → **Prometheus**
3. URL : `http://localhost:9090`
4. **Save & Test** ✅

### 2. Créer le Dashboard

1. **☰** → **Dashboards** → **New Dashboard**
2. Créer 5 panels :

| Panel | Query | Type |
|-------|-------|------|
| **Total Tests** | `tests_total` | Stat |
| **Tests Passed** | `tests_passed` | Stat |
| **Tests Failed** | `tests_failed` | Stat |
| **Tests Skipped** | `tests_skipped` | Stat |
| **Average Duration** | `tests_avg_duration_ms` | Time series |

3. **Save dashboard** : `Test Metrics Dashboard`

### 3. Configurer les Alertes

1. **☰** → **Alerting** → **Contact points** → Créer un contact point
2. **Alert rules** → Créer 3 alertes :

| Nom | Query | Condition |
|-----|-------|-----------|
| **Tests Skipped Alert** | `tests_skipped` | > 0 |
| **Tests Failed Alert** | `tests_failed` | > 0 |
| **Slow Tests Alert** | `tests_avg_duration_ms` | > 150 |

### 4. Tester les Alertes

```bash
npm run test:trigger-alarm
```

Les alertes passent en état **Firing** 🔥 dans Grafana

---

## Métriques Disponibles

| Métrique | Description |
|----------|-------------|
| `tests_total` | Nombre total de tests exécutés |
| `tests_passed` | Tests réussis |
| `tests_failed` | Tests échoués |
| `tests_skipped` | Tests sautés |
| `tests_avg_duration_ms` | Temps moyen d'exécution (ms) |

---

## URLs Importantes

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Exporteur Prometheus** | http://localhost:9464/metrics | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin/admin |
| **Serveur Express** | http://localhost:3000/hello | - |

---

## Scripts npm Disponibles

```bash
npm test                    # Exécuter tous les tests
npm run exporter           # Lancer l'exporteur Prometheus
npm run test:trigger-alarm # Lancer les tests d'alarme
npm run lint               # Vérifier le code avec ESLint
npm start                  # Démarrer le serveur Express
```

---

## Checklist de Validation

- [ ] Exporteur actif (port 9464)
- [ ] Prometheus actif (port 9090)
- [ ] Prometheus voit l'exporteur (target UP sur http://localhost:9090/targets)
- [ ] Grafana actif (port 3000)
- [ ] Data source Prometheus connectée dans Grafana
- [ ] Dashboard créé avec 5 panels
- [ ] Les 5 panels affichent des données
- [ ] 3 alertes configurées
- [ ] `npm run test:trigger-alarm` déclenche les alertes

---

## Dépannage

### L'exporteur ne démarre pas
```bash
# Vérifier si le port est occupé
netstat -ano | findstr :9464
# Tuer le processus si nécessaire
Stop-Process -Id <PID> -Force
```

### Prometheus ne voit pas l'exporteur
- Vérifier http://localhost:9090/targets
- La target `test-metrics` doit être **UP** (vert)
- Vérifier que l'exporteur tourne
- Redémarrer Prometheus

### Pas de données dans Grafana
1. Lancer `npm test` pour générer des données
2. Vérifier que l'exporteur et Prometheus tournent
3. Attendre 5-10 secondes pour le scraping
4. Vérifier la time range dans Grafana (Last 15 minutes)

### Les alertes ne se déclenchent pas
1. Vérifier les queries dans Prometheus (http://localhost:9090)
2. Vérifier les seuils (thresholds)
3. Attendre le délai d'évaluation (10s)
4. Lancer `npm run test:trigger-alarm`

---

## Structure du Projet

```
cicd-tp/
├── src/
│   ├── prometheusExporter.js    # Exporteur de métriques Prometheus
│   ├── server.js                 # Serveur Express
│   └── greeting.js               # Logique métier
├── tests/
│   ├── alarm/                    # Tests pour déclencher les alertes
│   ├── unit/                     # Tests unitaires
│   ├── integration/              # Tests d'intégration
│   └── e2e/                      # Tests end-to-end
├── prometheus.yml                # Configuration Prometheus
├── grafana-dashboard.json        # Template dashboard Grafana (optionnel)
├── package.json                  # Scripts et dépendances
└── README.md                     # Ce fichier
```

---

## Ressources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

## Fonctionnalités de l'Application

### API REST

**GET /hello/:name?**
- Sans paramètre : `Hello world!`
- Avec nom : `Hello world! From {name}`

**POST /hello**
- Header `x-name` : `Hello world! From {name}`

### Tests

- **Unit tests** : 17 tests pour `greeting.js`
- **Integration tests** : 19 tests pour l'API
- **E2E tests** : 15 tests complets
- **Alarm tests** : 7 tests pour tester les alertes

**Total : 58 tests**

---

## Résumé

Ce projet implémente une stack de monitoring complète :
- Système de collecte de métriques avec Prometheus
- Dashboards Grafana pour la visualisation des tests
- Alertes automatiques en cas de problème
- Infrastructure production-ready pour le monitoring de tests

**Cette stack est utilisée en production par Google, Netflix, Uber, Spotify et des milliers d'autres entreprises.**
