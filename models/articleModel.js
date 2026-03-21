const { getDB } = require("../database/db");

function formatArticle(article) {
  if (!article) return null;

  return {
    ...article,
    tags: article.tags ? JSON.parse(article.tags) : [],
  };
}

async function createArticle(article) {
  const db = getDB();

  const result = await db.run(
    `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      article.titre,
      article.contenu,
      article.auteur,
      article.date,
      article.categorie,
      JSON.stringify(article.tags || []),
    ]
  );

  return result.lastID;
}

async function getAllArticles(filters = {}) {
  const db = getDB();

  let sql = `SELECT * FROM articles WHERE 1=1`;
  const params = [];

  if (filters.categorie) {
    sql += ` AND categorie = ?`;
    params.push(filters.categorie);
  }

  if (filters.auteur) {
    sql += ` AND auteur = ?`;
    params.push(filters.auteur);
  }

  if (filters.date) {
    sql += ` AND date = ?`;
    params.push(filters.date);
  }

  sql += ` ORDER BY id DESC`;

  const articles = await db.all(sql, params);
  return articles.map(formatArticle);
}

async function getArticleById(id) {
  const db = getDB();

  const article = await db.get(`SELECT * FROM articles WHERE id = ?`, [id]);
  return formatArticle(article);
}

async function updateArticle(id, data) {
  const db = getDB();

  const fields = [];
  const values = [];

  if (data.titre !== undefined) {
    fields.push("titre = ?");
    values.push(data.titre);
  }

  if (data.contenu !== undefined) {
    fields.push("contenu = ?");
    values.push(data.contenu);
  }

  if (data.categorie !== undefined) {
    fields.push("categorie = ?");
    values.push(data.categorie);
  }

  if (data.tags !== undefined) {
    fields.push("tags = ?");
    values.push(JSON.stringify(data.tags));
  }

  if (fields.length === 0) {
    return 0;
  }

  values.push(id);

  const result = await db.run(
    `UPDATE articles SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  return result.changes;
}

async function deleteArticle(id) {
  const db = getDB();

  const result = await db.run(`DELETE FROM articles WHERE id = ?`, [id]);
  return result.changes;
}

async function searchArticles(query) {
  const db = getDB();

  const articles = await db.all(
    `SELECT * FROM articles
     WHERE titre LIKE ? OR contenu LIKE ?
     ORDER BY id DESC`,
    [`%${query}%`, `%${query}%`]
  );

  return articles.map(formatArticle);
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};
