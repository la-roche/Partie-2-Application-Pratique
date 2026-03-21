const articleModel = require("../models/articleModel");

function isEmpty(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function createArticle(req, res) {
  try {
    let { titre, contenu, auteur, date, categorie, tags } = req.body;

    if (isEmpty(titre) || isEmpty(contenu) || isEmpty(auteur) || isEmpty(categorie)) {
      return res.status(400).json({
        message: "Les champs titre, contenu, auteur et categorie sont obligatoires.",
      });
    }

    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        message: "La date doit être au format YYYY-MM-DD.",
      });
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({
        message: "Le champ tags doit être un tableau.",
      });
    }

    const id = await articleModel.createArticle({
      titre: titre.trim(),
      contenu: contenu.trim(),
      auteur: auteur.trim(),
      date,
      categorie: categorie.trim(),
      tags: tags || [],
    });

    return res.status(201).json({
      message: "Article créé avec succès.",
      id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

async function getAllArticles(req, res) {
  try {
    const { categorie, auteur, date } = req.query;

    const articles = await articleModel.getAllArticles({
      categorie,
      auteur,
      date,
    });

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

async function getArticleById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    const article = await articleModel.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article non trouvé.",
      });
    }

    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

async function updateArticle(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    const existingArticle = await articleModel.getArticleById(id);

    if (!existingArticle) {
      return res.status(404).json({
        message: "Article non trouvé.",
      });
    }

    const { titre, contenu, categorie, tags } = req.body;

    if (
      titre === undefined &&
      contenu === undefined &&
      categorie === undefined &&
      tags === undefined
    ) {
      return res.status(400).json({
        message: "Aucune donnée à mettre à jour.",
      });
    }

    if (titre !== undefined && isEmpty(titre)) {
      return res.status(400).json({
        message: "Le titre ne doit pas être vide.",
      });
    }

    if (contenu !== undefined && isEmpty(contenu)) {
      return res.status(400).json({
        message: "Le contenu ne doit pas être vide.",
      });
    }

    if (categorie !== undefined && isEmpty(categorie)) {
      return res.status(400).json({
        message: "La catégorie ne doit pas être vide.",
      });
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({
        message: "Le champ tags doit être un tableau.",
      });
    }

    await articleModel.updateArticle(id, {
      titre: titre !== undefined ? titre.trim() : undefined,
      contenu: contenu !== undefined ? contenu.trim() : undefined,
      categorie: categorie !== undefined ? categorie.trim() : undefined,
      tags,
    });

    return res.status(200).json({
      message: "Article mis à jour avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

async function deleteArticle(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    const deleted = await articleModel.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Article non trouvé.",
      });
    }

    return res.status(200).json({
      message: "Article supprimé avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

async function searchArticles(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Le paramètre query est obligatoire.",
      });
    }

    const articles = await articleModel.searchArticles(query.trim());

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};
