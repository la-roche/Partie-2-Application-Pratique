
# DevBlog API

API backend de gestion d’articles de blog avec **Node.js**, **Express**, **SQLite** et **Swagger**, accompagnée d’une **interface web frontend** en **HTML/CSS/JavaScript**.

## Présentation

Ce projet a été réalisé dans le cadre d’un projet académique de **Licence 2 Informatique**.

L’objectif est de développer une application simple de gestion de blog permettant :

- de **créer** un article
- de **lister** tous les articles
- de **consulter** un article par son identifiant
- de **modifier** un article
- de **supprimer** un article
- de **rechercher** des articles
- de **tester et documenter** l’API avec Swagger
- d’**utiliser une interface web** connectée au backend

---

## Fonctionnalités

### Backend API
- Création d’articles
- Lecture de tous les articles
- Lecture d’un article par ID
- Modification d’un article
- Suppression d’un article
- Recherche d’articles par mot-clé
- Filtrage par catégorie, auteur ou date
- Validation des données
- Gestion des erreurs avec les bons codes HTTP
- Documentation Swagger

### Frontend
- Formulaire de création d’article
- Affichage de la liste des articles
- Modification d’un article depuis l’interface
- Suppression d’un article depuis l’interface
- Recherche d’articles
- Filtres par catégorie, auteur et date
- Boutons d’accès à Swagger et aux données JSON de l’API

---

## Technologies utilisées

### Backend
- **Node.js**
- **Express.js**
- **SQLite**
- **sqlite3**
- **sqlite**
- **cors**

### Documentation
- **swagger-ui-express**
- **swagger-jsdoc**

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript vanilla**

### Développement
- **nodemon**

---

## Structure du projet

```bash
blog-api/
│
├── controllers/
│   └── articleController.js
│
├── models/
│   └── articleModel.js
│
├── routes/
│   └── articleRoutes.js
│
├── database/
│   ├── db.js
│   └── blog.db
│
├── docs/
│   └── swagger.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── app.js
├── package.json
└── README.md
```

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ton-username/blog-api.git
cd blog-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le projet

En mode développement :

```bash
npm run dev
```

En mode normal :

```bash
npm start
```

---

## Accès à l’application

Une fois le serveur démarré, tu peux accéder à :

- **Frontend** : `http://localhost:3000`
- **API** : `http://localhost:3000/api`
- **Articles JSON** : `http://localhost:3000/api/articles`
- **Documentation Swagger** : `http://localhost:3000/api-docs`

---

## Base de données

Le projet utilise **SQLite** comme base de données locale.

Le fichier de base de données est créé automatiquement dans :

```bash
database/blog.db
```

### Table `articles`

Chaque article contient les champs suivants :

| Champ | Type | Description |
|------|------|-------------|
| `id` | INTEGER | Identifiant unique auto-incrémenté |
| `titre` | TEXT | Titre de l’article |
| `contenu` | TEXT | Contenu de l’article |
| `auteur` | TEXT | Nom de l’auteur |
| `date` | TEXT | Date de publication |
| `categorie` | TEXT | Catégorie de l’article |
| `tags` | TEXT | Liste des tags stockée au format JSON |

### Schéma SQL

```sql
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  auteur TEXT NOT NULL,
  date TEXT NOT NULL,
  categorie TEXT NOT NULL,
  tags TEXT
);
```

---

## Architecture du projet

Le projet suit une architecture simple et claire en 3 parties :

### 1. Routes
Les routes définissent les URL de l’API.

Exemple :
- `POST /api/articles`
- `GET /api/articles`
- `PUT /api/articles/:id`

### 2. Contrôleurs
Les contrôleurs contiennent la logique métier :
- validation
- traitement des requêtes
- gestion des réponses

### 3. Modèles
Les modèles communiquent avec la base de données SQLite.

---

## Endpoints de l’API

### 1. Créer un article

**POST** `/api/articles`

#### Corps de la requête
```json
{
  "titre": "Introduction à Node.js",
  "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur.",
  "auteur": "Rochefort",
  "date": "2026-03-18",
  "categorie": "Tech",
  "tags": ["nodejs", "backend", "api"]
}
```

#### Réponse
```json
{
  "message": "Article créé avec succès.",
  "id": 1
}
```

---

### 2. Lire tous les articles

**GET** `/api/articles`

#### Exemple
```bash
GET /api/articles
```

#### Réponse
```json
[
  {
    "id": 1,
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur.",
    "auteur": "Rochefort",
    "date": "2026-03-18",
    "categorie": "Tech",
    "tags": ["nodejs", "backend", "api"]
  }
]
```

---

### 3. Lire un article par ID

**GET** `/api/articles/:id`

#### Exemple
```bash
GET /api/articles/1
```

#### Réponse
```json
{
  "id": 1,
  "titre": "Introduction à Node.js",
  "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur.",
  "auteur": "Rochefort",
  "date": "2026-03-18",
  "categorie": "Tech",
  "tags": ["nodejs", "backend", "api"]
}
```

---

### 4. Modifier un article

**PUT** `/api/articles/:id`

#### Corps de la requête
```json
{
  "titre": "Node.js pour débutants",
  "contenu": "Contenu mis à jour...",
  "categorie": "Développement Web",
  "tags": ["nodejs", "express"]
}
```

#### Réponse
```json
{
  "message": "Article mis à jour avec succès."
}
```

---

### 5. Supprimer un article

**DELETE** `/api/articles/:id`

#### Exemple
```bash
DELETE /api/articles/1
```

#### Réponse
```json
{
  "message": "Article supprimé avec succès."
}
```

---

### 6. Rechercher un article

**GET** `/api/articles/search?query=texte`

#### Exemple
```bash
GET /api/articles/search?query=node
```

#### Réponse
```json
[
  {
    "id": 1,
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement d'exécution JavaScript côté serveur.",
    "auteur": "Rochefort",
    "date": "2026-03-18",
    "categorie": "Tech",
    "tags": ["nodejs", "backend", "api"]
  }
]
```

---

### 7. Filtrer les articles

**GET** `/api/articles?categorie=Tech&auteur=Rochefort&date=2026-03-18`

#### Paramètres possibles
- `categorie`
- `auteur`
- `date`

#### Exemple
```bash
GET /api/articles?categorie=Tech
```

---

## Interface web

Le projet contient également une interface web simple accessible à l’adresse :

```bash
http://localhost:3000
```

### Fonctionnalités disponibles dans l’interface
- créer un article
- afficher les articles
- modifier un article
- supprimer un article
- rechercher un article
- filtrer les articles
- accéder à Swagger
- accéder à la sortie JSON de l’API

### Fonctionnement
Le frontend utilise `fetch()` en JavaScript pour envoyer les requêtes HTTP vers le backend Express.

L’interface est servie automatiquement par Express grâce au dossier `public`.

---

## Comment utiliser l’interface web

### 1. Ajouter un article
- remplir le formulaire
- cliquer sur **Ajouter l’article**

### 2. Modifier un article
- cliquer sur **Modifier**
- le formulaire se remplit automatiquement
- modifier les champs
- cliquer sur **Mettre à jour**

### 3. Supprimer un article
- cliquer sur **Supprimer**
- confirmer la suppression

### 4. Rechercher
- saisir un mot-clé dans la barre de recherche
- cliquer sur **Rechercher**

### 5. Filtrer
- remplir un ou plusieurs champs de filtre
- cliquer sur **Appliquer les filtres**

### 6. Réinitialiser
- cliquer sur **Réinitialiser** pour vider les filtres

---

## Documentation Swagger

La documentation Swagger est accessible ici :

```bash
http://localhost:3000/api-docs
```

Elle permet de :
- visualiser tous les endpoints
- voir les paramètres et les corps de requêtes
- tester les endpoints directement dans le navigateur

---

## Validation des données

Le backend vérifie plusieurs règles importantes :

- le `titre` ne doit pas être vide
- le `contenu` ne doit pas être vide
- l’`auteur` est obligatoire
- la `categorie` est obligatoire
- la `date` doit être au format `YYYY-MM-DD`
- les `tags` doivent être un tableau
- l’`id` doit être valide

---

## Codes HTTP utilisés

| Code | Signification |
|------|---------------|
| `200` | Requête réussie |
| `201` | Création réussie |
| `400` | Requête invalide |
| `404` | Ressource introuvable |
| `500` | Erreur interne du serveur |

---

## Exemple de scénario de test complet

### 1. Créer un article
```bash
POST /api/articles
```

### 2. Vérifier qu’il existe
```bash
GET /api/articles
```

### 3. Afficher cet article
```bash
GET /api/articles/1
```

### 4. Modifier son titre
```bash
PUT /api/articles/1
```

### 5. Le rechercher
```bash
GET /api/articles/search?query=Node
```

### 6. Le supprimer
```bash
DELETE /api/articles/1
```

---

## Points forts du projet

- architecture claire
- projet simple et fonctionnel
- code organisé
- utilisation de SQLite adaptée à un projet étudiant
- documentation Swagger
- interface web connectée au backend
- respect des principes CRUD
- validation des entrées utilisateurs

---

## Limites actuelles

Ce projet est volontairement simple. Il ne contient pas encore :

- authentification utilisateur
- gestion des commentaires
- upload d’images
- pagination
- déploiement en ligne

---

## Améliorations possibles

Pour faire évoluer le projet, on peut ajouter :

- authentification avec JWT
- système de commentaires
- gestion des utilisateurs
- pagination des articles
- tri par date
- interface frontend plus avancée avec React ou Vue.js
- déploiement sur Render ou Railway

---

## Lancement rapide

Si tu veux lancer le projet rapidement :

```bash
npm install
npm run dev
```

Puis ouvre :

```bash
http://localhost:3000
```

---

## Auteur

**Ton nom ici**  
Étudiant en Licence 2 Informatique

### GitHub
```bash
https://github.com/ton-username
```

---

## Dépôt GitHub

Dans le rapport, il faut fournir :
- le lien du dépôt GitHub
- le README
- le code source
- éventuellement le lien Swagger ou le lien de déploiement

---

## Conclusion

Ce projet m’a permis de mettre en pratique :

- la création d’une API REST
- l’utilisation d’Express
- la manipulation d’une base de données SQLite
- la structuration d’un projet backend
- la documentation d’API avec Swagger
- la consommation d’une API avec un frontend simple en JavaScript

