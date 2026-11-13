
(() => {
  const cfg = window.STAR_PAGES_CONFIG;
  const grid = document.getElementById("bookGrid");

  // Format book cards
  function card(book, index) {
    const cover = book.cover
      ? `<img src="${book.cover}" alt="${book.title} cover">`
      : `<div class="cover-placeholder ${book.accent || "blue"}">
           <span class="cover-star">✦</span>
           <strong>${book.title}</strong>
           <small>STAR PAGES PUBLISHING</small>
           <i>${String(index + 1).padStart(2, "0")}</i>
         </div>`;

    const amazonButton = book.amazonUrl
      ? `<a class="buy-button"
            href="${book.amazonUrl}"
            target="_blank"
            rel="noopener noreferrer">
            Buy on Amazon ↗
         </a>`
      : `<span class="book-meta">Amazon link coming soon</span>`;

    return `
      <article class="book-card" data-category="${book.category}">
        <div class="cover-wrap">
          ${cover}
          <span class="book-tag">${book.categoryLabel}</span>
        </div>

        <div class="book-info">
          <div class="book-meta">Published book</div>
          <h3>${book.title}</h3>
          <p>${book.description}</p>

          <div class="book-buy">
            ${amazonButton}
          </div>
        </div>
      </article>
    `;
  }

  // Display books
  function render(filter = "all") {
    const books = cfg.books.filter(book =>
      filter === "all" || book.category === filter
    );

    grid.innerHTML = books.map(card).join("");
  }

  // Book category filters
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(item =>
        item.classList.remove("active")
      );

      button.classList.add("active");
      render(button.dataset.filter);
    });
  });

  // Mobile navigation
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("show");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
      });
    });
  }

  // Footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const email = document.getElementById("emailLink");
  if (email) {
    email.href = "mailto:" + cfg.publisherEmail;
  }

  // Display catalogue
  if (grid && cfg && Array.isArray(cfg.books)) {
    render();
  }
})();
