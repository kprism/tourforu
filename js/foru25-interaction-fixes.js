(() => {
  "use strict";

  document.addEventListener("click", event => {
    const result = event.target.closest(".foru-search-result[data-id]");

    if (!result) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const id = result.dataset.id;
    const layer = document.querySelector(".foru-search-layer");

    if (layer) {
      layer.remove();
    }

    if (!id) {
      return;
    }

    location.hash = `#/destination?id=${encodeURIComponent(id)}`;
  }, true);
})();
