(() => {
  "use strict";

  const data = window.TOURFORU_DATA;

  if (!data) {
    console.error("forU25 data를 찾을 수 없습니다.");
    return;
  }

  const victory = (data.destinations || []).find(
    item => item.id === "yisunshin-victory-road"
  );

  if (victory) {
    const localImages = [
      "images/yisunshin/yisunshin-victory-road-01.png",
      "images/yisunshin/yisunshin-victory-road-02.png",
      "images/yisunshin/yisunshin-victory-road-03.png",
      "images/yisunshin/yisunshin-victory-road-04.png"
    ];

    victory.image = localImages[0];
    victory.images = localImages;
  }
})();
