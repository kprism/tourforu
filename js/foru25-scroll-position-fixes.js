(() => {
  "use strict";

  const PRESERVE_ACTIONS = new Set([
    "like",
    "toggle-keep",
    "toggle-trip-item"
  ]);

  function restoreScroll(position) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: position,
          left: 0,
          behavior: "instant"
        });
      });
    });
  }

  document.addEventListener("click", event => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    if (!PRESERVE_ACTIONS.has(action)) return;

    const scrollPosition = window.scrollY;
    restoreScroll(scrollPosition);
  }, true);
})();
