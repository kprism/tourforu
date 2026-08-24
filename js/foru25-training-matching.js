(() => {
  "use strict";

  const app = document.getElementById("app");
  if (!app) return;

  const courses = [
    {
      id: "edu-2603",
      batch: "26-03기",
      name: "현장체험학습 안전요원 기본과정",
      capacity: 40,
      enrolled: 31,
      status: "접수중",
      date: "2026-09-05",
      time: "09:00~17:00",
      place: "창원 교육연수센터",
      fee: "80,000원",
      hours: "8시간",
      audience: "신규 안전요원·여행업 종사자",
      curriculum: ["현장체험학습 안전관리", "학생 인솔 실무", "응급상황 대응", "사고보고·보호자 응대"],
      note: "수료 후 인력풀 프로필에 자격이수일이 자동 표시되는 프로토타입입니다."
    },
    {
      id: "edu-2604",
      batch: "26-04기",
      name: "수학여행 인솔자 보수교육",
      capacity: 50,
      enrolled: 18,
      status: "접수예정",
      date: "2026-10-17",
      time: "13:00~18:00",
      place: "온라인+집합 혼합",
      fee: "50,000원",
      hours: "5시간",
      audience: "기존 활동 안전요원",
      curriculum: ["최근 사고사례", "학교별 운영기준", "학생 생활지도", "현장 위험성 평가"],
      note: "보수교육 이수 여부는 인력풀 검색 필터에 반영됩니다."
    },
    {
      id: "edu-2605",
      batch: "26-05기",
      name: "해외체험학습 안전·인솔 심화과정",
      capacity: 30,
      enrolled: 30,
      status: "접수완료",
      date: "2026-11-07",
      time: "09:30~17:30",
      place: "부산권 교육장",
      fee: "100,000원",
      hours: "8시간",
      audience: "해외 인솔 희망자",
      curriculum: ["출입국·여권 확인", "해외 응급상황", "학생 분실·이탈 대응", "현지가이드 협업"],
      note: "해외 인솔 가능 여부를 별도 배지로 표시합니다."
    }
  ];

  const jobs = [
    {id:"job-01",uploaded:"2026-08-24",nights:"2박3일",start:"2026-09-21",end:"2026-09-23",school:"창원가람중학교",region:"경남·부산",people:3,price:"1일 180,000원",title:"부산·거제 수학여행 안전요원 모집",detail:"2학년 118명, 버스 4대. 안전요원 3명 모집. 집결지는 창원이며 숙식 제공."},
    {id:"job-02",uploaded:"2026-08-23",nights:"1박2일",start:"2026-09-15",end:"2026-09-16",school:"마산해솔고등학교",region:"경주",people:2,price:"1일 170,000원",title:"경주 역사문화 체험학습 인솔자 모집",detail:"1학년 82명. 학생 생활지도와 이동 안전관리 중심. 유경험자 우대."},
    {id:"job-03",uploaded:"2026-08-22",nights:"3박4일",start:"2026-10-12",end:"2026-10-15",school:"진해바다중학교",region:"서울·인천",people:4,price:"1일 200,000원",title:"수도권 수학여행 안전요원 모집",detail:"학생 146명, 인솔교사 8명. 숙박형 체험학습 경험자 및 보수교육 이수자 우대."},
    {id:"job-04",uploaded:"2026-08-20",nights:"0박1일",start:"2026-09-04",end:"2026-09-04",school:"김해늘봄중학교",region:"창원",people:2,price:"150,000원",title:"창원 산업관광 현장체험 인솔자",detail:"당일형 프로그램. 창원컨벤션센터·산업관광 이동 안전관리."}
  ];

  const pool = [
    {id:"p1",name:"김안전",region:"창원·김해",age:"40대",gender:"남성",career:"6년 · 42회",special:"중·고등학교 수학여행 다수, 해외 인솔 가능",cert:"2025-03-12",refresh:"2026-06-20",refreshOk:true,rating:"4.9",phone:"010-1234-5678",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"},
    {id:"p2",name:"이하늘",region:"부산·경남",age:"30대",gender:"여성",career:"4년 · 31회",special:"청소년지도사 2급, 여학생 생활지도 강점",cert:"2025-08-18",refresh:"2026-07-11",refreshOk:true,rating:"4.8",phone:"010-2345-6789",image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"},
    {id:"p3",name:"박현장",region:"전국",age:"50대",gender:"남성",career:"10년 · 96회",special:"대규모 수학여행, 버스 다수 운영 경험",cert:"2024-02-09",refresh:"2026-04-08",refreshOk:true,rating:"4.9",phone:"010-3456-7890",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"},
    {id:"p4",name:"최여행",region:"창원·마산",age:"20대",gender:"여성",career:"1년 · 8회",special:"응급처치 자격, 당일형 현장체험 중심",cert:"2026-03-21",refresh:"미이수",refreshOk:false,rating:"4.7",phone:"010-4567-8901",image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
  ];

  let tab = "education";
  let selectedCourse = null;
  let selectedJob = null;
  let selectedPerson = null;
  let poolOpen = false;
  let poolFilter = {region:"전체",gender:"전체",refresh:"전체"};

  function esc(v="") { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
  function onTrainingRoute(){ return location.hash.replace(/^#\/?/,"").split("?")[0] === "training"; }

  function nav(){
    return `<nav class="bottom-nav bottom-nav-scroll"><div class="bottom-nav-track">
      <button class="nav-button" data-route="home"><span class="nav-icon nav-icon-3d">🏠</span><span>홈</span></button>
      <button class="nav-button" data-action="top"><span class="nav-icon nav-icon-3d">⬆️</span><span>상단</span></button>
      <button class="nav-button" data-route="keeper"><span class="nav-icon nav-icon-3d">🧳</span><span>여행키퍼</span></button>
      <button class="nav-button" data-route="guide-jobs"><span class="nav-icon nav-icon-3d">🧑‍🏫</span><span>가이드일자리</span></button>
      <button class="nav-button active" data-route="training"><span class="nav-icon nav-icon-3d">🎓</span><span>여행업교육</span></button>
      <button class="nav-button call" data-route="call"><span class="nav-icon nav-icon-3d">🚐</span><span>콜</span></button>
    </div></nav>`;
  }

  function header(){
    return `<header class="topbar"><button class="icon-button" data-route="home">←</button><div class="brand"><small>SAFETY CREW & EDUCATION</small><strong>여행업교육·인력매칭</strong></div><div class="top-actions"><button class="icon-button">🔎</button><button class="icon-button" data-route="mypage">👤</button></div></header>`;
  }

  function courseRows(){
    return courses.map(c=>`<button class="tm-table-row" data-tm-course="${c.id}">
      <span><b>${esc(c.batch)}</b><small>${esc(c.status)}</small></span><span class="tm-grow"><strong>${esc(c.name)}</strong><small>${esc(c.date)} · ${esc(c.place)}</small></span><span><b>${c.enrolled}/${c.capacity}</b><small>수강인원</small></span><span>›</span>
    </button>`).join("");
  }

  function courseDetail(){ const c=courses.find(x=>x.id===selectedCourse); if(!c) return ""; return `<section class="tm-detail-card"><div class="tm-detail-head"><div><small>${esc(c.batch)} · ${esc(c.status)}</small><h3>${esc(c.name)}</h3></div><button data-tm-close-course>✕</button></div><div class="tm-kv"><div><span>교육일정</span><strong>${esc(c.date)} ${esc(c.time)}</strong></div><div><span>교육장소</span><strong>${esc(c.place)}</strong></div><div><span>수강료</span><strong>${esc(c.fee)}</strong></div><div><span>교육시간</span><strong>${esc(c.hours)}</strong></div></div><h4>교육과정 세부내용</h4><ol class="tm-curriculum">${c.curriculum.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><p class="tm-note">${esc(c.note)}</p><button class="primary-button" data-tm-apply-course>이 과정 신청하기</button></section>`; }

  function education(){ return `<section class="tm-hero"><div class="tm-hero-icon">🎓</div><div><small>forU25 SCHOOL TRIP SAFETY</small><h2>교육과 인력풀을 한 흐름으로</h2><p>교육 이수 → 인력풀 등록 → 학교·여행사 채용까지 이어지는 프로토타입입니다.</p></div></section><section class="tm-stats"><article><strong>3개</strong><span>예정 과정</span></article><article><strong>99명</strong><span>신청 인원</span></article><article><strong>2개</strong><span>접수 가능</span></article></section><section class="tm-section"><div class="tm-title"><div><h2>교육일정</h2><p>기수별 과정과 모집현황을 확인하세요.</p></div><span class="tm-badge">2026 하반기</span></div><div class="tm-table"><div class="tm-table-head"><span>기수</span><span>과정명</span><span>수강</span><span></span></div>${courseRows()}</div>${courseDetail()}<div class="tm-info-grid"><article><span>🪪</span><strong>이수정보 자동연결</strong><p>교육일자와 보수교육 여부를 인력풀 프로필에 표시합니다.</p></article><article><span>📣</span><strong>교육 알림</strong><p>접수예정 과정은 오픈 알림을 받는 흐름으로 확장합니다.</p></article></div></section>`; }

  function jobRows(){ return jobs.map(j=>`<button class="tm-job-row" data-tm-job="${j.id}"><span><strong>${esc(j.school)}</strong><small>${esc(j.uploaded)} 업로드</small></span><span><b>${esc(j.nights)}</b><small>${esc(j.start)}~${esc(j.end)}</small></span><span><b>${esc(j.price)}</b><small>${j.people}명 모집</small></span><span>›</span></button>`).join(""); }
  function jobDetail(){ const j=jobs.find(x=>x.id===selectedJob); if(!j) return ""; return `<section class="tm-detail-card"><div class="tm-detail-head"><div><small>${esc(j.region)} · ${j.people}명 모집</small><h3>${esc(j.title)}</h3></div><button data-tm-close-job>✕</button></div><div class="tm-kv"><div><span>학교명</span><strong>${esc(j.school)}</strong></div><div><span>기간</span><strong>${esc(j.nights)} · ${esc(j.start)}~${esc(j.end)}</strong></div><div><span>단가</span><strong>${esc(j.price)}</strong></div><div><span>지역</span><strong>${esc(j.region)}</strong></div></div><p class="tm-job-desc">${esc(j.detail)}</p><div class="tm-action-row"><button data-tm-open-pool>인력풀에서 선택</button><button class="primary-button" data-tm-job-apply>이 일자리 지원</button></div></section>`; }

  function poolList(){ const filtered=pool.filter(p=>(poolFilter.region==="전체"||p.region.includes(poolFilter.region)||p.region==="전국")&&(poolFilter.gender==="전체"||p.gender===poolFilter.gender)&&(poolFilter.refresh==="전체"||(poolFilter.refresh==="이수"?p.refreshOk:!p.refreshOk))); return filtered.map(p=>`<button class="tm-person" data-tm-person="${p.id}"><img src="${esc(p.image)}" alt="${esc(p.name)}"><span class="tm-grow"><small>${esc(p.region)} · ${esc(p.age)} · ${esc(p.gender)}</small><strong>${esc(p.name)}</strong><em>${esc(p.career)} · ★ ${esc(p.rating)}</em></span><span>›</span></button>`).join("") || `<div class="tm-empty">조건에 맞는 인력이 없습니다.</div>`; }
  function personDetail(){ const p=pool.find(x=>x.id===selectedPerson); if(!p) return ""; return `<section class="tm-profile-detail"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="tm-profile-title"><small>${esc(p.region)}</small><h3>${esc(p.name)}</h3><p>${esc(p.age)} · ${esc(p.gender)} · 경력 ${esc(p.career)}</p></div><div class="tm-kv"><div><span>특이사항</span><strong>${esc(p.special)}</strong></div><div><span>자격이수</span><strong>${esc(p.cert)}</strong></div><div><span>보수교육</span><strong>${esc(p.refresh)} ${p.refreshOk?"✓":""}</strong></div><div><span>평점</span><strong>★ ${esc(p.rating)}</strong></div></div><div class="tm-contact"><button data-tm-call="${esc(p.phone)}">📞 전화하기</button><button data-tm-sms="${esc(p.phone)}">💬 문자하기</button><button data-tm-kakao>🟡 카카오톡</button></div><button class="primary-button" data-tm-select-person>이 인력 선택하기</button></section>`; }
  function poolPanel(){ if(!poolOpen) return ""; return `<section class="tm-pool"><div class="tm-title"><div><h2>인력풀 현황 <b>360명</b></h2><p>프로토타입 샘플 인력입니다. 지역·성별·보수교육으로 필터링합니다.</p></div><button data-tm-close-pool>닫기</button></div><div class="tm-filters"><select data-tm-filter="region"><option>전체</option><option>창원</option><option>부산</option><option>전국</option></select><select data-tm-filter="gender"><option>전체</option><option>남성</option><option>여성</option></select><select data-tm-filter="refresh"><option>전체</option><option>이수</option><option>미이수</option></select></div><div class="tm-pool-list">${poolList()}</div>${personDetail()}</section>`; }

  function matching(){ return `<section class="tm-hero tm-hero-alt"><div class="tm-hero-icon">🧑‍🏫</div><div><small>SCHOOL & TRAVEL AGENCY MATCHING</small><h2>학교·여행사가 필요한 인솔자를 바로 찾습니다</h2><p>게시판에 흩어진 구직정보 대신 일정·단가·자격이 한 화면에서 연결됩니다.</p></div></section><section class="tm-stats"><button data-tm-open-pool><strong>360명</strong><span>인력풀 현황</span></button><article><strong>4건</strong><span>모집중 일정</span></article><article><strong>11명</strong><span>필요 인원</span></article></section><section class="tm-section"><div class="tm-title"><div><h2>일자리매칭</h2><p>학교·여행사 채용 일정 샘플입니다.</p></div><button data-tm-open-pool class="tm-outline">인력풀 보기</button></div><div class="tm-job-head"><span>학교·업로드</span><span>일정</span><span>단가</span><span></span></div>${jobRows()}${jobDetail()}${poolPanel()}</section>`; }

  function render(){ if(!onTrainingRoute()) return; app.innerHTML=`<div class="app-shell tm-app">${header()}<main class="app-main"><section class="tm-tabs"><button class="${tab==="education"?"active":""}" data-tm-tab="education"><span>🎓</span><strong>교육일정</strong><small>과정·기수·신청</small></button><button class="${tab==="matching"?"active":""}" data-tm-tab="matching"><span>🤝</span><strong>일자리매칭</strong><small>학교·여행사·인력풀</small></button></section>${tab==="education"?education():matching()}</main>${nav()}</div>`; }

  document.addEventListener("click", e=>{
    const tabBtn=e.target.closest("[data-tm-tab]"); if(tabBtn){tab=tabBtn.dataset.tmTab; selectedCourse=selectedJob=selectedPerson=null; poolOpen=false; render(); return;}
    const c=e.target.closest("[data-tm-course]"); if(c){selectedCourse=c.dataset.tmCourse; render(); return;}
    if(e.target.closest("[data-tm-close-course]")){selectedCourse=null; render(); return;}
    const j=e.target.closest("[data-tm-job]"); if(j){selectedJob=j.dataset.tmJob; render(); return;}
    if(e.target.closest("[data-tm-close-job]")){selectedJob=null; render(); return;}
    if(e.target.closest("[data-tm-open-pool]")){poolOpen=true; render(); setTimeout(()=>document.querySelector(".tm-pool")?.scrollIntoView({behavior:"smooth"}),50); return;}
    if(e.target.closest("[data-tm-close-pool]")){poolOpen=false; selectedPerson=null; render(); return;}
    const p=e.target.closest("[data-tm-person]"); if(p){selectedPerson=p.dataset.tmPerson; render(); setTimeout(()=>document.querySelector(".tm-profile-detail")?.scrollIntoView({behavior:"smooth",block:"center"}),50); return;}
    if(e.target.closest("[data-tm-apply-course]")){alert("교육과정 신청이 접수된 샘플 상태입니다."); return;}
    if(e.target.closest("[data-tm-job-apply]")){alert("일자리 지원이 접수된 샘플 상태입니다."); return;}
    if(e.target.closest("[data-tm-select-person]")){alert("선택한 인력이 채용 후보에 저장되었습니다."); return;}
    const call=e.target.closest("[data-tm-call]"); if(call){location.href=`tel:${call.dataset.tmCall.replaceAll("-","")}`; return;}
    const sms=e.target.closest("[data-tm-sms]"); if(sms){location.href=`sms:${sms.dataset.tmSms.replaceAll("-","")}`; return;}
    if(e.target.closest("[data-tm-kakao]")){alert("카카오톡 연결 샘플입니다. 실제 서비스에서는 카카오 채널/알림톡으로 연결합니다."); return;}
  });
  document.addEventListener("change", e=>{const f=e.target.closest("[data-tm-filter]"); if(!f)return; poolFilter[f.dataset.tmFilter]=f.value; render();});
  window.addEventListener("hashchange",()=>setTimeout(render,0));
  setTimeout(render,0);
})();