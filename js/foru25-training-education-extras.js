(() => {
  "use strict";

  const notices = [
    {date:"2026-08-24",type:"교육",title:"26-03기 현장체험학습 안전요원 기본과정 접수 안내",badge:"접수중"},
    {date:"2026-08-18",type:"안내",title:"교육 신청 전 자격·준비사항을 확인해 주세요",badge:"필독"},
    {date:"2026-08-11",type:"보수교육",title:"2026년 하반기 보수교육 일정 안내",badge:"공지"},
    {date:"2026-08-04",type:"수료",title:"교육 수료 후 인력풀 등록 절차 안내",badge:"안내"}
  ];

  function isTraining(){ return location.hash.replace(/^#\/?/,"").split("?")[0] === "training"; }

  function extras(){
    return `<section class="tm-extra-section" data-training-extra>
      <div class="tm-title tm-extra-title"><div><h2>공지사항</h2><p>교육 신청과 수료에 필요한 최신 안내입니다.</p></div><button class="tm-more-btn" type="button">전체보기</button></div>
      <div class="tm-notice-table">
        <div class="tm-notice-head"><span>구분</span><span>제목</span><span>등록일</span></div>
        ${notices.map(n=>`<button class="tm-notice-row" type="button"><span><b>${n.type}</b></span><span class="tm-notice-title"><strong>${n.title}</strong><small>${n.badge}</small></span><span>${n.date.slice(5)}</span></button>`).join("")}
      </div>

      <div class="tm-title tm-extra-title tm-guide-title"><div><h2>교육 이용안내</h2><p>신청부터 현장 활동까지 필요한 절차를 한눈에 확인하세요.</p></div></div>
      <div class="tm-step-list">
        <article><span>1</span><div><strong>교육과정 선택·신청</strong><p>일정, 장소, 잔여인원과 교육대상을 확인한 뒤 신청합니다.</p></div></article>
        <article><span>2</span><div><strong>교육 이수·수료 확인</strong><p>교육 완료 후 수료정보와 자격 이수일을 확인합니다.</p></div></article>
        <article><span>3</span><div><strong>인력풀 프로필 등록</strong><p>활동지역, 경력, 자격, 사진 등 학교가 확인할 프로필을 등록합니다.</p></div></article>
        <article><span>4</span><div><strong>학교·여행사 일자리 연결</strong><p>조건이 맞는 모집일정을 확인하고 지원하거나 채용 제안을 받을 수 있습니다.</p></div></article>
      </div>

      <div class="tm-title tm-extra-title"><div><h2>자주 묻는 질문</h2><p>교육 신청 전에 많이 확인하는 내용입니다.</p></div></div>
      <div class="tm-faq">
        <details><summary>교육 신청 후 일정 변경이 가능한가요?</summary><p>프로토타입에서는 신청내역에서 변경·취소할 수 있는 흐름으로 확장할 예정입니다.</p></details>
        <details><summary>수료하면 인력풀에 바로 등록되나요?</summary><p>수료정보를 연계하되, 사진·활동지역·경력 등 프로필 정보를 추가한 뒤 공개하는 구조가 적합합니다.</p></details>
        <details><summary>보수교육 이수 여부도 학교가 확인할 수 있나요?</summary><p>인력풀 프로필과 검색 필터에서 최근 보수교육 여부와 이수일을 확인하도록 설계합니다.</p></details>
      </div>
    </section>`;
  }

  function enhance(){
    if(!isTraining()) return;
    const educationTab = document.querySelector('[data-tm-tab="education"].active');
    if(!educationTab) return;
    document.querySelectorAll('[data-training-extra]').forEach(x=>x.remove());
    const section = document.querySelector('.tm-section');
    if(!section) return;
    section.querySelectorAll('.tm-info-grid').forEach(x=>x.remove());
    section.insertAdjacentHTML('beforeend', extras());
  }

  const observer = new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(enhance,0));
  setTimeout(enhance,50);
})();
