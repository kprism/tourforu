(() => {
  "use strict";

  const data = window.TOURFORU_DATA;
  const app = document.getElementById("app");

  if (!data || !app) {
    return;
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function itemImage(item) {
    return item.image || (item.images && item.images[0]) || "";
  }

  function topbar(title, subtitle) {
    return `
      <header class="topbar">
        <button class="icon-button"
                type="button"
                data-foru-home-back
                aria-label="뒤로가기">
          ←
        </button>

        <div class="brand">
          <small>${escapeHtml(subtitle)}</small>
          <strong>${escapeHtml(title)}</strong>
        </div>

        <div class="top-actions">
          <button class="icon-button"
                  type="button"
                  data-foru-search-open
                  aria-label="검색">
            🔎
          </button>

          <button class="icon-button"
                  type="button"
                  data-route="mypage"
                  aria-label="마이페이지">
            👤
          </button>
        </div>
      </header>
    `;
  }

  function renderCategoryPage(type) {
    const isHotel = type === "hotel";
    const items = isHotel ? data.hotels || [] : data.foods || [];

    const title = isHotel ? "숙박" : "맛집";
    const subtitle = isHotel ? "AI STAY" : "AI FOOD";
    const icon = isHotel ? "🏨" : "🍲";

    history.pushState(
      null,
      "",
      isHotel ? "#/stays" : "#/foods"
    );

    const cards = items.map(item => {
      const route = isHotel ? "hotel" : "food";

      return `
        <article class="foru-category-card"
                 data-route="${route}"
                 data-id="${escapeHtml(item.id)}">

          <div class="foru-category-image">
            <img src="${escapeHtml(itemImage(item))}"
                 alt="${escapeHtml(item.name)}">
          </div>

          <div class="foru-category-body">
            <div class="foru-category-badges">
              <span>${icon} AI 추천 ${title}</span>
              <span>★ ${escapeHtml(item.rating)}</span>
            </div>

            <h2>${escapeHtml(item.name)}</h2>

            <p>
              ${escapeHtml(
                item.description ||
                item.address ||
                "여행 동선과 후기 데이터를 반영한 추천 콘텐츠입니다."
              )}
            </p>

            <div class="foru-category-meta">
              <span>📍 ${escapeHtml(item.distance || "거리 확인")}</span>
              <span>💬 ${escapeHtml(item.reviews || "후기 준비 중")}</span>
            </div>

            <div class="foru-category-price">
              <strong>${escapeHtml(item.price || "가격 확인")}</strong>
              <span>상세보기 ›</span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    app.innerHTML = `
      <div class="app-shell foru-category-page">
        ${topbar(`${icon} ${title}`, subtitle)}

        <main class="app-main">
          <section class="foru-category-hero">
            <span>${icon}</span>

            <div>
              <small>forU25 맞춤 탐색</small>
              <h1>
                ${isHotel
                  ? "여행지와 가까운 숙박을 모았어요"
                  : "현지에서 놓치기 아쉬운 맛집을 모았어요"}
              </h1>

              <p>
                거리·평점·후기·가격을 함께 보고
                상세페이지에서 KEEP할 수 있습니다.
              </p>
            </div>
          </section>

          <section class="section">
            <div class="section-title">
              <div>
                <h2>${title} 콘텐츠 ${items.length}개</h2>
                <p>카드를 누르면 상세페이지로 이동합니다.</p>
              </div>
            </div>

            <div class="foru-category-list">
              ${cards || `
                <div class="empty-state">
                  <span>${icon}</span>
                  <h2>등록된 ${title} 콘텐츠가 없습니다.</h2>
                </div>
              `}
            </div>
          </section>
        </main>
      </div>
    `;

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  function searchItems(keyword) {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return (data.destinations || []).filter(item => {
      const text = [
        item.title,
        item.summary,
        item.city,
        item.district,
        ...(item.tags || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(normalized);
    });
  }

  function resultCard(item) {
    return `
      <button class="foru-search-result"
              type="button"
              data-route="destination"
              data-id="${escapeHtml(item.id)}">

        <img src="${escapeHtml(itemImage(item))}"
             alt="${escapeHtml(item.title)}">

        <div>
          <small>
            📍 ${escapeHtml(item.city || "")}
            ${escapeHtml(item.district || "")}
          </small>

          <strong>${escapeHtml(item.title)}</strong>

          <p>${escapeHtml(item.summary || "")}</p>

          <span>
            ★ ${escapeHtml(item.rating)}
            · ${escapeHtml(item.distance)}
          </span>
        </div>
      </button>
    `;
  }

  function updateSearchResults(input, resultArea) {
    const keyword = input.value;
    const results = searchItems(keyword);

    if (!keyword.trim()) {
      resultArea.innerHTML = `
        <div class="foru-search-guide">
          <span>⚓</span>
          <strong>‘이순신’을 검색해보세요.</strong>
          <p>이순신 승전길이 검색 결과에 표시됩니다.</p>
        </div>
      `;
      return;
    }

    if (!results.length) {
      resultArea.innerHTML = `
        <div class="foru-search-guide">
          <span>🔍</span>
          <strong>검색 결과가 없습니다.</strong>
          <p>다른 관광지명이나 지역명을 입력해보세요.</p>
        </div>
      `;
      return;
    }

    resultArea.innerHTML = results.map(resultCard).join("");
  }

  function openSearch() {
    const existing = document.querySelector(".foru-search-layer");

    if (existing) {
      existing.remove();
    }

    const layer = document.createElement("div");
    layer.className = "foru-search-layer";

    layer.innerHTML = `
      <section class="foru-search-panel"
               role="dialog"
               aria-modal="true"
               aria-label="관광지 검색">

        <div class="foru-search-head">
          <button type="button"
                  data-foru-search-close
                  aria-label="검색 닫기">
            ←
          </button>

          <div>
            <small>forU25 통합검색</small>
            <strong>어디로 떠나볼까요?</strong>
          </div>
        </div>

        <form class="foru-search-form"
              data-foru-search-form>

          <span>🔎</span>

          <input type="search"
                 autocomplete="off"
                 placeholder="관광지·지역·테마 검색"
                 value="">

          <button type="submit">검색</button>
        </form>

        <div class="foru-search-chips">
          <button type="button"
                  data-foru-search-keyword="이순신">
            이순신
          </button>

          <button type="button"
                  data-foru-search-keyword="통영">
            통영
          </button>

          <button type="button"
                  data-foru-search-keyword="거제">
            거제
          </button>

          <button type="button"
                  data-foru-search-keyword="바다">
            바다
          </button>
        </div>

        <div class="foru-search-results">
          <div class="foru-search-guide">
            <span>⚓</span>
            <strong>‘이순신’을 검색해보세요.</strong>
            <p>이순신 승전길이 검색 결과에 표시됩니다.</p>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(layer);

    const input = layer.querySelector("input");
    const resultArea = layer.querySelector(".foru-search-results");

    setTimeout(() => input.focus(), 50);

    input.addEventListener("input", () => {
      updateSearchResults(input, resultArea);
    });

    layer
      .querySelector("[data-foru-search-form]")
      .addEventListener("submit", event => {
        event.preventDefault();
        updateSearchResults(input, resultArea);
      });

    layer
      .querySelectorAll("[data-foru-search-keyword]")
      .forEach(button => {
        button.addEventListener("click", () => {
          input.value = button.dataset.foruSearchKeyword;
          updateSearchResults(input, resultArea);
        });
      });
  }

  document.addEventListener("click", event => {
    const story = event.target.closest(".story");

    if (story) {
      const label = story.textContent.replace(/\s+/g, " ").trim();

      if (label.includes("숙박")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        renderCategoryPage("hotel");
        return;
      }

      if (label.includes("맛집")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        renderCategoryPage("food");
        return;
      }
    }

    const searchButton = event.target.closest(
      '[data-action="search"], [data-foru-search-open]'
    );

    if (searchButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openSearch();
      return;
    }

    if (event.target.closest("[data-foru-search-close]")) {
      event.preventDefault();
      document.querySelector(".foru-search-layer")?.remove();
      return;
    }

    if (
      event.target.classList.contains("foru-search-layer") &&
      !event.target.closest(".foru-search-panel")
    ) {
      event.target.remove();
      return;
    }

    if (event.target.closest("[data-foru-home-back]")) {
      event.preventDefault();
      location.hash = "#/home";
    }
  }, true);
})();
