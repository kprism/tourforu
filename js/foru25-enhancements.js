(() => {
  "use strict";

  const DATA = window.TOURFORU_DATA || {};

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentRoute() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [page = "home", query = ""] = hash.split("?");
    return { page, params: new URLSearchParams(query) };
  }

  function replaceBrandText(root = document.body) {
    document.title = "forU25";
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue && node.nodeValue.includes("TOURFORU")) {
        node.nodeValue = node.nodeValue.replaceAll("TOURFORU", "forU25");
      }
    });
  }

  function injectSpecialTourism() {
    if (currentRoute().page !== "home") return;
    if (document.querySelector("[data-foru-special-section]")) return;

    const heading = [...document.querySelectorAll("h2")]
      .find(node => node.textContent.includes("지금 떠오르는 여행 피드"));
    const feedSection = heading?.closest("section");
    if (!feedSection) return;

    const cards = (DATA.specialTours || []).map((item, index) => `
      <button class="foru-special-card" type="button" data-foru-special="${index}">
        <div class="foru-special-media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
          <span class="foru-special-badge">${escapeHtml(item.icon)} ${escapeHtml(item.category)}</span>
        </div>
        <div class="foru-special-body">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.description)}</p>
          <small>${escapeHtml(item.distance)} · ${escapeHtml(item.time)}</small>
          <span class="foru-keep-chip">📌 KEEP</span>
        </div>
      </button>
    `).join("");

    const section = document.createElement("section");
    section.className = "section foru-special-shell";
    section.dataset.foruSpecialSection = "true";
    section.innerHTML = `
      <div class="foru-special-inner">
        <div class="section-title">
          <div>
            <h2>✨ 현 위치 이색관광</h2>
            <p>현재 위치 창원에서 만나는 MICE·산업·스포츠·크루즈 여행</p>
          </div>
          <span class="foru-location-chip">📍 창원</span>
        </div>
        <div class="foru-special-list">${cards}</div>
      </div>
    `;
    feedSection.parentNode.insertBefore(section, feedSection);
  }

  function enhanceVictoryDetail() {
    const { page, params } = currentRoute();
    if (page !== "destination") return;
    const id = params.get("id") || localStorage.getItem("foru25-last-destination");
    if (id !== "yisunshin-victory-road") return;
    if (document.querySelector("[data-victory-detail]")) return;

    const item = (DATA.destinations || []).find(entry => entry.id === id);
    const statGrid = document.querySelector(".stat-grid");
    if (!item || !statGrid) return;

    const section = document.createElement("section");
    section.className = "section victory-detail";
    section.dataset.victoryDetail = "true";
    section.innerHTML = `
      <div class="victory-lead">
        <span>⚓ 대표 역사 걷기여행</span>
        <h2>12개 승전길로 만나는 이순신의 바다</h2>
        <p>${escapeHtml(item.introduction)}</p>
      </div>

      <div class="victory-highlight-grid">
        ${(item.highlights || []).map(highlight => `
          <article>
            <span>${escapeHtml(highlight.icon)}</span>
            <strong>${escapeHtml(highlight.title)}</strong>
            <p>${escapeHtml(highlight.description)}</p>
          </article>
        `).join("")}
      </div>

      <div class="victory-route-head">
        <div>
          <h2>6개 시·군, 12개 승전 노선</h2>
          <p>원하는 지역과 체력에 맞춰 구간을 골라 걸을 수 있습니다.</p>
        </div>
        <strong>${escapeHtml(item.totalDistance)}</strong>
      </div>

      <div class="victory-route-list">
        ${(item.battleRoutes || []).map(route => `
          <article>
            <span>${escapeHtml(route.region)}</span>
            <div>
              <strong>${escapeHtml(route.routes)}</strong>
              <small>${escapeHtml(route.distance)}</small>
            </div>
          </article>
        `).join("")}
      </div>

      <div class="victory-program">
        <span>🥾</span>
        <div>
          <strong>승전길 원정대</strong>
          <p>${escapeHtml(item.expedition)}</p>
        </div>
      </div>

      <div class="victory-connections">
        <strong>연계 걷기길</strong>
        <div>${(item.connections || []).map(value => `<span>${escapeHtml(value)}</span>`).join("")}</div>
      </div>
    `;
    statGrid.insertAdjacentElement("afterend", section);

    document.querySelectorAll(".travel-highlight small").forEach((node, index) => {
      const texts = [
        "옥포·한산도·노량 등 주요 승전지와 남해안 해전의 현장",
        "항구와 전통시장 주변의 제철 해산물과 경남 향토음식",
        "해안 걷기·승전 이야기·노선 인증사진을 남기는 역사여행"
      ];
      if (texts[index]) node.textContent = texts[index];
    });
  }

  function enhanceCallForm() {
    if (currentRoute().page !== "call") return;
    const form = document.querySelector("#callForm");
    if (!form || form.dataset.foruPeopleEnhanced) return;

    const people = form.querySelector("#people");
    const group = people?.closest(".form-group");
    if (!group) return;

    group.innerHTML = `
      <label>여행 인원을 선택해주세요</label>
      <p class="foru-people-guide">총 탑승 인원은 4명부터 10명까지 선택할 수 있습니다.</p>
      <div class="foru-people-grid">
        <label><span>성인</span><select class="form-control" id="adultCount">${Array.from({length: 11}, (_, i) => `<option value="${i}">${i}명</option>`).join("")}</select></label>
        <label><span>청소년 및 영유아</span><select class="form-control" id="childCount">${Array.from({length: 11}, (_, i) => `<option value="${i}">${i}명</option>`).join("")}</select></label>
      </div>
      <div class="foru-total-people">현재 총인원 <strong>0명</strong></div>
    `;

    const adult = group.querySelector("#adultCount");
    const child = group.querySelector("#childCount");
    const totalBox = group.querySelector(".foru-total-people strong");
    const saved = JSON.parse(localStorage.getItem("foru25-people") || '{"adult":4,"child":0}');
    adult.value = String(saved.adult ?? 4);
    child.value = String(saved.child ?? 0);

    function updateTotal() {
      const total = Number(adult.value) + Number(child.value);
      totalBox.textContent = `${total}명`;
      totalBox.parentElement.classList.toggle("invalid", total < 4 || total > 10);
      localStorage.setItem("foru25-people", JSON.stringify({ adult: Number(adult.value), child: Number(child.value) }));
    }

    adult.addEventListener("change", updateTotal);
    child.addEventListener("change", updateTotal);
    updateTotal();
    form.dataset.foruPeopleEnhanced = "true";

    form.addEventListener("submit", event => {
      const total = Number(adult.value) + Number(child.value);
      if (total < 4 || total > 10) {
        event.preventDefault();
        event.stopImmediatePropagation();
        alert("총 탑승 인원은 4명 이상 10명 이하로 선택해주세요.");
      }
    }, true);
  }

  function openSpecialModal(index) {
    const item = (DATA.specialTours || [])[Number(index)];
    if (!item) return;
    document.querySelector(".foru-special-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "foru-special-modal";
    modal.innerHTML = `
      <div class="foru-special-dialog">
        <button type="button" class="foru-special-close" aria-label="닫기">×</button>
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
        <span>${escapeHtml(item.icon)} ${escapeHtml(item.category)}</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description)}</p>
        <div><strong>${escapeHtml(item.distance)}</strong><strong>${escapeHtml(item.time)}</strong></div>
        <button type="button" class="primary-button foru-special-keep">📌 이번 여행에 KEEP</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function enhance() {
    replaceBrandText();
    injectSpecialTourism();
    enhanceVictoryDetail();
    enhanceCallForm();
  }

  document.addEventListener("click", event => {
    const special = event.target.closest("[data-foru-special]");
    if (special) {
      openSpecialModal(special.dataset.foruSpecial);
      return;
    }
    if (event.target.closest(".foru-special-close") || event.target.classList.contains("foru-special-modal")) {
      document.querySelector(".foru-special-modal")?.remove();
      return;
    }
    if (event.target.closest(".foru-special-keep")) {
      event.target.closest(".foru-special-keep").textContent = "✓ KEEP 완료";
    }
    const destination = event.target.closest('[data-route="destination"][data-id]');
    if (destination) localStorage.setItem("foru25-last-destination", destination.dataset.id);
  }, true);

  const observer = new MutationObserver(() => {
    clearTimeout(window.__foru25EnhanceTimer);
    window.__foru25EnhanceTimer = setTimeout(enhance, 20);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => setTimeout(enhance, 30));
  setTimeout(enhance, 30);
})();
