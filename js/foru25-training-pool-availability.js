(() => {
  "use strict";
  const SAMPLE = [
    ["p1",["2026-09-15/2026-09-16"]],["p2",[]],["p3",["2026-09-21/2026-09-23"]],["p4",[]],
    ["p5",["2026-09-04/2026-09-04"]],["p6",[]],["p7",["2026-10-12/2026-10-15"]],["p8",[]],
    ["p9",[]],["p10",["2026-09-21/2026-09-22"]],["p11",[]],["p12",[]],["p13",["2026-10-13/2026-10-14"]],
    ["p14",[]],["p15",[]],["p16",["2026-09-15/2026-09-16"]],["p17",[]],["p18",[]],["p19",[]],["p20",["2026-09-04/2026-09-04"]]
  ];
  const names=["정하준","윤서진","강민호","한지우","송도윤","임수아","오현석","문예린","조성훈","배유진","권태영","신하늘","장우진","서민지","홍재현","유가은"];
  const photos=[
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=240&q=80"
  ];
  window.FORU25_TRAINING_EXTRA_POOL = names.map((name,i)=>({
    id:`p${i+5}`, name, region:["창원·김해","부산·경남","전국","창원·마산"][i%4], age:["20대","30대","40대","50대"][i%4], gender:i%2?"여성":"남성", career:`${2+i%8}년 · ${12+i*5}회`, special:["숙박형 수학여행 경험","응급처치·생활지도","대규모 버스 운영 경험","해외·장거리 인솔 가능"][i%4], cert:`202${4+i%3}-0${1+i%8}-1${i%9}`, refresh:i%5===0?"미이수":`2026-0${2+i%6}-2${i%9}`, refreshOk:i%5!==0, rating:(4.6+(i%4)*0.1).toFixed(1), phone:`010-${5000+i}-${6100+i}`, image:photos[i%4]
  }));
  window.FORU25_TRAINING_BUSY = Object.fromEntries(SAMPLE);
})();
