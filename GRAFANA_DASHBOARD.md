# 📊 Guide : Créer le Dashboard Grafana

## Vue d'ensemble

Nous allons créer un dashboard avec 5 panels pour visualiser les métriques de tests.

---

## 🎨 Étape 1 : Créer un Nouveau Dashboard

1. Dans Grafana, cliquez sur **☰** (menu hamburger) → **Dashboards**
2. Cliquez sur **New** → **New Dashboard**
3. Cliquez sur **+ Add visualization**
4. Sélectionnez la data source **Prometheus**

---

## 📈 Panel 1 : Nombre Total de Tests

### Configuration

1. **Type de visualisation** : Stat
2. **Query** (onglet Query) :
   ```promql
   tests_total
   ```
3. **Panel options** (onglet Panel options) :
   - **Title** : `Total Tests`
   - **Description** : `Nombre total de tests exécutés`

4. **Value options** (dans les options à droite) :
   - **Show** : `Value`
   - **Calculation** : `Last`
   - **Unit** : `none`

5. **Thresholds** (seuils de couleur) :
   - Base : Vert
   - Optionnel : Rouge si < 50

6. Cliquez sur **Apply** (en haut à droite)

---

## ✅ Panel 2 : Tests Passés

### Configuration

1. Dans le dashboard, cliquez sur **Add** → **Visualization**
2. **Type** : Stat
3. **Query** :
   ```promql
   tests_passed
   ```
4. **Panel options** :
   - **Title** : `Tests Passed`
   - **Description** : `Nombre de tests réussis`

5. **Value options** :
   - **Show** : `Value`
   - **Calculation** : `Last`

6. **Thresholds** :
   - Base : Vert (0)
   - Rouge : < 45 (si vous voulez alerter sur trop d'échecs)

7. **Text color** : Green
8. Cliquez sur **Apply**

---

## ❌ Panel 3 : Tests Échoués

### Configuration

1. **Add** → **Visualization**
2. **Type** : Stat
3. **Query** :
   ```promql
   tests_failed
   ```
4. **Panel options** :
   - **Title** : `Tests Failed`
   - **Description** : `Nombre de tests en échec`

5. **Value options** :
   - **Show** : `Value`
   - **Calculation** : `Last`

6. **Thresholds** :
   - Base : Vert (0)
   - Orange : > 0
   - Rouge : > 5

7. **Color scheme** : By value
8. Cliquez sur **Apply**

---

## ⏭️ Panel 4 : Tests Sautés

### Configuration

1. **Add** → **Visualization**
2. **Type** : Stat
3. **Query** :
   ```promql
   tests_skipped
   ```
4. **Panel options** :
   - **Title** : `Tests Skipped`
   - **Description** : `Nombre de tests sautés`

5. **Value options** :
   - **Show** : `Value`
   - **Calculation** : `Last`

6. **Thresholds** :
   - Base : Vert (0)
   - Orange : > 0

7. Cliquez sur **Apply**

---

## ⏱️ Panel 5 : Temps Moyen d'Exécution

### Configuration

1. **Add** → **Visualization**
2. **Type** : **Time series** (graphique)
3. **Query** :
   ```promql
   tests_avg_duration_ms
   ```
4. **Panel options** :
   - **Title** : `Average Test Duration`
   - **Description** : `Temps moyen d'exécution des tests en millisecondes`

5. **Axis** (dans les options) :
   - **Unit** : `milliseconds (ms)`
   - **Min** : `0`

6. **Graph styles** :
   - **Style** : `Lines`
   - **Line width** : `2`
   - **Fill opacity** : `10`

7. **Legend** :
   - **Mode** : `Table`
   - **Placement** : `Bottom`
   - **Values** : Cocher `Last`, `Min`, `Max`, `Mean`

8. **Thresholds** (optionnel) :
   - Ajouter une ligne de référence à 100ms (valeur normale)
   - Ligne orange à 150ms (warning)
   - Ligne rouge à 200ms (critique)

9. Cliquez sur **Apply**

---

## 🎨 Organisation du Dashboard

### Layout recommandé

Organisez les panels en deux rangées :

**Rangée 1** (Stats - largeur égale) :
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Tests │ Tests Passed│ Tests Failed│Tests Skipped│
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Rangée 2** (Graphique - pleine largeur) :
```
┌───────────────────────────────────────────────────────┐
│          Average Test Duration (graph)                │
└───────────────────────────────────────────────────────┘
```

### Pour organiser :

1. Cliquez sur l'icône **⋮⋮** (drag handle) en haut à gauche de chaque panel
2. Déplacez les panels par drag & drop
3. Redimensionnez en tirant les coins

---

## 💾 Sauvegarder le Dashboard

1. Cliquez sur l'icône **💾** (Save dashboard) en haut à droite
2. **Title** : `Test Metrics Dashboard`
3. **Folder** : `General` ou créez un nouveau dossier "CI/CD"
4. **Description** : `Dashboard de monitoring des tests avec métriques Prometheus`
5. Cliquez sur **Save**

---

## ⚙️ Paramètres Avancés du Dashboard

### Refresh automatique

1. En haut à droite, cliquez sur l'icône **⟳** (refresh)
2. Sélectionnez un intervalle : **5s** ou **10s**
3. Le dashboard se rafraîchira automatiquement

### Time range

1. En haut à droite, cliquez sur le sélecteur de temps
2. Recommandé : **Last 15 minutes** ou **Last 1 hour**
3. Vous pouvez aussi activer **Auto-refresh**

### Variables (optionnel - avancé)

Pour filtrer par suite de tests à l'avenir :

1. Dashboard settings (⚙️) → **Variables**
2. Ajoutez une variable pour filtrer dynamiquement

---

## 🎯 Vérification du Dashboard

### Test avec des données réelles

1. Assurez-vous que l'exporteur tourne : `npm run exporter`
2. Lancez les tests : `npm test`
3. Retournez sur le dashboard Grafana
4. Vérifiez que les valeurs s'affichent :
   - Total Tests : **51**
   - Tests Passed : **51**
   - Tests Failed : **0**
   - Tests Skipped : **0**
   - Graph avec durée moyenne visible

### Test avec les tests d'alarme

1. Lancez : `npm run test:trigger-alarm`
2. Attendez 5-10 secondes (le temps que Prometheus scrape)
3. Observez les changements :
   - Tests Failed devrait augmenter
   - Tests Skipped devrait augmenter
   - Graph de durée devrait montrer un pic

---

## 📊 Panels Additionnels Optionnels

### Panel 6 : Taux de Réussite (Success Rate)

**Type** : Gauge
**Query** :
```promql
(tests_passed / tests_total) * 100
```
**Unit** : Percent (0-100)
**Thresholds** :
- Vert : > 90%
- Orange : 70-90%
- Rouge : < 70%

### Panel 7 : Tests par État (Pie Chart)

**Type** : Pie chart
**Queries** :
- Query A : `tests_passed` (Label: Passed)
- Query B : `tests_failed` (Label: Failed)
- Query C : `tests_skipped` (Label: Skipped)

### Panel 8 : Historique des Exécutions

**Type** : Time series
**Queries** :
- `tests_passed` (Vert)
- `tests_failed` (Rouge)
- `tests_skipped` (Orange)

**Legend** : Afficher tous les tests sur un même graphique

---

## 🎨 Personnalisation Esthétique

### Thème

1. **☰** → **Preferences**
2. **UI Theme** : Dark ou Light

### Couleurs des Panels

Pour chaque panel Stat :
1. Panel options → **Color scheme**
2. Options :
   - **Single color** : Une seule couleur
   - **From thresholds** : Couleur selon seuils (recommandé)
   - **Classic palette** : Dégradé

### Icônes

Ajoutez des emojis dans les titres :
- `📊 Total Tests`
- `✅ Tests Passed`
- `❌ Tests Failed`
- `⏭️ Tests Skipped`
- `⏱️ Average Duration`

---

## 🔄 Mise à Jour des Données

### Forcer un refresh

1. Cliquez sur **⟳** en haut à droite
2. Ou utilisez le raccourci : **Shift + R**

### Voir les requêtes en temps réel

1. Ouvrez un panel en mode édition
2. Onglet **Query inspector**
3. Vous verrez :
   - La requête PromQL envoyée
   - Les données brutes retournées
   - Le temps de réponse

---

## 📤 Exporter le Dashboard

### Export JSON

1. Dashboard settings (⚙️) → **JSON Model**
2. Copiez le JSON
3. Sauvegardez dans un fichier `grafana-dashboard.json`

### Import sur une autre instance

1. **☰** → **Dashboards** → **Import**
2. Collez le JSON ou uploadez le fichier
3. Sélectionnez la data source Prometheus
4. **Import**

---

## 🎯 Checklist Dashboard Complet

- [ ] Dashboard créé et sauvegardé
- [ ] Panel "Total Tests" affiche 51
- [ ] Panel "Tests Passed" affiche 51
- [ ] Panel "Tests Failed" affiche 0
- [ ] Panel "Tests Skipped" affiche 0
- [ ] Graph "Average Duration" montre des données
- [ ] Refresh automatique configuré (5-10s)
- [ ] Time range configuré (Last 15 min)
- [ ] Organisation des panels propre
- [ ] Couleurs et seuils configurés

---

## 🆘 Troubleshooting

### Problème : "No data"

**Solutions :**
1. Vérifier que Prometheus est connecté (Data sources)
2. Tester la query dans Prometheus : http://localhost:9090/graph
3. Vérifier que l'exporteur tourne : http://localhost:9464/metrics
4. Ajuster le time range (peut-être trop court)

### Problème : Valeurs incorrectes

**Solutions :**
1. Vérifier la query PromQL (pas de typo)
2. Vérifier le type de calcul : `Last` vs `Mean`
3. Relancer les tests : `npm test`
4. Attendre 5-10 secondes pour le scrape

### Problème : Graph vide

**Solutions :**
1. Augmenter le time range (Last 1 hour au lieu de 5 min)
2. Lancer plusieurs fois les tests pour avoir de l'historique
3. Vérifier l'unité (milliseconds) dans les options

---

**✅ Dashboard prêt ! Passez à la configuration des alertes : [GRAFANA_ALERTS.md](./GRAFANA_ALERTS.md)**
