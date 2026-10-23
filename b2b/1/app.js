(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b1");
  var app = document.getElementById("app");
  var slideTimer = null, slideAt = 0;

  var I = {
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    case: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M8 7V4h8v3M3 12h18"/></svg>',
    tool: '<svg viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>'
  };
  var SLIDES = [
    { ph: "n_dusk", name: "업체 찾기", href: "#/companies" },
    { ph: "n_draft", name: "전문가 찾기", href: "#/experts" },
    { ph: "n_steel", name: "회원 자재몰", href: "#/mall" }
  ];
  var PANELS = [
    { ph: "n_crew", no: "01", label: "업체 찾기", t: "믿고 맡길 시공사를<br>공종과 지역으로", d: "종합·전문건설사, 설계사무소, 자재 공급사를 공종과 지역으로 찾습니다. 면허·사업자·보험을 확인한 업체만 목록에 올라옵니다.", btn: "업체 목록 보기", href: "#/companies", tag: "등록 업체 " + D.companies.length + "곳" },
    { ph: "n_draft", no: "02", label: "전문가 찾기", t: "도면부터 감리까지<br>맡길 전문가", d: "건축사·구조기술사·감리원·현장소장급 기술자를 분야와 지역으로 찾고, 경력과 대표 실적을 확인한 뒤 바로 견적을 요청합니다.", btn: "전문가 목록 보기", href: "#/experts", tag: "등록 전문가 " + D.experts.length + "명" },
    { ph: "n_steel", no: "03", label: "회원 자재몰", t: "현장 자재는<br>사업자 회원가로", d: "철근·형강부터 마감재까지 등급별 회원가로 삽니다. 수도권 일부 품목은 당일 출고하고, 대량 구매는 따로 견적을 받습니다.", btn: "자재몰 들어가기", href: "#/mall", tag: "회원 자재 " + D.materials.length + "종" }
  ];
  var GUIDES = [
    { ph: "n_room", c: "가입", t: "사업자 회원 가입 안내", d: "사업자등록번호로 가입하면 등급별 회원가와 견적 목록을 씁니다." },
    { ph: "n_plan", c: "견적", t: "한 번의 요청으로 여러 업체에", d: "공종·지역·규모를 남기면 담당 매니저가 맞는 업체를 골라 연결합니다." },
    { ph: "n_hall", c: "자재", t: "회원가와 당일 출고 품목", d: "등급별 할인율과 수도권 당일 출고 품목을 자재몰에서 바로 확인합니다." }
  ];

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checks(c) { return '<span class="chk">' + ["면허", "사업자", "보험"].map(function (k) { return '<i class="' + (c.checks.indexOf(k) >= 0 ? "on" : "") + '">' + k + (c.checks.indexOf(k) >= 0 ? " 확인" : " 미확인") + "</i>"; }).join("") + "</span>"; }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="btn line-l save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '">' + I.save + "<span>" + (saved(id) ? "관심 업체" : "관심 업체 저장") + "</span></button>"; }
  function list(v) { return v ? String(v).split(",").filter(Boolean) : []; }
  function pill(text, href, cls) { return '<a class="pill' + (cls ? " " + cls : "") + '" href="' + href + '"><span>' + esc(text) + '</span><i aria-hidden="true"></i></a>'; }

  function home() {
    var bgs = SLIDES.map(function (s, i) { return '<div class="sl' + (i ? "" : " on") + '"><img src="' + photo(s.ph) + '" alt=""' + (i ? ' loading="lazy"' : "") + "></div>"; }).join("");
    var idx = SLIDES.map(function (s, i) { return '<a href="' + s.href + '" class="' + (i ? "" : "on") + '" data-i="' + i + '"><span>' + esc(s.name) + "</span><i></i></a>"; }).join("");
    var panels = PANELS.map(function (p, i) {
      return '<section class="panel' + (i % 2 ? " flip" : "") + '"><div class="pn-img"><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.label) + '"><a class="pill sm" href="' + p.href + '"><span>' + esc(p.tag) + '</span><i aria-hidden="true"></i></a></div>' +
        '<div class="pn-txt"><p class="lab">' + p.no + " · " + esc(p.label) + "</p><h3>" + p.t + "</h3><p>" + esc(p.d) + "</p>" + pill(p.btn, p.href, "dark") + "</div></section>";
    }).join("");
    var guides = GUIDES.map(function (g) { return '<article class="gcard"><span class="gtag">' + esc(g.c) + "</span><h3>" + esc(g.t) + "</h3><p>" + esc(g.d) + '</p><div class="gimg"><img loading="lazy" src="' + photo(g.ph) + '" alt=""></div></article>'; }).join("");
    app.innerHTML =
      '<section class="hero" id="hero"><div class="slides" id="slides">' + bgs + '</div><div class="veil"></div><div class="dots" aria-hidden="true"></div>' +
      '<h1 class="h-title" id="htitle">현장을 아는<br>건설 B2B.</h1><nav class="h-idx" id="hidx" aria-label="바로 가기">' + idx + '</nav><div class="h-bar"><b id="hbar"></b></div></section>' +
      '<section class="intro"><div class="in-l"><h2>설계부터 분양까지,<br>한 회사가.</h2><p class="since">도아 · LH 민간신축매입약정사업 전문기업</p></div>' +
      '<div class="in-r"><p class="lead">도아는 LH 민간신축매입약정사업을 전문으로 하는 (주)더원파트너스의 브랜드입니다.</p><p>개발 현장에서 직접 겪은 일 — 믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제때 구하는 일 — 을 기업 고객이 한 곳에서 할 수 있도록 BUILDGO를 만들었습니다. 현장소장과 기업 담당자를 위한 사업자 전용 거래 사이트입니다.</p>' +
      '<div class="btns">' + pill("업체 찾기", "#/companies") + pill("견적 문의", "#/quote", "ghost") + "</div></div></section>" +
      '<div class="panels">' + panels + "</div>" +
      '<section class="feature"><img loading="lazy" src="' + photo("n_slab") + '" alt=""><div class="veil"></div><div class="ft-txt"><p class="lab">견적 문의</p><h2>한 번의 요청으로<br>맞는 업체까지.</h2><p>공종과 현장 지역, 규모를 남기면 담당 매니저가 면허와 실적을 확인한 업체를 골라 연결합니다. 받은 견적은 같은 기준으로 나란히 비교합니다.</p><div class="btns">' + pill("견적 요청하기", "#/quote") + pill("업체 먼저 보기", "#/companies", "ghost") + '</div></div><a class="orb" href="#/quote" aria-label="견적 요청하기">' + I.arrow + "</a></section>" +
      '<section class="guides"><p class="lab">이용 안내</p><h2>처음 쓰시는 분께</h2><div class="gg">' + guides + "</div></section>" +
      '<section class="join"><div class="dots" aria-hidden="true"></div><h2>BUILDGO와 함께 일할<br>업체를 찾습니다</h2><p>면허와 사업자 정보를 갖춘 시공사·설계사무소·자재 공급사라면 업체 등록을 신청하세요. 확인을 마치면 목록에 올라갑니다.</p>' + pill("업체 등록 문의", "#/quote") + "</section>";
    slideSetup();
  }
  function slideGo(i) {
    var box = document.getElementById("slides"); if (!box) return;
    i = (i + SLIDES.length) % SLIDES.length;
    if (i === slideAt) return;
    var els = box.querySelectorAll(".sl"), from = els[slideAt], to = els[i], img = to.querySelector("img");
    if (img.loading === "lazy") img.loading = "eager";
    slideAt = i;
    to.classList.add("on");
    if (!BG.reduced() && to.animate) {
      var a = to.animate([{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 1100, easing: "cubic-bezier(.7,0,.2,1)" });
      img.animate([{ transform: "scale(1.12) translateX(4%)" }, { transform: "none" }], { duration: 1600, easing: "cubic-bezier(.2,.7,.1,1)" });
      a.onfinish = function () { from.classList.remove("on"); };
    } else from.classList.remove("on");
    [].forEach.call(document.querySelectorAll("#hidx a"), function (a, k) { a.classList.toggle("on", k === i); });
    barRun();
  }
  function barRun() {
    var bar = document.getElementById("hbar"); if (!bar || !bar.animate || BG.reduced()) return;
    bar.getAnimations().forEach(function (x) { x.cancel(); });
    bar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 6500, easing: "linear", fill: "forwards" });
  }
  function slideSetup() {
    slideAt = 0;
    clearInterval(slideTimer);
    BG.mo.play([document.querySelector("#slides .sl img")], "settle", { s: 1.08, dur: 2400 });
    if (!BG.reduced()) slideTimer = setInterval(function () { if (!document.getElementById("slides")) return clearInterval(slideTimer); if (!document.hidden) slideGo(slideAt + 1); }, 6500);
    barRun();
    BG.swipe(document.getElementById("hero"), function () { slideGo(slideAt + 1); }, function () { slideGo(slideAt - 1); });
    var idx = document.getElementById("hidx");
    if (idx) idx.addEventListener("mouseover", function (ev) { var a = ev.target.closest("a[data-i]"); if (a) { slideGo(+a.dataset.i); clearInterval(slideTimer); } });
  }

  function pageHead(title, sub, crumb, extra) {
    return '<section class="ph"><p class="crumb"><a href="#/">홈</a><span>›</span>' + esc(crumb || title) + "</p><h1>" + esc(title) + "</h1>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + (extra || "") + "</section>";
  }
  function checksList(name, title, items, cur, count) {
    return '<fieldset class="fg"><legend>' + esc(title) + "</legend>" + items.map(function (x) {
      var id = x.id || x, on = cur.indexOf(id) >= 0;
      return '<label class="cb"><input type="checkbox" name="' + name + '" value="' + esc(id) + '"' + (on ? " checked" : "") + '><span class="box" aria-hidden="true"></span><span class="t">' + esc(x.name || x) + (count ? '<b>' + count(id) + "</b>" : "") + "</span></label>";
    }).join("") + "</fieldset>";
  }
  function searchBar(kind, q, ph, regions) {
    return '<form class="sbar" data-finder="' + kind + '"><label class="s-q">' + I.search + '<input name="q" type="search" value="' + esc(q.q || "") + '" placeholder="' + esc(ph) + '" aria-label="검색어"></label>' +
      '<label class="s-r">' + I.pin + '<select name="region1" aria-label="지역">' + '<option value="">전국</option>' + D.regions.map(function (r) { return '<option' + (list(q.region).length === 1 && list(q.region)[0] === r ? " selected" : "") + ">" + esc(r) + "</option>"; }).join("") + "</select></label>" +
      '<button type="submit" class="s-go" aria-label="검색">' + I.search + "</button></form>";
  }
  function companies(r) {
    var q = r.query, types = list(q.type), works = list(q.work), regions = list(q.region), kw = (q.q || "").trim();
    var base = D.companies.filter(function (c) {
      if (works.length && !c.works.some(function (w) { return works.indexOf(w) >= 0; })) return false;
      if (regions.length && regions.indexOf(c.region) < 0) return false;
      if (kw && (c.name + c.licenses.join(" ") + workNames(c.works).join(" ")).indexOf(kw) < 0) return false;
      return true;
    });
    var res = base.filter(function (c) { return !types.length || types.indexOf(c.type) >= 0; });
    var sort = q.sort || "trust";
    res.sort(function (a, b) { return sort === "count" ? b.count - a.count : sort === "since" ? a.since - b.since : (b.checks.length - a.checks.length) || (b.count - a.count); });
    var cnt = function (t) { return base.filter(function (c) { return c.type === t; }).length; };
    var cards = res.map(function (c) {
      return '<article class="rcard"><a class="rc-main" href="#/company/' + c.id + '">' + mono(c.name) + '<div class="rc-info"><h3>' + esc(c.name) + "</h3><ul>" +
        "<li>" + I.pin + esc(c.region + " " + c.city) + "</li><li>" + I.case + esc(typeName(c.type)) + "</li><li>" + I.tool + esc(workNames(c.works).join(", ")) + "</li><li>" + I.doc + esc(c.licenses.join(", ")) + "</li></ul></div></a>" +
        '<div class="rc-foot"><p>' + esc(c.intro) + '</p><div class="rc-act">' + checks(c) + '<a class="btn sm" href="#/quote?to=' + c.id + '">견적 요청</a></div></div></article>';
    }).join("");
    var side = '<form class="side" data-side="companies"><div class="side-h"><b>조건</b><a href="#/companies">초기화</a></div>' + checksList("type", "업체 종류", D.types, types, cnt) + checksList("work", "공종", D.works, works) + checksList("region", "지역", D.regions, regions) + '<input type="hidden" name="q" value="' + esc(kw) + '"><input type="hidden" name="sort" value="' + esc(sort) + '"></form>';
    app.innerHTML = '<div class="lp">' + pageHead("업체 찾기", "", "업체 찾기", searchBar("companies", q, "업체명이나 면허, 공종으로 찾기 (예: 방수, 건축공사업)")) +
      '<div class="lp-body">' + side + '<section class="res"><div class="res-h"><p>검색 결과 <b>' + res.length + '</b>곳</p><button type="button" class="btn line-l sm fbtn" data-act="filters">' + I.filter + '조건 고르기</button><label class="sort">정렬<select data-sort="companies"><option value="trust"' + (sort === "trust" ? " selected" : "") + '>확인 항목 많은 순</option><option value="count"' + (sort === "count" ? " selected" : "") + '>실적 많은 순</option><option value="since"' + (sort === "since" ? " selected" : "") + ">업력 오래된 순</option></select></label></div>" +
      (res.length ? '<div class="rgrid">' + cards + "</div>" : '<p class="empty">조건에 맞는 업체가 없습니다. 지역이나 공종을 넓혀 보세요.</p>') + "</section></div></div>";
  }
  function company(r) {
    var c = BG.CO[r.id] || D.companies[0];
    app.innerHTML = '<section class="prof"><p class="crumb"><a href="#/companies">업체 찾기</a><span>›</span>' + esc(typeName(c.type)) + '</p><div class="pf-top">' + mono(c.name, "lg") + '<div class="pf-t"><h1>' + esc(c.name) + "</h1><p>" + esc(c.intro) + "</p>" + checks(c) + '</div><div class="pf-act">' + pill("견적 요청", "#/quote?to=" + c.id) + saveBtn(c.id) + "</div></div></section>" +
      '<section class="pbody"><dl class="facts"><div><dt>업체 종류</dt><dd>' + esc(typeName(c.type)) + "</dd></div><div><dt>지역</dt><dd>" + esc(c.region + " " + c.city) + "</dd></div><div><dt>설립</dt><dd>" + c.since + "년</dd></div><div><dt>실적</dt><dd>" + won(c.count) + "건</dd></div></dl>" +
      '<p class="lab">대표 실적</p><div class="pj">' + c.projects.map(function (p) { return '<figure><div class="pj-img"><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"></div><figcaption><b>' + esc(p.t) + "</b><span>" + p.y + "년 준공</span></figcaption></figure>"; }).join("") + "</div>" +
      '<p class="lab">면허와 공종</p><table class="spec"><tr><th>면허·등록</th><td>' + esc(c.licenses.join(", ")) + "</td></tr><tr><th>공종</th><td>" + esc(workNames(c.works).join(", ")) + "</td></tr><tr><th>확인 항목</th><td>" + esc(c.checks.join(" · ")) + '</td></tr></table></section>' +
      '<section class="ask"><h2>' + esc(c.name) + "에<br>견적을 요청하세요.</h2><p>현장 지역과 규모를 남기면 담당 매니저가 확인한 뒤 연결합니다.</p>" + pill("견적 요청하기", "#/quote?to=" + c.id) + "</section>";
  }
  function experts(r) {
    var q = r.query, works = list(q.work), regions = list(q.region), kw = (q.q || "").trim();
    var res = D.experts.filter(function (x) {
      if (works.length && !x.works.some(function (w) { return works.indexOf(w) >= 0; })) return false;
      if (regions.length && regions.indexOf(x.region) < 0) return false;
      if (kw && (x.name + x.title + x.affil + workNames(x.works).join(" ")).indexOf(kw) < 0) return false;
      return true;
    }).sort(function (a, b) { return b.years - a.years; });
    var cards = res.map(function (x) {
      return '<article class="rcard"><a class="rc-main" href="#/expert/' + x.id + '">' + mono(x.name, "round") + '<div class="rc-info"><h3>' + esc(x.name) + " <small>" + esc(x.title) + "</small></h3><ul>" +
        "<li>" + I.pin + esc(x.region) + "</li><li>" + I.case + "경력 " + x.years + "년 · " + esc(x.affil === "개인" ? "개인" : x.affil) + "</li><li>" + I.tool + esc(workNames(x.works).join(", ")) + "</li></ul></div></a>" +
        '<div class="rc-foot"><p>' + esc(x.intro) + '</p><div class="rc-act"><span></span><a class="btn sm" href="#/quote?to=' + x.id + '">견적 요청</a></div></div></article>';
    }).join("");
    var side = '<form class="side" data-side="experts"><div class="side-h"><b>조건</b><a href="#/experts">초기화</a></div>' + checksList("work", "분야", D.works, works) + checksList("region", "지역", D.regions, regions) + '<input type="hidden" name="q" value="' + esc(kw) + '"></form>';
    app.innerHTML = '<div class="lp">' + pageHead("전문가 찾기", "", "전문가 찾기", searchBar("experts", q, "이름이나 자격으로 찾기 (예: 건축사, 감리)")) +
      '<div class="lp-body">' + side + '<section class="res"><div class="res-h"><p>검색 결과 <b>' + res.length + '</b>명</p><button type="button" class="btn line-l sm fbtn" data-act="filters">' + I.filter + "조건 고르기</button></div>" +
      (res.length ? '<div class="rgrid">' + cards + "</div>" : '<p class="empty">조건에 맞는 전문가가 없습니다.</p>') + "</section></div></div>";
  }
  function expert(r) {
    var x = BG.EX[r.id] || D.experts[0];
    app.innerHTML = '<section class="prof"><p class="crumb"><a href="#/experts">전문가 찾기</a><span>›</span>' + esc(x.title) + '</p><div class="pf-top">' + mono(x.name, "lg round") + '<div class="pf-t"><h1>' + esc(x.name) + " <small>" + esc(x.title) + "</small></h1><p>" + esc(x.intro) + '</p></div><div class="pf-act">' + pill("견적 요청", "#/quote?to=" + x.id) + saveBtn(x.id) + "</div></div></section>" +
      '<section class="pbody"><dl class="facts"><div><dt>자격</dt><dd>' + esc(x.title) + "</dd></div><div><dt>분야</dt><dd>" + esc(workNames(x.works).join(", ")) + "</dd></div><div><dt>경력</dt><dd>" + x.years + "년</dd></div><div><dt>지역·소속</dt><dd>" + esc(x.region + " · " + (x.affil === "개인" ? "개인" : x.affil)) + "</dd></div></dl>" +
      '<p class="lab">대표 실적</p><ol class="plist">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol></section>" +
      '<section class="ask"><h2>' + esc(x.name + " " + x.title) + "에게<br>견적을 요청하세요.</h2><p>현장 정보와 일정을 남기면 담당 매니저가 연결합니다.</p>" + pill("견적 요청하기", "#/quote?to=" + x.id) + "</section>";
  }
  function priceHtml(m) {
    if (S.member) return '<p class="pr"><s data-pop class="mo-ib">' + won(m.price) + '원</s><b><span data-roll="' + m.id + '">' + won(S.priceOf(m)) + '</span>원</b><em data-pop class="mo-ib">회원가</em></p>';
    return '<p class="pr"><b><span data-roll="' + m.id + '">' + won(m.price) + '</span>원</b></p><button type="button" class="lock" data-act="login" data-pop>로그인하고 회원가 보기</button>';
  }
  function mall(r) {
    var c = r.query.c || "", items = D.materials.filter(function (m) { return !c || m.cat === c; }), t = S.tier();
    var cats = '<a class="' + (c ? "" : "on") + '" href="#/mall"><span>전체</span><b>' + D.materials.length + "</b></a>" + D.matCats.map(function (x) { return '<a class="' + (c === x.id ? "on" : "") + '" href="#/mall?c=' + x.id + '"><span>' + esc(x.name) + "</span><b>" + D.materials.filter(function (m) { return m.cat === x.id; }).length + "</b></a>"; }).join("");
    var cards = items.map(function (m) {
      return '<article class="mcard"><a class="m-img" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '">' + (m.ship.indexOf("당일") >= 0 ? '<span class="today">당일 출고</span>' : "") + '</a><div class="m-b"><p class="seller">' + esc(BG.CO[m.seller] ? BG.CO[m.seller].name : "BUILDGO") + '</p><h3><a href="#/item/' + m.id + '">' + esc(m.name) + '</a></h3><p class="spec1">' + esc(m.spec + " · " + m.unit + " · 최소 " + m.moq) + "</p>" + priceHtml(m) +
        '<div class="m-act"><button type="button" class="btn line-l sm" data-act="cart" data-id="' + m.id + '">견적 목록에 담기</button><a class="tl" href="#/quote?item=' + m.id + '">대량 구매 문의</a></div></div></article>';
    }).join("");
    app.innerHTML = '<div class="lp">' + pageHead("회원 자재몰", t ? D.demoUser.company + " " + D.demoUser.name + "님 · " + t.name + " 회원가 " + t.discount + "% 적용 중" : "사업자 회원은 등급별 회원가로 삽니다. 수도권 일부 품목은 당일 출고합니다.", "회원 자재몰", t ? '<div class="ph-act">' + pill("견적 목록 보기", "#/cart") + "</div>" : '<div class="ph-act"><button type="button" class="pill" data-act="login"><span>사업자 회원 로그인</span><i aria-hidden="true"></i></button></div>') +
      '<div class="lp-body"><nav class="side mcats" aria-label="자재 분류"><div class="side-h"><b>자재 분류</b></div>' + cats + '</nav><section class="res"><div class="res-h"><p>' + (c ? esc(BG.MC[c].name) : "전체 자재") + " <b>" + items.length + "</b>종</p></div><div class=\"mgrid\">" + cards + "</div></section></div></div>" + cartBar();
  }
  function cartBar() {
    var tt = S.cartTotals(); if (!tt.count) return "";
    return '<div class="cartbar" id="cartbar"><p>견적 목록 <b>' + tt.count + "건</b> · 합계 <b>" + won(tt.pay) + "원</b></p>" + pill("견적서 받기", "#/cart") + "</div>";
  }
  function refreshCart() {
    var old = document.getElementById("cartbar"); if (old) old.remove();
    var html = cartBar(); if (!html) return;
    app.insertAdjacentHTML("beforeend", html);
    var bar = document.getElementById("cartbar");
    if (!BG.reduced() && bar.animate) bar.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
  }
  function item(r) {
    var m = BG.MT[r.id] || D.materials[0], co = BG.CO[m.seller];
    app.innerHTML = '<div class="lp"><section class="item"><p class="crumb"><a href="#/mall">회원 자재몰</a><span>›</span><a href="#/mall?c=' + m.cat + '">' + esc(BG.MC[m.cat].name) + '</a></p><div class="it-in"><div class="it-img"><img src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></div><div class="it-info"><p class="seller">' + esc(co ? co.name : "BUILDGO") + "</p><h1>" + esc(m.name) + "</h1>" + priceHtml(m) +
      '<table class="spec"><tr><th>규격</th><td><label class="selbox"><select id="spec">' + m.specs.map(function (s) { return "<option" + (s === m.spec ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" + I.down + '</label></td></tr><tr><th>수량 (' + esc(m.unit) + ')</th><td><div class="qty"><button type="button" data-q="-1" aria-label="빼기">' + I.minus + '</button><input id="qty" inputmode="numeric" value="1" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">' + I.plus + "</button></div></td></tr>" +
      "<tr><th>최소 주문</th><td>" + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a>" : "BUILDGO") + "</td></tr></table>" +
      '<div class="it-act"><button type="button" class="btn line-l" data-act="cart-item">견적 목록에 담기</button><a class="btn" href="#/quote?item=' + m.id + '">대량 구매 문의</a></div></div></div></section></div>' + cartBar();
    app.querySelector(".qty").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var inp = document.getElementById("qty"); inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + +b.dataset.q); };
    app.querySelector('[data-act="cart-item"]').onclick = function () { S.addCart(m.id, Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1), document.getElementById("spec").value); BG.toast("견적 목록에 담았습니다"); refreshCart(); };
  }
  function cart() {
    var tt = S.cartTotals();
    app.innerHTML = '<div class="lp">' + pageHead("견적 목록", "담은 자재로 견적서를 받습니다. 사업자 회원은 회원가로 계산됩니다.", "견적 목록") + '<section class="cart">' +
      (S.cart.length ? '<ul class="clist">' + S.cart.map(function (row) { var m = BG.MT[row.id]; return '<li><img src="' + photo(m.ph) + '" alt=""><div><b>' + esc(m.name) + "</b><span>" + esc(row.spec || m.spec) + " · " + row.qty + esc(m.unit) + "</span></div><strong>" + won(S.priceOf(m) * row.qty) + "원</strong></li>"; }).join("") + "</ul>" +
        '<div class="csum"><p><span>정가 합계</span><b>' + won(tt.list) + "원</b></p><p><span>회원 할인</span><b>-" + won(tt.discount) + '원</b></p><p class="t"><span>견적 금액</span><b>' + won(tt.pay) + '원</b></p><button type="button" class="btn wide" data-act="estimate">견적서 받기</button></div>'
        : '<p class="empty">담은 자재가 없습니다.</p>' + pill("회원 자재몰로", "#/mall")) + "</section></div>";
  }
  function quote(r) {
    var to = BG.CO[r.query.to] || BG.EX[r.query.to], m = BG.MT[r.query.item];
    var target = to ? (to.title ? to.name + " " + to.title : to.name) : m ? m.name + " 대량 구매" : "";
    var sel = function (name, items, cur, all) { return '<label class="selbox"><select name="' + name + '"><option value="">' + all + "</option>" + items.map(function (x) { var v = x.id || x; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(x.name || x) + "</option>"; }).join("") + "</select>" + I.down + "</label>"; };
    app.innerHTML = '<div class="lp">' + pageHead("견적 요청", target ? target + "에 보내는 요청입니다." : "현장 정보를 남기면 담당 매니저가 맞는 업체를 연결합니다.", "견적 요청") +
      '<section class="qf"><form id="qf" novalidate><div class="fgrid"><label><span>공종 <i>*</i></span>' + sel("work", D.works, to && to.works ? to.works[0] : "", "공종 선택") + "</label><label><span>현장 지역 <i>*</i></span>" + sel("region", D.regions, to ? to.region : "", "지역 선택") + '</label>' +
      '<label><span>규모</span><input class="inp" name="size" placeholder="예: 연면적 1,200㎡"></label><label><span>착공 예정</span><input class="inp" name="when" placeholder="예: 2027년 3월"></label>' +
      '<label><span>회사명 <i>*</i></span><input class="inp" name="co" autocomplete="organization"></label><label><span>담당자 <i>*</i></span><input class="inp" name="name" autocomplete="name"></label><label class="full"><span>휴대폰 <i>*</i></span><input class="inp" name="phone" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label></div>' +
      '<p class="err" id="qerr"></p><button type="submit" class="btn wide">견적 요청하기</button></form></section></div>';
    document.getElementById("qf").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, miss = [];
      if (!f.work.value) miss.push("공종"); if (!f.region.value) miss.push("지역"); if (!f.co.value.trim()) miss.push("회사명"); if (!f.name.value.trim()) miss.push("담당자");
      if (!/^0\d{8,10}$/.test(f.phone.value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("qerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ work: f.work.value, region: f.region.value, to: target });
      app.innerHTML = '<div class="lp">' + pageHead("견적 요청 완료", "담당 매니저가 확인 후 남기신 번호로 연락드립니다.", "견적 요청") + '<section class="done"><p>' + (target ? esc(target) + "에 요청을 전달했습니다." : "맞는 업체를 골라 연결해 드립니다.") + '</p><div class="btns">' + pill("다른 업체 보기", "#/companies") + pill("처음으로", "#/", "ghost-d") + "</div></section></div>";
      window.scrollTo(0, 0);
    };
  }
  function login() {
    app.innerHTML = '<div class="lp">' + pageHead("사업자 회원 로그인", "등급별 회원가와 견적 목록을 쓸 수 있습니다.", "로그인") + '<section class="login"><label><span>아이디</span><input class="inp" value="hankyul_gm" autocomplete="username"></label><label><span>비밀번호</span><input class="inp" type="password" value="buildgo1998" autocomplete="current-password"></label>' +
      '<button type="button" class="btn wide" data-act="do-login">로그인</button><p class="join-q">아직 회원이 아니신가요? <a href="#/quote">가입 문의</a></p></section></div>';
  }

  function sync(r) {
    var name = r ? r.name : BG.parseHash().name;
    document.body.classList.toggle("on-home", name === "home");
    if (name !== "home") clearInterval(slideTimer);
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === name || (name === "company" && a.dataset.nav === "companies") || (name === "expert" && a.dataset.nav === "experts") || ((name === "item" || name === "cart") && a.dataset.nav === "mall")); });
    ["loginBtn", "loginBtn2"].forEach(function (id) { var b = document.getElementById(id); if (b) b.textContent = S.member ? "로그아웃" : "로그인"; });
    closeMenu();
    document.body.classList.remove("filters");
  }
  function closeMenu() { var d = document.getElementById("drawer"); if (d && !d.hidden) { d.hidden = true; document.body.classList.remove("lock"); } }
  function go(kind) {
    var side = document.querySelector('form.side[data-side="' + kind + '"]'), bar = document.querySelector('form.sbar[data-finder="' + kind + '"]');
    var vals = function (n) { return side ? [].map.call(side.querySelectorAll('input[name="' + n + '"]:checked'), function (i) { return i.value; }).join(",") : ""; };
    var region = vals("region"), r1 = bar && bar.region1 ? bar.region1.value : "";
    if (r1 && !region) region = r1;
    var srt = document.querySelector('select[data-sort="' + kind + '"]');
    location.hash = "#/" + kind + BG.qs({ type: vals("type"), work: vals("work"), region: region, q: bar ? bar.q.value.trim() : "", sort: srt && srt.value !== "trust" ? srt.value : "" });
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-act]");
    if (!a) return;
    var act = a.dataset.act;
    if (act === "login") { ev.preventDefault(); if (S.member) { S.member = false; S.save(); BG.toast("로그아웃했습니다"); window.dispatchEvent(new HashChangeEvent("hashchange")); } else location.hash = "#/login"; }
    if (act === "do-login") { S.member = true; S.save(); BG.toast(D.demoUser.company + " " + D.demoUser.name + "님, 골드 회원가가 적용됩니다"); location.hash = "#/mall"; }
    if (act === "menu") { var d = document.getElementById("drawer"); d.hidden = false; document.body.classList.add("lock"); if (!BG.reduced() && d.animate) d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); }
    if (act === "menu-close") closeMenu();
    if (act === "filters") document.body.classList.toggle("filters");
    if (act === "save") { var on = S.toggleSave(a.dataset.id); a.classList.toggle("on", on); a.querySelector("span").textContent = on ? "관심 업체" : "관심 업체 저장"; BG.toast(on ? "관심 업체로 저장했습니다" : "저장을 취소했습니다"); }
    if (act === "cart") { var m = BG.MT[a.dataset.id]; S.addCart(m.id, 1, m.spec); BG.toast(m.name + " 1" + m.unit + ", 견적 목록에 담았습니다"); refreshCart(); }
    if (act === "estimate") BG.toast("견적서를 만들고 있습니다. 담당 매니저가 확인 후 연락드립니다");
  });
  document.getElementById("drawer").addEventListener("click", function (ev) { if (ev.target === this || ev.target.closest("a")) closeMenu(); });
  document.addEventListener("submit", function (ev) { var f = ev.target.closest("form.sbar"); if (!f) return; ev.preventDefault(); go(f.dataset.finder); });
  document.addEventListener("change", function (ev) {
    var f = ev.target.closest("form.side[data-side]"), s = ev.target.closest("select[data-sort]");
    if (!f && !s) return;
    var y = window.scrollY;
    go(f ? f.dataset.side : s.dataset.sort);
    setTimeout(function () { window.scrollTo(0, y); }, 0);
  });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;

  var MOTION = [
    [".h-title", "lines", { delay: 200, gap: 140, dur: 1200 }],
    [".h-idx a", "up", { y: 14, delay: 700, stagger: 110 }],
    [".intro h2", "lines", { gap: 120, dur: 1100 }],
    [".intro .since, .intro .lead, .intro .in-r > p:not(.lead), .intro .btns", "up", { y: 18, lag: 180, stagger: 110 }],
    [".pn-img", "wipeX", { dur: 1200 }],
    [".pn-txt h3", "lines", { gap: 110, delay: 200 }],
    [".pn-txt .lab, .pn-txt > p, .pn-txt .pill", "up", { y: 16, lag: 260, stagger: 100 }],
    [".feature > img", "settle", { s: 1.1, dur: 2200 }],
    [".feature h2", "lines", { gap: 120 }],
    [".feature .ft-txt > p, .feature .btns", "up", { y: 16, lag: 200, stagger: 100 }],
    [".guides h2, .join h2, .ask h2", "lines", { gap: 110 }],
    [".gcard", "card", { y: 30, stagger: 120 }],
    [".join > p, .join > .pill", "up", { y: 16, lag: 200, stagger: 100 }],
    [".rcard", "up", { y: 18, stagger: 50, max: 8 }],
    [".mcard", "card", { y: 22, stagger: 50, max: 9 }],
    [".pj figure", "wipe", { stagger: 110 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
