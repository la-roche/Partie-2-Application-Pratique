const API_BASE_URL = "";

const form = document.getElementById("article-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const messageBox = document.getElementById("message");

const titreInput = document.getElementById("titre");
const contenuInput = document.getElementById("contenu");
const auteurInput = document.getElementById("auteur");
const dateInput = document.getElementById("date");
const categorieInput = document.getElementById("categorie");
const tagsInput = document.getElementById("tags");

const searchInput = document.getElementById("search-input");
const filterCategorie = document.getElementById("filter-categorie");
const filterAuteur = document.getElementById("filter-auteur");
const filterDate = document.getElementById("filter-date");

const searchBtn = document.getElementById("search-btn");
const filterBtn = document.getElementById("filter-btn");
const resetBtn = document.getElementById("reset-btn");
const refreshBtn = document.getElementById("refresh-btn");

const articlesContainer = document.getElementById("articles-container");

let editingId = null;
let currentArticles = [];

function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function hideMessage() {
  messageBox.className = "message hidden";
  messageBox.textContent = "";
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.filter(tag => tag && tag.trim() !== "");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = "Créer un article";
  submitBtn.textContent = "Ajouter l'article";
  cancelEditBtn.classList.add("hidden");
  auteurInput.disabled = false;
  dateInput.disabled = false;
  dateInput.value = getTodayDate();
  hideMessage();
}

function fillFormForEdit(article) {
  editingId = article.id;

  titreInput.value = article.titre || "";
  contenuInput.value = article.contenu || "";
  auteurInput.value = article.auteur || "";
  dateInput.value = article.date || "";
  categorieInput.value = article.categorie || "";
  tagsInput.value = Array.isArray(article.tags) ? article.tags.join(", ") : "";

  auteurInput.disabled = true;
  dateInput.disabled = true;

  formTitle.textContent = `Modifier l'article #${article.id}`;
  submitBtn.textContent = "Mettre à jour";
  cancelEditBtn.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function buildCreatePayload() {
  return {
    titre: titreInput.value.trim(),
    contenu: contenuInput.value.trim(),
    auteur: auteurInput.value.trim(),
    date: dateInput.value || getTodayDate(),
    categorie: categorieInput.value.trim(),
    tags: formatTags(tagsInput.value.split(",").map(tag => tag.trim()))
  };
}

function buildUpdatePayload() {
  return {
    titre: titreInput.value.trim(),
    contenu: contenuInput.value.trim(),
    categorie: categorieInput.value.trim(),
    tags: formatTags(tagsInput.value.split(",").map(tag => tag.trim()))
  };
}

async function loadArticles() {
  try {
    hideMessage();

    const params = new URLSearchParams();

    if (filterCategorie.value.trim()) {
      params.append("categorie", filterCategorie.value.trim());
    }

    if (filterAuteur.value.trim()) {
      params.append("auteur", filterAuteur.value.trim());
    }

    if (filterDate.value) {
      params.append("date", filterDate.value);
    }

    const url = params.toString()
      ? `${API_BASE_URL}/api/articles?${params.toString()}`
      : `${API_BASE_URL}/api/articles`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors du chargement des articles.");
    }

    currentArticles = data;
    renderArticles(data);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function searchArticles() {
  try {
    hideMessage();

    const query = searchInput.value.trim();

    if (!query) {
      loadArticles();
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/articles/search?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la recherche.");
    }

    currentArticles = data;
    renderArticles(data);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderArticles(articles) {
  if (!Array.isArray(articles) || articles.length === 0) {
    articlesContainer.innerHTML = `
      <div class="empty-state">
        <p>Aucun article trouvé.</p>
      </div>
    `;
    return;
  }

  articlesContainer.innerHTML = articles
    .map(article => {
      const tagsHtml = Array.isArray(article.tags) && article.tags.length > 0
        ? article.tags
            .map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`)
            .join("")
        : `<span class="tag">Aucun tag</span>`;

      return `
        <div class="article-card">
          <h3>${escapeHtml(article.titre)}</h3>

          <div class="article-meta">
            <strong>Auteur :</strong> ${escapeHtml(article.auteur)} |
            <strong>Date :</strong> ${escapeHtml(article.date)} |
            <strong>Catégorie :</strong> ${escapeHtml(article.categorie)}
          </div>

          <div class="article-content">
            ${escapeHtml(article.contenu).replace(/\n/g, "<br>")}
          </div>

          <div class="tags">
            ${tagsHtml}
          </div>

          <div class="article-actions">
            <button class="btn btn-primary" onclick="editArticle(${article.id})">Modifier</button>
            <button class="btn btn-danger" onclick="removeArticle(${article.id})">Supprimer</button>
          </div>
        </div>
      `;
    })
    .join("");
}

async function saveArticle(event) {
  event.preventDefault();

  try {
    hideMessage();

    let url = `${API_BASE_URL}/api/articles`;
    let method = "POST";
    let payload = buildCreatePayload();

    if (!payload.titre || !payload.contenu || !payload.auteur || !payload.categorie) {
      showMessage("Veuillez remplir les champs obligatoires.", "error");
      return;
    }

    if (editingId !== null) {
      url = `${API_BASE_URL}/api/articles/${editingId}`;
      method = "PUT";
      payload = buildUpdatePayload();

      if (!payload.titre || !payload.contenu || !payload.categorie) {
        showMessage("Le titre, le contenu et la catégorie sont obligatoires pour la modification.", "error");
        return;
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'enregistrement.");
    }

    showMessage(data.message || "Opération réussie.", "success");
    resetForm();
    await loadArticles();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function editArticle(id) {
  const article = currentArticles.find(item => item.id === id);

  if (!article) {
    showMessage("Article introuvable pour modification.", "error");
    return;
  }

  fillFormForEdit(article);
}

async function removeArticle(id) {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer cet article ?");

  if (!confirmDelete) return;

  try {
    hideMessage();

    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la suppression.");
    }

    showMessage(data.message || "Article supprimé avec succès.", "success");
    await loadArticles();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function resetFilters() {
  searchInput.value = "";
  filterCategorie.value = "";
  filterAuteur.value = "";
  filterDate.value = "";
  loadArticles();
}

form.addEventListener("submit", saveArticle);
searchBtn.addEventListener("click", searchArticles);
filterBtn.addEventListener("click", loadArticles);
resetBtn.addEventListener("click", resetFilters);
refreshBtn.addEventListener("click", loadArticles);
cancelEditBtn.addEventListener("click", resetForm);

window.editArticle = editArticle;
window.removeArticle = removeArticle;

document.addEventListener("DOMContentLoaded", () => {
  dateInput.value = getTodayDate();
  loadArticles();
});
