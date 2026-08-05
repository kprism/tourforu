(() => {
  "use strict";

  const data = window.TOURFORU_DATA;
  if (!data) return;

  const victoryImages = [
    "images/yisunshin/yisunshin-victory-road-01.svg",
    "images/yisunshin/yisunshin-victory-road-02.svg",
    "images/yisunshin/yisunshin-victory-road-03.svg",
    "images/yisunshin/yisunshin-victory-road-04.svg"
  ];

  const victoryRoad = {
    id: "yisunshin-victory-road",
    city: "경상남도",
    district: "남해안 6개 시·군",
    title: "이순신 승전길",
    summary: "창원·거제·통영·사천·고성·남해의 12개 승전지를 잇는 159.8km 역사 걷기여행",
    distance: "159.8km",
    time: "12개 노선",
    rating: 4.9,
    views: "21.8만",
    visitors: "2,526명",
    stay: "구간별 반나절~다일",
    cost: "구간별 상이",
    image: victoryImages[0],
    images: victoryImages,
    tags: ["이순신", "역사여행", "남해안", "걷기여행"],
    productType: "linked-route",
    totalDistance: "159.8km",
    routeCount: 12,
    regionCount: 6,
    introduction: "이순신 승전길은 임진왜란 당시 이순신 장군의 주요 승전지를 남해안 관광지와 연결한 역사 걷기여행 상품입니다. 경남 6개 시·군의 바다와 마을, 해전의 현장을 따라 걸으며 위대한 자연과 승전의 역사를 함께 만날 수 있습니다.",
    highlights: [
      { icon: "⚔️", title: "해전의 현장", description: "합포·옥포·한산도·사천·당항포·노량 등 주요 승전지를 걷습니다." },
      { icon: "🌊", title: "남해안 풍경", description: "섬과 바다, 항구와 해안길이 이어지는 경남 남해안을 만납니다." },
      { icon: "🥾", title: "구간 선택 여행", description: "반나절 코스부터 여러 시·군을 잇는 다일 코스까지 선택할 수 있습니다." }
    ],
    battleRoutes: [
      { region: "창원", routes: "합포해전 진해·마산, 안골포해전, 웅포해전", distance: "36.9km" },
      { region: "거제", routes: "옥포해전, 율포해전", distance: "19.3km" },
      { region: "통영", routes: "당포해전, 한산도해전", distance: "46.0km" },
      { region: "사천", routes: "사천해전", distance: "20.6km" },
      { region: "고성", routes: "적진포해전, 당항포해전", distance: "26.1km" },
      { region: "남해", routes: "노량해전", distance: "10.9km" }
    ],
    connections: ["남파랑길", "백의종군로", "수군재건로"],
    expedition: "학생·가족·길 전문가가 12개 노선을 직접 탐방하며 접근성, 안전성, 노선 편의성을 함께 점검하는 승전길 원정대 프로그램이 운영됩니다."
  };

  data.destinations = data.destinations || [];
  const oldIndex = data.destinations.findIndex(item => item.id === victoryRoad.id);
  if (oldIndex >= 0) data.destinations.splice(oldIndex, 1);
  data.destinations.unshift(victoryRoad);

  data.specialTours = [
    { category: "MICE", icon: "🏢", title: "창원컨벤션센터", description: "전시·회의·국제행사가 열리는 창원의 대표 MICE 거점", distance: "현 위치 2.4km", time: "차량 8분", image: victoryImages[1] },
    { category: "산업관광", icon: "🏭", title: "창원국가산단 투어", description: "대한민국 기계산업의 심장을 둘러보는 산업 현장 여행", distance: "현 위치 5.1km", time: "차량 14분", image: victoryImages[2] },
    { category: "산업관광", icon: "🥃", title: "무학 굿데이뮤지엄", description: "지역 주류문화와 기업의 역사를 체험하는 이색 박물관", distance: "현 위치 10.8km", time: "차량 22분", image: victoryImages[3] },
    { category: "산업관광", icon: "⚙️", title: "마산자유무역지역 홍보관", description: "수출산업의 발자취와 마산의 산업사를 만나는 공간", distance: "현 위치 12.6km", time: "차량 25분", image: victoryImages[0] },
    { category: "경기대회", icon: "⚽", title: "아시아·태평양 농아인 축구 선수권대회", description: "국제 스포츠와 응원의 열기를 가까이에서 만나는 특별한 일정", distance: "현 위치 6.4km", time: "차량 16분", image: victoryImages[2] },
    { category: "크루즈", icon: "🛳️", title: "창원 기항지 관광", description: "마산항을 출발해 도심·시장·해안을 연결하는 크루즈 연계 코스", distance: "현 위치 13.1km", time: "차량 27분", image: victoryImages[1] }
  ];
})();
