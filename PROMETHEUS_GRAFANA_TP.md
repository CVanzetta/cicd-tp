# 📊 TP Prometheus + Grafana - Guide Complet

## 🎯 Objectif du TP

Mettre en place une stack de monitoring complète pour visualiser les métriques de tests avec :
- **Allure** : Génération de rapports de tests
- **Prometheus** : Collecte des métriques
- **Grafana** : Visualisation et alertes

---

## 📋 Prérequis

### Installations nécessaires

1. **Node.js** ≥22.19.0 (déjà installé)
2. **Prometheus** : [Documentation d'installation](https://prometheus.io/download/)
3. **Grafana OSS** : [Documentation d'installation](https://grafana.com/grafana/download)

---

## 🚀 Étape 1 : Préparation du Projet

### 1.1 Vérifier la branche

```bash
git branch --show-current
# Devrait afficher : tp-prometheus
```

### 1.2 Installer les dépendances

```bash
npm install
```

### 1.3 Vérifier les fichiers créés

- ✅ `src/prometheusExporter.js` - Exporteur de métriques
- ✅ `prometheus.yml` - Configuration Prometheus
- ✅ `tests/alarm/alarm.test.js` - Tests pour déclencher les alertes
- ✅ Scripts npm ajoutés

---

## 🔧 Étape 2 : Lancer l'Exporteur Prometheus

### 2.1 Démarrer l'exporteur

Ouvrez un **premier terminal** et lancez :

```bash
npm run exporter
```

**Sortie attendue :**
```
📊 Prometheus exporter running on http://localhost:9464/metrics
💚 Health check available at http://localhost:9464/health
🔄 Metrics will update when tests are run
```

⚠️ **Laissez ce terminal ouvert pendant tout le TP**

### 2.2 Vérifier le fonctionnement

Dans un **second terminal** ou navigateur :

```bash
curl http://localhost:9464/metrics
```

Ou visitez : http://localhost:9464/metrics

**Sortie attendue :** Métriques au format Prometheus
```
# HELP tests_total Total number of tests executed
# TYPE tests_total gauge
tests_total 51

# HELP tests_passed Number of tests that passed
# TYPE tests_passed gauge
tests_passed 51
...
```

---

## ⚙️ Étape 3 : Configurer et Lancer Prometheus

### 3.1 Vérifier le fichier de configuration

Le fichier `prometheus.yml` est déjà créé à la racine du projet avec :
- Intervalle de scraping : 5 secondes
- Target : `localhost:9464` (notre exporteur)

### 3.2 Lancer Prometheus

Ouvrez un **troisième terminal** et lancez :

```bash
# Windows (PowerShell)
prometheus --config.file=prometheus.yml

# macOS/Linux
./prometheus --config.file=prometheus.yml
```

⚠️ **Important :** Assurez-vous d'être dans le répertoire où se trouve `prometheus.yml` ou donnez le chemin absolu.

**Sortie attendue :**
```
level=info msg="Server is ready to receive web requests."
```

⚠️ **Laissez ce terminal ouvert pendant tout le TP**

### 3.3 Vérifier Prometheus

Visitez : http://localhost:9090

Dans l'interface :
1. Cliquez sur **Status** → **Targets**
2. Vérifiez que `test-metrics` est **UP** (vert)

---

## 📊 Étape 4 : Exécuter les Tests

### 4.1 Lancer les tests normaux

Dans un **quatrième terminal** :

```bash
npm test
```

**Attendu :** 51 tests passent ✅

### 4.2 Vérifier les métriques mises à jour

Retournez sur : http://localhost:9464/metrics

Les valeurs devraient refléter l'exécution des tests.

---

## 📈 Étape 5 : Installer et Configurer Grafana

### 5.1 Installer Grafana

**Windows :**
- Télécharger depuis https://grafana.com/grafana/download
- Choisir la version **OSS** (Open Source)
- Suivre l'installateur

**macOS :**
```bash
brew install grafana
```

**Linux :**
```bash
sudo apt-get install -y grafana
```

### 5.2 Lancer Grafana

Ouvrez un **cinquième terminal** :

```bash
# Windows (si installé avec l'installateur)
# Le service démarre automatiquement

# macOS
brew services start grafana

# Linux
sudo systemctl start grafana-server
```

⚠️ **Laissez Grafana tourner pendant tout le TP**

### 5.3 Accéder à l'interface Grafana

Visitez : http://localhost:3000

**Identifiants par défaut :**
- Username : `admin`
- Password : `admin`

(Grafana vous demandera de changer le mot de passe au premier login)

---

## 🔌 Étape 6 : Connecter Prometheus à Grafana

### 6.1 Ajouter une Data Source

1. Cliquez sur **☰** (menu) → **Connections** → **Data sources**
2. Cliquez sur **Add data source**
3. Sélectionnez **Prometheus**
4. Configurez :
   - **Name** : `Prometheus`
   - **URL** : `http://localhost:9090`
   - Laissez les autres paramètres par défaut
5. Cliquez sur **Save & Test**

**Résultat attendu :** ✅ "Data source is working"

---

## 📊 Étape 7 : Créer le Dashboard

Voir le fichier détaillé : **[GRAFANA_DASHBOARD.md](./GRAFANA_DASHBOARD.md)**

### Dashboard à créer avec les panels suivants :

| Panel | Métrique | Type | Description |
|-------|----------|------|-------------|
| Total Tests | `tests_total` | Stat | Nombre total de tests |
| Tests Passed | `tests_passed` | Stat | Tests réussis |
| Tests Failed | `tests_failed` | Stat | Tests échoués |
| Tests Skipped | `tests_skipped` | Stat | Tests sautés |
| Avg Duration | `tests_avg_duration_ms` | Graph | Temps moyen d'exécution |

---

## 🚨 Étape 8 : Configurer les Alertes

Voir le fichier détaillé : **[GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)**

### Alertes à créer :

| Alerte | Condition | Seuil |
|--------|-----------|-------|
| Tests Skipped | `tests_skipped > 0` | Immédiat |
| Tests Failed | `tests_failed > 0` | Immédiat |
| Slow Tests | Augmentation de 30% | Comparaison avec run précédent |

---

## 🔥 Étape 9 : Tester les Alertes

### 9.1 Déclencher les alertes

Dans votre terminal de tests :

```bash
npm run test:trigger-alarm
```

**Résultat attendu :**
- ❌ 2 tests en échec
- ⏭️ 2 tests sautés
- 🐌 3 tests lents

### 9.2 Vérifier les métriques

Sur http://localhost:9464/metrics :
- `tests_failed` devrait être > 0
- `tests_skipped` devrait être > 0
- `tests_avg_duration_ms` devrait avoir augmenté

### 9.3 Vérifier les alertes dans Grafana

1. Aller dans **Alerting** → **Alert rules**
2. Les alertes devraient passer en état **Firing** (🔥)
3. Vérifier les notifications (si configurées)

---

## 📝 Résumé des Terminaux à Maintenir Ouverts

1. **Terminal 1** : `npm run exporter` (Exporteur Prometheus)
2. **Terminal 2** : Tests (`npm test` ou `npm run test:trigger-alarm`)
3. **Terminal 3** : `prometheus --config.file=prometheus.yml`
4. **Terminal 4** : Grafana (service)

---

## 🔍 Vérification de la Configuration

### Checklist

- [ ] Exporteur tourne sur http://localhost:9464/metrics
- [ ] Prometheus tourne sur http://localhost:9090
- [ ] Target `test-metrics` est UP dans Prometheus
- [ ] Grafana accessible sur http://localhost:3000
- [ ] Data source Prometheus connectée ✅
- [ ] Dashboard créé avec 5 panels
- [ ] 3 alertes configurées
- [ ] Alertes se déclenchent avec `npm run test:trigger-alarm`

---

## 🎯 Objectifs Complétés

- ✅ Rapports Allure générés
- ✅ Métriques Prometheus collectées
- ✅ Dashboard Grafana créé
- ✅ Alertes Grafana configurées
- ✅ Tests d'alarmes fonctionnels

---

## 🆘 Troubleshooting

### Problème : Exporteur ne démarre pas

**Solution :**
```bash
# Vérifier que le port 9464 n'est pas utilisé
netstat -ano | findstr :9464  # Windows
lsof -i :9464                 # macOS/Linux
```

### Problème : Prometheus ne voit pas l'exporteur

**Solutions :**
1. Vérifier que l'exporteur tourne
2. Vérifier `prometheus.yml` pointe vers `localhost:9464`
3. Redémarrer Prometheus après modification du config

### Problème : Grafana ne se connecte pas à Prometheus

**Solutions :**
1. Vérifier que Prometheus tourne sur port 9090
2. Tester l'URL : http://localhost:9090 dans un navigateur
3. Vérifier les logs Grafana

### Problème : Métriques à zéro

**Solution :**
```bash
# Relancer les tests pour générer des résultats
npm test
```

---

## 📚 Documentation Complémentaire

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Queries](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## 🎓 Pour Aller Plus Loin

### Améliorations possibles :

1. **Ajout de métriques personnalisées**
   - Temps d'exécution par type de test (unit/integration/e2e)
   - Nombre de tests par suite
   - Taux de réussite historique

2. **Notifications avancées**
   - Email
   - Slack
   - Discord
   - Microsoft Teams

3. **Rétention des données**
   - Configurer la rétention Prometheus
   - Exporter vers une base de données long-terme

4. **Dashboard avancé**
   - Variables pour filtrer par suite
   - Annotations pour marquer les déploiements
   - Comparaison période vs période

---

**🎉 Bon TP !**
