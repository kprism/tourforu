(() => {
  "use strict";

  const app = document.getElementById("app");
  const data = window.TOURFORU_DATA;

  const state = {
    saved: new Set(["tongyeong-mireuksan", "geoje-windyhill"]),
    liked: new Set(),
    selectedDestination: "tongyeong-mireuksan",
    selectedVehicle: "carnival-premium"
  };

  const routes = {
    home: renderHome,
    destination: renderDestination,
    keeper: renderKeeper,
    call: renderCall,
    vehicles: renderVehicles,
    "vehicle-detail": renderVehicleDetail,
    summary: renderSummary,
    complete: renderComplete,
    review: renderReview,
    mypage: renderMypage,
    driver: renderDriver,
    company: renderCompany,
    admin: renderAdmin
  };

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function routeInfo() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [page = "home", queryString = ""] = hash.split("?");
    return {
      page,
      params: new URLSearchParams(queryString)
    };
  }

  function go(page, params = {}) {
    const query = new URLSearchParams(params).toString();
    location.hash = `#/${page}${query ? `?${query}` : ""}`;
  }

  function shell(content, options = {}) {
    const {
      title = "TOURFORU",
      subtitle = "AI TRAVEL FOR YOU",
      back = false,
      active = "",
      showNav = true
    } = options;

    return `
      <div class="app-shell">
        <header class="topbar">
          <button class="icon-button"
                  type="button"
                  data-action="${back ? "back" : "menu"}"
                  aria-label="${back ? "뒤로가기" : "메뉴"}">
            ${back ? "←" : "☰"}
          </button>

          <div class="brand">
            <small>${escapeHtml(subtitle)}</small>
            <strong>${escapeHtml(title)}</strong>
          </div>

          <div class="top-actions">
            <button class="icon-button"
                    type="button"
                    data-action="search"
                    aria-label="검색">🔎</button>
            <button class="icon-button"
                    type="button"
                    data-route="mypage"
                    aria-label="마이페이지">👤</button>
          </div>
        </header>

        <main class="app-main" id="pageTop">
          ${content}
        </main>

        ${showNav ? bottomNav(active) : ""}
      </div>
    `;
  }

  function bottomNav(active) {
    return `
      <nav class="bottom-nav" aria-label="주요 메뉴">
        <button class="nav-button ${active === "home" ? "active" : ""}"
                type="button"
                data-route="home">
          <span class="nav-icon">🏠</span>
          <span>홈</span>
        </button>

        <button class="nav-button"
                type="button"
                data-action="top">
          <span class="nav-icon">⬆️</span>
          <span>상단</span>
        </button>

        <button class="nav-button ${active === "keeper" ? "active" : ""}"
                type="button"
                data-route="keeper">
          <span class="nav-icon">🧳</span>
          <span>여행키퍼</span>
        </button>

        <button class="nav-button call ${active === "call" ? "active" : ""}"
                type="button"
                data-route="call">
          <span class="nav-icon">🚐</span>
          <span>콜</span>
        </button>
      </nav>
    `;
  }

  function heroCard(item) {
    return `
      <article class="hero-card"
               data-route="destination"
               data-id="${escapeHtml(item.id)}">
        <img src="${escapeHtml(item.image)}"
             alt="${escapeHtml(item.title)}">

        <div class="hero-top">
          <span class="pill">📍 ${escapeHtml(item.city)}</span>
          <span class="pill">실방문 ${escapeHtml(item.visitors)}</span>
        </div>

        <div class="hero-bottom">
          <span class="pill">✨ 지금 떠나기 좋은 곳</span>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.summary)}</p>

          <div class="meta-row">
            <span class="pill">거리 ${escapeHtml(item.distance)}</span>
            <span class="pill">★ ${item.rating}</span>
            <span class="pill">조회 ${escapeHtml(item.views)}</span>
          </div>
        </div>
      </article>
    `;
  }

  function feedCard(item) {
    const liked = state.liked.has(item.id);
    const saved = state.saved.has(item.id);

    return `
      <article class="feed-card">
        <div class="feed-header">
          <div class="feed-user">
            <div class="avatar">🧭</div>
            <div>
              <strong>TOURFORU 경남여행</strong>
              <small>${escapeHtml(item.city)} · AI 추천 여행지</small>
            </div>
          </div>

          <button class="icon-button"
                  style="width:32px;height:32px;font-size:14px"
                  type="button"
                  aria-label="더보기">•••</button>
        </div>

        <div class="feed-media"
             data-route="destination"
             data-id="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.image)}"
               alt="${escapeHtml(item.title)}">

          <div class="feed-overlay-top">
            <span class="pill">${escapeHtml(item.city)} ${escapeHtml(item.district)}</span>
            <span class="pill">👣 ${escapeHtml(item.visitors)}</span>
          </div>

          <div class="feed-overlay-bottom">
            <div class="feed-place">
              <span class="pill">★ ${item.rating} · 조회 ${escapeHtml(item.views)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.distance)} · ${escapeHtml(item.time)} · ${escapeHtml(item.stay)}</p>
            </div>

            <span class="pill">상세보기 ›</span>
          </div>
        </div>

        <div class="feed-actions">
          <div class="feed-actions-left">
            <button class="feed-action"
                    type="button"
                    data-action="like"
                    data-id="${escapeHtml(item.id)}">
              ${liked ? "❤️" : "🤍"} ${liked ? "좋아요" : "공감"}
            </button>

            <button class="feed-action"
                    type="button"
                    data-action="share"
                    data-id="${escapeHtml(item.id)}">
              📤 공유
            </button>
          </div>

          <button class="feed-action"
                  type="button"
                  data-action="save"
                  data-id="${escapeHtml(item.id)}">
            ${saved ? "🧳 저장됨" : "🔖 키퍼"}
          </button>
        </div>

        <div class="feed-caption">
          <strong>${escapeHtml(item.city)}</strong>
          ${escapeHtml(item.summary)}
        </div>

        <div class="tags">
          ${item.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}
        </div>
      </article>
    `;
  }

  function miniCard(item, type = "destination") {
    if (type === "destination") {
      return `
        <article class="mini-card"
                 data-route="destination"
                 data-id="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.image)}"
               alt="${escapeHtml(item.title)}">
          <div class="mini-card-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.city)} · ${escapeHtml(item.distance)} · ${escapeHtml(item.time)}</p>
            <div class="price-row">
              <span class="rating">★ ${item.rating}</span>
              <strong>${escapeHtml(item.cost)}</strong>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="mini-card">
        <img src="${escapeHtml(item.image)}"
             alt="${escapeHtml(item.name)}">
        <div class="mini-card-body">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.distance)} · ${escapeHtml(item.reviews)}</p>
          <div class="price-row">
            <span class="rating">★ ${item.rating}</span>
            <strong>${escapeHtml(item.price)}</strong>
          </div>
        </div>
      </article>
    `;
  }

  function renderHome() {
    const stories = [
      ["🤖", "AI 여행추천", "keeper"],
      ["🚐", "차량호출", "call"],
      ["🏨", "숙박", "destination"],
      ["🍲", "맛집", "destination"],
      ["🎡", "관광지", "destination"],
      ["🎉", "축제", "home"],
      ["🎯", "퀘스트", "mypage"],
      ["🎁", "혜택", "mypage"]
    ];

    const content = `
      <section class="hero-slider">
        ${data.destinations.slice(0, 3).map(heroCard).join("")}
      </section>

      <div class="dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>

      <section class="section compact">
        <div class="story-row">
          ${stories.map(([icon, label, route]) => `
            <button class="story"
                    type="button"
                    data-route="${route}">
              <span class="story-icon">${icon}</span>
              <span>${label}</span>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <div class="ai-banner" data-route="keeper">
          <div class="ai-orb">🧠</div>
          <div>
            <small>TOURFORU AI</small>
            <h2>오늘의 여행 조각을 맞췄어요</h2>
            <p>거리, 체류시간, 평점과 실제 방문 데이터를 바탕으로 경남 여행지를 추천합니다.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <div>
            <h2>📸 지금 떠오르는 여행 피드</h2>
            <p>사진을 누르면 상세페이지로 이동합니다.</p>
          </div>
        </div>

        ${data.destinations.map(feedCard).join("")}
      </section>

      <section class="section soft-blue">
        <div class="section-title">
          <div>
            <h2>🏨 AI 추천 숙박</h2>
            <p>여행지와 가까운 순으로 살펴보세요.</p>
          </div>
          <button class="more-button">더보기 ›</button>
        </div>

        <div class="horizontal-list">
          ${data.hotels.map(item => miniCard(item, "hotel")).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <div>
            <h2>🍲 AI 추천 음식</h2>
            <p>현지 후기와 이동시간을 함께 반영했어요.</p>
          </div>
          <button class="more-button">더보기 ›</button>
        </div>

        <div class="horizontal-list">
          ${data.foods.map(item => miniCard(item, "food")).join("")}
        </div>
      </section>

      <section class="section soft-green">
        <div class="section-title">
          <div>
            <h2>🎬 드라마와 스타가 다녀간 곳</h2>
            <p>이야기가 붙은 여행지는 기억에 더 오래 남습니다.</p>
          </div>
        </div>

        <div class="horizontal-list">
          ${data.destinations.slice().reverse().map(item => miniCard(item)).join("")}
        </div>
      </section>
    `;

    app.innerHTML = shell(content, { active: "home" });
  }

  function findDestination(id) {
    return data.destinations.find(item => item.id === id) || data.destinations[0];
  }

  function renderDestination(params) {
    const item = findDestination(params.get("id") || state.selectedDestination);
    state.selectedDestination = item.id;

    const content = `
      <section class="gallery-slider">
        ${item.images.map(image => `
          <div class="gallery-item">
            <img src="${escapeHtml(image)}"
                 alt="${escapeHtml(item.title)}">
          </div>
        `).join("")}
      </section>

      <section class="destination-intro">
        <span class="tag">${escapeHtml(item.city)} ${escapeHtml(item.district)}</span>
        <h1>${escapeHtml(item.title)}</h1>
        <p>${escapeHtml(item.summary)}</p>

        <div class="tags" style="padding:9px 0 0">
          ${item.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat">
          <small>거리</small>
          <strong>${escapeHtml(item.distance)}</strong>
        </div>
        <div class="stat">
          <small>이동시간</small>
          <strong>${escapeHtml(item.time)}</strong>
        </div>
        <div class="stat">
          <small>예상비용</small>
          <strong>${escapeHtml(item.cost)}</strong>
        </div>
        <div class="stat">
          <small>평점</small>
          <strong>★ ${item.rating}</strong>
        </div>
      </div>


      <section class="section">
        <div class="section-title">
          <div>
            <h2>이곳에서는 이렇게 여행하세요</h2>
            <p>관광지의 핵심 경험을 AI가 세 갈래로 정리했습니다.</p>
          </div>
        </div>

        <div class="travel-highlight-grid">
          <article class="travel-highlight">
            <span>👀</span>
            <strong>꼭 볼 것</strong>
            <small>전망대에서 바다와 섬이 겹쳐지는 풍경 감상</small>
          </article>

          <article class="travel-highlight">
            <span>🍲</span>
            <strong>꼭 먹을 것</strong>
            <small>${escapeHtml(item.city)} 현지 음식과 제철 해산물</small>
          </article>

          <article class="travel-highlight">
            <span>🎯</span>
            <strong>꼭 경험할 것</strong>
            <small>대표 포토존과 지역 고유 체험 코스</small>
          </article>
        </div>
      </section>

      <section class="itinerary-card">
        <div class="itinerary-head">
          <div class="itinerary-head-icon">🗺️</div>
          <div>
            <h2>AI 추천 관광 순서</h2>
            <p>예상 체류시간 ${escapeHtml(item.stay)} 기준</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">도착</span>
          <div>
            <strong>입구·안내소에서 여행 시작</strong>
            <p>주차와 화장실 위치를 먼저 확인하고 대표 동선으로 이동합니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">30분</span>
          <div>
            <strong>대표 경관과 핵심 포토존</strong>
            <p>사람이 몰리기 전에 주요 전망 지점을 먼저 둘러봅니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">90분</span>
          <div>
            <strong>체험·산책·지역 이야기</strong>
            <p>관광지의 역사와 지역 고유 체험을 천천히 즐깁니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">마무리</span>
          <div>
            <strong>주변 음식 또는 카페로 이동</strong>
            <p>이동시간과 다음 목적지를 고려해 가까운 추천 장소로 연결합니다.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">✨</div>
          <div>
            <small>AI 한 줄 안내</small>
            <h2>오후 4시 무렵 풍경이 가장 부드러워요</h2>
            <p>주말에는 오전보다 늦은 오후가 상대적으로 여유롭습니다.</p>
          </div>
        </div>
      </section>

      <section class="section soft-blue">
        <div class="section-title">
          <div>
            <h2>🏨 주변 숙박</h2>
            <p>가격·거리·평점·후기를 한눈에</p>
          </div>
        </div>
        <div class="horizontal-list">
          ${data.hotels.map(item => miniCard(item, "hotel")).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <div>
            <h2>🍲 주변 음식</h2>
            <p>현지 이용자 후기가 많은 순</p>
          </div>
        </div>
        <div class="horizontal-list">
          ${data.foods.map(item => miniCard(item, "food")).join("")}
        </div>
      </section>

      <section class="section soft-green">
        <div class="section-title">
          <div>
            <h2>🎡 함께 둘러볼 관광지</h2>
            <p>카드를 누르면 해당 관광지로 이동합니다.</p>
          </div>
        </div>
        <div class="horizontal-list">
          ${data.destinations
            .filter(destination => destination.id !== item.id)
            .map(destination => miniCard(destination))
            .join("")}
        </div>
      </section>

      <section class="section">
        <button class="primary-button"
                type="button"
                data-route="call">
          🚐 이 관광지를 포함해 차량 찾기
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "관광지 상세",
      subtitle: item.city,
      back: true,
      active: ""
    });
  }

  function renderKeeper() {
    const savedItems = data.destinations.filter(item => state.saved.has(item.id));

    const content = `
      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">🧳</div>
          <div>
            <small>MY TRAVEL KEEPER</small>
            <h2>${savedItems.length}곳을 보관하고 있어요</h2>
            <p>체류시간과 이동동선을 선택하면 AI가 여행 순서를 정리합니다.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <div>
            <h2>저장한 관광지</h2>
            <p>목적지를 복수 선택할 수 있습니다.</p>
          </div>
        </div>

        ${savedItems.length ? savedItems.map(item => `
          <article class="form-card">
            <div style="display:grid;grid-template-columns:82px 1fr;gap:10px">
              <img src="${escapeHtml(item.image)}"
                   alt="${escapeHtml(item.title)}"
                   style="width:82px;height:82px;object-fit:cover;border-radius:13px">

              <div>
                <span class="tag">${escapeHtml(item.city)}</span>
                <h3 style="margin:6px 0 4px;font-size:14px">
                  ${escapeHtml(item.title)}
                </h3>
                <p style="margin:0;color:var(--muted);font-size:9px">
                  ${escapeHtml(item.time)} · 체류 ${escapeHtml(item.stay)}
                </p>

                <div style="display:flex;margin-top:8px;gap:6px">
                  <button class="feed-action"
                          type="button"
                          data-route="destination"
                          data-id="${escapeHtml(item.id)}">상세</button>
                  <button class="feed-action"
                          type="button"
                          data-action="remove-save"
                          data-id="${escapeHtml(item.id)}">삭제</button>
                </div>
              </div>
            </div>
          </article>
        `).join("") : `
          <div class="empty-state">
            <div class="ai-orb">🗺️</div>
            <h2>아직 저장한 여행지가 없어요</h2>
            <p>홈에서 마음에 드는 관광지를 여행키퍼에 담아보세요.</p>
          </div>
        `}
      </section>

      <section class="section">
        <button class="primary-button"
                type="button"
                data-route="call">
          ✨ 선택한 장소로 AI 일정 만들기
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "여행키퍼",
      subtitle: "KEEP YOUR JOURNEY",
      active: "keeper"
    });
  }

  function renderCall() {
    const savedItems = data.destinations.filter(item => state.saved.has(item.id));

    const content = `
      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">🚐</div>
          <div>
            <small>SMART VEHICLE MATCHING</small>
            <h2>여행 인원과 짐을 알려주세요</h2>
            <p>목적지와 여행 조건을 바탕으로 맞는 차량을 추천합니다.</p>
          </div>
        </div>
      </section>

      <form class="form-card" id="callForm">
        <div class="form-group">
          <label for="people">사람은 몇 명인가요?</label>
          <select class="form-control" id="people" name="people">
            <option value="1">1명</option>
            <option value="2">2명</option>
            <option value="4" selected>4명</option>
            <option value="6">5~6명</option>
            <option value="10">7명 이상</option>
          </select>
        </div>

        <div class="form-group">
          <label for="carrier">캐리어와 큰 짐은 몇 개인가요?</label>
          <select class="form-control" id="carrier" name="carrier">
            <option value="0">없음</option>
            <option value="1">1개</option>
            <option value="2" selected>2개</option>
            <option value="3">3개 이상</option>
          </select>
        </div>

        <div class="form-group">
          <label>운행 방식</label>
          <div class="check-grid">
            <div class="check-card">
              <input type="radio"
                     id="withDriver"
                     name="driveType"
                     value="driver"
                     checked>
              <label for="withDriver">🧑‍✈️ 기사 포함</label>
            </div>

            <div class="check-card">
              <input type="radio"
                     id="selfDrive"
                     name="driveType"
                     value="self">
              <label for="selfDrive">🪪 직접 운전</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>목적지 선택</label>

          ${savedItems.map((item, index) => `
            <div class="check-card" style="margin-bottom:7px">
              <input type="checkbox"
                     id="destination-${index}"
                     name="destination"
                     value="${escapeHtml(item.id)}"
                     ${index < 2 ? "checked" : ""}>
              <label for="destination-${index}">
                <span>📍</span>
                <span>
                  <strong style="display:block;font-size:11px">
                    ${escapeHtml(item.title)}
                  </strong>
                  <small style="color:var(--muted)">
                    체류 ${escapeHtml(item.stay)}
                  </small>
                </span>
              </label>
            </div>
          `).join("")}
        </div>

        <button class="primary-button" type="submit">
          🤖 AI 추천 차량 보기
        </button>
      </form>
    `;

    app.innerHTML = shell(content, {
      title: "플로팅 콜",
      subtitle: "CALL & TOUR",
      back: true,
      active: "call"
    });
  }

  function renderVehicles() {
    const content = `
      <section class="section">
        <div class="section-title">
          <div>
            <h2>🚐 추천 차량 ${data.vehicles.length}대</h2>
            <p>4명 · 캐리어 2개 · 기사 포함 기준</p>
          </div>
        </div>
      </section>

      ${data.vehicles.map(vehicle => `
        <article class="vehicle-card"
                 data-route="vehicle-detail"
                 data-id="${escapeHtml(vehicle.id)}">
          <img src="${escapeHtml(vehicle.image)}"
               alt="${escapeHtml(vehicle.name)}">

          <div class="vehicle-badges">
            ${vehicle.badge ? `
              <span class="badge ${vehicle.badge === "광고" ? "ad" : ""}">
                ${escapeHtml(vehicle.badge)}
              </span>
            ` : ""}
            <span class="badge">${escapeHtml(vehicle.fit)}</span>
          </div>

          <div class="vehicle-body">
            <div class="vehicle-title-row">
              <h2>${escapeHtml(vehicle.name)}</h2>
              <strong>${escapeHtml(vehicle.price)}</strong>
            </div>

            <p>
              출차지 ${escapeHtml(vehicle.start)}
              · 도착 ${escapeHtml(vehicle.arrival)}
            </p>
            <p>
              이용 ${escapeHtml(vehicle.uses)}
              · ★ ${vehicle.rating}
              · ${escapeHtml(vehicle.reviews)}
            </p>
          </div>
        </article>
      `).join("")}
    `;

    app.innerHTML = shell(content, {
      title: "추천 차량",
      subtitle: "AI VEHICLE MATCH",
      back: true,
      active: ""
    });
  }

  function findVehicle(id) {
    return data.vehicles.find(vehicle => vehicle.id === id) || data.vehicles[0];
  }

  function renderVehicleDetail(params) {
    const vehicle = findVehicle(params.get("id") || state.selectedVehicle);
    state.selectedVehicle = vehicle.id;

    const content = `
      <section class="page-hero">
        <img src="${escapeHtml(vehicle.image)}"
             alt="${escapeHtml(vehicle.name)}">

        <div class="page-hero-content">
          <span class="pill">${escapeHtml(vehicle.fit)}</span>
          <h1>${escapeHtml(vehicle.name)}</h1>
          <p>
            출차지 ${escapeHtml(vehicle.start)}
            · 약 ${escapeHtml(vehicle.arrival)}
          </p>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat">
          <small>가격</small>
          <strong>${escapeHtml(vehicle.price)}</strong>
        </div>
        <div class="stat">
          <small>이용횟수</small>
          <strong>${escapeHtml(vehicle.uses)}</strong>
        </div>
        <div class="stat">
          <small>평점</small>
          <strong>★ ${vehicle.rating}</strong>
        </div>
        <div class="stat">
          <small>후기</small>
          <strong>${escapeHtml(vehicle.reviews)}</strong>
        </div>
      </div>

      <section class="summary-card">
        <h2 style="margin:0 0 8px;font-size:16px">차량 안내</h2>

        <ul class="summary-list">
          <li><span>탑승 가능 인원</span><strong>최대 9명</strong></li>
          <li><span>캐리어 적재</span><strong>대형 3개</strong></li>
          <li><span>운전 방식</span><strong>전문 기사 포함</strong></li>
          <li><span>차량 상태</span><strong>최근 점검 완료</strong></li>
          <li><span>취소 규정</span><strong>출발 48시간 전 무료</strong></li>
        </ul>
      </section>

      <section class="section">
        <button class="primary-button"
                type="button"
                data-route="summary">
          🧾 이 차량으로 여행요약 확인
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "차량 상세",
      subtitle: "VEHICLE DETAIL",
      back: true,
      active: ""
    });
  }

  function renderSummary() {
    const vehicle = findVehicle(state.selectedVehicle);
    const destinations = data.destinations.filter(item => state.saved.has(item.id)).slice(0, 2);

    const content = `
      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">🧾</div>
          <div>
            <small>FINAL CHECK</small>
            <h2>결제 전 여행내용을 확인하세요</h2>
            <p>목적지, 차량, 시간과 예상비용이 맞는지 마지막으로 확인합니다.</p>
          </div>
        </div>
      </section>

      <section class="itinerary-card">
        <div class="itinerary-head">
          <div class="itinerary-head-icon">🤖</div>
          <div>
            <h2>TOURFORU AI 자동 여행일정</h2>
            <p>선택 장소·이동시간·체류시간을 반영한 추천안입니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">08:30</span>
          <div>
            <strong>기사 도착 및 출발 준비</strong>
            <p>탑승 인원과 짐을 확인하고 첫 번째 목적지로 출발합니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">09:25</span>
          <div>
            <strong>${escapeHtml(destinations[0]?.title || "첫 번째 관광지")}</strong>
            <p>대표 전망·포토존·핵심 체험을 중심으로 약 2시간 둘러봅니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">11:40</span>
          <div>
            <strong>AI 추천 현지 점심</strong>
            <p>이동 동선 안에서 평점과 실제 방문 후기가 높은 음식점을 추천합니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">13:10</span>
          <div>
            <strong>${escapeHtml(destinations[1]?.title || "두 번째 관광지")}</strong>
            <p>첫 관광지와 겹치지 않는 체험과 산책 코스로 구성합니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">15:10</span>
          <div>
            <strong>카페·기념품·휴식</strong>
            <p>귀가 전 지역 특산품과 전망 카페를 선택적으로 방문합니다.</p>
          </div>
        </div>

        <div class="itinerary-step">
          <span class="itinerary-time">17:00</span>
          <div>
            <strong>여행 종료 및 도착 예정</strong>
            <p>교통 상황에 따라 실제 도착 예정시간을 다시 안내합니다.</p>
          </div>
        </div>
      </section>

      <section class="summary-card">
        <h2 style="margin:0 0 8px;font-size:16px">여행 요약</h2>

        <ul class="summary-list">
          <li><span>여행일</span><strong>2026년 8월 15일</strong></li>
          <li><span>탑승 인원</span><strong>4명</strong></li>
          <li><span>캐리어</span><strong>2개</strong></li>
          <li><span>운행 방식</span><strong>기사 포함</strong></li>
          <li><span>선택 차량</span><strong>${escapeHtml(vehicle.name)}</strong></li>
          <li><span>출차 예정</span><strong>오전 8시 30분</strong></li>
        </ul>
      </section>

      <section class="summary-card">
        <h2 style="margin:0 0 8px;font-size:16px">목적지</h2>

        <ul class="summary-list">
          ${destinations.map((item, index) => `
            <li>
              <span>${index + 1}번째</span>
              <strong>${escapeHtml(item.title)} · ${escapeHtml(item.stay)}</strong>
            </li>
          `).join("")}
        </ul>
      </section>

      <section class="summary-card">
        <div class="map-placeholder">
          <div class="map-route"></div>
          <span class="map-pin start">🚐</span>
          <span class="map-pin end">🏁</span>
        </div>
      </section>

      <section class="summary-card">
        <ul class="summary-list">
          <li><span>차량·기사 이용료</span><strong>${escapeHtml(vehicle.price)}</strong></li>
          <li><span>예상 관광지 비용</span><strong>36,000원</strong></li>
          <li><span>예상 식비</span><strong>100,000원</strong></li>
          <li><span>예상 총 여행경비</span><strong>334,000원</strong></li>
        </ul>
      </section>

      <section class="section">
        <button class="primary-button"
                type="button"
                data-action="payment">
          💳 토스페이먼츠 결제하기
        </button>

        <p style="margin:8px 0;text-align:center;color:var(--muted);font-size:9px">
          현재는 프로토타입이므로 실제 결제가 진행되지 않습니다.
        </p>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "여행 요약",
      subtitle: "TRIP SUMMARY",
      back: true,
      active: ""
    });
  }

  function renderComplete() {
    const content = `
      <div class="success-orb">✅</div>

      <section class="center-message">
        <h1>여행 예약이 완료됐어요</h1>
        <p>
          예약내용과 기사 안심번호는 카카오톡 알림으로 전달될 예정입니다.
        </p>
      </section>

      <section class="summary-card">
        <ul class="summary-list">
          <li><span>예약번호</span><strong>TFU-260815-0824</strong></li>
          <li><span>출발예정</span><strong>8월 15일 오전 8시 30분</strong></li>
          <li><span>기사</span><strong>김투어 기사</strong></li>
          <li><span>안심번호</span><strong>0504-1234-5678</strong></li>
          <li><span>예상 이동시간</span><strong>총 3시간 20분</strong></li>
          <li><span>예상 체류시간</span><strong>총 3시간 30분</strong></li>
        </ul>
      </section>

      <section class="summary-card">
        <h2 style="margin:0 0 8px;font-size:16px">🗺️ 여행 동선</h2>
        <div class="map-placeholder">
          <div class="map-route"></div>
          <span class="map-pin start">🏠</span>
          <span class="map-pin end">🌊</span>
        </div>
      </section>

      <section class="summary-card">
        <h2 style="margin:0 0 8px;font-size:16px">꼭 경험할 것</h2>
        <div class="tags" style="padding:0">
          <span class="tag">🎬 드라마 촬영지</span>
          <span class="tag">🍲 현지 바다 한상</span>
          <span class="tag">🚠 미륵산 케이블카</span>
          <span class="tag">📸 노을 사진 명소</span>
        </div>
      </section>

      <section class="section">
        <button class="primary-button"
                type="button"
                data-route="home">
          🏠 홈으로 돌아가기
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "예약 완료",
      subtitle: "BOOKING COMPLETE",
      back: false,
      active: "",
      showNav: false
    });
  }

  function renderReview() {
    const content = `
      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">⭐</div>
          <div>
            <small>TRIP REVIEW</small>
            <h2>여행은 어떠셨나요?</h2>
            <p>관광지와 기사 후기를 남기면 다음 여행 혜택을 드립니다.</p>
          </div>
        </div>
      </section>

      <form class="form-card" id="reviewForm">
        <div class="form-group">
          <label>관광지 평점</label>
          <select class="form-control">
            <option>★★★★★ 매우 만족</option>
            <option>★★★★ 만족</option>
            <option>★★★ 보통</option>
          </select>
        </div>

        <div class="form-group">
          <label>기사 평점</label>
          <select class="form-control">
            <option>★★★★★ 매우 만족</option>
            <option>★★★★ 만족</option>
            <option>★★★ 보통</option>
          </select>
        </div>

        <div class="form-group">
          <label>후기</label>
          <textarea class="form-control"
                    rows="5"
                    placeholder="여행 경험을 남겨주세요."></textarea>
        </div>

        <div class="check-card" style="margin-bottom:12px">
          <input type="checkbox" id="newsletter" checked>
          <label for="newsletter">💌 여행소식지 받아보기</label>
        </div>

        <button class="primary-button" type="submit">
          🎁 후기 남기고 혜택 받기
        </button>
      </form>
    `;

    app.innerHTML = shell(content, {
      title: "여행 후기",
      subtitle: "REVIEW & BENEFIT",
      back: true,
      active: ""
    });
  }

  function renderMypage() {
    const content = `
      <section class="profile-card">
        <div class="profile-head">
          <div class="profile-avatar">🧑‍💼</div>
          <div>
            <span class="tag">여행자 Lv.3</span>
            <h1>TOURFORU 회원</h1>
            <p>총 체류 32시간 · 실제 이용 6회 · 2박 3일 여행자</p>
          </div>
        </div>
      </section>

      <section class="dashboard-grid">
        <article class="dashboard-card">
          <span>👀</span>
          <small>둘러본 곳</small>
          <strong>24</strong>
        </article>
        <article class="dashboard-card">
          <span>👣</span>
          <small>가본 곳</small>
          <strong>8</strong>
        </article>
        <article class="dashboard-card">
          <span>🧳</span>
          <small>여행키퍼</small>
          <strong>${state.saved.size}</strong>
        </article>
        <article class="dashboard-card">
          <span>🎯</span>
          <small>퀘스트 달성</small>
          <strong>7</strong>
        </article>
      </section>

      <section class="menu-list">
        <button class="menu-item" data-route="keeper">
          <span>
            <strong>🧳 저장한 여행지</strong>
            <small>여행키퍼 관리</small>
          </span>
          <span>›</span>
        </button>

        <button class="menu-item" data-route="review">
          <span>
            <strong>⭐ 후기와 평점</strong>
            <small>여행지·기사 평가</small>
          </span>
          <span>›</span>
        </button>

        <button class="menu-item" data-route="driver">
          <span>
            <strong>🧑‍✈️ 기사 화면 샘플</strong>
            <small>기사 등록정보와 이용현황</small>
          </span>
          <span>›</span>
        </button>

        <button class="menu-item" data-route="company">
          <span>
            <strong>🏢 업체 화면 샘플</strong>
            <small>보유차량과 배차정보</small>
          </span>
          <span>›</span>
        </button>

        <button class="menu-item" data-route="admin">
          <span>
            <strong>🛠️ 관리자 화면 샘플</strong>
            <small>회원·예약·광고 관리</small>
          </span>
          <span>›</span>
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "마이페이지",
      subtitle: "MY TOURFORU",
      back: true,
      active: ""
    });
  }

  function renderDriver() {
    const content = `
      <section class="profile-card">
        <div class="profile-head">
          <div class="profile-avatar">🧑‍✈️</div>
          <div>
            <span class="tag">인증 기사</span>
            <h1>김투어 기사</h1>
            <p>카니발 9인승 · 2025년식 · 창원 성산구 출차</p>
          </div>
        </div>
      </section>

      <section class="summary-card">
        <ul class="summary-list">
          <li><span>운전면허</span><strong>확인 완료</strong></li>
          <li><span>차량번호</span><strong>12가 3456</strong></li>
          <li><span>누적 이용</span><strong>482회</strong></li>
          <li><span>누적 수익</span><strong>38,420,000원</strong></li>
          <li><span>평점</span><strong>★ 4.9</strong></li>
        </ul>
      </section>

      <section class="dashboard-grid">
        <article class="dashboard-card">
          <span>📅</span>
          <small>이번 달 운행</small>
          <strong>18건</strong>
        </article>
        <article class="dashboard-card">
          <span>💰</span>
          <small>이번 달 수익</small>
          <strong>2,840,000원</strong>
        </article>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "기사 프로필",
      subtitle: "DRIVER",
      back: true,
      active: ""
    });
  }

  function renderCompany() {
    const content = `
      <section class="profile-card">
        <div class="profile-head">
          <div class="profile-avatar">🏢</div>
          <div>
            <span class="tag">운수업체</span>
            <h1>경남투어모빌리티</h1>
            <p>개업 2022년 4월 · 창원시 성산구</p>
          </div>
        </div>
      </section>

      <section class="summary-card">
        <ul class="summary-list">
          <li><span>사업자번호</span><strong>123-45-67890</strong></li>
          <li><span>보유차량</span><strong>12대</strong></li>
          <li><span>등록기사</span><strong>9명</strong></li>
          <li><span>오늘 배차</span><strong>6건</strong></li>
        </ul>
      </section>

      <section class="section">
        <div class="section-title">
          <div>
            <h2>등록 차량</h2>
            <p>차종·차번·소유자 정보를 관리합니다.</p>
          </div>
        </div>

        ${data.vehicles.map(vehicle => `
          <article class="form-card">
            <strong style="font-size:13px">${escapeHtml(vehicle.name)}</strong>
            <p style="margin:5px 0;color:var(--muted);font-size:10px">
              차량번호 12가 3456 · 소유자 김투어 · 정상운행
            </p>
          </article>
        `).join("")}
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "업체 관리",
      subtitle: "COMPANY",
      back: true,
      active: ""
    });
  }

  function renderAdmin() {
    const content = `
      <section class="section">
        <div class="ai-banner">
          <div class="ai-orb">🛠️</div>
          <div>
            <small>TOURFORU ADMIN</small>
            <h2>운영현황을 한눈에 확인합니다</h2>
            <p>회원, 기사, 업체, 예약, 배차와 광고를 관리하는 샘플 화면입니다.</p>
          </div>
        </div>
      </section>

      <section class="dashboard-grid">
        <article class="dashboard-card">
          <span>👥</span>
          <small>전체 회원</small>
          <strong>12,842</strong>
        </article>
        <article class="dashboard-card">
          <span>🧑‍✈️</span>
          <small>등록 기사</small>
          <strong>326</strong>
        </article>
        <article class="dashboard-card">
          <span>🏢</span>
          <small>등록 업체</small>
          <strong>47</strong>
        </article>
        <article class="dashboard-card">
          <span>🚐</span>
          <small>오늘 예약</small>
          <strong>84</strong>
        </article>
        <article class="dashboard-card">
          <span>📣</span>
          <small>진행 광고</small>
          <strong>18</strong>
        </article>
        <article class="dashboard-card">
          <span>💳</span>
          <small>오늘 결제</small>
          <strong>18,420,000원</strong>
        </article>
      </section>

      <section class="menu-list">
        <button class="menu-item">
          <span>
            <strong>회원·본인인증 관리</strong>
            <small>국내회원·외국인 인증 검토</small>
          </span>
          <span>›</span>
        </button>
        <button class="menu-item">
          <span>
            <strong>기사·면허·차량 검증</strong>
            <small>기사 등록과 운행자격 관리</small>
          </span>
          <span>›</span>
        </button>
        <button class="menu-item">
          <span>
            <strong>예약·배차·결제 관리</strong>
            <small>실시간 여행 주문 현황</small>
          </span>
          <span>›</span>
        </button>
        <button class="menu-item">
          <span>
            <strong>광고 입찰 관리</strong>
            <small>광고·최적합·적합 노출 관리</small>
          </span>
          <span>›</span>
        </button>
      </section>
    `;

    app.innerHTML = shell(content, {
      title: "관리자",
      subtitle: "ADMIN DASHBOARD",
      back: true,
      active: ""
    });
  }

  function renderCurrentRoute() {
    const { page, params } = routeInfo();
    const renderer = routes[page] || routes.home;
    renderer(params);
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", event => {
    const routeTarget = event.target.closest("[data-route]");
    const actionTarget = event.target.closest("[data-action]");

    if (routeTarget) {
      const route = routeTarget.dataset.route;
      const id = routeTarget.dataset.id;

      if (route === "destination" && id) {
        state.selectedDestination = id;
        go(route, { id });
        return;
      }

      if (route === "vehicle-detail" && id) {
        state.selectedVehicle = id;
        go(route, { id });
        return;
      }

      go(route);
      return;
    }

    if (!actionTarget) {
      return;
    }

    const action = actionTarget.dataset.action;
    const id = actionTarget.dataset.id;

    if (action === "back") {
      history.back();
      return;
    }

    if (action === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (action === "like") {
      state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
      renderCurrentRoute();
      return;
    }

    if (action === "save") {
      state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
      renderCurrentRoute();
      return;
    }

    if (action === "remove-save") {
      state.saved.delete(id);
      renderCurrentRoute();
      return;
    }

    if (action === "share") {
      alert("공유 기능은 다음 단계에서 연결합니다.");
      return;
    }

    if (action === "search") {
      alert("관광지 통합검색 화면은 다음 단계에서 추가합니다.");
      return;
    }

    if (action === "menu") {
      go("mypage");
      return;
    }

    if (action === "payment") {
      go("complete");
    }
  });

  document.addEventListener("submit", event => {
    event.preventDefault();

    if (event.target.id === "callForm") {
      go("vehicles");
      return;
    }

    if (event.target.id === "reviewForm") {
      alert("후기가 저장된 샘플 상태입니다.");
      go("mypage");
    }
  });

  window.addEventListener("hashchange", renderCurrentRoute);

  if (!location.hash) {
    location.hash = "#/home";
  } else {
    renderCurrentRoute();
  }
})();
