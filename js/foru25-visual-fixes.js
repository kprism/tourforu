(() => {
  "use strict";

  const DATA = window.TOURFORU_DATA || {};

  const PHOTO_SETS = {
    victory: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=88",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=88",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=88",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=88"
    ],
    ceco: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Changwon_Exhibition_Convention_Center_in_2013.jpg/1280px-Changwon_Exhibition_Convention_Center_in_2013.jpg",
    industrial: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=88",
    goodday: "https://tong.visitkorea.or.kr/cms/resource/52/2030852_image2_1.jpg",
    ftz: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=88",
    football: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=88",
    cruise: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=88"
  };

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function patchData() {
    const victory = (DATA.destinations || []).find(item => item.id === "yisunshin-victory-road");
    if (victory) {
      victory.image = PHOTO_SETS.victory[0];
      victory.images = [...PHOTO_SETS.victory];
    }

    const specialImages = [
      PHOTO_SETS.ceco,
      PHOTO_SETS.industrial,
      PHOTO_SETS.goodday,
      PHOTO_SETS.ftz,
      PHOTO_SETS.football,
      PHOTO_SETS.cruise
    ];

    (DATA.specialTours || []).forEach((item, index) => {
      item.image = specialImages[index] || item.image;
      item.id = item.id || `special-${index}`;
      item.gallery = [item.image, PHOTO_SETS.ceco, PHOTO_SETS.goodday].filter(Boolean);
      item.rating = item.rating || (4.7 + ((index % 3) * 0.1)).toFixed(1);
      item.views = item.views || `${(3.2 + index * 1.1).toFixed(1)}만`;
      item.stay = item.stay || "약 1시간 30분";
      item.cost = item.cost || "무료 또는 프로그램별 상이";
      item.highlights = item.highlights || [
        "현재 위치에서 이동이 쉬운 창원형 이색관광",
        "산업·MICE·스포츠·항만을 여행 콘텐츠로 경험",
        "차량·가이드·KEEP 일정과 바로 연결"
      ];
    });
  }

  function renderSpecialDetail(index) {
    const item = (DATA.specialTours || [])[Number(index)];
    if (!item) return;

    const app = document.getElementById("app");
    if (!app) return;

    history.pushState(null, "", `#/special-tour?id=${encodeURIComponent(item.id)}`);

    app.innerHTML = `
      <div class="app-shell foru-special-detail-page">
        <header class="topbar">
          <button class="icon-button" type="button" data-foru-back aria-label="뒤로가기">←</button>
          <div class="brand">
            <small>${escapeHtml(item.category)} · 창원</small>
            <strong>이색관광 상세</strong>
          </div>
          <div class="top-actions">
            <button class="icon-button" type="button" aria-label="검색">🔎</button>
            <button class="icon-button" type="button" data-route="mypage" aria-label="마이페이지">👤</button>
          </div>
        </header>

        <main class="app-main">
          <section class="gallery-slider foru-special-detail-gallery">
            ${(item.gallery || [item.image]).map(src => `
              <div class="gallery-item">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}">
              </div>
            `).join("")}
          </section>

          <section class="destination-intro">
            <span class="tag">${escapeHtml(item.icon)} ${escapeHtml(item.category)}</span>
            <h1>${escapeHtml(item.title)}</h1>
            <p>${escapeHtml(item.description)}</p>
          </section>

          <div class="stat-grid">
            <div class="stat"><small>현 위치 거리</small><strong>${escapeHtml(item.distance)}</strong></div>
            <div class="stat"><small>이동시간</small><strong>${escapeHtml(item.time)}</strong></div>
            <div class="stat"><small>평점</small><strong>★ ${escapeHtml(item.rating)}</strong></div>
            <div class="stat"><small>조회</small><strong>${escapeHtml(item.views)}</strong></div>
          </div>

          <section class="section">
            <div class="section-title">
              <div>
                <h2>이곳에서는 이렇게 여행하세요</h2>
                <p>창원의 산업·문화·행사를 여행자 관점에서 정리했습니다.</p>
              </div>
            </div>

            <div class="travel-highlight-grid">
              ${(item.highlights || []).map((text, idx) => `
                <article class="travel-highlight">
                  <span>${["👀", "🎯", "🧭"][idx] || "✨"}</span>
                  <strong>${["꼭 볼 것", "꼭 경험할 것", "여행 팁"][idx] || "추천"}</strong>
                  <small>${escapeHtml(text)}</small>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="itinerary-card">
            <div class="itinerary-head">
              <div class="itinerary-head-icon">🗺️</div>
              <div>
                <h2>AI 추천 관람 순서</h2>
                <p>현 위치에서 출발하는 반나절 이색관광 동선입니다.</p>
              </div>
            </div>
            <div class="itinerary-list">
              <article><span>도착</span><div><strong>${escapeHtml(item.title)} 입장·안내 확인</strong><p>운영시간과 예약 여부를 먼저 확인합니다.</p></div></article>
              <article><span>40분</span><div><strong>핵심 전시·현장 관람</strong><p>${escapeHtml(item.category)}의 대표 콘텐츠를 집중해서 둘러봅니다.</p></div></article>
              <article><span>30분</span><div><strong>체험·해설 프로그램</strong><p>가이드 또는 현장 프로그램이 있으면 함께 참여합니다.</p></div></article>
              <article><span>마무리</span><div><strong>주변 관광·식사 연결</strong><p>KEEP 목록에서 다음 관광지와 음식점을 선택합니다.</p></div></article>
            </div>
          </section>

          <section class="summary-card">
            <h2 style="margin:0 0 8px;font-size:16px">여행 핵심정보</h2>
            <ul class="summary-list">
              <li><span>예상 체류</span><strong>${escapeHtml(item.stay)}</strong></li>
              <li><span>예상 비용</span><strong>${escapeHtml(item.cost)}</strong></li>
              <li><span>추천 대상</span><strong>가족·단체·산업관광객</strong></li>
              <li><span>차량 연결</span><strong>forU25 콜 연계</strong></li>
            </ul>
          </section>

          <section class="section">
            <div class="detail-action-grid">
              <button class="keep-3d-button" type="button" data-foru-special-keep-full>📌 KEEP</button>
              <button class="primary-button" type="button" data-foru-go-keeper>🧳 키핑 목록에서 일정 선택</button>
            </div>
          </section>
        </main>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function installEvents() {
    document.addEventListener("click", event => {
      const special = event.target.closest("[data-foru-special]");
      if (special) {
        event.preventDefault();
        event.stopImmediatePropagation();
        renderSpecialDetail(special.dataset.foruSpecial);
        return;
      }

      if (event.target.closest("[data-foru-back]")) {
        event.preventDefault();
        location.hash = "#/home";
        return;
      }

      if (event.target.closest("[data-foru-go-keeper]")) {
        location.hash = "#/keeper";
        return;
      }

      const keep = event.target.closest("[data-foru-special-keep-full]");
      if (keep) {
        keep.textContent = "✓ KEEP 완료";
        keep.classList.add("active");
      }
    }, true);
  }

  patchData();
  installEvents();
})();
