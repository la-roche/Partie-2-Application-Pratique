const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API backend pour gérer les articles d'un blog simple",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        Article: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            titre: {
              type: "string",
              example: "Introduction à Node.js",
            },
            contenu: {
              type: "string",
              example: "Node.js permet de créer des applications backend...",
            },
            auteur: {
              type: "string",
              example: "Ali",
            },
            date: {
              type: "string",
              example: "2026-03-18",
            },
            categorie: {
              type: "string",
              example: "Tech",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["nodejs", "backend", "api"],
            },
          },
        },
        ArticleInput: {
          type: "object",
          required: ["titre", "contenu", "auteur", "categorie"],
          properties: {
            titre: {
              type: "string",
            },
            contenu: {
              type: "string",
            },
            auteur: {
              type: "string",
            },
            date: {
              type: "string",
              example: "2026-03-18",
            },
            categorie: {
              type: "string",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        ArticleUpdate: {
          type: "object",
          properties: {
            titre: {
              type: "string",
            },
            contenu: {
              type: "string",
            },
            categorie: {
              type: "string",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
