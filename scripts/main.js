"use strict";

const gameGrid = document.querySelector("[data-game-grid]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const searchInput = document.querySelector("[data-game-search]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const resetCatalogButton = document.querySelector("[data-reset-catalog]");
const siteHeader = document.querySelector("[data-site-header]");

let activeFilter = "all";
let games = [];
let gameCards = [];

/* ---- Render ---- */

function categoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function padNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function createCardHTML(game, index) {
  const loading = index < 2 ? "eager" : "lazy";

  const actionIcon = `<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>`;
  const actionText = "Play game";
  const actionLabel = `Play ${game.title}`;

  const cardContent = `
    <figure class="game-card__media">
      <img class="game-card__image" src="${game.image}" alt="${game.imageAlt}" width="800" height="500" loading="${loading}">
      <span class="game-card__number" aria-hidden="true">${padNumber(index)}</span>
    </figure>
    <div class="game-card__body">
      <div class="game-card__meta"><span>${categoryLabel(game.category)}</span><span>${game.meta}</span></div>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <div class="game-card__footer">
        <span>${game.tag}</span>
        <span class="game-card__action" aria-label="${actionLabel}">${actionText} ${actionIcon}</span>
      </div>
    </div>`;

  if (game.url) {
    return `<article class="game-card" data-game-card data-title="${game.title}" data-category="${game.category}">
      <a class="game-card__link" href="${game.url}">${cardContent}</a>
    </article>`;
  }

  return `<article class="game-card" data-game-card data-title="${game.title}" data-category="${game.category}">
    ${cardContent}
  </article>`;
}

function renderCards() {
  if (!gameGrid) return;

  gameGrid.innerHTML = games.map(createCardHTML).join("");
  gameCards = [...gameGrid.querySelectorAll("[data-game-card]")];

  // Wire image fallbacks on freshly created elements
  gameGrid.querySelectorAll(".game-card__image").forEach((image) => {
    const markAsLoaded = () => image.classList.remove("is-missing");
    const markAsMissing = () => image.classList.add("is-missing");

    image.addEventListener("load", markAsLoaded);
    image.addEventListener("error", markAsMissing);

    if (image.complete) {
      image.naturalWidth > 0 ? markAsLoaded() : markAsMissing();
    }
  });

  updateCatalog();
}

/* ---- Search & Filter ---- */

function normalizeText(value) {
  return value.trim().toLocaleLowerCase();
}

function getSearchableText(card) {
  const title = card.dataset.title ?? "";
  const category = card.dataset.category ?? "";
  const description = card.querySelector(".game-card__body > p")?.textContent ?? "";

  return normalizeText(`${title} ${category} ${description}`);
}

function updateCatalog() {
  const query = normalizeText(searchInput?.value ?? "");
  let visibleCount = 0;

  gameCards.forEach((card) => {
    const category = card.dataset.category ?? "";
    const matchesSearch = getSearchableText(card).includes(query);
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const isVisible = matchesSearch && matchesFilter;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (resultCount) {
    const gameLabel = visibleCount === 1 ? "game" : "games";
    const isDefaultView = activeFilter === "all" && query === "";

    resultCount.textContent = isDefaultView
      ? `Showing all ${visibleCount} games`
      : `Showing ${visibleCount} ${gameLabel}`;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
}

function setActiveFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateCatalog();
}

function resetCatalog({ focusSearch = false } = {}) {
  if (searchInput) {
    searchInput.value = "";
  }

  setActiveFilter("all");

  if (focusSearch) {
    searchInput?.focus();
  }
}

/* ---- Event listeners ---- */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter ?? "all");
  });
});

searchInput?.addEventListener("input", updateCatalog);
searchInput?.addEventListener("search", updateCatalog);
searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchInput.value) {
    searchInput.value = "";
    updateCatalog();
  }
});

resetCatalogButton?.addEventListener("click", () => {
  resetCatalog({ focusSearch: true });
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target?.isContentEditable;
  const hasModifier = event.metaKey || event.ctrlKey || event.altKey;

  if (event.key === "/" && !isTyping && !hasModifier && searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

/* ---- Header scroll state ---- */

function updateHeader() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ---- Hero/floating images fallback ---- */

document.querySelectorAll(".preview-window__image img, .floating-card img").forEach((image) => {
  const markAsLoaded = () => image.classList.remove("is-missing");
  const markAsMissing = () => image.classList.add("is-missing");

  image.addEventListener("load", markAsLoaded);
  image.addEventListener("error", markAsMissing);

  if (image.complete) {
    image.naturalWidth > 0 ? markAsLoaded() : markAsMissing();
  }
});

/* ---- Load games data and render ---- */

async function init() {
  try {
    const response = await fetch("data/games.json");

    if (!response.ok) {
      throw new Error(`Failed to load games data: ${response.status}`);
    }

    games = await response.json();
    renderCards();
  } catch (error) {
    console.error("Game Zone:", error.message);

    // Fallback: if cards were already present in HTML (e.g. SSR), wire them up
    gameCards = [...document.querySelectorAll("[data-game-card]")];
    updateCatalog();
  }
}

init();
