(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("bg4");
  var app = document.getElementById("app");
  var I = {
    chev: '<svg class="i" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    check: '<svg class="i" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>',
    search: '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    shield: '<svg class="i" viewBox="0 0 24 24"><path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
    home: '<svg class="i" viewBox="0 0 24 24"><path d="M4 11 12 4.5 20 11v8.5H4z"/></svg>'
  };
  var CAT_PH = { design: "f_draw3", frame: "pf_e2_1", interior: "f_kitchen", mep: "f_pipe", waterproof: "f_bath", exterior: "f_house3" };
  var EXP_PH = { e1: ["f_draw1", "f_draw2", "pf_e1_2"], e2: ["f_hero", "pf_e2_1", "pf_e2_2"], e3: ["f_kitchen2", "f_living", "f_living2"], e4: ["f_valve", "f_bath2", "pf_e4_1"], e5: ["f_bath", "pf_e5_2", "f_bath2"], e6: ["f_hero2", "f_house2", "pf_e6_2"] };
  var CASES = [
    { ph: "f_living2", t: "마포 34평 아파트", e: "e3" },
    { ph: "f_bath2", t: "욕실 전체 방수와 리모델링", e: "e5" },
    { ph: "pf_e1_2", t: "양평 단독주택 2층", e: "e1" },
    { ph: "f_living", t: "합정 오피스텔 거실", e: "e3" },
    { ph: "pf_e6_2", t: "일산 아파트 창호 교체", e: "e6" },
    { ph: "pf_e2_2", t: "판교 상가주택 골조", e: "e2" },
    { ph: "f_draw2", t: "성수동 다가구 리모델링 설계", e: "e1" },
    { ph: "pf_e4_1", t: "송도 아파트 배관 교체", e: "e4" },
    { ph: "pf_e5_2", t: "춘천 상가 옥상 방수", e: "e5" }
  ];
  var MCOLOR = { e1: "c1", e2: "c6", e3: "c3", e4: "c2", e5: "c4", e6: "c5" };
  var SIZE = ["20평 미만", "20~30평", "30~40평", "40평 이상", "잘 모름"];
  var WHEN = ["한 달 안", "1~3개월", "3개월 이후"];
  var BUDGET = ["1천만원 미만", "1천~3천만원", "3천~5천만원", "5천만원 이상"];

  function mono(e, cls) { return '<span class="mono ' + (MCOLOR[e.id] || "") + (cls ? " " + cls : "") + '">' + esc(BG.initial(e.name)) + "</span>"; }
  function fromPrice(e) { var p = e.packages.filter(function (x) { return x.price; })[0]; return p ? p.price : null; }
  function priceText(e) { var p = fromPrice(e); return p ? won(p) + '원<small>부터</small>' : '현장 실측 후 견적'; }
  function tierBy(id) { return D.tiers.filter(function (t) { return t.id === id; })[0]; }
  function gold() { return tierBy("gold"); }
  function goldPrice(m) { return Math.round(m.price * (100 - gold().discount) / 100 / 10) * 10; }
  function rv(html, i) { return html.replace('class="', 'style="transition-delay:' + (i * 60) + 'ms" class="rv '); }

  function svcCard(e, i) {
    var c = BG.CAT[e.category];
    return rv('<a class="svc" href="#/service/' + e.id + '"><div class="ph"><img loading="lazy" src="' + photo(EXP_PH[e.id][0]) + '" alt="' + esc(e.portfolio[0].title) + '">' + (e.verified.license ? '<span class="tag">' + I.shield + esc(e.verified.license) + "</span>" : "") + "</div>" +
      "<h3>" + esc(e.service) + '</h3><div class="meta"><span class="st">' + I.star + e.rating + "</span><span>후기 " + won(e.reviews) + "</span><i></i><span>" + esc(c.name) + '</span></div><p class="price num">' + priceText(e) + '</p><div class="seller">' + mono(e) + esc(e.name) + "</div></a>", i || 0);
  }
  function matPrice(m) {
    if (S.member) { var t = S.tier(); return '<div class="pr"><span class="rate">' + t.discount + '%</span><span class="now num" data-id="' + m.id + '" data-v="' + S.priceOf(m) + '">' + won(S.priceOf(m)) + "원</span><s class=\"num\">" + won(m.price) + "원</s></div>"; }
    return '<div class="pr"><span class="now num" data-id="' + m.id + '" data-v="' + m.price + '">' + won(m.price) + '원</span><span class="unit">/ ' + esc(m.unit) + '</span></div><p class="hint num">골드 회원가 ' + won(goldPrice(m)) + "원</p>";
  }
  function matCard(m, i) {
    return rv('<a class="mat" href="#/item/' + m.id + '"><div class="ph"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"><span class="stock' + (m.stock === "당일 출고" ? " today" : "") + '">' + esc(m.stock) + "</span></div><h3>" + esc(m.name) + '</h3><p class="spec">' + esc(m.spec) + "</p>" + matPrice(m) + "</a>", i || 0);
  }
  function ladder() {
    var me = S.tier();
    return '<div class="ladder">' + D.tiers.map(function (t) { return '<div class="' + (me && me.id === t.id ? "me" : "") + '"><b class="num">' + t.discount + "%</b><span>" + esc(t.name) + "</span></div>"; }).join("") + "</div>";
  }
  function switchHtml(id) {
    return '<label class="switch"><span><b>회원가로 보기</b><small>' + (S.member ? esc(D.demoUser.name) + "님 · " + esc(S.tier().name) + " 등급가 적용 중" : "로그인하면 등급별 단가로 바뀌어요") + '</small></span><input type="checkbox" id="' + id + '"' + (S.member ? " checked" : "") + '><span class="tg"></span></label>';
  }
  function tierCards() {
    var me = S.tier();
    return '<div class="tiers">' + D.tiers.map(function (t, i) {
      var cls = { basic: "", silver: "silver", gold: "gold", vip: "vip" }[t.id];
      var badge = me && me.id === t.id ? '<span class="pill pill-ink me">내 등급 · ' + won(D.demoUser.points) + "P</span>" : t.id === "gold" ? '<span class="pill me">사업자 시작 등급</span>' : "";
      return rv('<div class="tier ' + cls + '">' + badge + '<span class="tn">' + esc(t.name) + '</span><span class="td num">' + t.discount + "%<small>할인</small></span>" + '<span class="tp">적립 ' + t.pointRate + "%</span><span class=\"tr\">" + esc(t.rule) + "</span></div>", i);
    }).join("") + "</div>" +
      '<div class="refer rv"><div><b>추천 적립</b><p>' + esc(D.points.referralRule) + "</p></div><span class=\"pt num\">" + won(D.points.referral) + "P</span></div>";
  }
  function caseTile(x, i) {
    var e = BG.EXP[x.e];
    return rv('<a class="case" href="#/service/' + e.id + '"><img loading="lazy" src="' + photo(x.ph) + '" alt="' + esc(x.t) + '"><span class="cap"><small>' + esc(BG.CAT[e.category].name) + " · " + esc(e.name) + "</small><b>" + esc(x.t) + "</b></span></a>", i);
  }
  function pkgCard(e, sel, cta) {
    return '<div class="pkg-card"><div class="pkg-tabs" data-pkgtabs>' + e.packages.map(function (p, i) { return '<button type="button" data-pk="' + i + '" class="' + (i === sel ? "on" : "") + '">' + esc(p.tier) + "</button>"; }).join("") + '</div><div class="pkg-in" data-pkgin></div>' + (cta || "") + "</div>";
  }
  function fillPkg(root, e, i) {
    var p = e.packages[i];
    var price = p.price == null ? "현장 견적" : p.price === 0 ? "무료" : won(p.price) + "원";
    var note = p.price == null ? "실측 후 확정" : p.price === 0 ? "현장 방문" : "VAT 포함";
    root.querySelector("[data-pkgin]").innerHTML = '<p class="pp num">' + price + "<small>" + note + '</small></p><p class="pt">' + esc(p.tier) + " · " + esc(e.tagline) + "</p><ul>" + p.items.map(function (t) { return "<li>" + I.check + esc(t) + "</li>"; }).join("") + "<li>" + I.check + "작업 기간<span>" + (p.days ? p.days + "일" : "협의") + "</span></li></ul>";
    root.querySelectorAll("[data-pk]").forEach(function (b) { b.classList.toggle("on", +b.dataset.pk === i); });
  }
  function bindPkg(root, e, sel) {
    fillPkg(root, e, sel);
    root.querySelector("[data-pkgtabs]").addEventListener("click", function (ev) { var b = ev.target.closest("[data-pk]"); if (b) fillPkg(root, e, +b.dataset.pk); });
  }

  function home() {
    var q = [["e3", 0], ["e5", 0], ["e4", 1]];
    var m1 = BG.MAT.m1;
    var top = D.experts.slice().sort(function (a, b) { return b.reviews - a.reviews; }).slice(0, 4);
    app.innerHTML =
      '<section class="hero"><div class="wrap hero-in"><div class="hero-copy">' +
      '<p class="eyebrow">설계 · 시공 · 자재를 한 곳에서</p>' +
      '<h1><span class="l">집 짓는 일,</span><span class="b">전문가와 자재를 한 번에</span></h1>' +
      '<p class="lead">면허와 후기를 확인한 전문가에게 견적을 받고, <br>필요한 자재는 회원 등급가로 바로 주문하세요.</p>' +
      '<form class="search" data-search><div class="seg" role="tablist" aria-label="검색 대상"><button type="button" class="on" data-seg="svc" role="tab" aria-selected="true">시공 전문가</button><button type="button" data-seg="mat" role="tab" aria-selected="false">회원 자재</button></div>' +
      '<div class="field">' + I.search + '<input name="q" id="heroQ" placeholder="어떤 공사를 계획하세요?" aria-label="검색어"><button class="btn btn-pri" type="submit">' + I.search + "<span>검색</span></button></div></form>" +
      '<div class="pop" id="pop"></div></div>' +
      '<div class="hero-art"><div class="photo"><img src="' + photo("f_house2") + '" alt="수영장이 있는 흰 단독주택"></div>' +
      '<div class="fc fc-quote"><div class="fc-h"><b>욕실 리모델링 견적</b><span class="pill pill-blue">견적 3건 도착</span></div>' +
      q.map(function (x) { var e = BG.EXP[x[0]], p = e.packages[x[1]]; return '<div class="qrow">' + mono(e) + "<div>" + esc(e.name) + "<small>" + esc(p.tier) + " · 평균 응답 " + e.responseHours + '시간</small></div><strong class="num">' + won(p.price) + "원</strong></div>"; }).join("") + "</div>" +
      '<div class="fc fc-mat"><img src="' + photo(m1.photo) + '" alt=""><div><p>보드·합판</p><b>' + esc(m1.name) + " " + esc(m1.spec.split(" ")[0]) + '</b><div class="pr num">' + won(goldPrice(m1)) + "원<s>" + won(m1.price) + "원</s></div></div></div>" +
      '<div class="fc fc-tier"><span class="tb">GOLD</span><div><b>골드 회원</b><span>자재 6% 할인 · 적립 1.5%</span></div></div></div>' +
      "</div></section>" +
      '<section class="steps"><div class="wrap"><ol>' + [["요청서 올리기", "공사 종류·규모·일정만 고르면 끝나요"], ["견적 비교", "패키지 가격과 후기로 전문가를 골라요"], ["계약·시공", "계약과 대금은 전문가와 직접 진행해요"], ["자재 주문", "필요한 자재는 회원 등급가로 주문해요"]].map(function (s, i) { return rv("<li><b>0" + (i + 1) + "</b><strong>" + s[0] + "</strong><span>" + s[1] + "</span></li>", i); }).join("") + "</ol></div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec-h"><div><h2>어떤 공사를 계획하세요?</h2><p>분야를 고르면 맞는 전문가와 패키지를 보여 드려요</p></div><a class="more" href="#/services">전체 보기' + I.chev + "</a></div>" +
      '<div class="cat-grid">' + D.categories.map(function (c, i) { return rv('<a class="cat" href="#/services?c=' + c.id + '"><div class="ph"><img loading="lazy" src="' + photo(CAT_PH[c.id]) + '" alt=""></div><b>' + esc(c.name) + "</b><span>" + esc(c.desc) + "</span></a>", i); }).join("") + "</div></div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec-h"><div><h2>견적 요청이 많은 서비스</h2><p>기본·표준·프리미엄 패키지로 가격을 먼저 보고 고르세요</p></div><a class="more" href="#/services">서비스 전체' + I.chev + "</a></div>" +
      '<div class="svc-grid rail">' + top.map(svcCard).join("") + "</div></div></section>" +
      '<section class="band"><div class="wrap mall-in"><div class="mall-copy"><p class="eyebrow">회원 자재몰</p><h2>등급이 오를수록<br>자재 단가가 내려갑니다</h2><p>사업자 회원은 골드 등급부터 시작해요. 시공에 필요한 자재를 현장으로 바로 받아 보세요.</p>' +
      switchHtml("homeSw") + ladder() + '<a class="btn btn-line" href="#/mall">자재몰 둘러보기' + I.chev + "</a></div>" +
      '<div class="mat-grid" id="homeMat">' + D.materials.slice(0, 8).map(matCard).join("") + "</div></div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec-h"><div><h2>회원 등급 혜택</h2><p>최근 3개월 구매액으로 등급이 정해져요</p></div><a class="more" href="#/tiers">자세히' + I.chev + "</a></div>" + tierCards() + "</div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec-h"><div><h2>BUILDGO 전문가의 시공사례</h2><p>분야별 전문가가 직접 올린 현장이에요</p></div><a class="more" href="#/cases">사례 더 보기' + I.chev + "</a></div>" +
      '<div class="cases">' + CASES.slice(0, 5).map(caseTile).join("") + "</div></div></section>" +
      '<section class="partner"><div class="wrap"><div class="partner-in rv"><div><p class="eyebrow">전문가 입점</p><h2>설계·시공 기술을<br>패키지 상품으로 올리세요</h2><p>기본·표준·프리미엄 세 가지 패키지를 등록하면 고객이 가격과 범위를 비교해 바로 견적을 요청해요. 면허·사업자·보험을 확인한 업체에는 검증 표시가 붙어요.</p><a class="btn btn-white btn-lg" href="#/partner">전문가로 등록하기' + I.chev + "</a></div>" +
      pkgCard(BG.EXP.e1, 1, '<div class="pkg-cta"><span class="btn btn-line">문의</span><span class="btn btn-ink">견적 요청</span></div>') + "</div></div></section>";
    var pop = ["욕실 리모델링", "옥상 방수", "창호 교체", "주택 설계", "인테리어"];
    var popMat = ["석고보드", "구조용 합판", "강마루", "포세린 타일", "단열재"];
    function setPop(kind) { document.getElementById("pop").innerHTML = "<span>많이 찾는</span>" + (kind === "mat" ? popMat : pop).map(function (k) { return '<a href="#/search?q=' + encodeURIComponent(k) + "&t=" + kind + '">' + esc(k) + "</a>"; }).join(""); }
    setPop("svc");
    var form = app.querySelector("[data-search]");
    form.querySelector(".seg").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-seg]"); if (!b) return;
      form.querySelectorAll("[data-seg]").forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", on ? "true" : "false"); });
      form.dataset.kind = b.dataset.seg;
      document.getElementById("heroQ").placeholder = b.dataset.seg === "mat" ? "필요한 자재를 찾아보세요" : "어떤 공사를 계획하세요?";
      setPop(b.dataset.seg);
    });
    bindPkg(app.querySelector(".partner .pkg-card"), BG.EXP.e1, 1);
    bindSwitch("homeSw", function () { rerenderMat("homeMat", D.materials.slice(0, 8)); });
  }

  function rerenderMat(id, list) {
    var box = document.getElementById(id); if (!box) return;
    var before = {};
    box.querySelectorAll("[data-id]").forEach(function (el) { before[el.dataset.id] = +el.dataset.v; });
    box.innerHTML = list.map(matCard).join("");
    box.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
    box.querySelectorAll("[data-id]").forEach(function (el) { roll(el, before[el.dataset.id], +el.dataset.v); });
    var lad = document.querySelector(".ladder"); if (lad) lad.outerHTML = ladder();
  }
  function roll(el, from, to) {
    if (from == null || from === to || BG.reduced()) return;
    var t0 = performance.now(), dur = 520;
    function step(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = won(Math.round((from + (to - from) * e) / 10) * 10) + "원";
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function bindSwitch(id, after) {
    var sw = document.getElementById(id); if (!sw) return;
    sw.addEventListener("change", function () {
      S.member = sw.checked; S.save(); sync();
      var lab = sw.closest(".switch").querySelector("small");
      lab.textContent = S.member ? D.demoUser.name + "님 · " + S.tier().name + " 등급가 적용 중" : "로그인하면 등급별 단가로 바뀌어요";
      after();
      BG.toast(S.member ? D.demoUser.name + "님, 골드 등급가로 보여 드려요" : "정가로 보여 드려요");
    });
  }

  function crumb(parts) {
    return '<nav class="crumb" aria-label="현재 위치"><a href="#/" aria-label="홈">' + I.home + "</a>" + parts.map(function (p) { return I.chev + (p[1] ? '<a href="' + p[1] + '">' + esc(p[0]) + "</a>" : "<span>" + esc(p[0]) + "</span>"); }).join("") + "</nav>";
  }
  function services(r) {
    var c = r.query.c || "";
    var list = D.experts.filter(function (e) { return !c || e.category === c; });
    app.innerHTML = '<div class="wrap page">' + crumb([["시공 맡기기", c ? "#/services" : ""]].concat(c ? [[BG.CAT[c].name, ""]] : [])) +
      '<div class="page-h"><div><h1>' + (c ? esc(BG.CAT[c].name) : "시공 맡기기") + "</h1><p>" + (c ? esc(BG.CAT[c].desc) : "분야별 전문가의 패키지를 비교하고 견적을 요청하세요") + "</p></div></div>" +
      '<div class="toolbar"><div class="chips"><a class="chip' + (!c ? " on" : "") + '" href="#/services" style="display:inline-flex;align-items:center">전체</a>' + D.categories.map(function (x) { return '<a class="chip' + (c === x.id ? " on" : "") + '" href="#/services?c=' + x.id + '" style="display:inline-flex;align-items:center">' + esc(x.name) + "</a>"; }).join("") + "</div></div>" +
      '<div class="svc-grid">' + list.map(svcCard).join("") + "</div></div>";
  }
  function service(r) {
    var e = BG.EXP[r.id] || D.experts[0], c = BG.CAT[e.category];
    var shots = EXP_PH[e.id];
    var sel = Math.min(1, e.packages.length - 1);
    var v = e.verified;
    app.innerHTML = '<div class="wrap page">' + crumb([["시공 맡기기", "#/services"], [c.name, "#/services?c=" + c.id]]) +
      '<div class="detail" style="margin-top:20px"><div>' +
      '<div class="gal"><div class="main"><img id="gImg" src="' + photo(shots[0]) + '" alt=""></div><div class="thumbs">' + shots.map(function (k, i) { return '<button type="button" data-shot="' + k + '" class="' + (i ? "" : "on") + '" aria-label="사진 ' + (i + 1) + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div>" +
      '<h1 class="d-title">' + esc(e.service) + '</h1><div class="meta"><span class="st">' + I.star + e.rating + "</span><span>후기 " + won(e.reviews) + "</span><i></i><span>" + esc(e.region) + "</span><i></i><span>경력 " + e.years + "년</span></div>" +
      '<div class="vchips">' + [v.license ? v.license + " 확인" : "", v.business ? "사업자 확인" : "", v.insurance ? "보험 가입" : ""].filter(Boolean).map(function (t) { return "<span>" + I.check + esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="sellerbox">' + mono(e) + "<div><b>" + esc(e.name) + "</b><span>평균 응답 " + e.responseHours + "시간 이내 · " + esc(c.name) + '</span></div><button type="button" class="btn btn-line" data-act="ask">문의하기</button></div>' +
      '<nav class="tabs"><a class="on" href="#d-desc">서비스 설명</a><a href="#d-pf">포트폴리오</a><a href="#d-rev">후기 ' + e.reviews + "</a></nav>" +
      '<section class="dsec" id="d-desc"><h2>서비스 설명</h2><p>' + esc(e.tagline) + ". " + e.packages.map(function (p) { return esc(p.tier) + "은 " + esc(p.items.join(", ")); }).join(" / ") + ".</p></section>" +
      '<section class="dsec" id="d-pf"><h2>포트폴리오</h2><div class="pf">' + shots.map(function (k) { return '<div><img loading="lazy" src="' + photo(k) + '" alt=""></div>'; }).join("") + '</div><div class="pf-cap">' + e.portfolio.concat(e.portfolio).slice(0, 3).map(function (p) { return "<span>" + esc(p.title) + "</span>"; }).join("") + "</div></section>" +
      '<section class="dsec" id="d-rev"><h2>후기</h2><div class="revs">' + e.reviewsSample.map(function (x) { return '<div class="rev"><div class="rh"><b>' + "★".repeat(x.rating) + "</b><span>" + esc(x.author) + "</span></div><p>" + esc(x.text) + "</p></div>"; }).join("") + "</div></section></div>" +
      '<aside class="side">' + pkgCard(e, sel, '<div class="pkg-cta"><button type="button" class="btn btn-line" data-act="ask">문의</button><a class="btn btn-ink" href="#/request?e=' + e.id + '">견적 요청</a></div>') +
      '<p class="side-note">견적을 받아 보고 결정해도 비용이 들지 않아요. 계약과 대금은 전문가와 직접 주고받아요.</p></aside></div></div>';
    bindPkg(app.querySelector(".side .pkg-card"), e, sel);
    app.querySelector(".thumbs").addEventListener("click", function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("gImg").src = photo(b.dataset.shot); });
  }
  function mall(r) {
    var c = r.query.c || "";
    var list = D.materials.filter(function (m) { return !c || m.category === c; });
    app.innerHTML = '<div class="wrap page">' + crumb([["회원 자재몰", c ? "#/mall" : ""]].concat(c ? [[BG.MAT_CAT[c].name, ""]] : [])) +
      '<div class="page-h"><div><h1>' + (c ? esc(BG.MAT_CAT[c].name) : "회원 자재몰") + '</h1><p>등급이 오를수록 단가가 내려가요 · 일반 0% · 실버 3% · 골드 6% · VIP 10%</p></div></div>' +
      '<div class="toolbar"><div class="chips"><a class="chip' + (!c ? " on" : "") + '" href="#/mall" style="display:inline-flex;align-items:center">전체</a>' + D.materialCategories.map(function (x) { return '<a class="chip' + (c === x.id ? " on" : "") + '" href="#/mall?c=' + x.id + '" style="display:inline-flex;align-items:center">' + esc(x.name) + "</a>"; }).join("") + "</div>" + switchHtml("mallSw") + "</div>" +
      '<div class="mat-grid" id="mallMat">' + list.map(matCard).join("") + "</div></div>";
    bindSwitch("mallSw", function () { rerenderMat("mallMat", list); });
  }
  function item(r) {
    var m = BG.MAT[r.id] || D.materials[0];
    var rel = D.materials.filter(function (x) { return x.category === m.category && x.id !== m.id; });
    var shots = [m.photo].concat(rel.map(function (x) { return x.photo; })).slice(0, 3);
    var me = S.tier();
    app.innerHTML = '<div class="wrap page">' + crumb([["회원 자재몰", "#/mall"], [BG.MAT_CAT[m.category].name, "#/mall?c=" + m.category]]) +
      '<div class="detail" style="margin-top:20px"><div>' +
      '<div class="gal"><div class="main" style="aspect-ratio:4/3"><img id="gImg" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"></div><div class="thumbs">' + shots.map(function (k, i) { return '<button type="button" data-shot="' + k + '" class="' + (i ? "" : "on") + '" aria-label="사진 ' + (i + 1) + '" style="aspect-ratio:1"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div>" +
      '<section class="dsec"><h2>등급별 단가</h2><div class="trow h"><span>등급</span><span>할인</span><span>1' + esc(m.unit.replace(/\(.*\)/, "")) + " 단가</span></div>" +
      D.tiers.map(function (t) { return '<div class="trow num' + (me && me.id === t.id ? " me" : "") + '"><span>' + esc(t.name) + "</span><span>" + (t.discount ? t.discount + "%" : "-") + "</span><span>" + won(Math.round(m.price * (100 - t.discount) / 100 / 10) * 10) + "원</span></div>"; }).join("") + "</section>" +
      '<section class="dsec"><h2>규격·배송</h2><div class="trow"><span>규격</span><span style="grid-column:span 2;text-align:right">' + esc(m.spec) + '</span></div><div class="trow"><span>판매 단위</span><span style="grid-column:span 2;text-align:right">' + esc(m.unit) + '</span></div><div class="trow"><span>최소 주문</span><span style="grid-column:span 2;text-align:right">' + m.moq + " " + esc(m.unit) + '</span></div><div class="trow"><span>출고</span><span style="grid-column:span 2;text-align:right">' + esc(m.stock) + " · 현장 직배송</span></div></section></div>" +
      '<aside class="side"><div class="pkg-card"><div class="pkg-in"><p class="pt">' + esc(BG.MAT_CAT[m.category].name) + '</p><h1 class="d-title" style="margin:6px 0 14px;font-size:24px;line-height:34px">' + esc(m.name) + '</h1><p class="pt" style="margin-top:-8px">' + esc(m.spec) + "</p>" +
      '<div class="mat" style="margin-top:14px">' + matPrice(m) + "</div>" + switchHtml("itemSw") +
      '<div class="qty"><b style="font-size:14px">수량</b><div class="ctl"><button type="button" data-q="-1" aria-label="빼기">−</button><input id="qty" value="' + m.moq + '" inputmode="numeric" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">+</button></div></div>' +
      '<div class="sum" id="sum"></div></div><div class="pkg-cta"><button type="button" class="btn btn-line" data-act="cart">장바구니</button><button type="button" class="btn btn-ink" data-act="buy">바로 주문</button></div></div>' +
      '<p class="side-note">최소 주문 ' + m.moq + " " + esc(m.unit) + " · 사업자 회원은 세금계산서가 발행돼요.</p></aside></div></div>";
    function calc() {
      var q = Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1), unit = S.priceOf(m);
      document.getElementById("sum").innerHTML = '<div><span>정가</span><span class="num">' + won(m.price * q) + '원</span></div><div><span>등급 할인</span><span class="num">-' + won((m.price - unit) * q) + '원</span></div><div><span>적립 예정</span><span class="num">' + (S.member ? won(S.pointsOf(unit * q)) + "P" : "로그인 후 적립") + '</span></div><div class="t"><span>결제 예정</span><b class="num">' + won(unit * q) + "원</b></div>";
    }
    calc();
    app.querySelector(".qty .ctl").addEventListener("click", function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var el = document.getElementById("qty"); el.value = Math.max(1, (parseInt(el.value, 10) || 1) + parseInt(b.dataset.q, 10)); calc(); });
    document.getElementById("qty").addEventListener("input", calc);
    app.querySelector(".thumbs").addEventListener("click", function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("gImg").src = photo(b.dataset.shot); });
    bindSwitch("itemSw", function () { render(); });
    app.querySelector('[data-act="cart"]').addEventListener("click", function () { S.addCart(m.id, parseInt(document.getElementById("qty").value, 10) || 1); sync(); BG.toast("장바구니에 담았어요"); });
    app.querySelector('[data-act="buy"]').addEventListener("click", function () { S.addCart(m.id, parseInt(document.getElementById("qty").value, 10) || 1); location.hash = "#/cart"; });
  }
  function request(r) {
    var pre = BG.EXP[r.query.e];
    var st = { cat: pre ? pre.category : (r.query.c || ""), size: "", when: "", budget: "", name: "", phone: "" };
    function opts(k, arr, sm) { return '<div class="opts' + (sm ? " sm" : "") + '" data-k="' + k + '">' + arr.map(function (x) { var v = x.id || x, on = st[k] === v; return '<button type="button" class="opt' + (on ? " on" : "") + '" data-v="' + esc(v) + '"><b>' + esc(x.name || x) + "</b>" + (x.desc ? "<small>" + esc(x.desc) + "</small>" : "") + "</button>"; }).join("") + "</div>"; }
    app.innerHTML = '<div class="wrap page">' + crumb([["견적 요청", ""]]) + '<div class="page-h"><div><h1>무료 견적 요청</h1><p>' + (pre ? esc(pre.name) + "에게 보내는 요청이에요" : "요청서를 올리면 맞는 전문가들이 견적을 보내 드려요") + "</p></div></div>" +
      '<div class="req"><form id="rf" novalidate><div class="stepper" id="stepper"><span></span><span></span><span></span></div>' +
      '<div class="qcard"><h3>어떤 공사인가요?</h3><p>가장 가까운 분야를 골라 주세요</p>' + opts("cat", D.categories) + "</div>" +
      '<div class="qcard"><h3>규모와 일정</h3><p>대략적으로 골라도 괜찮아요</p>' + opts("size", SIZE, true) + '<div style="height:12px"></div>' + opts("when", WHEN, true) + '<div style="height:12px"></div>' + opts("budget", BUDGET, true) + "</div>" +
      '<div class="qcard"><h3>연락처</h3><p>견적이 도착하면 알려 드려요</p><input class="inp" id="nm" placeholder="이름" autocomplete="name"><input class="inp" id="ph" placeholder="휴대폰 번호" inputmode="tel" autocomplete="tel"></div>' +
      '<p class="err" id="er" role="alert"></p></form><aside class="summary"><h3>요청 내용</h3><dl id="sumv"></dl><button class="btn btn-pri" type="submit" form="rf">견적 요청 보내기</button><p class="side-note" style="margin:12px 0 0">비교 후 결정해도 비용이 들지 않아요</p></aside></div></div>';
    function paint() {
      var done = [st.cat, st.size && st.when, st.name && st.phone];
      document.querySelectorAll("#stepper span").forEach(function (s, i) { s.classList.toggle("on", !!done[i]); });
      document.getElementById("sumv").innerHTML = [["공사", st.cat ? BG.CAT[st.cat].name : "-"], ["규모", st.size || "-"], ["시작", st.when || "-"], ["예산", st.budget || "-"], ["받는 곳", pre ? pre.name : "맞는 전문가 여러 곳"]].map(function (x) { return "<div><dt>" + x[0] + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("");
    }
    paint();
    app.querySelectorAll(".opts").forEach(function (g) { g.addEventListener("click", function (ev) { var b = ev.target.closest(".opt"); if (!b) return; g.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("on", x === b); }); st[g.dataset.k] = b.dataset.v; paint(); }); });
    ["nm", "ph"].forEach(function (id) { document.getElementById(id).addEventListener("input", function () { st.name = document.getElementById("nm").value.trim(); st.phone = document.getElementById("ph").value.trim(); paint(); }); });
    document.getElementById("rf").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var miss = [];
      if (!st.cat) miss.push("공사 종류"); if (!st.size) miss.push("규모"); if (!st.when) miss.push("시작 시기");
      if (!st.name) miss.push("이름");
      if (!/^0\d{8,10}$/.test(st.phone.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("er").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ cat: st.cat, size: st.size, when: st.when, to: pre ? pre.name : "맞는 전문가들" });
      app.innerHTML = '<div class="wrap page"><div class="done"><div class="ok">' + I.check + '</div><h1>견적 요청을 보냈어요</h1><p>' + esc(BG.CAT[st.cat].name) + " · " + esc(st.size) + " · " + esc(st.when) + '<br>전문가들의 견적이 도착하면 알려 드려요.</p><div class="btns"><a class="btn btn-line" href="#/">홈으로</a><a class="btn btn-pri" href="#/services?c=' + st.cat + '">이 분야 전문가 보기</a></div></div></div>';
      window.scrollTo(0, 0);
    });
  }
  function cases() {
    app.innerHTML = '<div class="wrap page">' + crumb([["시공사례", ""]]) + '<div class="page-h"><div><h1>시공사례</h1><p>BUILDGO 전문가가 진행한 현장</p></div></div><div class="cases" style="grid-template-rows:280px 280px 280px 280px">' + CASES.map(caseTile).join("") + "</div></div>";
  }
  function tiers() {
    app.innerHTML = '<div class="wrap page">' + crumb([["등급 혜택", ""]]) + '<div class="page-h"><div><h1>회원 등급 혜택</h1><p>최근 3개월 구매액으로 등급이 정해지고, 등급이 오를수록 자재 단가가 내려가요</p></div></div>' + tierCards() +
      '<div class="refer rv" style="margin-top:16px"><div><b>포인트 쓰는 곳</b><p>' + esc(D.points.use) + '</p></div><a class="btn btn-ink" href="#/mall">자재몰 보기</a></div></div>';
  }
  function cart() {
    var t = S.cartTotals();
    app.innerHTML = '<div class="wrap page">' + crumb([["장바구니", ""]]) + '<div class="page-h"><div><h1>장바구니</h1><p>' + (S.member ? esc(S.tier().name) + " 등급가가 적용됐어요" : "로그인하면 등급가가 적용돼요") + "</p></div></div>" +
      (S.cart.length ? '<div class="req"><div>' + S.cart.map(function (row) { var m = BG.MAT[row.id]; return '<div class="qcard" style="display:grid;grid-template-columns:88px 1fr auto;gap:16px;align-items:center;padding:16px"><img src="' + photo(m.photo) + '" alt="" style="width:88px;height:88px;border-radius:12px;object-fit:cover"><div><b>' + esc(m.name) + '</b><p class="spec" style="margin:2px 0 0;color:var(--sub);font-size:13px">' + esc(m.spec) + " · " + row.qty + " " + esc(m.unit) + '</p></div><b class="num">' + won(S.priceOf(m) * row.qty) + "원</b></div>"; }).join("") + "</div>" +
        '<aside class="summary"><h3>결제 예정</h3><dl><div><dt>정가</dt><dd class="num">' + won(t.list) + "원</dd></div><div><dt>등급 할인</dt><dd class=\"num\">-" + won(t.discount) + "원</dd></div><div><dt>적립 예정</dt><dd class=\"num\">" + won(t.points) + 'P</dd></div><div><dt><b>합계</b></dt><dd class="num" style="font-size:20px">' + won(t.pay) + '원</dd></div></dl><button type="button" class="btn btn-pri" data-act="order">주문하기</button></aside></div>'
        : '<div class="done"><h1 style="font-size:22px">장바구니가 비었어요</h1><div class="btns"><a class="btn btn-pri" href="#/mall">회원 자재몰 보기</a></div></div>') + "</div>";
    var o = app.querySelector('[data-act="order"]'); if (o) o.addEventListener("click", function () { BG.toast("주문서를 준비하고 있어요"); });
  }
  function search(r) {
    var q = (r.query.q || "").trim();
    var es = D.experts.filter(function (e) { return q && (e.name + e.service + BG.CAT[e.category].name + e.tagline).indexOf(q.split(" ")[0]) >= 0; });
    var ms = D.materials.filter(function (m) { return q && (m.name + m.spec + BG.MAT_CAT[m.category].name).indexOf(q.split(" ")[0]) >= 0; });
    app.innerHTML = '<div class="wrap page">' + crumb([["검색", ""]]) + '<div class="page-h"><div><h1>' + (q ? "‘" + esc(q) + "’ 검색 결과" : "검색") + "</h1><p>시공 서비스 " + es.length + " · 자재 " + ms.length + "</p></div></div>" +
      '<form class="search" data-search style="max-width:720px;margin-bottom:40px"><div class="field">' + I.search + '<input name="q" value="' + esc(q) + '" placeholder="공사나 자재 이름으로 찾아보세요" aria-label="검색어"><button class="btn btn-pri" type="submit">검색</button></div></form>' +
      (es.length ? '<div class="svc-grid">' + es.map(svcCard).join("") + "</div>" : "") +
      (ms.length ? '<div class="mat-grid" style="margin-top:40px">' + ms.map(matCard).join("") + "</div>" : "") +
      (q && !es.length && !ms.length ? '<p style="color:var(--sub)">찾는 결과가 없어요. 다른 이름으로 검색해 보세요.</p>' : "") + "</div>";
  }
  function partner() {
    app.innerHTML = '<div class="wrap page">' + crumb([["전문가 등록", ""]]) + '<div class="req" style="margin-top:24px"><div><p class="eyebrow">전문가 입점</p><h1 class="d-title" style="margin-top:0;font-size:34px;line-height:46px">설계·시공 기술을<br>패키지 상품으로 올리세요</h1><p style="color:var(--sub);line-height:1.8">기본·표준·프리미엄 패키지로 가격과 범위를 정해 두면, 고객이 비교해 바로 견적을 요청해요. 면허·사업자·보험을 확인한 업체에는 검증 표시가 붙어요.</p>' +
      '<div class="qcard" style="margin-top:28px"><h3>등록 신청</h3><p>담당자가 확인 후 연락드려요</p><div class="opts" data-k="cat">' + D.categories.map(function (c) { return '<button type="button" class="opt" data-v="' + c.id + '"><b>' + esc(c.name) + "</b></button>"; }).join("") + '</div><div style="height:12px"></div><input class="inp" id="pn" placeholder="업체명"><input class="inp" id="pp" placeholder="연락처" inputmode="tel"><p class="err" id="per" role="alert"></p><button type="button" class="btn btn-pri btn-lg" id="psend" style="width:100%">등록 신청하기</button></div></div>' +
      '<aside class="side">' + pkgCard(BG.EXP.e3, 1, '<div class="pkg-cta"><span class="btn btn-line">문의</span><span class="btn btn-ink">견적 요청</span></div>') + '<p class="side-note">고객 화면에 이렇게 보여요. 패키지 이름·가격·포함 항목은 직접 정해요.</p></aside></div></div>';
    bindPkg(app.querySelector(".side .pkg-card"), BG.EXP.e3, 1);
    var cat = "";
    app.querySelector(".opts").addEventListener("click", function (ev) { var b = ev.target.closest(".opt"); if (!b) return; this.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("on", x === b); }); cat = b.dataset.v; });
    document.getElementById("psend").addEventListener("click", function () {
      var miss = [];
      if (!cat) miss.push("분야"); if (!document.getElementById("pn").value.trim()) miss.push("업체명");
      if (!/^0\d{8,10}$/.test(document.getElementById("pp").value.replace(/\D/g, ""))) miss.push("연락처");
      if (miss.length) { document.getElementById("per").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      app.innerHTML = '<div class="wrap page"><div class="done"><div class="ok">' + I.check + '</div><h1>등록 신청을 받았어요</h1><p>담당자가 서류를 확인한 뒤 연락드려요.</p><div class="btns"><a class="btn btn-pri" href="#/">홈으로</a></div></div></div>';
    });
  }

  var VIEWS = { home: home, services: services, service: service, mall: mall, item: item, request: request, cases: cases, tiers: tiers, cart: cart, search: search, partner: partner };
  var NAV = { services: "services", service: "services", mall: "mall", item: "mall", cart: "mall", cases: "cases", tiers: "tiers" };
  var TAB = { home: "home", services: "services", service: "services", mall: "mall", item: "mall", cart: "mall", request: "request", tiers: "tiers" };
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px 12% 0px" }) : null;
  function reveal() {
    var els = app.querySelectorAll(".rv:not(.in)");
    if (!io || BG.reduced()) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { app.querySelectorAll(".rv:not(.in)").forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight * 1.15) el.classList.add("in"); }); }, 900);
  }
  function render() {
    var y = window.scrollY;
    var r = BG.parseHash();
    (VIEWS[r.name] || home)(r);
    after(r);
    window.scrollTo(0, y);
  }
  function sync() {
    document.getElementById("loginBtn").textContent = S.member ? "로그아웃" : "로그인";
    var n = S.cartTotals().count, c = document.getElementById("cartN");
    c.hidden = !n; c.textContent = n;
  }
  function after(r) {
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === NAV[r.name]); });
    document.querySelectorAll("[data-tab]").forEach(function (a) { a.classList.toggle("on", a.dataset.tab === (TAB[r.name] || "")); });
    sync();
    reveal();
  }
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-act]");
    if (!a) return;
    if (a.dataset.act === "login") { ev.preventDefault(); S.member = !S.member; S.save(); render(); BG.toast(S.member ? D.demoUser.name + "님, 골드 등급가로 보여 드려요" : "로그아웃했어요"); }
    if (a.dataset.act === "ask") BG.toast("문의 내용을 전문가에게 전달할게요");
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target.closest("[data-search]"); if (!f) return;
    ev.preventDefault();
    var v = f.q.value.trim(); if (v) location.hash = "#/search?q=" + encodeURIComponent(v);
  });
  window.addEventListener("scroll", function () { document.getElementById("hd").classList.toggle("line", window.scrollY > 8); }, { passive: true });
  document.getElementById("ftCredit").textContent = "사진 Unsplash";
  BG.router(VIEWS, after);
})();
