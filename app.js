const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const articleRoutes = require("./routes/articleRoutes");
const swaggerSpec = require("./docs/swagger");
const { initDB } = require("./database/db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Sert les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "public")));

// Route API simple
app.get("/api", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Blog",
  });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes articles
app.use("/api/articles", articleRoutes);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
      console.log(`Frontend disponible sur http://localhost:${PORT}`);
      console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Erreur au démarrage :", error);
  });
