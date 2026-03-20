# Blog API

API backend simple pour gérer des articles de blog, développée avec Node.js, Express, SQLite et Swagger.

## Technologies utilisées
- Node.js
- Express
- SQLite
- Swagger

## Installation
1. Cloner le projet
2. Installer les dépendances :
   npm install
3. Lancer le serveur :
   npm run dev

## URL
- API : http://localhost:3000
- Swagger : http://localhost:3000/api-docs

## Endpoints
### Créer un article
POST /api/articles

### Lire tous les articles
GET /api/articles

### Lire un article par ID
GET /api/articles/:id

### Modifier un article
PUT /api/articles/:id

### Supprimer un article
DELETE /api/articles/:id

### Rechercher un article
GET /api/articles/search?query=texte

## Exemple de requête POST
{
  "titre": "Article test",
  "contenu": "Contenu de test",
  "auteur": "Ali",
  "date": "2026-03-18",
  "categorie": "Tech",
  "tags": ["test", "node"]
}
