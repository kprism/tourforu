(() => {
  "use strict";

  const STORAGE_KEY = "tourforu-prototype-state-v1";
  const GUIDE_FEE = 80000;

  function parseMoney(text = "") {
    const value = Number(String(text).replace(/[^0-9]/g, ""));
    return Number.isFinite(value) ? value : 0;
  }

  function formatMoney(value) {
    return `${Number(value).toLocaleString("ko-KR")}원`;
  }

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function patchSummary() {
    if (!location.hash.includes("#/summary")) {
      return;
    }

    const state = getState();
    const hasGuide = Boolean(state.selectedGuide);
    const cards = [...document.querySelectorAll(".summary-card")];

    const costCard = cards.find(card =>
      card.textContent.includes("차량·기사 이용료") &&
      card.textContent.includes("예상 총 여행경비")
    );

    if (!costCard) {
      return;
    }

    const list = costCard.querySelector(".summary-list");
    if (!list) {
      return;
    }

    const rows = [...list.querySelectorAll("li")];
    const vehicleRow = rows.find(row => row.textContent.includes("차량·기사 이용료"));
    const attractionRow = rows.find(row => row.textContent.includes("예상 관광지 비용"));
    const foodRow = rows.find(row => row.textContent.includes("예상 식비"));
    const totalRow = rows.find(row => row.textContent.includes("예상 총 여행경비"));

    if (hasGuide && !list.querySelector(".foru-guide-fee")) {
      const guideRow = document.createElement("li");
      guideRow.className = "foru-guide-fee";
      guideRow.innerHTML = `<span>가이드 이용료</span><strong>${formatMoney(GUIDE_FEE)}</strong>`;

      if (attractionRow) {
        list.insertBefore(guideRow, attractionRow);
      } else if (totalRow) {
        list.insertBefore(guideRow, totalRow);
      } else {
        list.appendChild(guideRow);
      }
    }

    const vehicle = parseMoney(vehicleRow?.querySelector("strong")?.textContent);
    const attraction = parseMoney(attractionRow?.querySelector("strong")?.textContent);
    const food = parseMoney(foodRow?.querySelector("strong")?.textContent);
    const total = vehicle + attraction + food + (hasGuide ? GUIDE_FEE : 0);

    if (totalRow?.querySelector("strong")) {
      totalRow.querySelector("strong").textContent = formatMoney(total);
    }

    const travelSummaryCard = cards.find(card => card.textContent.includes("운행 방식"));
    if (hasGuide && travelSummaryCard) {
      const modeRow = [...travelSummaryCard.querySelectorAll("li")]
        .find(row => row.textContent.includes("운행 방식"));
      const modeValue = modeRow?.querySelector("strong");
      if (modeValue) {
        modeValue.textContent = "가이드 포함";
      }
    }
  }

  function schedulePatch() {
    requestAnimationFrame(() => {
      setTimeout(patchSummary, 30);
    });
  }

  window.addEventListener("hashchange", schedulePatch);
  window.addEventListener("DOMContentLoaded", schedulePatch);
  schedulePatch();
})();
