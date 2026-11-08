(function () {
  var A = window.APP, D = A.D, esc = A.esc, I = A.I, photo = A.photo, app = A.app, BG = window.BG;
  var IC = {
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7M12 14.6v2.2"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z"/><path d="M8.5 10.5h7"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.2v.3"/><circle cx="12" cy="12" r="8.5"/></svg>'
  };
  var POP = [["시행사 찾기", "#/companies?cat=dev"], ["시공사 찾기", "#/companies?cat=build"], ["자재 구매", "#/mall"], ["구조기술사", "#/search?q=" + encodeURIComponent("구조기술사")], ["PM 상담", "#/pm"], ["PF·금융 상담", "#/finance"]];
  var FEED = [
    { v: "v1459", co: "c13", t: "분당 병원 실내 마감 — 경량 골조 작업", at: "2026.11.07" },
    { ph: "steel_hall", co: "c3", t: "김포시 물류센터 철골 공사", at: "2026.11.07" },
    { v: "v4010", co: "c15", t: "원주시 공동주택 신축 — 타워크레인 양중", at: "2026.11.06" },
    { ph: "pf_water", co: "c4", t: "송파구 공동주택 옥상 방수", at: "2026.11.06" },
    { ph: "frame_work", co: "c1", t: "하남시 근린생활시설 신축 — 골조 공사", at: "2026.11.05" },
    { v: "v1457", co: "c10", t: "의정부시 상가 외벽 조적", at: "2026.11.05" },
    { ph: "site_aerial", co: "c2", t: "용인시 공동주택 골조 공사", at: "2026.11.04" },
    { v: "v1439", co: "c8", t: "은평구 공동주택 인허가 도면 검토", at: "2026.11.03" },
    { ph: "pf_mep", co: "c7", t: "수원시 지식산업센터 전기 공사", at: "2026.11.02" }
  ];
  var DOORS = [
    { t: "업체 찾기", s: "시행 · 시공 · 자재", d: "시행사·시공사·자재 공급사를 분류별로 찾고, 채팅으로 조건을 확인한 뒤 연결합니다.", href: "#/companies", ph: "n_aerial" },
    { t: "전문가 찾기", s: "건축사 · 기술사 · 현장소장", d: "경력과 실적을 같은 기준으로 비교해 고릅니다.", href: "#/experts", ph: "w_review" },
    { t: "자재몰", s: "사업자 회원가", d: "자재를 고르고 온라인 서명까지 마치면 견적서를 받습니다.", href: "#/mall", ph: "mt_warehouse" },
    { t: "PM", s: "사업 관리", d: "부지 매입 검토부터 준공 후 매각까지 관리합니다.", href: "#/pm", ph: "n_plan" },
    { t: "금융", s: "PF · 브릿지론 · 에쿼티", d: "상황에 맞는 자금조달 구조를 제안합니다.", href: "#/finance", ph: "city_night" }
  ];
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
  var CO_LAST = "(주)도아가 구축한 'LH 매입약정사업 전문 연합' 의 특권을 누려보시길 바랍니다.";
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
  function workOf(c) { return c.works && c.works.length ? A.workNames(c.works.slice(0, 1))[0] : A.typeName(c.type); }
  function pageWrap(head, body) { return '<div class="lp h-pg">' + head + body + "</div>"; }
  function today() { var d = new Date(); return d.getFullYear() + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + ("0" + d.getDate()).slice(-2); }

  function heroHtml() {
    return '<section class="h-top"><p class="h-kick">설계 · 시공 · 분양 — LH 민간신축매입약정사업 전문기업 도아</p><h1 class="h-h1">어떤 업무를<br>진행하시나요?</h1>' +
      '<form class="h-sch" id="hSch" role="search"><input name="q" type="search" placeholder="업체·전문가·자재를 한 번에 찾기 (예: 시공사, 구조기술사, 철근)" aria-label="찾을 업무" autocomplete="off" enterkeyhint="search"><button type="submit" class="h-sch-go" aria-label="검색">' + I.search + "</button></form>" +
      '<p class="h-pop"><span>많이 찾는 업무</span>' + POP.map(function (x) { return '<a href="' + x[1] + '">' + esc(x[0]) + "</a>"; }).join("") + "</p></section>";
  }
  function feedHtml() {
    var cards = FEED.map(function (f, i) {
      var c = co(f.co), media = f.v
        ? '<video class="h-vid" muted playsinline loop preload="none" poster="media/' + f.v + '.jpg" aria-label="' + esc(c.name + " 현장 작업 영상") + '"><source src="media/' + f.v + '.mp4" type="video/mp4"></video><span class="h-fd-tag">현장 영상</span>'
        : '<img loading="lazy" src="' + photo(f.ph) + '" alt="' + esc(f.t) + '">';
      return '<a class="h-fd' + (i === 0 ? " h-fd-big" : "") + '" href="#/company/' + c.id + '"><div class="h-fd-m">' + media + '</div><div class="h-fd-c"><p class="h-fd-co"><b>' + esc(c.name) + "</b><time>" + esc(f.at) + '</time></p><p class="h-fd-t">' + esc(f.t) + '</p><p class="h-fd-k">' + esc(workOf(c) + " · " + c.region + " " + c.city) + "</p></div></a>";
    }).join("");
    return '<section class="h-feed" aria-labelledby="hFeedT"><div class="h-sec-h"><div><p class="h-eye">지금 현장에서</p><h2 id="hFeedT">입점 업체가 올린<br>현장 기록입니다.</h2></div><p class="h-sec-s">시공 사진과 작업 영상을 업체가 직접 올립니다. 누르면 그 업체의 실적과 면허를 볼 수 있습니다.</p><a class="h-more" href="#/companies">업체 전체 보기 ' + I.arrow + '</a></div><div class="h-fd-grid">' + cards + "</div></section>";
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
  function quoteHtml() {
    return '<section class="h-qt" aria-labelledby="hQtT"><div class="h-qt-bg" aria-hidden="true"><img loading="lazy" src="' + photo("hero_night") + '" alt=""></div><div class="h-qt-in"><p class="h-eye">견적서 받기</p><h2 id="hQtT">편하게 연락 주세요.<br>담당 매니저가 바로 답합니다.</h2><p class="h-qt-s">업체·전문가·자재 견적을 한 장의 견적서로 받습니다.</p><div class="h-qt-cards">' +
      '<a class="h-qc" href="#/quote"><div><b>견적서 받기</b><p>고른 업체·전문가·자재를 모아 한 번에 견적을 받습니다.</p><span class="go">견적서 받기 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("w_women") + '" alt=""></a>' +
      '<a class="h-qc" href="#/join"><div><b>회원가입</b><p>가입 목적을 남기면 맞는 업체·자재·PM·금융을 추천해 드립니다.</p><span class="go">회원가입 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("n_plan") + '" alt=""></a></div></div></section>';
  }

  function home() {
    var user = A.keep("user");
    app.innerHTML = '<div class="h-home">' + heroHtml() + feedHtml() + recHtml(user) + doorsHtml() + stepsHtml() + coHtml(true) + quoteHtml() + "</div>";
    var f = document.getElementById("hSch");
    if (window.matchMedia && matchMedia("(max-width: 600px)").matches) f.q.placeholder = "예: 시공사, 구조기술사, 철근";
    f.onsubmit = function (ev) { ev.preventDefault(); var q = f.q.value.trim(); location.hash = "#/search" + BG.qs({ q: q }); };
  }

  function askHtml(to, title, sub) {
    return '<section class="h-ask"><div class="h-ask-t"><span class="h-ask-i" aria-hidden="true">' + IC.chat + "</span><div><h2>" + esc(title) + "</h2><p>" + esc(sub) + '</p></div></div><div class="h-ask-b"><a class="btn h-btn" href="#/match?to=' + to + '">채팅으로 상담하기</a><a class="btn line-l h-btn" href="#/quote">견적서 받기</a></div></section>';
  }
  function quoteBox(q, a) { return '<blockquote class="h-bq"><p class="h-bq-q">' + esc(q) + "</p><p>" + esc(a) + '</p><a href="#/faq">자주 묻는 질문 전체 보기 ' + I.arrow + "</a></blockquote>"; }
  function rows(list) { return '<ol class="h-list">' + list.map(function (x) { return '<li class="h-row"><b>' + esc(x[0]) + "</b><p>" + esc(x[1]) + "</p></li>"; }).join("") + "</ol>"; }

  function about() {
    var facts = [["회사명", "(주)더원파트너스"], ["브랜드", "도아 (BUILDGO)"], ["대표", "권병철"], ["사업자등록번호", "399-86-03838"], ["주소", "서울 영등포구 국회대로 800 317호"], ["대표번호", "1588-9863"], ["이메일", "doadoa-kr@naver.com"], ["사업 분야", "PM · 시행 · 시공 · 금융 · 자재"], ["설계 실적", "2023년까지 직접 설계 109건"]];
    app.innerHTML = pageWrap(A.pageHead("회사 소개", "LH 민간신축매입약정사업 전문기업 도아 — (주)더원파트너스", "회사 소개"),
      '<div class="h-wide"><img src="' + photo("n_wide") + '" alt="바다 가까이 올라가는 아파트 신축 현장"></div>' + coHtml(true) +
      '<section class="h-sec"><h2 class="h-h2">회사 정보</h2><table class="spec h-spec">' + facts.map(function (f) { return "<tr><th>" + esc(f[0]) + "</th><td>" + esc(f[1]) + "</td></tr>"; }).join("") + "</table></section>" +
      askHtml("pm", "사업 참여를 상담해 보세요", "토지·기술·자본 중 무엇을 가지고 계신지부터 채팅으로 여쭙니다."));
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
      }).join("") + '<a class="h-fq-go" href="#/qna"><span><b>찾는 답이 없나요?</b> 문의게시판에 질문을 남겨 주세요. 질문은 전체 공개, 답변은 비밀로 드립니다.</span>' + I.arrow + "</a></section>");
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
  function qnaWrite() {
    var u = A.keep("user") || {};
    app.innerHTML = pageWrap(A.pageHead("질문 쓰기", "질문은 전체 공개, 답변은 비밀로 드립니다.", "문의게시판"),
      '<section class="h-sec"><form class="h-qw" id="hQw" novalidate><p class="h-qw-n">' + IC.lock + "<span>질문은 전체 공개, 답변은 비밀로 드립니다. 연락처나 주소처럼 남에게 보이면 안 되는 내용은 적지 말아 주세요.</span></p>" +
      '<div class="h-fld"><label for="hQc">분류</label><span class="selbox"><select id="hQc" name="cat">' + QCATS.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</select>" + I.down + "</span></div>" +
      '<div class="h-fld"><label for="hQt">제목</label><input class="inp" id="hQt" name="title" maxlength="60" placeholder="예: 토지는 있는데 설계와 금융이 어렵습니다"></div>' +
      '<div class="h-fld"><label for="hQb">내용</label><textarea class="inp h-ta" id="hQb" name="body" rows="8" placeholder="사업지 지역, 진행 단계, 궁금한 점을 적어 주세요"></textarea></div>' +
      '<div class="h-fld"><label for="hQw2">작성자</label><input class="inp" id="hQw2" name="who" maxlength="20" value="' + esc(u.name || "") + '" placeholder="이름 (목록에는 가려서 보입니다)"></div>' +
      '<p class="err" id="hQerr" role="alert"></p><div class="h-qw-b"><a class="btn line-l h-btn" href="#/qna">취소</a><button type="submit" class="btn h-btn">질문 올리기</button></div></form></section>');
    document.getElementById("hQw").onsubmit = function (ev) {
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
    if (r.id === "write") qnaWrite();
    else if (r.id) qnaView(r.id);
    else qnaList();
  }

  var vio = null;
  function videos() {
    if (vio) { vio.disconnect(); vio = null; }
    var vs = app.querySelectorAll("video.h-vid");
    if (!vs.length || BG.reduced() || !("IntersectionObserver" in window)) return;
    vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { v.preload = "auto"; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.35 });
    [].forEach.call(vs, function (v) { v.muted = true; vio.observe(v); });
  }
  var TAB = { home: "home", search: "search", companies: "search", company: "search", experts: "search", expert: "search", match: "search", mall: "mall", item: "mall", cart: "mall", sign: "quote", quote: "quote", my: "my", login: "my", join: "my" };
  function badge() {
    var n = 0;
    try { n = typeof A.quoteCount === "function" ? +A.quoteCount() || 0 : 0; } catch (e) { n = 0; }
    [].forEach.call(document.querySelectorAll(".h-qn"), function (b) { b.hidden = !n; b.textContent = n > 99 ? "99+" : String(n); });
    var q = document.getElementById("hQ"); if (q) q.setAttribute("aria-label", n ? "견적서 받기, 담은 항목 " + n + "개" : "견적서 받기");
  }
  function frame(r) {
    var t = TAB[r.name] || "";
    document.body.classList.toggle("h-notab", r.name === "match" || r.name === "item" || r.name === "sign");
    [].forEach.call(document.querySelectorAll("#hTab a"), function (a) { var on = a.dataset.tab === t; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var u = A.keep("user"), j = document.getElementById("hJoin");
    if (j) { j.textContent = u && u.name ? u.name + "님" : "회원가입"; j.setAttribute("href", u ? "#/my" : "#/join"); }
    badge();
    videos();
  }

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
    var html = '<div class="h-i-bg"><img src="../assets/photos/d_hall_line.jpg?v=1" alt=""><img src="' + photo("n_crew") + '" alt=""><img src="' + photo("n_glassbox") + '" alt=""></div><div class="h-i-veil"></div>' +
      '<div class="h-i-logo">' + BG.doaMark("h-i-mk") + '<p class="h-i-tag">LH 민간신축매입약정사업 전문기업</p></div>' +
      '<p class="h-i-word" aria-hidden="true"><span>설계</span><span>시공</span><span>분양</span></p>' +
      '<div class="h-i-end"><p class="h-i-e1">설계부터 시공, 분양까지</p><p class="h-i-e2">한 회사가 한 번에 하니까<br><b>더 합리적인 가격으로.</b></p><div class="h-i-e3">' + BG.doaMark("h-i-mk2") + "<span>BUILDGO</span></div></div>";
    BG.opening({
      key: "doa-pick-intro", cls: "h-in", html: html, total: 9400,
      start: function (el, at) {
        function on(sel, v) { var n = el.querySelector(sel); if (n) n.classList.toggle("on", v !== false); }
        at(80, function () { on(".h-i-logo"); });
        at(2300, function () { on(".h-i-tag"); });
        at(3300, function () { el.classList.add("w1"); });
        at(4300, function () { el.classList.remove("w1"); el.classList.add("w2"); });
        at(5300, function () { el.classList.remove("w2"); el.classList.add("w3"); });
        at(6300, function () { el.classList.remove("w3"); el.classList.add("fin"); });
      },
      exit: function (el, skipped, anim) {
        el.classList.add("out");
        anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 120, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
        BG.mo.play(document.querySelectorAll(".hd .logo, .hd .gnb a, .hd-r > *"), "up", { y: 10, stagger: 40, delay: 300, dur: 700 });
        BG.mo.play([".h-kick", ".h-h1", ".h-sch", ".h-pop"].map(function (s) { return document.querySelector(s); }), "up", { y: 28, stagger: 110, delay: 260, dur: 950 });
        return 820;
      }
    });
  }
  if (isHome()) intro(); else document.documentElement.classList.remove("intro-pending");

  window.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button) return;
    var t = e.target && e.target.closest ? e.target : null;
    if (!t || (dlg && dlg.contains(t))) return;
    var n = t.closest('[data-act="h-note"]');
    if (n) { e.preventDefault(); open(n.getAttribute("data-name") || labelOf(n), n, e); return; }
    var a = t.closest("a[href]");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    if (/^(https?:|tel:|mailto:)/i.test(h)) { e.preventDefault(); open(labelOf(a), a, e); }
  });
  document.addEventListener("click", function () { setTimeout(badge, 0); });
  window.addEventListener("storage", badge);
  window.addEventListener("app:quote", badge);

  A.views.home = home;
  A.views.about = about;
  A.views.pm = pm;
  A.views.finance = finance;
  A.views.faq = faq;
  A.views.qna = qna;
  A.after.push(frame);
  A.motion.push(
    [".h-kick", "up", { y: 12, delay: 100 }],
    [".h-h1", "lines", { delay: 180, gap: 120, dur: 1100 }],
    [".h-sch", "up", { y: 22, delay: 480 }],
    [".h-pop", "up", { y: 14, delay: 620 }],
    [".h-sec-h", "up", { y: 18 }],
    [".h-fd", "card", { y: 28, stagger: 80, max: 9 }],
    [".h-rec-col", "up", { y: 18, stagger: 80 }],
    [".h-door", "card", { y: 36, stagger: 110 }],
    [".h-co-l1, .h-co-l2", "lines", { gap: 100 }],
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
