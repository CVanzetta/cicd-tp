# 🚨 Guide : Configurer les Alertes Grafana

## Vue d'ensemble

Nous allons configurer 3 alertes pour détecter automatiquement les problèmes :
1. Tests sautés > 0
2. Tests échoués > 0
3. Augmentation du temps d'exécution de +30%

---

## ⚙️ Prérequis : Configurer un Contact Point

Avant de créer des alertes, configurons où les notifications seront envoyées.

### Étape 1 : Créer un Contact Point

1. **☰** → **Alerting** → **Contact points**
2. Cliquez sur **+ Add contact point**
3. **Name** : `Email Notifications` (ou tout autre nom)
4. **Integration** : Choisissez une option :

#### Option A : Email (recommandé pour le TP)

Pour le TP, on peut simuler sans vraie config email :
- **Name** : `TP Contact Point`
- **Integration** : `Alertmanager` (par défaut, logs seulement)
- Laissez les autres champs par défaut
- Cliquez sur **Test** → **Save contact point**

#### Option B : Webhook (pour logs)

- **Integration** : `Webhook`
- **URL** : `http://localhost:9464/health` (notre exporteur)
- Cliquez sur **Test** → **Save contact point**

#### Option C : Configuration réelle (optionnel)

**Slack :**
- Créez un webhook Slack
- Collez l'URL du webhook

**Discord :**
- Créez un webhook Discord
- Collez l'URL du webhook

**Email (si SMTP configuré) :**
- Configurez le serveur SMTP dans `grafana.ini`

---

## 🚨 Alerte 1 : Tests Sautés > 0

### Configuration

1. **☰** → **Alerting** → **Alert rules**
2. Cliquez sur **+ Create alert rule**

### Section A : Set an alert rule name

- **Rule name** : `Tests Skipped Alert`

### Section B : Set a query and alert condition

1. **Select data source** : `Prometheus`
2. **Query A** (onglet Query) :
   ```promql
   tests_skipped
   ```
3. En dessous, dans **Expressions** :
   - Cliquez sur **+ Add expression**
   - **Type** : `Threshold`
   - **Expression** : `A`
   - **Condition** : `IS ABOVE`
   - **Value** : `0`

### Section C : Set alert evaluation behavior

1. **Folder** : Sélectionnez ou créez `CI/CD Alerts`
2. **Evaluation group** : Créez un nouveau groupe : `Test Metrics`
3. **Evaluation interval** : `10s` (évalue toutes les 10 secondes)
4. **Pending period** : `0s` (alerte immédiate)

### Section D : Add annotations

- **Summary** : `Tests have been skipped`
- **Description** :
  ```
  {{ $values.A }} test(s) were skipped in the last test run.
  This may indicate incomplete test coverage.
  ```
- **Runbook URL** : (optionnel) Lien vers doc de troubleshooting

### Section E : Notifications

1. **Contact point** : Sélectionnez celui créé précédemment
2. **Custom labels** (optionnel) :
   - `severity` = `warning`
   - `team` = `qa`

### Sauvegarder

Cliquez sur **Save rule and exit**

---

## ❌ Alerte 2 : Tests Échoués > 0

### Configuration

1. **☰** → **Alerting** → **Alert rules**
2. **+ Create alert rule**

### Sections

**A. Rule name** :
```
Tests Failed Alert
```

**B. Query and condition** :
1. Query A :
   ```promql
   tests_failed
   ```
2. Expression (Threshold) :
   - Expression : `A`
   - Condition : `IS ABOVE`
   - Value : `0`

**C. Evaluation** :
- Folder : `CI/CD Alerts`
- Group : `Test Metrics`
- Interval : `10s`
- Pending : `0s`

**D. Annotations** :
- **Summary** : `Tests have failed`
- **Description** :
  ```
  🚨 CRITICAL: {{ $values.A }} test(s) failed in the last run.
  Immediate investigation required.
  ```

**E. Notifications** :
- Contact point : Celui créé précédemment
- Labels :
  - `severity` = `critical`
  - `team` = `qa`

**Sauvegarder**

---

## 🐌 Alerte 3 : Augmentation du Temps d'Exécution (+30%)

### Configuration Avancée

Cette alerte est plus complexe car elle compare avec une valeur précédente.

1. **☰** → **Alerting** → **Alert rules**
2. **+ Create alert rule**

### Sections

**A. Rule name** :
```
Slow Test Execution Alert
```

**B. Query and condition** :

1. **Query A** (durée actuelle) :
   ```promql
   tests_avg_duration_ms
   ```

2. **Query B** (durée 1 minute avant) :
   ```promql
   tests_avg_duration_ms offset 1m
   ```

3. **Expression C** (Math : calcul du delta en %) :
   - Type : `Math`
   - Expression : `(A - B) / B * 100`
   - Ceci calcule le pourcentage d'augmentation

4. **Expression D** (Threshold : seuil d'alerte) :
   - Type : `Threshold`
   - Expression : `C`
   - Condition : `IS ABOVE`
   - Value : `30` (30%)

### Alternative Simplifiée (recommandé pour le TP)

Si la méthode ci-dessus est trop complexe, utilisez une alerte simple :

**Query A** :
```promql
tests_avg_duration_ms
```

**Threshold** :
- Condition : `IS ABOVE`
- Value : `150` (150ms, si votre durée normale est ~100ms)

Ajustez la valeur selon votre baseline.

**C. Evaluation** :
- Folder : `CI/CD Alerts`
- Group : `Test Metrics`
- Interval : `10s`
- Pending : `30s` (attend 30s avant de déclencher)

**D. Annotations** :
- **Summary** : `Test execution time has increased significantly`
- **Description** :
  ```
  ⚠️ WARNING: Average test duration has increased by more than 30%.
  Current: {{ $values.A }}ms
  This may indicate performance degradation or resource issues.
  ```

**E. Notifications** :
- Contact point : Celui créé
- Labels :
  - `severity` = `warning`
  - `team` = `performance`

**Sauvegarder**

---

## 📊 Visualiser les Alertes dans le Dashboard

### Ajouter des seuils visuels

Retournez dans votre dashboard et éditez les panels :

**Panel "Tests Failed"** :
1. Edit panel
2. Onglet **Overrides**
3. Ajoutez une règle : Si `tests_failed > 0`, couleur rouge

**Panel "Average Duration"** :
1. Edit panel
2. Onglet **Thresholds** (dans les options du panel)
3. Ajoutez :
   - Base : Vert
   - 130 : Orange (warning)
   - 150 : Rouge (critical)

Cliquez sur **Apply**

---

## 🧪 Tester les Alertes

### Scénario de Test Complet

1. **Vérifier l'état initial** :
   ```bash
   npm test
   ```
   Toutes les alertes doivent être **Normal** (vert)

2. **Déclencher les alertes** :
   ```bash
   npm run test:trigger-alarm
   ```

3. **Attendre 10-15 secondes** (pour que Prometheus scrape)

4. **Vérifier dans Grafana** :
   - **☰** → **Alerting** → **Alert rules**
   - Les alertes devraient passer en état **Firing** 🔥

### Vérification Détaillée

Pour chaque alerte, cliquez dessus et vérifiez :
- **State** : Firing
- **Labels** : severity, team
- **Annotations** : Le message d'erreur
- **Timeline** : Historique des états

---

## 📧 Notifications (Optionnel)

### Activer les Notifications Réelles

#### Slack

1. Créez une Incoming Webhook :
   - https://api.slack.com/messaging/webhooks
2. Dans Contact points, ajoutez :
   - Integration : Slack
   - Webhook URL : Collez l'URL

#### Discord

1. Dans votre serveur Discord :
   - Server Settings → Integrations → Webhooks
   - Create Webhook → Copy URL
2. Dans Contact points :
   - Integration : Discord
   - Webhook URL : Collez l'URL

#### Email (avec SMTP)

Éditez `grafana.ini` :
```ini
[smtp]
enabled = true
host = smtp.gmail.com:587
user = your-email@gmail.com
password = your-app-password
from_address = grafana@yourdomain.com
```

Redémarrez Grafana, puis :
1. Contact point → Email
2. Addresses : `your-email@example.com`

---

## 🔕 Silencer une Alerte (Mute)

Si vous voulez temporairement désactiver une alerte :

1. **☰** → **Alerting** → **Silences**
2. **+ Add silence**
3. **Matchers** :
   - `alertname` = `Tests Skipped Alert`
4. **Duration** : 1h, 24h, etc.
5. **Comment** : Raison du silence
6. **Create silence**

---

## 📈 Dashboard d'Alertes

### Créer un Panel avec l'État des Alertes

1. Retournez dans votre dashboard
2. **Add** → **Visualization**
3. **Type** : **Alert list**
4. **Options** :
   - **Show** : Current state
   - **State filter** : All
   - **Alert name filter** : Laissez vide pour voir toutes
5. **Title** : `🚨 Active Alerts`
6. **Apply**

Ce panel affichera en temps réel toutes les alertes actives.

---

## 🎯 Checklist Alertes

- [ ] Contact point créé
- [ ] Alerte "Tests Skipped" créée
- [ ] Alerte "Tests Failed" créée
- [ ] Alerte "Slow Execution" créée
- [ ] Toutes les alertes dans le même groupe "Test Metrics"
- [ ] Intervals d'évaluation configurés (10s)
- [ ] Annotations avec descriptions claires
- [ ] Labels severity ajoutés
- [ ] Test avec `npm run test:trigger-alarm` réussi
- [ ] Alertes passent en état "Firing" 🔥
- [ ] (Optionnel) Notifications reçues

---

## 🔍 Monitoring des Alertes

### Historique des Alertes

1. **☰** → **Alerting** → **Alert rules**
2. Cliquez sur une alerte
3. Onglet **History** : Voir tous les changements d'état

### Statistiques

Dans la page **Alert rules** :
- **Firing** : Nombre d'alertes actives
- **Pending** : Alertes en attente
- **Normal** : Alertes OK

---

## 🆘 Troubleshooting Alertes

### Problème : Alerte ne se déclenche jamais

**Solutions :**
1. Vérifier la query Prometheus :
   - Aller sur http://localhost:9090/graph
   - Tester la query manuellement
2. Vérifier le seuil (threshold) n'est pas trop haut
3. Vérifier l'évaluation interval (peut-être trop long)
4. Vérifier que les données arrivent dans Prometheus

### Problème : Alerte se déclenche en boucle

**Solutions :**
1. Augmenter le **Pending period** (ex: 30s au lieu de 0s)
2. Ajouter un **Recovery threshold** différent du seuil de déclenchement
3. Utiliser une **moyenne sur plusieurs points** avec :
   ```promql
   avg_over_time(tests_failed[1m])
   ```

### Problème : Pas de notification reçue

**Solutions :**
1. Vérifier le Contact point est bien configuré
2. Tester le contact point manuellement (bouton **Test**)
3. Vérifier les logs Grafana :
   ```bash
   # Logs Windows
   C:\Program Files\GrafanaLabs\grafana\data\log\

   # Logs macOS/Linux
   /var/log/grafana/grafana.log
   ```
4. Vérifier que l'alerte a bien le contact point assigné

### Problème : Alerte reste en "Pending"

**Solution :**
- C'est normal si le pending period est > 0s
- L'alerte passe en "Firing" après ce délai
- Réduire à `0s` pour des alertes immédiates

---

## 📚 PromQL pour Alertes Avancées

### Exemples de Queries Utiles

**Taux de réussite sous 90% :**
```promql
(tests_passed / tests_total) * 100 < 90
```

**Plus de 5 tests échoués :**
```promql
tests_failed > 5
```

**Durée en augmentation constante sur 5 min :**
```promql
deriv(tests_avg_duration_ms[5m]) > 0
```

**Aucun test exécuté depuis 1h :**
```promql
time() - timestamp(tests_total) > 3600
```

---

## 🎓 Best Practices

### Bonnes Pratiques d'Alerting

1. **Utilisez des labels** : Pour filtrer et router les alertes
2. **Descriptions claires** : Incluez des étapes de résolution
3. **Évitez le spam** : Utilisez pending period et thresholds adaptés
4. **Testez régulièrement** : Vérifiez que les alertes fonctionnent
5. **Documentez** : Liens vers runbooks dans les annotations
6. **Sévérité appropriée** : Critical, Warning, Info
7. **On-call rotation** : Assignez des équipes responsables

### Structure de Labels Recommandée

```yaml
severity: critical | warning | info
team: qa | dev | ops
service: tests | build | deploy
environment: prod | staging | dev
```

---

## 📊 Exemple de Règles Multiples

Pour créer un système d'alerting complet :

```yaml
# Critique : Tests échoués
tests_failed > 0
→ severity: critical, team: qa

# Warning : Tests lents
tests_avg_duration_ms > 150
→ severity: warning, team: performance

# Info : Nouveau run de tests
changes(tests_total[1m]) > 0
→ severity: info, team: qa
```

---

**✅ Alertes configurées ! Testez avec `npm run test:trigger-alarm` 🔥**
