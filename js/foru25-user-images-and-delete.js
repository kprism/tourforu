(() => {
  "use strict";

  const DATA = window.TOURFORU_DATA || {};
  const STORAGE_KEY = "tourforu-prototype-state-v1";
  const USER_VICTORY_IMAGES = [
    "images/yisunshin/yisunshin-victory-road-01.png",
    "images/yisunshin/yisunshin-victory-road-02.png",
    "images/yisunshin/yisunshin-victory-road-03.png",
    "images/yisunshin/yisunshin-victory-road-04.png"
  ];

  function patchVictoryImages() {
    const item = (DATA.destinations || []).find(value => value.id === "yisunshin-victory-road");
    if (!item) return;

    item.image = USER_VICTORY_IMAGES[0];
    item.images = [...USER_VICTORY_IMAGES];
  }

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      console.warn("키핑 상태를 불러오지 못했습니다.", error);
      return {};
    }
  }

  function writeState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function renderKeeperDeleteBar() {
    if (!location.hash.startsWith("#/keeper")) return;

    const main = document.querySelector(".app-main");
    if (!main || main.querySelector("[data-foru-keeper-delete-bar]")) return;

    const firstSection = main.querySelector(".keeper-type-section");
    if (!firstSection) return;

    const state = readState();
    const selectedCount = Array.isArray(state.selectedTripItems)
      ? state.selectedTripItems.length
      : 0;

    const bar = document.createElement("section");
    bar.className = "foru-keeper-delete-bar";
    bar.dataset.foruKeeperDeleteBar = "true";
    bar.innerHTML = `
      <div>
        <strong>선택한 KEEP 관리</strong>
        <small>체크한 항목 ${selectedCount}개를 키핑 목록에서 삭제할 수 있습니다.</small>
      </div>
      <button type="button" data-foru-delete-selected>
        🗑️ 선택 삭제
      </button>
    `;

    firstSection.parentNode.insertBefore(bar, firstSection);
  }

  function deleteSelectedKeeps() {
    const state = readState();
    const selected = Array.isArray(state.selectedTripItems)
      ? state.selectedTripItems
      : [];

    if (!selected.length) {
      alert("먼저 삭제할 항목의 체크박스를 선택해주세요.");
      return;
    }

    if (!confirm(`선택한 ${selected.length}개 항목을 KEEP 목록에서 삭제할까요?`)) {
      return;
    }

    const selectedSet = new Set(selected);
    const kept = Array.isArray(state.keptItems) ? state.keptItems : [];

    state.keptItems = kept.filter(key => !selectedSet.has(key));
    state.selectedTripItems = [];
    writeState(state);

    alert("선택한 KEEP 항목을 삭제했습니다.");

    // 앱 내부 메모리 상태까지 새로 읽도록 현재 해시를 유지한 채 새로고침합니다.
    location.reload();
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-foru-delete-selected]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      deleteSelectedKeeps();
    }
  }, true);

  const observer = new MutationObserver(() => {
    renderKeeperDeleteBar();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("hashchange", () => {
    setTimeout(renderKeeperDeleteBar, 30);
  });

  patchVictoryImages();

  if (location.hash.startsWith("#/home") || location.hash.startsWith("#/destination")) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  setTimeout(renderKeeperDeleteBar, 30);
})();
