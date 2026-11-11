(function () {
  var A = window.APP, D = A.D, esc = A.esc, I = A.I, photo = A.photo, app = A.app, BG = window.BG;
  var IC = {
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7M12 14.6v2.2"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z"/><path d="M8.5 10.5h7"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.2v.3"/><circle cx="12" cy="12" r="8.5"/></svg>'
  };
  var POP = [["시행사 찾기", "#/match?cat=dev"], ["시공사 찾기", "#/match?cat=build"], ["자재 구매", "#/match?mcat=all"], ["설계·인허가", "#/match?work=design"], ["PM 상담", "#/match?to=pm"], ["PF·금융 상담", "#/match?to=finance"]];
  var FEED = [
    { v: "v1459", co: "c13", t: "분당 병원 실내 마감 — 경량 골조 작업", at: "2026.11.07" },
    { v: "v4010", co: "c15", t: "원주시 공동주택 신축 — 타워크레인 양중", at: "2026.11.06" },
    { ph: "steel_hall", co: "c3", t: "김포시 물류센터 철골 공사", at: "2026.11.07" },
    { ph: "pf_water", co: "c4", t: "송파구 공동주택 옥상 방수", at: "2026.11.06" },
    { v: "v1457", co: "c10", t: "의정부시 상가 외벽 조적", at: "2026.11.05" },
    { ph: "frame_work", co: "c1", t: "하남시 근린생활시설 신축 — 골조 공사", at: "2026.11.05" },
    { v: "v1439", co: "c8", t: "은평구 공동주택 인허가 도면 검토", at: "2026.11.03" },
    { ph: "site_aerial", co: "c2", t: "용인시 공동주택 골조 공사", at: "2026.11.04" },
    { ph: "pf_mep", co: "c7", t: "수원시 지식산업센터 전기 공사", at: "2026.11.02" }
  ];
  var POPDEF = { on: true, img: "hero_kr", title: "BUILDGO를 소개해 주시면 포인트를 드립니다", body: "소개받은 분이 회원가입 할 때 추천인 아이디에 내 아이디를 적으면 포인트가 적립됩니다. 적립된 포인트는 내 정보에서 확인하실 수 있습니다.", btn: "회원가입 하러 가기", href: "#/join", rev: 1 };
  var BRANCH = ["용인지사", "안성지사", "경북지사", "전북지사"];
  var OPCOLS = [["n_plan", "설계"], ["n_rebarman", "시공"], ["n_aptv", "분양"]];
  var DOORS = [
    { t: "업체 찾기", s: "시행 · 시공 · 자재", d: "시행사·시공사·자재 공급사를 분류별로 찾고, 채팅으로 조건을 확인한 뒤 연결합니다.", href: "#/companies", ph: "n_aerial" },
    { t: "전문가 찾기", s: "건축사 · 기술사 · 현장소장", d: "경력과 실적을 같은 기준으로 비교해 고릅니다.", href: "#/experts", ph: "w_review" },
    { t: "자재몰", s: "사업자 회원가", d: "자재를 고르고 온라인 서명까지 마치면 견적서를 받습니다.", href: "#/mall", ph: "mt_warehouse" },
    { t: "PM", s: "사업 관리", d: "부지 매입 검토부터 준공 후 매각까지 관리합니다.", href: "#/pm", ph: "n_plan" },
    { t: "금융", s: "PF · 브릿지론 · 에쿼티", d: "상황에 맞는 자금조달 구조를 제안합니다.", href: "#/finance", ph: "city_night" }
  ];
  var WK = [
    { t: "업체 찾기", s: "시행 · 시공 · 자재", href: "#/companies", ic: '<g class="k"><path d="M9 55V17l17-7v45"/><path d="M26 55V25h19v9"/><path d="M5 55h29"/><path d="M15 21v3M20 19.5v3M15 30v3M20 30v3M15 39v3M20 39v3M32 31h3M38 31h3"/></g><g class="a"><circle class="cv" cx="43.5" cy="45.5" r="9.5"/><path d="m50.5 52.5 7.5 7.5"/></g>' },
    { t: "전문가 찾기", s: "건축사 · 기술사", href: "#/experts", ic: '<g class="k"><path d="M21 34.5c1 7.5 5.2 12 11 12s10-4.5 11-12"/><path d="M11 58c2.4-7 10-11 21-11s18.6 4 21 11"/><path d="m27 49.5 5 4.5 5-4.5"/></g><g class="a"><path class="af" d="M17 30a15 15 0 0 1 30 0z"/><path d="M13 30.5h38M32 15v6"/></g>' },
    { t: "자재몰", s: "사업자 회원가", href: "#/mall", ic: '<g class="k"><path d="M5 13h7l6.5 29h30.5l5.5-21H14"/><circle cx="23" cy="51" r="3.6"/><circle cx="45" cy="51" r="3.6"/></g><g class="a"><path class="af" d="M20.5 27h11v7.5h-11zM33.5 27h11v7.5h-11zM27 19.5h11V27H27z"/></g>' },
    { t: "PM", s: "사업 관리", href: "#/pm", ic: '<g class="k"><path d="M25 11h-8a3 3 0 0 0-3 3v41a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V14a3 3 0 0 0-3-3h-8"/><path d="M25 8h14v7H25z"/><path d="M35 27h8M35 37h8M35 47h8"/></g><g class="a"><path d="m21 26.5 3 3 5-6M21 36.5l3 3 5-6M21 46.5l3 3 5-6"/></g>' },
    { t: "금융", s: "PF · 브릿지론", href: "#/finance", ic: '<g class="k"><path d="M8 47v7c0 2.8 6.3 5 14 5s14-2.2 14-5v-7"/><path d="M8 40v7c0 2.8 6.3 5 14 5s14-2.2 14-5v-7"/><path d="M8 33v7c0 2.8 6.3 5 14 5s14-2.2 14-5v-7"/><ellipse class="cv" cx="22" cy="33" rx="14" ry="5"/></g><g class="a"><circle class="cv" cx="45" cy="21" r="13"/><path d="m38.5 15.5 3.2 11.5 3.3-9 3.3 9 3.2-11.5M37.5 21h15"/></g>' }
  ];
  var RING = "M84 17C66 6 30 9 15 34 1 58 12 96 46 107c32 10 64-6 70-38 5-27-12-52-40-58-11-2-21 0-30 3";
  var HV = [
    { v: "1", t: "살짝 떠오르기", d: "버튼이 2~3mm 위로 떠올랐다가 제자리로 내려옵니다. 가볍고 무난합니다." },
    { v: "2", t: "동그라미 치기", d: "그림 둘레에 주황 동그라미가 펜으로 그리듯 쳐집니다. 지금 가리키는 버튼이 가장 잘 보입니다.", rec: true },
    { v: "3", t: "색 채우기", d: "버튼이 아래에서 위로 검게 차오르고 그림 바탕이 주황으로 바뀝니다. 가장 묵직하고 또렷합니다." }
  ];
  var PFIELD = [["dev", "시행"], ["build", "시공"], ["mat", "자재"], ["design", "설계·인허가"], ["pm", "PM"], ["finance", "금융"]];
  var PSIDO = ["전국", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  var STEPS = [
    { t: "찾기", d: "업무를 검색하거나 업체·전문가·자재몰에서 바로 고릅니다.", ph: "n_room" },
    { t: "비교하기", d: "면허, 실적, 현장 사진을 같은 기준으로 나란히 봅니다.", ph: "n_crew" },
    { t: "채팅으로 확인", d: "고른 업체·전문가와 규모·일정·조건을 하나씩 확인합니다.", ph: "w_measure" },
    { t: "견적서 받기", d: "업체·전문가·자재 견적을 한 장의 견적서로 받습니다.", ph: "n_plan" },
    { t: "계약과 진행", d: "자재는 온라인 서명으로 계약하고, 담당 매니저가 일정까지 챙깁니다.", ph: "n_steel" }
  ];
  var CO = [
    "LH 민간신축매입약정사업 전문 파트너, (주)도아입니다.",
    "사업의 본질은 '안정성'과 '확실한 집행력'에 있습니다.",
    "LH 민간신축매입약정사업은 국가 공공기관과의 계약을 바탕으로 추진되어, 시장 변동성 속에서도 사업 안정성을 확실하게 담보받을 수 있는 구조입니다.",
    "(주)도아는 LH 매입약정사업의 시작부터 끝까지 전 과정을 책임지는 통합 전문 기업입니다.",
    "부지 매입 검토부터 설계, 인허가, 시공, 시행, PM(프로젝트 관리), 금융(PF/구도), 자재제공까지 건설 프로젝트 전반에 필요한 모든 업무를 원스톱으로 수행합니다.",
    "사업 참여를 희망하시는 모든 고객님들을 환영합니다."
  ];
  var THREE = [["토지를", " 가지고 계신 분"], ["기술을", " 가지고 계신 분"], ["자본을", " 가지고 계신 분"]];
  var CO_LAST = "(주)도아가 구축한 'LH 매입약정사업 전문 연합'의 특권을 누려보시길 바랍니다.";
  var FAQ = [
    ["LH 민간신축매입약정사업이란 무엇인가요?", "LH가 민간사업자와 매입약정을 체결한 후, 완공된 주택을 LH가 매입하는 방식으로, 서민 주거안정을 목표로 한 정부 주도형 공급사업입니다."],
    ["사업 참여 조건은 어떻게 되나요?", "건설(시행) 가능한 토지를 확보하고, LH의 건축 기준에 따라 신축 설계를 할 수 있는 민간 사업자면 참여할 수 있습니다. 세부 조건은 연도별 LH 공고 기준을 따릅니다."],
    ["토지는 보유하고 있지만 설계와 금융이 어려운데 참여가 가능한가요?", "가능합니다. 당사는 설계부터 PF(프로젝트파이낸싱), 공사, 준공 후 매각까지 전 과정을 원스톱으로 지원하고 있습니다."],
    ["LH와 직접 계약을 체결해야 하나요?", "본 사업은 민간사업자가 LH와 직접 매입약정을 체결하는 구조이며, 당사는 해당 계약 체결까지의 전 과정을 컨설팅 및 PM으로 함께합니다."],
    ["사업에 소요되는 자금 조달은 어떻게 하나요?", "자기자본, 브릿지론, 시공사 투자, PF대출, LH 매입대금 등 다양한 자금조달 구조를 활용할 수 있으며, 상황에 따라 최적의 구조를 제안드립니다."],
    ["PM 또는 금융수수료는 어떻게 되나요?", "당사는 일체 의뢰자에게 수수료를 요구하지 않습니다. 단, 사업이 다마무리 되어 수익금이 예상보다 많아졌을 경우 소정의 수고비정도는 받을 수 있습니다."],
    ["에쿼티(자기자본비율)가 부족할 경우 자금조달이 가능한가요?", "네, 가능합니다. 에쿼티 대출또는 투자는 가능하지만 조건마다 상이할 수 있습니다. 일부 의뢰자분들께서는 자기자본 하나도없는 상태에서는 안됩니다."]
  ];
  var PROS = [
    ["처음부터 끝까지 한 곳에서", "부지 매입 검토부터 설계, 인허가, 시공, 시행, PM, 금융, 자재제공까지 원스톱으로 수행합니다.", "회사 소개"],
    ["공공기관 계약 기반의 안정성", "국가 공공기관과의 계약을 바탕으로 추진되어, 시장 변동성 속에서도 사업 안정성을 담보받을 수 있는 구조입니다.", "회사 소개"],
    ["의뢰자 수수료 없음", "당사는 일체 의뢰자에게 수수료를 요구하지 않습니다.", "FAQ · PM 또는 금융수수료는 어떻게 되나요?"],
    ["LH 매입약정 체결까지 함께", "계약 체결까지의 전 과정을 컨설팅 및 PM으로 함께합니다.", "FAQ · LH와 직접 계약을 체결해야 하나요?"]
  ];
  var CONS = [
    ["참여 조건은 LH 공고 기준", "세부 조건은 연도별 LH 공고 기준을 따릅니다.", "FAQ · 사업 참여 조건은 어떻게 되나요?"],
    ["자기자본이 전혀 없으면 어렵습니다", "자기자본이 하나도 없는 상태에서는 진행할 수 없습니다.", "FAQ · 에쿼티가 부족할 경우"],
    ["에쿼티 조건은 경우마다 다릅니다", "에쿼티 대출 또는 투자는 가능하지만 조건마다 상이할 수 있습니다.", "FAQ · 에쿼티가 부족할 경우"],
    ["수익이 예상보다 많으면 소정의 수고비", "사업이 마무리되어 수익금이 예상보다 많아졌을 경우 소정의 수고비 정도는 받을 수 있습니다.", "FAQ · PM 또는 금융수수료는 어떻게 되나요?"]
  ];
  var QCATS = ["LH 매입약정", "PM", "금융", "설계·시공", "자재", "회원"];
  var QNA = [
    { id: 8, cat: "금융", title: "토지는 있는데 에쿼티가 부족합니다. 브릿지론부터 진행할 수 있을까요?", who: "pa***", at: "2026.11.06", body: "경기 남부에 토지를 보유하고 있습니다. 자기자본이 일부 있는데 사업비에 비해 부족한 편입니다. 브릿지론부터 진행할 수 있는지, 상담 받으려면 어떤 자료를 준비하면 되는지 궁금합니다." },
    { id: 7, cat: "설계·시공", title: "LH 매입약정 신청 전에 설계를 먼저 맡겨야 하나요?", who: "jh***", at: "2026.11.04", body: "매입약정 신청 전에 어느 단계까지 설계가 되어 있어야 하는지 알고 싶습니다. 설계와 인허가를 함께 맡길 수 있는지도 여쭙니다." },
    { id: 6, cat: "자재", title: "자재몰 견적서로 세금계산서 발행이 되나요?", who: "bu***", at: "2026.10.29", body: "현장에서 쓸 철근과 합판을 자재몰에서 견적 받으려고 합니다. 견적서 기준으로 계약하면 세금계산서 발행이 되는지 궁금합니다." },
    { id: 5, cat: "LH 매입약정", title: "부산에 인허가 받은 민간사업지 LH감평형으로 준비해보려고 합니다.", who: "el***", at: "2025.10.23", body: "부산에 인허가 받은 민간사업지 LH감평형으로 준비해보려고 합니다." },
    { id: 4, cat: "LH 매입약정", title: "“도아”와 파트너로 사업진행할 경우 어떤 장,단점이 있나요?", who: "ll***", at: "2025.09.03", body: "“도아”와 파트너로 사업진행할 경우 어떤 장,단점이 있나요?" },
    { id: 3, cat: "LH 매입약정", title: "lh매입약정 계약하였습니다.", who: "ss***", at: "2025.09.01", body: "lh매입약정 계약하였습니다." },
    { id: 2, cat: "LH 매입약정", title: "lh매입약정 조건부 통과해서 사업진행할려고 합니다", who: "sy***", at: "2025.09.01", body: "lh매입약정 조건부 통과해서 사업진행할려고 합니다" },
    { id: 1, cat: "LH 매입약정", title: "경기도 용인시 역북동 토지주입니다", who: "ga***", at: "2025.09.01", body: "경기도 용인시 역북동 토지주입니다" }
  ];
  var PURPOSE = { land: "토지 보유", tech: "기술 보유", capital: "자본 보유", dev: "시행", build: "시공", mat: "자재", pm: "PM", finance: "금융" };

  function co(id) { return BG.CO[id] || D.companies[0]; }
  function feedList() { var s = A.keep("portfolio"); return s && s.length ? s : FEED.slice(); }
  function imgSrc(v) { return !v ? "" : /^(data:|https?:|\.|\/)/.test(v) ? v : photo(v); }
  function feedMedia(f, label) {
    if (f.v) return '<video class="h-vid" autoplay muted playsinline loop preload="metadata" poster="media/' + f.v + '.jpg" aria-label="' + esc(label) + '"><source src="media/' + f.v + '.mp4" type="video/mp4"></video><span class="h-fd-tag">현장 영상</span>';
    return '<img loading="lazy" src="' + esc(imgSrc(f.img || f.ph)) + '" alt="' + esc(f.t || "") + '">';
  }
  function popCfg() { var c = A.keep("popup"), o = {}; for (var k in POPDEF) o[k] = c && c[k] !== undefined && c[k] !== null ? c[k] : POPDEF[k]; return o; }
  function workOf(c) { return c.works && c.works.length ? A.workNames(c.works.slice(0, 1))[0] : A.typeName(c.type); }
  function pageWrap(head, body) { return '<div class="lp h-pg">' + head + body + "</div>"; }
  function today() { var d = new Date(); return d.getFullYear() + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + ("0" + d.getDate()).slice(-2); }

  function hvNow(q) {
    var v = q && q.hv;
    try { if (/^[123]$/.test(v || "")) sessionStorage.setItem("doa-pick-hv", v); else v = sessionStorage.getItem("doa-pick-hv"); } catch (e) {}
    return /^[123]$/.test(v || "") ? v : "2";
  }
  function wkHtml(hv, id) {
    return '<nav class="h-wk"' + (id ? ' id="' + id + '"' : "") + ' data-hv="' + hv + '" aria-label="업무 고르기">' + WK.map(function (w) {
      return '<a class="h-wk-i" href="' + w.href + '"><span class="h-wk-m"><svg class="h-wk-ic" viewBox="0 0 64 64" aria-hidden="true">' + w.ic + '</svg><svg class="h-wk-o" viewBox="0 0 120 120" aria-hidden="true"><path pathLength="1" d="' + RING + '"/></svg></span><b class="h-wk-t">' + esc(w.t) + '</b><span class="h-wk-s">' + esc(w.s) + "</span></a>";
    }).join("") + "</nav>";
  }
  function wkTap(box, nav) {
    if (!box) return;
    box.addEventListener("click", function (ev) {
      var a = ev.target.closest("a.h-wk-i");
      if (!a) return;
      if (!nav) {
        ev.preventDefault();
        a.classList.remove("tap"); void a.offsetWidth; a.classList.add("tap");
        clearTimeout(a._t); a._t = setTimeout(function () { a.classList.remove("tap"); }, 1200);
        return;
      }
      if (!(window.matchMedia && matchMedia("(hover: none)").matches) || BG.reduced() || a.classList.contains("tap")) return;
      ev.preventDefault();
      a.classList.add("tap");
      setTimeout(function () { location.hash = a.getAttribute("href"); }, 380);
    });
  }
  function heroHtml(hv) {
    return '<section class="h-top"><p class="h-kick">설계 · 시공 · 분양 — LH 민간신축매입약정사업 전문기업 도아</p><h1 class="h-h1">어떤 업무를<br>진행하시나요?</h1>' + wkHtml(hv, "hWk") +
      '<p class="h-or">찾는 업무가 없으면 검색해 보세요</p>' +
      '<form class="h-sch" id="hSch" role="search"><input name="q" type="search" placeholder="업체·전문가·자재를 한 번에 찾기 (예: 시공사, 구조기술사, 철근)" aria-label="찾을 업무" autocomplete="off" enterkeyhint="search"><button type="submit" class="h-sch-go" aria-label="검색">' + I.search + "</button></form>" +
      '<p class="h-pop"><span>누르면 바로 상담</span>' + POP.map(function (x) { return '<a href="' + x[1] + '">' + esc(x[0]) + "</a>"; }).join("") + "</p></section>";
  }
  function feedHtml() {
    var cards = feedList().slice(0, 7).map(function (f, i) {
      var c = co(f.co);
      return '<a class="h-fd' + (i === 0 ? " h-fd-big" : "") + '" href="#/company/' + c.id + '"><div class="h-fd-m">' + feedMedia(f, c.name + " 현장 작업 영상") + '</div><div class="h-fd-c"><p class="h-fd-co"><b>' + esc(c.name) + "</b><time>" + esc(f.at || "") + '</time></p><p class="h-fd-t">' + esc(f.t || "") + '</p><p class="h-fd-k">' + esc(workOf(c) + " · " + c.region + " " + c.city) + "</p></div></a>";
    }).join("");
    return '<section class="h-feed" aria-labelledby="hFeedT"><div class="h-sec-h"><div><p class="h-eye">지금 현장에서</p><h2 id="hFeedT">입점 업체 포트폴리오</h2></div><p class="h-sec-s">입점 업체에서 받은 현장 사진과 작업 영상을 도아가 확인해 직접 올립니다. 누르면 그 업체의 실적과 면허를 볼 수 있습니다.</p><a class="h-more" href="#/companies">업체 전체 보기 ' + I.arrow + '</a></div><div class="h-fd-grid">' + cards + "</div></section>";
  }
  function recItem(kind, x) {
    var o = typeof x === "string" ? (kind === "companies" ? BG.CO[x] : kind === "experts" ? BG.EX[x] : kind === "materials" ? BG.MT[x] : { name: x }) : x;
    if (!o) return "";
    var name = o.name || o.t || o.title || "", sub = "", href = o.href || "";
    if (kind === "companies") { sub = A.typeName(o.type) + (o.region ? " · " + o.region : ""); href = href || "#/company/" + o.id; }
    else if (kind === "experts") { sub = (o.title || "") + (o.region ? " · " + o.region : ""); href = href || "#/expert/" + o.id; }
    else if (kind === "materials") { sub = o.spec || ""; href = href || "#/item/" + o.id; }
    else { sub = o.d || o.desc || ""; href = href || (/금융|PF|finance/i.test(name + (o.id || "")) ? "#/finance" : "#/pm"); }
    if (!name) return "";
    return '<li><a href="' + esc(href) + '"><b>' + esc(name) + "</b>" + (sub ? "<span>" + esc(sub) + "</span>" : "") + "</a></li>";
  }
  function recHtml(user) {
    if (!user || typeof A.recommend !== "function") return "";
    var r = null;
    try { r = A.recommend(user); } catch (e) { r = null; }
    if (!r) return "";
    var cols = [["companies", "업체"], ["experts", "전문가"], ["materials", "자재"], ["services", "PM · 금융"]].map(function (k) {
      var items = (r[k[0]] || []).slice(0, 3).map(function (x) { return recItem(k[0], x); }).join("");
      return items ? '<div class="h-rec-col"><p class="h-rec-k">' + k[1] + "</p><ul>" + items + "</ul></div>" : "";
    }).join("");
    if (!cols) return "";
    var ps = (user.purposes || []).map(function (p) { return PURPOSE[p] || p; }).filter(Boolean);
    var who = user.name || user.company || "회원";
    return '<section class="h-rec" aria-labelledby="hRecT"><div class="h-sec-h"><div><p class="h-eye">회원 추천</p><h2 id="hRecT">' + esc(who) + "님께 맞는 추천</h2></div><p class=\"h-sec-s\">" + (ps.length ? "가입하실 때 적어 주신 목적(" + esc(ps.join(" · ")) + ")에 맞춰 골랐습니다." : "가입 정보에 맞춰 골랐습니다.") + '</p><a class="h-more" href="#/my">내 정보 ' + I.arrow + '</a></div><div class="h-rec-g">' + cols + "</div></section>";
  }
  function doorsHtml() {
    return '<h2 class="giant g2 h-giant">무엇을 찾으세요</h2><section class="h-doors">' + DOORS.map(function (d, i) {
      return '<a class="h-door h-door' + (i + 1) + '" href="' + d.href + '"><img loading="lazy" src="' + photo(d.ph) + '" alt=""><div class="h-door-b"><p class="h-door-s">' + esc(d.s) + "</p><h3>" + esc(d.t) + "</h3><p class=\"h-door-d\">" + esc(d.d) + '</p><span class="h-door-go">바로 보기 ' + I.arrow + "</span></div></a>";
    }).join("") + "</section>";
  }
  function stepsHtml() {
    return '<h2 class="giant g3 h-giant">이렇게 진행합니다</h2><ol class="steps h-steps">' + STEPS.map(function (s, i) { return '<li><span class="sn">0' + (i + 1) + '</span><span class="stt">' + esc(s.t) + '</span><span class="sd">' + esc(s.d) + '</span><span class="si"><img loading="lazy" src="' + photo(s.ph) + '" alt=""></span></li>'; }).join("") + "</ol>";
  }
  function pcList(rows) {
    return "<ul>" + rows.map(function (x) { return '<li class="h-row"><b>' + esc(x[0]) + "</b><p>" + esc(x[1]) + '</p><small>근거 · ' + esc(x[2]) + "</small></li>"; }).join("") + "</ul>";
  }
  function coHtml(withJoin) {
    return '<section class="h-co" aria-labelledby="hCoT"><div class="h-co-in"><p class="h-eye">회사 소개</p><p class="h-co-l1" id="hCoT">' + esc(CO[0]) + '</p><p class="h-co-l2">' + esc(CO[1]) + '</p><div class="h-co-body">' + CO.slice(2).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></div>" +
      '<ul class="h-three">' + THREE.map(function (t) { return "<li><b>" + esc(t[0]) + "</b>" + esc(t[1]) + "</li>"; }).join("") + '</ul><p class="h-co-last">' + esc(CO_LAST) + "</p>" +
      '<div class="h-pc"><div class="h-pc-col"><h3>함께하면 좋은 점</h3>' + pcList(PROS) + '</div><div class="h-pc-col"><h3>미리 아셔야 할 점</h3>' + pcList(CONS) + "</div></div>" +
      (withJoin ? '<div class="h-join"><a class="btn h-btn" href="#/join?kind=biz">업체 입점 (사업자)</a><a class="btn line-l h-btn" href="#/join?kind=person">일반회원 (개인)</a></div><p class="h-join-n">가입할 때 목적을 적어 주시면 맞는 업체·자재·PM·금융을 첫 화면에 추천해 드립니다.</p>' : "") + "</section>";
  }
  function coHome() {
    return '<section class="h-co h-co-sm" aria-labelledby="hCoT"><div class="h-co-g"><div class="h-co-a"><p class="h-eye">회사 소개</p><p class="h-co-l1" id="hCoT">' + esc(CO[0]) + '</p><p class="h-co-l2">' + esc(CO[1]) + '</p></div><div class="h-co-body">' + CO.slice(2).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></div>" +
      '<ul class="h-three">' + THREE.map(function (t) { return "<li><b>" + esc(t[0]) + "</b>" + esc(t[1]) + "</li>"; }).join("") + '</ul><p class="h-co-last">' + esc(CO_LAST) + "</p></section>" +
      '<section class="h-joinb" aria-label="회원가입과 입점 문의"><div class="h-jg">' +
      '<div class="h-jg-c"><h2 id="hJoinT">회원가입</h2><p class="h-jg-d">사업자회원과 일반회원 중에 골라 가입합니다. 아직 BUILDGO와 함께 일하지 않는 사업자도 사업자회원으로 가입할 수 있습니다.</p>' +
      '<div class="h-join"><a class="h-jb h-jb-biz" href="#/join?kind=biz"><b>사업자회원</b>' + I.arrow + '</a><a class="h-jb" href="#/join?kind=person"><b>일반회원</b>' + I.arrow + '</a></div>' +
      '<p class="h-join-n">가입할 때 목적을 적어 주시면 맞는 업체·자재·PM·금융을 첫 화면에 추천해 드립니다.</p><p class="h-join-n">추천인 아이디가 없으신가요? <a href="#/qna/write?cat=' + encodeURIComponent("회원") + "&title=" + encodeURIComponent("추천인 아이디 요청") + '">문의게시판으로 요청하기</a></p></div>' +
      '<div class="h-jg-c h-jg-p"><h2>입점 문의</h2><p class="h-jg-d">BUILDGO에 업체로 입점해 함께 일할 사업자는 입점 문의를 남겨 주세요. 담당 매니저가 서류를 확인하고 연락드립니다.</p>' +
      '<div class="h-join"><a class="h-jb h-jb-p" href="#/partner"><b>입점 문의하기</b>' + I.arrow + "</a></div></div>" +
      "</div></section>";
  }
  function quoteHtml() {
    return '<section class="h-qt" aria-labelledby="hQtT"><div class="h-qt-bg" aria-hidden="true"><img loading="lazy" src="' + photo("hero_night") + '" alt=""></div><div class="h-qt-in"><p class="h-eye">견적서 받기</p><h2 id="hQtT">편하게 연락 주세요.<br>담당 매니저가 바로 답합니다.</h2><p class="h-qt-s">업체·전문가·자재 견적을 한 장의 견적서로 받습니다.</p><div class="h-qt-cards">' +
      '<a class="h-qc" href="#/quote"><div><b>견적서 받기</b><p>고른 업체·전문가·자재를 모아 한 번에 견적을 받습니다.</p><span class="go">견적서 받기 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("w_women") + '" alt=""></a>' +
      '<a class="h-qc" href="#/join"><div><b>회원가입</b><p>가입 목적을 남기면 맞는 업체·자재·PM·금융을 추천해 드립니다.</p><span class="go">회원가입 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("n_plan") + '" alt=""></a></div></div></section>';
  }

  var topSeen = null;
  function watchTop() {
    if (topSeen) { topSeen.disconnect(); topSeen = null; }
    document.body.classList.remove("h-top-in");
    var t = app.querySelector(".h-top");
    if (!t || !window.IntersectionObserver) return;
    topSeen = new IntersectionObserver(function (es) { document.body.classList.toggle("h-top-in", es[0].isIntersecting && es[0].intersectionRatio > 0.4); }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    topSeen.observe(t);
  }
  function home(r) {
    var user = A.keep("user");
    app.innerHTML = '<div class="h-home">' + heroHtml(hvNow(r && r.query)) + recHtml(user) + feedHtml() + coHome() + "</div>";
    wkTap(document.getElementById("hWk"), true);
    var f = document.getElementById("hSch");
    if (window.matchMedia && matchMedia("(max-width: 600px)").matches) f.q.placeholder = "예: 시공사, 구조기술사, 철근";
    f.onsubmit = function (ev) { ev.preventDefault(); var q = f.q.value.trim(); location.hash = "#/search" + BG.qs({ q: q }); };
  }

  function partner(r) {
    var q = (r && r.query) || {}, u = A.keep("user") || {}, done = q.done ? (A.keep("partner") || []).filter(function (x) { return String(x.id) === String(q.done); })[0] : null;
    if (done) return partnerDone(done, u);
    var why = [
      ["업체 찾기·자재몰에 회사가 올라갑니다", "서류 확인을 마치면 회사 실적과 면허를 고객에게 보여 드립니다."],
      ["담당 매니저가 맞는 일을 연결합니다", "고객 상담 내용을 듣고 매니저가 맞는 업체를 추천합니다. 고객과 직접 흥정하지 않아도 됩니다."],
      ["현장 사진·영상을 대신 올려 드립니다", "보내 주신 현장 자료를 도아가 확인해 첫 화면 포트폴리오에 올립니다."]
    ];
    var flow = [["01", "입점 문의 남기기"], ["02", "매니저 연락·서류 확인"], ["03", "입점 완료"]];
    app.innerHTML = pageWrap(A.pageHead("입점 문의", "BUILDGO에 업체로 입점해 함께 일할 사업자를 찾습니다. 남겨 주시면 담당 매니저가 연락드립니다.", "입점 문의"),
      '<section class="h-sec h-pt"><div class="h-pt-g"><div class="h-pt-a"><p class="h-eye">입점 안내</p><h2 class="h-h2">함께 일할<br>사업자를 찾습니다.</h2>' +
      '<ol class="h-list h-pt-l">' + why.map(function (x) { return '<li class="h-row"><b>' + esc(x[0]) + "</b><p>" + esc(x[1]) + "</p></li>"; }).join("") + "</ol>" +
      '<ol class="h-pt-f">' + flow.map(function (x) { return "<li><span>" + x[0] + "</span><b>" + esc(x[1]) + "</b></li>"; }).join("") + "</ol>" +
      '<p class="h-pt-vs"><b>사업자회원 가입과 입점은 다릅니다.</b> 사업자회원은 누구나 가입해 자재몰 회원가와 견적서 받기를 씁니다. 입점은 서류 확인을 거쳐 BUILDGO에서 일을 받는 협력 업체가 되는 것입니다.</p></div>' +
      '<form class="h-pf" id="hPf" novalidate><h2 class="h-pf-t">입점 문의 남기기</h2>' +
      '<div class="h-pf-2"><div class="h-fld"><label for="hPc">회사명</label><input class="inp" id="hPc" name="company" value="' + esc(u.company || "") + '" autocomplete="organization" placeholder="예: 도아종합건설"></div>' +
      '<div class="h-fld"><label for="hPb">사업자등록번호 <em>선택</em></label><input class="inp" id="hPb" name="bizNo" value="' + esc(u.bizNo || "") + '" inputmode="numeric" placeholder="000-00-00000"></div>' +
      '<div class="h-fld"><label for="hPn">담당자 이름</label><input class="inp" id="hPn" name="name" value="' + esc(u.name || "") + '" autocomplete="name" placeholder="예: 홍길동"></div>' +
      '<div class="h-fld"><label for="hPp">휴대폰</label><input class="inp" id="hPp" name="phone" value="' + esc(u.phone || "") + '" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></div></div>' +
      '<fieldset class="h-fld h-pf-fs"><legend>입점 분야 <em>여러 개 고를 수 있습니다</em></legend><div class="s-chips h-pf-ch">' + PFIELD.map(function (x) { return '<label class="s-chip"><input type="checkbox" name="field" value="' + x[0] + '"' + (u.field === x[0] ? " checked" : "") + "><span>" + esc(x[1]) + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<div class="h-fld"><label for="hPs">주로 일하는 지역</label><span class="selbox"><select id="hPs" name="sido">' + PSIDO.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + "</select>" + I.down + "</span></div>" +
      '<div class="h-fld"><label for="hPm">회사 소개 <em>선택</em></label><textarea class="inp h-ta" id="hPm" name="memo" rows="4" placeholder="주요 실적, 보유 면허, 장비 같은 내용을 적어 주세요"></textarea></div>' +
      '<label class="s-cb h-pf-ag"><input type="checkbox" name="agree"><span class="s-box" aria-hidden="true">' + IC.check + "</span><span>[필수] 입점 상담을 위한 개인정보 수집·이용에 동의합니다</span></label>" +
      '<p class="err" id="hPerr" role="alert"></p><button type="submit" class="btn h-btn h-pf-go">입점 문의 남기기 ' + I.arrow + "</button></form></div></section>");
    var f = document.getElementById("hPf");
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var v = function (n) { return (f[n] && f[n].value || "").trim(); }, fl = [].filter.call(f.querySelectorAll('input[name="field"]'), function (x) { return x.checked; }).map(function (x) { return x.value; }), miss = [];
      if (!v("company")) miss.push("회사명"); if (!v("name")) miss.push("담당자 이름"); if (v("phone").replace(/\D/g, "").length < 9) miss.push("휴대폰"); if (!fl.length) miss.push("입점 분야"); if (!f.agree.checked) miss.push("개인정보 동의");
      if (miss.length) { document.getElementById("hPerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      var list = A.keep("partner") || [], id = Date.now();
      list.unshift({ id: id, at: today(), company: v("company"), bizNo: v("bizNo"), name: v("name"), phone: v("phone"), fields: fl, sido: v("sido"), memo: v("memo"), status: "접수" });
      A.keep("partner", list.slice(0, 20));
      location.hash = "#/partner" + BG.qs({ done: id });
    };
  }
  function partnerDone(p, u) {
    var names = PFIELD.filter(function (x) { return p.fields.indexOf(x[0]) >= 0; }).map(function (x) { return x[1]; });
    app.innerHTML = pageWrap(A.pageHead("입점 문의 접수 완료", "담당 매니저가 1영업일 안에 남기신 번호로 연락드립니다.", "입점 문의"),
      '<section class="h-sec h-pd"><div class="h-pd-ok"><span class="h-pd-i" aria-hidden="true">' + IC.check + '</span><h2>입점 문의가 접수됐습니다</h2><p>사업자등록증, 면허, 보험 서류를 미리 준비해 주시면 더 빨리 진행됩니다.</p></div>' +
      '<dl class="h-pd-l"><div><dt>회사명</dt><dd>' + esc(p.company) + "</dd></div><div><dt>담당자</dt><dd>" + esc(p.name) + " · " + esc(p.phone) + "</dd></div><div><dt>입점 분야</dt><dd>" + esc(names.join(", ")) + "</dd></div><div><dt>지역</dt><dd>" + esc(p.sido) + "</dd></div><div><dt>접수일</dt><dd>" + esc(p.at) + "</dd></div></dl>" +
      '<div class="h-pd-b"><a class="btn line-l h-btn" href="#/">홈으로</a>' + (u.kind === "biz" ? "" : '<a class="btn h-btn" href="#/join?kind=biz">사업자회원 가입하기 ' + I.arrow + "</a>") + "</div></section>");
  }
  function motion() {
    app.innerHTML = pageWrap(A.pageHead("버튼 움직임 고르기", "첫 화면 ‘어떤 업무를 진행하시나요?’ 아래 다섯 버튼에 마우스를 올리거나 눌러 보세요.", "버튼 움직임"),
      '<section class="h-sec h-mo"><p class="h-mo-n">세 가지 모두 0.4초 안에 끝납니다. 업체 찾기에서 분류를 누르면 상담 말풍선이 올라오는 속도와 같습니다. 휴대폰에서는 버튼을 누르는 순간 움직입니다.</p>' +
      HV.map(function (h) { return '<div class="h-mo-r"><div class="h-mo-h"><span class="h-mo-k">' + h.v + "안</span><h2>" + esc(h.t) + (h.rec ? "<em>추천</em>" : "") + "</h2><p>" + esc(h.d) + '</p><a class="h-mo-go" href="#/?hv=' + h.v + '">이 움직임으로 첫 화면 보기 ' + I.arrow + "</a></div>" + wkHtml(h.v) + "</div>"; }).join("") + "</section>");
    [].forEach.call(app.querySelectorAll(".h-wk"), function (b) { wkTap(b, false); });
  }

  function askHtml(to, title, sub) {
    return '<section class="h-ask"><div class="h-ask-t"><span class="h-ask-i" aria-hidden="true">' + IC.chat + "</span><div><h2>" + esc(title) + "</h2><p>" + esc(sub) + '</p></div></div><div class="h-ask-b"><a class="btn h-btn" href="#/match?to=' + to + '">채팅으로 상담하기</a><a class="btn line-l h-btn" href="#/quote">견적서 받기</a></div></section>';
  }
  function quoteBox(q, a) { return '<blockquote class="h-bq"><p class="h-bq-q">' + esc(q) + "</p><p>" + esc(a) + '</p><a href="#/faq">자주 묻는 질문 전체 보기 ' + I.arrow + "</a></blockquote>"; }
  function rows(list) { return '<ol class="h-list">' + list.map(function (x) { return '<li class="h-row"><b>' + esc(x[0]) + "</b><p>" + esc(x[1]) + "</p></li>"; }).join("") + "</ol>"; }

  function about() {
    app.innerHTML = pageWrap(A.pageHead("회사 소개", "LH 민간신축매입약정사업 전문기업 도아", "회사 소개"),
      '<div class="h-wide"><img src="' + photo("n_wide") + '" alt="바다 가까이 올라가는 아파트 신축 현장"></div>' +
      '<section class="h-co h-ab" aria-labelledby="hCoT"><div class="h-co-in"><p class="h-co-l1" id="hCoT">' + esc(CO[0]) + '</p><p class="h-co-l2">' + esc(CO[1]) + '</p><div class="h-co-body">' + CO.slice(2, 6).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></div></section>" +
      '<section class="h-br" aria-labelledby="hBrT"><h2 class="h-br-t" id="hBrT">지사 안내</h2><ul class="h-br-l">' + BRANCH.map(function (b) { return "<li>" + I.pin + "<b>" + esc(b) + "</b></li>"; }).join("") + "</ul></section>");
  }
  function pm() {
    var steps = [
      ["부지 매입 검토", "건설(시행) 가능한 토지인지부터 함께 확인합니다."],
      ["설계", "LH의 건축 기준에 따른 신축 설계를 맡습니다. 2023년까지 직접 설계 109건."],
      ["인허가", "설계에 이어 인허가까지 이어서 진행합니다."],
      ["LH 매입약정 체결", "민간사업자가 LH와 직접 매입약정을 체결하는 구조이며, 계약 체결까지의 전 과정을 컨설팅 및 PM으로 함께합니다."],
      ["시공 · 시행", "시공과 시행을 한 회사가 이어서 맡습니다."],
      ["준공 후 매각", "완공된 주택은 LH가 매입합니다."]
    ];
    app.innerHTML = pageWrap(A.pageHead("PM", "부지 매입 검토부터 설계·인허가·시공, 준공 후 매각까지 사업 전체를 관리합니다.", "PM"),
      '<div class="h-wide"><img src="' + photo("n_plan") + '" alt="설계 도면을 함께 검토하는 모습"></div>' +
      '<section class="h-sec"><p class="h-eye">PM이 맡는 일</p><h2 class="h-h2">LH 매입약정사업의<br>시작부터 끝까지.</h2>' + rows(steps) + "</section>" +
      '<section class="h-sec">' + quoteBox(FAQ[2][0], FAQ[2][1]) + quoteBox(FAQ[5][0], FAQ[5][1]) + "</section>" +
      askHtml("pm", "PM 상담을 채팅으로 시작하세요", "사업지 위치와 진행 단계를 여쭙고 담당 매니저가 연결합니다."));
  }
  function finance() {
    var kinds = [["자기자본", "사업에 직접 넣는 자금입니다."], ["브릿지론", "본 대출 전 단계에 쓰는 자금입니다."], ["시공사 투자", "시공사가 사업에 투자하는 구조입니다."], ["PF대출", "프로젝트파이낸싱 대출입니다."], ["LH 매입대금", "완공된 주택을 LH가 매입하며 받는 대금입니다."], ["에쿼티 대출 · 투자", "가능하지만 조건마다 상이할 수 있습니다."]];
    app.innerHTML = pageWrap(A.pageHead("금융", "자기자본·브릿지론·시공사 투자·PF대출·LH 매입대금 — 상황에 따라 최적의 구조를 제안드립니다.", "금융"),
      '<div class="h-wide"><img src="' + photo("city_night") + '" alt="불 켜진 도심 건물들"></div>' +
      '<section class="h-sec"><p class="h-eye">자금조달 구조</p><h2 class="h-h2">다양한 자금조달 구조를<br>함께 짭니다.</h2>' + rows(kinds) + "</section>" +
      '<section class="h-sec">' + quoteBox(FAQ[4][0], FAQ[4][1]) + quoteBox(FAQ[6][0], FAQ[6][1]) + quoteBox(FAQ[5][0], FAQ[5][1]) + "</section>" +
      askHtml("finance", "금융 상담을 채팅으로 시작하세요", "자기자본 규모와 사업 단계를 여쭙고 맞는 구조를 제안드립니다."));
  }
  function faq() {
    app.innerHTML = pageWrap(A.pageHead("FAQ", "자주 묻는 질문입니다. 찾는 답이 없으면 문의게시판에 남겨 주세요.", "FAQ"),
      '<section class="h-sec h-faq">' + FAQ.map(function (q, i) {
        return '<details class="h-fq"' + (i === 0 ? " open" : "") + '><summary><span class="h-fq-k" aria-hidden="true">Q</span><span class="h-fq-t">' + esc(q[0]) + '</span><span class="h-fq-x" aria-hidden="true">' + I.plus + '</span></summary><div class="h-fq-a"><span class="h-fq-k" aria-hidden="true">A</span><p>' + esc(q[1]) + "</p></div></details>";
      }).join("") + "</section>" +
      '<section class="h-fq-ask" aria-labelledby="hFqAskT"><h2 id="hFqAskT">찾는 답이 없으신가요?</h2><p>문의게시판에 질문을 남겨 주시면 담당자가 답해 드립니다. 질문은 전체 공개, 답변은 비밀로 드립니다.</p>' +
      '<div class="h-fq-btns"><a class="h-fq-main" href="#/qna/write">문의게시판에 질문하기 ' + I.arrow + '</a><a class="h-fq-tel" href="tel:1588-9863"><span>전화로 묻기</span><b>1588-9863</b></a></div></section>');
  }

  function allQna() {
    var mine = A.keep("qna") || [];
    return mine.concat(QNA).sort(function (a, b) { return b.id - a.id; });
  }
  function status(q) { return q.mine ? '<span class="h-st wait">' + IC.clock + "답변 대기</span>" : '<span class="h-st">' + IC.lock + "답변 완료</span>"; }
  function qnaList() {
    var list = allQna(), fresh = "";
    try { fresh = sessionStorage.getItem("h-qna-new") || ""; sessionStorage.removeItem("h-qna-new"); } catch (e) {}
    app.innerHTML = pageWrap(A.pageHead("문의게시판", "질문은 누구나 볼 수 있고, 관리자 답변은 질문하신 분께만 비밀로 드립니다.", "문의게시판", '<div class="ph-act"><a class="btn h-btn" href="#/qna/write">질문 쓰기</a></div>'),
      '<section class="h-sec h-qna"><p class="h-qn-h">전체 <b>' + list.length + '</b>건</p><table class="h-qt-tbl"><thead><tr><th scope="col">번호</th><th scope="col">분류</th><th scope="col">제목</th><th scope="col">작성자</th><th scope="col">작성일</th><th scope="col">상태</th></tr></thead><tbody>' +
      list.map(function (q) { return '<tr class="h-qrow' + (String(q.id) === fresh ? " h-new" : "") + '"><td class="c-no">' + q.id + '</td><td class="c-cat">' + esc(q.cat) + '</td><td class="c-t"><a href="#/qna/' + q.id + '">' + esc(q.title) + '</a></td><td class="c-who">' + esc(q.who) + '</td><td class="c-at">' + esc(q.at) + '</td><td class="c-st">' + status(q) + "</td></tr>"; }).join("") +
      '</tbody></table><p class="h-qn-f">' + IC.lock + "질문은 전체 공개, 답변은 비밀로 드립니다. 답변은 질문하신 분과 관리자만 볼 수 있어요.</p></section>");
  }
  function qnaView(id) {
    var q = allQna().filter(function (x) { return String(x.id) === String(id); })[0];
    if (!q) { qnaList(); return; }
    var ans = q.mine
      ? '<div class="h-ans wait">' + IC.clock + "<div><b>답변 대기 중입니다</b><p>관리자가 확인한 뒤 비밀 답변으로 드려요. 답변은 질문하신 분과 관리자만 볼 수 있어요.</p></div></div>"
      : '<div class="h-ans">' + IC.lock + "<div><b>비밀 답변입니다 — 질문하신 분과 관리자만 볼 수 있어요</b><p>관리자 답변 완료</p></div></div>";
    app.innerHTML = pageWrap(A.pageHead("문의게시판", "", "문의게시판"),
      '<article class="h-sec h-qv"><p class="h-qv-m"><span>' + esc(q.cat) + "</span><span>" + esc(q.who) + "</span><span>" + esc(q.at) + "</span>" + status(q) + "</p><h2>" + esc(q.title) + '</h2><div class="h-qv-b">' + esc(q.body).split("\n").map(function (l) { return "<p>" + l + "</p>"; }).join("") + "</div>" + ans +
      '<div class="h-qv-nav"><a class="btn line-l h-btn" href="#/qna">목록으로</a><a class="btn h-btn" href="#/qna/write">질문 쓰기</a></div></article>');
  }
  function qnaWrite(q) {
    var u = A.keep("user") || {};
    q = q || {};
    app.innerHTML = pageWrap(A.pageHead("질문 쓰기", "질문은 전체 공개, 답변은 비밀로 드립니다.", "문의게시판"),
      '<section class="h-sec"><form class="h-qw" id="hQw" novalidate><p class="h-qw-n">' + IC.lock + "<span>질문은 전체 공개, 답변은 비밀로 드립니다. 연락처나 주소처럼 남에게 보이면 안 되는 내용은 적지 말아 주세요.</span></p>" +
      '<div class="h-fld"><label for="hQc">분류</label><span class="selbox"><select id="hQc" name="cat">' + QCATS.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</select>" + I.down + "</span></div>" +
      '<div class="h-fld"><label for="hQt">제목</label><input class="inp" id="hQt" name="title" maxlength="60" placeholder="예: 토지는 있는데 설계와 금융이 어렵습니다"></div>' +
      '<div class="h-fld"><label for="hQb">내용</label><textarea class="inp h-ta" id="hQb" name="body" rows="8" placeholder="사업지 지역, 진행 단계, 궁금한 점을 적어 주세요"></textarea></div>' +
      '<div class="h-fld"><label for="hQw2">작성자</label><input class="inp" id="hQw2" name="who" maxlength="20" value="' + esc(u.name || "") + '" placeholder="이름 (목록에는 가려서 보입니다)"></div>' +
      '<p class="err" id="hQerr" role="alert"></p><div class="h-qw-b"><a class="btn line-l h-btn" href="#/qna">취소</a><button type="submit" class="btn h-btn">질문 올리기</button></div></form></section>');
    var fw = document.getElementById("hQw");
    if (q.cat && QCATS.indexOf(q.cat) >= 0) fw.cat.value = q.cat;
    if (q.title) fw.title.value = q.title.slice(0, 60);
    if (q.body) fw.body.value = q.body;
    fw.onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, t = f.title.value.trim(), b = f.body.value.trim(), w = f.who.value.trim(), miss = [];
      if (!t) miss.push("제목"); if (!b) miss.push("내용"); if (!w) miss.push("작성자");
      if (miss.length) { document.getElementById("hQerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      var mine = A.keep("qna") || [], top = allQna().reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1;
      mine.unshift({ id: top, cat: f.cat.value, title: t, body: b, who: w.charAt(0) + "**", at: today(), mine: true });
      A.keep("qna", mine);
      try { sessionStorage.setItem("h-qna-new", String(top)); } catch (e) {}
      location.hash = "#/qna";
    };
  }
  function qna(r) {
    if (r.id === "write") qnaWrite(r.query);
    else if (r.id) qnaView(r.id);
    else qnaList();
  }

  var vio = null;
  function videos() {
    if (vio) { vio.disconnect(); vio = null; }
    var vs = app.querySelectorAll("video.h-vid");
    if (!vs.length) return;
    [].forEach.call(vs, function (v) { v.muted = true; v.defaultMuted = true; });
    if (!("IntersectionObserver" in window)) { [].forEach.call(vs, playV); return; }
    vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) playV(v);
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.2 });
    [].forEach.call(vs, function (v) { vio.observe(v); });
  }
  function playV(v) { v.preload = "auto"; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function qkLift() {
    var h = 0;
    [].forEach.call(document.querySelectorAll(".s-cbar, .cartbar"), function (b) {
      var cs = getComputedStyle(b), rc = b.getBoundingClientRect();
      if (cs.position === "fixed" && cs.display !== "none" && cs.visibility !== "hidden" && rc.height && rc.bottom > innerHeight - 140) h = Math.max(h, Math.round(innerHeight - rc.top) - (matchMedia("(max-width: 768px)").matches ? 60 : 0));
    });
    document.body.style.setProperty("--qkb", Math.max(0, h) + "px");
  }
  var TAB = { home: "home", search: "search", companies: "search", company: "search", experts: "search", expert: "search", match: "consult", mall: "search", item: "search", cart: "quote", sign: "quote", quote: "quote", my: "my", login: "my", join: "my" };
  function badge() {
    var n = 0;
    try { n = typeof A.quoteCount === "function" ? +A.quoteCount() || 0 : 0; } catch (e) { n = 0; }
    [].forEach.call(document.querySelectorAll(".h-qn"), function (b) { b.hidden = !n; b.textContent = n > 99 ? "99+" : String(n); });
    var q = document.getElementById("hQ"); if (q) q.setAttribute("aria-label", n ? "견적서 받기, 담은 항목 " + n + "개" : "견적서 받기");
  }
  function frame(r) {
    var t = TAB[r.name] || "", bare = r.name === "match" || r.name === "item" || r.name === "sign" || r.name === "admin";
    document.body.classList.toggle("h-notab", bare);
    document.body.classList.toggle("h-noqk", bare);
    [].forEach.call(document.querySelectorAll("#hTab a"), function (a) { var on = a.dataset.tab === t; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var u = A.keep("user"), j = document.getElementById("hJoin");
    if (j) { j.textContent = u && u.name ? u.name + "님" : "회원가입"; j.setAttribute("href", u ? "#/my" : "#/join"); }
    badge();
    videos();
    setTimeout(qkLift, 60);
    if (r.name === "home") setTimeout(popupMaybe, 650);
    watchTop();
  }

  var pp = null, ppRev = null;
  function popupClose(now) {
    if (!pp) return;
    var el = pp, card = el.querySelector(".h-pp-card");
    pp = null;
    document.documentElement.classList.remove("h-pp-lock");
    if (now || reduce() || !card.animate) { el.remove(); return; }
    el.querySelector(".h-pp-dim").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EOUT, fill: "forwards" });
    var a = card.animate(sheetMode() ? [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }] : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(14px)" }], { duration: 260, easing: EOUT, fill: "forwards" });
    a.onfinish = function () { el.remove(); };
  }
  function popupOpen(c, demo) {
    popupClose(true);
    var el = document.createElement("div"), src = imgSrc(c.img);
    el.className = "h-pp" + (src ? "" : " no-im");
    el.dataset.rev = demo ? "" : String(c.rev);
    el.innerHTML = '<div class="h-pp-dim"></div><div class="h-pp-card" role="dialog" aria-modal="true" aria-labelledby="hPpT">' +
      (src ? '<div class="h-pp-im"><img src="' + esc(src) + '" alt=""></div>' : "") +
      '<div class="h-pp-b"><h2 class="h-pp-t" id="hPpT">' + esc(c.title || "") + '</h2><p class="h-pp-d">' + esc(c.body || "").replace(/\n/g, "<br>") + "</p>" +
      (c.btn ? '<a class="h-pp-go" href="' + esc(c.href || "#/join") + '">' + esc(c.btn) + " " + I.arrow + "</a>" : "") + "</div>" +
      '<div class="h-pp-f"><button type="button" data-pp="hide">다시 보지 않기</button><button type="button" data-pp="close">닫기 ' + I.close + "</button></div></div>";
    document.body.appendChild(el);
    pp = el;
    document.documentElement.classList.add("h-pp-lock");
    var card = el.querySelector(".h-pp-card");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pp]"), go = e.target.closest(".h-pp-go");
      if (!b && !go && !e.target.classList.contains("h-pp-dim")) return;
      if (!demo) ppRev = String(c.rev);
      if (b && b.getAttribute("data-pp") === "hide" && !demo) A.keep("popup-hide", String(c.rev));
      if (!go) popupClose();
    });
    el.addEventListener("wheel", function (e) { if (!e.target.closest(".h-pp-card")) e.preventDefault(); }, { passive: false });
    if (!reduce() && card.animate) {
      el.querySelector(".h-pp-dim").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: EIN });
      card.animate(sheetMode() ? [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }] : [{ opacity: 0, transform: "translateY(24px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 560, easing: EIN });
    }
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });
  }
  function popupMaybe() {
    if (pp || !isHome() || document.body.classList.contains("op-on") || document.getElementById("op")) return;
    var c = popCfg();
    if (!c.on || !(c.title || c.body)) return;
    var hid = A.keep("popup-hide");
    if (hid !== null && String(hid) === String(c.rev)) return;
    if (ppRev === String(c.rev)) return;
    popupOpen(c, false);
  }
  window.addEventListener("hashchange", function () { popupClose(true); });
  window.addEventListener("keydown", function (e) { if (pp && e.key === "Escape") { if (pp.dataset.rev) ppRev = pp.dataset.rev; popupClose(); } });

  var dlg = null, card, dim, chipK, chipT, chip, ok, lastFocus = null, isOpen = false, closing = null;
  var EIN = "cubic-bezier(.16,1,.3,1)", EHAND = "cubic-bezier(.2,.8,.2,1)", EOUT = "cubic-bezier(.7,0,.84,0)";
  function reduce() { return BG.reduced(); }
  function sheetMode() { return !!(window.matchMedia && matchMedia("(max-width: 640px)").matches); }
  function labelOf(el) {
    var t = ((el.innerText || el.textContent || "") + "").replace(/\s+/g, " ").trim();
    if (!t) t = (el.getAttribute("aria-label") || "").trim();
    if (t.length > 34) t = t.slice(0, 32) + "…";
    return t;
  }
  function build() {
    dlg = document.createElement("div");
    dlg.className = "h-dn";
    dlg.hidden = true;
    dlg.innerHTML = '<div class="h-dn-dim"></div><div class="h-dn-card" role="dialog" aria-modal="true" aria-labelledby="hDnT" aria-describedby="hDnD"><span class="h-dn-grip" aria-hidden="true"></span>' +
      '<span class="h-dn-ic" aria-hidden="true"><svg viewBox="0 0 32 32"><g transform="rotate(-45 16 16)"><rect class="h-dn-l" x="3.5" y="11.6" width="11.4" height="8.8" rx="4.4"/><rect class="h-dn-r" x="17.1" y="11.6" width="11.4" height="8.8" rx="4.4"/><path class="h-dn-s" d="M16 5.2v2.6M16 24.2v2.6"/></g></svg></span>' +
      '<p class="h-dn-chip"><span class="h-dn-k"></span><span class="h-dn-n"></span></p><h2 class="h-dn-t" id="hDnT">아직 열리지 않는 시안 화면이에요</h2><p class="h-dn-d" id="hDnD"><span>지금 보시는 페이지는 도아 BUILDGO 홈페이지 시안이에요.</span><span>메뉴와 버튼은 실제 사이트를 만들 때 연결돼요.</span></p><button type="button" class="h-dn-ok">확인</button></div>';
    document.body.appendChild(dlg);
    card = dlg.querySelector(".h-dn-card"); dim = dlg.querySelector(".h-dn-dim"); chip = dlg.querySelector(".h-dn-chip"); chipK = dlg.querySelector(".h-dn-k"); chipT = dlg.querySelector(".h-dn-n"); ok = dlg.querySelector(".h-dn-ok");
    ok.addEventListener("click", close);
    dim.addEventListener("click", close);
    dlg.addEventListener("wheel", function (e) { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    dlg.addEventListener("touchmove", function (e) { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    drag();
  }
  function open(name, el, e) {
    if (!dlg) build();
    var label = name || (el ? labelOf(el) : "");
    chipK.textContent = el && el.tagName === "A" ? "누른 링크" : "누른 버튼";
    chipT.textContent = label;
    chip.hidden = !label;
    lastFocus = el || document.activeElement;
    if (closing) { closing.onfinish = null; closing = null; card.getAnimations().forEach(function (x) { x.cancel(); }); dim.getAnimations().forEach(function (x) { x.cancel(); }); }
    dlg.hidden = false;
    isOpen = true;
    document.documentElement.classList.add("h-dn-lock");
    card.style.transform = "";
    var sheet = sheetMode();
    dlg.classList.toggle("is-sheet", sheet);
    if (!reduce() && card.animate) {
      var r = card.getBoundingClientRect(), px = e && e.clientX ? e.clientX : r.left + r.width / 2, py = e && e.clientY ? e.clientY : r.top + r.height / 2;
      var ox = Math.max(-40, Math.min(r.width + 40, px - r.left)), oy = Math.max(-40, Math.min(r.height + 40, py - r.top));
      dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EIN });
      if (sheet) card.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 560, easing: EIN });
      else { card.style.transformOrigin = ox + "px " + oy + "px"; card.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "scale(1)" }], { duration: 520, easing: EIN }); }
      [].forEach.call(card.querySelectorAll(".h-dn-ic, .h-dn-chip, .h-dn-t, .h-dn-d, .h-dn-ok"), function (x, i) { x.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 560, delay: 70 + i * 55, easing: EIN, fill: "backwards" }); });
      var L = card.querySelector(".h-dn-l"), R = card.querySelector(".h-dn-r"), S = card.querySelector(".h-dn-s");
      L.animate([{ transform: "translateX(2.2px)" }, { transform: "translateX(2.2px)", offset: 0.35 }, { transform: "translateX(0)" }], { duration: 760, delay: 120, easing: EHAND, fill: "backwards" });
      R.animate([{ transform: "translateX(-2.2px)" }, { transform: "translateX(-2.2px)", offset: 0.35 }, { transform: "translateX(0)" }], { duration: 760, delay: 120, easing: EHAND, fill: "backwards" });
      S.animate([{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }], { duration: 760, delay: 120, easing: "linear", fill: "backwards" });
    }
    ok.focus({ preventScroll: true });
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    var done = function () {
      dlg.hidden = true;
      card.style.transform = "";
      document.documentElement.classList.remove("h-dn-lock");
      if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    };
    if (reduce() || !card.animate) { done(); return; }
    var sheet = dlg.classList.contains("is-sheet"), cur = card.style.transform || "translateY(0)";
    dim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EOUT, fill: "forwards" });
    var a = sheet ? card.animate([{ transform: cur }, { transform: "translateY(100%)" }], { duration: 300, easing: EOUT, fill: "forwards" }) : card.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.96)" }], { duration: 200, easing: EOUT, fill: "forwards" });
    closing = a;
    a.onfinish = function () { closing = null; done(); card.getAnimations().forEach(function (x) { x.cancel(); }); dim.getAnimations().forEach(function (x) { x.cancel(); }); };
  }
  function drag() {
    var y0 = 0, dy = 0, t0 = 0, on = false, id = null;
    card.addEventListener("pointerdown", function (e) { if (!dlg.classList.contains("is-sheet") || e.target.closest("button")) return; on = true; id = e.pointerId; y0 = e.clientY; dy = 0; t0 = e.timeStamp; card.setPointerCapture(id); });
    card.addEventListener("pointermove", function (e) { if (!on || e.pointerId !== id) return; dy = e.clientY - y0; var y = dy > 0 ? dy : dy * 0.2; card.style.transform = "translateY(" + y.toFixed(1) + "px)"; });
    function end(e) {
      if (!on || e.pointerId !== id) return;
      on = false;
      var v = dy / Math.max(1, e.timeStamp - t0);
      if (dy > 90 || (dy > 24 && v > 0.5)) { close(); return; }
      var cur = card.style.transform;
      card.style.transform = "";
      if (cur && card.animate && !reduce()) card.animate([{ transform: cur }, { transform: "translateY(0)" }], { duration: 420, easing: EHAND });
    }
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }
  A.notice = function (name, el, ev) { open(name || "", el || null, ev || null); };

  window.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "Tab") { e.preventDefault(); e.stopPropagation(); ok.focus(); }
  }, true);
  window.addEventListener("hashchange", function () { if (isOpen) close(); });

  function isHome() { var h = location.hash; return !h || h === "#" || h === "#/" || /^#\/\?/.test(h); }
  function intro() {
    var html = '<div class="o1-cols">' + OPCOLS.map(function (c, i) { return '<div class="o1-c"><div class="o1-im"><img src="' + photo(c[0]) + '" alt=""></div><p class="o1-k"><span><b>0' + (i + 1) + "</b>" + c[1] + "</span></p></div>"; }).join("") + "</div>" +
      '<div class="o1-full"><img src="' + photo("n_dusk") + '" alt=""></div><i class="o1-ln l1"></i><i class="o1-ln l2"></i>' +
      OPCOLS.map(function (c, i) { return '<p class="o1-w w' + (i + 1) + '"><span>' + c[1] + "</span></p>"; }).join("") + '<i class="o1-dot"></i><i class="o1-dot"></i>' +
      '<div class="o1-msg"><p class="o1-m1"><span>세 회사에 따로 맡기던 일을</span></p><p class="o1-m2"><span>도아는 한 회사가 한 번에.</span></p></div>' +
      '<div class="o1-end">' + BG.doaMark("o1-mk") + '<p class="o1-e1"><span>설계 · 시공 · 분양까지 한 번에, 그래서</span></p><p class="o1-e2"><span>더 저렴합니다<i>.</i></span></p></div>';
    BG.opening({
      key: "doa-pick-intro1", cls: "h-o1", html: html, total: 7700,
      start: function (el, at, anim) { merge(el, anim, 2750, 5500); },
      exit: function (el) {
        el.classList.add("out");
        BG.mo.play(document.querySelectorAll(".hd .logo, .hd .gnb a, .hd-r > *"), "up", { y: 10, stagger: 40, delay: 380, dur: 700 });
        BG.mo.play([".h-kick", ".h-h1", ".h-wk", ".h-or", ".h-sch", ".h-pop"].map(function (s) { return document.querySelector(s); }), "up", { y: 28, stagger: 110, delay: 300, dur: 950 });
        return 950;
      },
      after: function () { setTimeout(popupMaybe, 350); }
    });
  }
  function merge(el, anim, t0, t1) {
    var ws = [].slice.call(el.querySelectorAll(".o1-w")), dots = el.querySelectorAll(".o1-dot"), box = el.getBoundingClientRect();
    var rs = ws.map(function (w) { return w.getBoundingClientRect(); });
    var sep = parseFloat(getComputedStyle(ws[0]).fontSize) * .85, total = sep * 2;
    rs.forEach(function (r) { total += r.width; });
    var k = Math.min(1, (box.width - 48) / total), x = (box.width - total * k) / 2, cy = box.height * (box.width > 640 ? .4 : .37);
    ws.forEach(function (w, i) {
      var r = rs[i];
      anim(w, [{ transform: "none" }, { transform: "translate(" + (x - r.left) + "px," + (cy - r.height * k / 2 - r.top) + "px) scale(" + k + ")" }], { duration: 950, delay: t0, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
      x += r.width * k;
      if (i < 2) {
        var t = "translate(" + (x + sep * k / 2 - 7) + "px," + (cy - 7) + "px)";
        anim(dots[i], [{ transform: t + " scale(0)" }, { transform: t + " scale(1)" }], { duration: 420, delay: t0 + 650, easing: "cubic-bezier(.2,.7,.1,1)", fill: "forwards" });
        anim(dots[i], [{ transform: t + " scale(1)" }, { transform: t + " scale(0)" }], { duration: 360, delay: t1, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
        x += sep * k;
      }
    });
  }
  if (isHome()) intro(); else document.documentElement.classList.remove("intro-pending");

  window.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button) return;
    var t = e.target && e.target.closest ? e.target : null;
    if (!t || (dlg && dlg.contains(t))) return;
    var up = t.closest('[data-act="h-top"]');
    if (up) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce() ? "auto" : "smooth" }); return; }
    var n = t.closest('[data-act="h-note"]');
    if (n) { e.preventDefault(); open(n.getAttribute("data-name") || labelOf(n), n, e); return; }
    var a = t.closest("a[href]");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    if (/^(https?:|tel:|mailto:)/i.test(h)) { e.preventDefault(); open(labelOf(a), a, e); }
  });
  document.addEventListener("click", function () { setTimeout(badge, 0); setTimeout(qkLift, 80); });
  window.addEventListener("resize", qkLift);
  window.addEventListener("storage", badge);
  window.addEventListener("app:quote", badge);

  A.views.home = home;
  A.views.about = about;
  A.views.pm = pm;
  A.views.finance = finance;
  A.views.faq = faq;
  A.views.qna = qna;
  A.views.partner = partner;
  A.views.motion = motion;
  A.after.push(frame);
  A.popup = { cfg: popCfg, def: POPDEF, open: popupOpen, src: imgSrc };
  A.homeFeed = { list: feedList, def: FEED, media: feedMedia, co: co };
  A.motion.push(
    [".h-kick", "up", { y: 12, delay: 100 }],
    [".h-h1", "lines", { delay: 180, gap: 120, dur: 1100 }],
    [".h-wk-i", "up", { y: 18, stagger: 70, delay: 420 }],
    [".h-or", "up", { y: 12, delay: 760 }],
    [".h-sch", "up", { y: 22, delay: 820 }],
    [".h-pop", "up", { y: 14, delay: 940 }],
    [".h-sec-h", "up", { y: 18 }],
    [".h-fd", "card", { y: 28, stagger: 80, max: 9 }],
    [".h-rec-col", "up", { y: 18, stagger: 80 }],
    [".h-door", "card", { y: 36, stagger: 110 }],
    [".h-co-l1, .h-co-l2", "lines", { gap: 100 }],
    [".h-jb", "up", { y: 18, stagger: 90 }],
    [".h-pt-f li", "up", { y: 14, stagger: 80 }],
    [".h-mo-r", "up", { y: 18, stagger: 90 }],
    [".h-br-l li", "up", { y: 16, stagger: 70 }],
    [".h-fq-ask", "up", { y: 18 }],
    [".h-co-body p", "up", { y: 16, stagger: 70 }],
    [".h-three li", "up", { y: 20, stagger: 110 }],
    [".h-pc-col", "up", { y: 24, stagger: 120 }],
    [".h-qt h2", "lines", { gap: 110 }],
    [".h-qc", "card", { y: 30, stagger: 120 }],
    [".h-wide", "wipe", { dur: 1200 }],
    [".h-h2", "lines", { gap: 100 }],
    [".h-row", "up", { y: 14, stagger: 60, max: 8 }],
    [".h-bq", "up", { y: 18, stagger: 90 }],
    [".h-fq", "up", { y: 14, stagger: 50, max: 7 }],
    [".h-qrow", "up", { y: 10, stagger: 40, max: 10 }],
    [".h-ask", "up", { y: 20 }]
  );
})();
