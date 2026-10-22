(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b1");
  var app = document.getElementById("app");
  var heroTimer = null;

  var I = {
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
  };

  var FIELDS = [
    { t: "부동산 개발", ph: "hero_dusk", href: "#about" },
    { t: "설계·인허가", ph: "w_draft", href: "#/companies?work=design" },
    { t: "골조·철골", ph: "hero_rise", href: "#/companies?work=rc" },
    { t: "외장·마감", ph: "facade", href: "#/companies?work=water" },
    { t: "자재 공급", ph: "mt_warehouse", href: "#/mall" }
  ];
  var DOORS = [
    { href: "#/companies", n: "01", t: "업체 찾기", d: "면허를 확인한 시공사·설계사무소·자재사를 공종과 지역으로 찾습니다.", ph: "w_women" },
    { href: "#/experts", n: "02", t: "전문가 찾기", d: "건축사·기술사·현장소장급 기술자에게 바로 견적을 받습니다.", ph: "w_measure" },
    { href: "#/mall", n: "03", t: "회원 자재몰", d: "사업자 회원은 등급별 가격으로 자재를 삽니다.", ph: "mt_rebar" }
  ];

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checks(c) {
    var label = { "면허": "면허 확인", "사업자": "사업자 확인", "보험": "보험 가입" };
    return '<ul class="checks">' + c.checks.map(function (k) { return "<li>" + I.check + esc(label[k]) + "</li>"; }).join("") + "</ul>";
  }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '" aria-label="저장">' + I.save + "<span>" + (saved(id) ? "저장됨" : "저장") + "</span></button>"; }
  function opts(list, cur, all) { return '<option value="">' + esc(all) + "</option>" + list.map(function (x) { var v = x.id || x; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(x.name || x) + "</option>"; }).join(""); }

  function home() {
    document.body.classList.add("on-hero");
    var fl = FIELDS.map(function (f, i) { return '<li class="' + (i ? "" : "on") + '"><button type="button" data-field="' + i + '"><i></i>' + esc(f.t) + "</button></li>"; }).join("");
    var doors = DOORS.map(function (d) {
      return '<a class="door" href="' + d.href + '"><span class="dimg"><img src="' + photo(d.ph) + '" alt=""></span><span class="dbody"><em>' + d.n + "</em><b>" + esc(d.t) + "</b><span>" + esc(d.d) + '</span><i class="darr">' + I.arrow + "</i></span></a>";
    }).join("");
    var nums = [
      { n: BG.years(D.company.since) + "년", l: D.company.since + "년 설립" },
      { n: D.companies.length + "곳", l: "등록 업체" },
      { n: D.experts.length + "명", l: "등록 전문가" },
      { n: D.materials.length + "종", l: "회원 자재" }
    ].map(function (x) { return '<div class="num"><b>' + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("");
    var biz = [
      { n: "01", t: "부동산 개발", d: "1998년부터 이어 온 더원파트너스의 본업입니다. 개발 현장에서 쌓은 경험이 BUILDGO의 기준이 됩니다.", ph: "hero_glass" },
      { n: "02", t: "설계·시공 연결", d: "공종과 지역으로 업체와 전문가를 찾고, 한 번의 문의로 견적을 받습니다. 면허와 사업자 정보는 미리 확인합니다.", ph: "w_review" },
      { n: "03", t: "회원 자재 공급", d: "사업자 회원에게 등급별 가격으로 자재를 공급합니다. 수도권 일부 품목은 당일 출고합니다.", ph: "mt_lumber" }
    ].map(function (b, i) { return '<article class="biz-row' + (i % 2 ? " rev" : "") + '"><div class="bimg"><img loading="lazy" src="' + photo(b.ph) + '" alt=""></div><div class="btxt"><em>' + b.n + "</em><h3>" + esc(b.t) + "</h3><p>" + esc(b.d) + "</p></div></article>"; }).join("");
    var steps = [
      { t: "공종과 지역 고르기", d: "철근콘크리트·방수·설계처럼 맡길 일과 현장 지역을 고릅니다." },
      { t: "업체 비교", d: "면허, 실적 사진, 설립 연도를 나란히 놓고 봅니다." },
      { t: "견적 문의", d: "한 번의 문의로 고른 업체에 견적을 요청합니다." }
    ].map(function (s, i) { return '<li class="step"><em>' + (i + 1) + "</em><b>" + esc(s.t) + "</b><span>" + esc(s.d) + "</span></li>"; }).join("");
    app.innerHTML =
      '<section class="hero" id="hero"><div class="hero-bg" id="heroBg"><img class="on" src="' + photo(FIELDS[0].ph) + '" alt=""></div><div class="hero-shade"></div>' +
      '<div class="wrap hero-in"><div class="hero-copy"><p class="eyebrow">SINCE 1998 · 부동산 개발·공급</p><h1>설계부터 시공, 자재까지<br>한 곳에서 연결합니다</h1>' +
      '<p class="sub">더원파트너스가 개발 현장에서 쌓은 경험으로 만든<br>건설 B2B 거래 사이트, BUILDGO입니다.</p>' +
      '<div class="cta"><a class="btn btn-accent" href="#/companies">업체 찾기 ' + I.arrow + '</a><a class="btn btn-line" href="#/experts">전문가 찾기</a></div></div>' +
      '<div class="fields"><p>분야</p><ol id="fields">' + fl + '</ol><a class="fgo" id="fieldGo" href="' + FIELDS[0].href + '">이 분야 보기 ' + I.arrow + "</a></div></div>" +
      '<div class="hero-bar"><i id="heroBar"></i></div></section>' +
      '<section class="doors wrap" aria-label="바로 가기">' + doors + "</section>" +
      '<section class="about wrap" id="about"><div class="sec-h"><p class="eyebrow">회사 소개</p><h2>1998년부터<br>부동산을 개발하고 공급해 왔습니다</h2></div>' +
      '<div class="about-r"><p>더원파트너스는 1998년에 설립해 부동산 개발과 공급을 해 온 회사입니다. 개발 현장에서 늘 필요했던 일 — 믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제값에 구하는 일 — 을 한 곳에서 할 수 있도록 BUILDGO를 엽니다.</p>' +
      '<div class="nums">' + nums + "</div></div></section>" +
      '<section class="biz wrap"><div class="sec-h"><p class="eyebrow">사업 분야</p><h2>세 가지 일을 합니다</h2></div>' + biz + "</section>" +
      '<section class="how"><div class="wrap"><div class="sec-h"><p class="eyebrow">이용 방법</p><h2>세 번이면 견적까지</h2></div><ol class="steps">' + steps + "</ol></div></section>" +
      '<section class="band wrap"><h2>현장에 맞는 업체를<br>지금 찾아보세요</h2><div class="cta"><a class="btn btn-accent" href="#/companies">업체 찾기 ' + I.arrow + '</a><a class="btn btn-dark" href="#/quote">견적 문의</a></div></section>';
    heroSetup();
  }

  var heroAt = 0;
  function heroGo(i) {
    var bg = document.getElementById("heroBg"); if (!bg) return;
    i = (i + FIELDS.length) % FIELDS.length;
    if (i === heroAt) return;
    heroAt = i;
    var img = document.createElement("img");
    img.src = photo(FIELDS[i].ph); img.alt = "";
    bg.appendChild(img);
    var old = bg.querySelectorAll("img");
    img.classList.add("on");
    if (!BG.reduced() && img.animate) {
      var a = img.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 1100, easing: "cubic-bezier(.7,0,.2,1)" });
      BG.mo.play([img], "settle", { s: 1.12, dur: 7000 });
      a.onfinish = function () { for (var k = 0; k < old.length - 1; k++) old[k].remove(); };
    } else {
      for (var k = 0; k < old.length - 1; k++) old[k].remove();
    }
    document.querySelectorAll("#fields li").forEach(function (li, k) { li.classList.toggle("on", k === i); });
    var go = document.getElementById("fieldGo"); go.setAttribute("href", FIELDS[i].href);
    barRun();
  }
  function barRun() {
    var bar = document.getElementById("heroBar"); if (!bar || !bar.animate || BG.reduced()) return;
    bar.getAnimations().forEach(function (x) { x.cancel(); });
    bar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 6500, easing: "linear", fill: "forwards" });
  }
  function heroSetup() {
    heroAt = 0;
    clearInterval(heroTimer);
    var first = document.querySelector("#heroBg img");
    BG.mo.play([first], "settle", { s: 1.12, dur: 7000 });
    if (!BG.reduced()) heroTimer = setInterval(function () { if (!document.getElementById("heroBg")) return clearInterval(heroTimer); if (!document.hidden) heroGo(heroAt + 1); }, 6500);
    barRun();
    document.getElementById("fields").onclick = function (ev) {
      var b = ev.target.closest("[data-field]"); if (!b) return;
      heroGo(+b.dataset.field);
      clearInterval(heroTimer);
      if (!BG.reduced()) heroTimer = setInterval(function () { if (!document.getElementById("heroBg")) return clearInterval(heroTimer); if (!document.hidden) heroGo(heroAt + 1); }, 6500);
    };
    BG.swipe(document.getElementById("hero"), function () { heroGo(heroAt + 1); }, function () { heroGo(heroAt - 1); });
  }

  function tabs(cur) {
    return '<div class="seg" role="tablist"><a href="#/companies" class="' + (cur === "companies" ? "on" : "") + '">업체 찾기</a><a href="#/experts" class="' + (cur === "experts" ? "on" : "") + '">전문가 찾기</a></div>';
  }
  function searchForm(kind, q) {
    return '<form class="finder" data-finder="' + kind + '"><label class="fsel"><span>공종</span><select name="work">' + opts(D.works, q.work, "모든 공종") + "</select>" + I.down + '</label>' +
      '<label class="fsel"><span>지역</span><select name="region">' + opts(D.regions, q.region, "전국") + "</select>" + I.down + '</label>' +
      '<label class="ftxt"><span>' + (kind === "companies" ? "업체명·면허" : "이름·자격") + '</span><input name="q" type="search" value="' + esc(q.q || "") + '" placeholder="' + (kind === "companies" ? "예: 방수, 건축공사업" : "예: 건축사, 감리") + '"></label>' +
      '<button type="submit" class="btn btn-accent fgo2">' + I.search + "검색</button></form>";
  }

  function companyRow(c) {
    var ph = c.projects.map(function (p) { return '<figure><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"><figcaption>' + esc(p.t) + "</figcaption></figure>"; }).join("");
    return '<article class="row"><div class="row-id">' + mono(c.name) + '<div><p class="tag">' + esc(typeName(c.type)) + '</p><h3><a href="#/company/' + c.id + '">' + esc(c.name) + "</a></h3>" +
      '<p class="meta">' + I.pin + esc(c.region + " " + c.city) + " · " + c.since + "년 설립 · 실적 " + won(c.count) + "건</p>" +
      '<p class="lic">' + esc(c.licenses.join(" · ")) + "</p>" + checks(c) + "</div></div>" +
      '<div class="row-ph">' + ph + "</div>" +
      '<div class="row-act"><p class="works">' + workNames(c.works).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("") + '</p><a class="btn btn-line-dark" href="#/company/' + c.id + '">업체 정보</a><a class="btn btn-dark" href="#/quote?to=' + c.id + '">견적 문의</a></div></article>';
  }
  function companies(r) {
    var q = r.query, all = BG.findCompanies({ work: q.work, region: q.region, q: q.q });
    var list = q.type ? all.filter(function (c) { return c.type === q.type; }) : all.slice();
    var sort = q.sort || "trust";
    list.sort(function (a, b) { return sort === "since" ? a.since - b.since : sort === "name" ? a.name.localeCompare(b.name, "ko") : sort === "count" ? b.count - a.count : (b.checks.length - a.checks.length) || (b.count - a.count); });
    var chips = '<a class="chip' + (q.type ? "" : " on") + '" href="#/companies' + BG.qs({ work: q.work, region: q.region, q: q.q }) + '">전체 <b>' + all.length + "</b></a>" +
      D.types.map(function (t) { var n = all.filter(function (c) { return c.type === t.id; }).length; return '<a class="chip' + (q.type === t.id ? " on" : "") + '" href="#/companies' + BG.qs({ work: q.work, region: q.region, q: q.q, type: t.id }) + '">' + esc(t.name) + " <b>" + n + "</b></a>"; }).join("");
    app.innerHTML = '<section class="page-h"><div class="wrap">' + tabs("companies") + '<h1>업체 찾기</h1><p>공종과 지역을 고르면 면허와 사업자 정보를 확인한 업체가 나옵니다.</p>' + searchForm("companies", q) + "</div></section>" +
      '<section class="wrap list"><div class="list-top"><div class="chips">' + chips + '</div><label class="sort"><span>정렬</span><select data-sort>' +
      [["trust", "확인 많은 순"], ["count", "실적 많은 순"], ["since", "오래된 업체 순"], ["name", "이름 순"]].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === sort ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>" + I.down + "</label></div>" +
      '<p class="count"><b>' + list.length + "곳</b>의 업체" + (q.work ? " · " + esc(BG.WORK[q.work].name) : "") + (q.region ? " · " + esc(q.region) : "") + "</p>" +
      (list.length ? list.map(companyRow).join("") : '<p class="empty">조건에 맞는 업체가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</section>";
  }

  function company(r) {
    var c = BG.CO[r.id] || D.companies[0];
    var ph = c.projects.map(function (p) { return '<figure><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"><figcaption><b>' + esc(p.t) + "</b><span>" + p.y + "년</span></figcaption></figure>"; }).join("");
    var same = D.companies.filter(function (x) { return x.id !== c.id && x.works.some(function (w) { return c.works.indexOf(w) >= 0; }); }).slice(0, 3);
    app.innerHTML = '<section class="pro-h"><div class="wrap"><p class="crumb"><a href="#/companies">업체 찾기</a> / ' + esc(typeName(c.type)) + "</p>" +
      '<div class="pro-top">' + mono(c.name, "lg") + '<div><h1>' + esc(c.name) + '</h1><p class="meta">' + esc(typeName(c.type)) + " · " + esc(c.region + " " + c.city) + " · " + c.since + "년 설립 (" + BG.years(c.since) + "년)</p>" + checks(c) + "</div>" +
      '<div class="pro-act"><a class="btn btn-accent" href="#/quote?to=' + c.id + '">견적 문의 ' + I.arrow + "</a>" + saveBtn(c.id) + "</div></div></div></section>" +
      '<section class="wrap pro-body"><div class="pro-main"><h2>업체 소개</h2><p class="lead">' + esc(c.intro) + "</p>" +
      '<h2>대표 실적</h2><div class="gallery">' + ph + "</div>" +
      '<h2>맡는 공종과 면허</h2><table class="spec"><tr><th>업체 종류</th><td>' + esc(typeName(c.type)) + "</td></tr><tr><th>공종</th><td>" + esc(workNames(c.works).join(", ")) + "</td></tr><tr><th>면허·등록</th><td>" + esc(c.licenses.join(", ")) + "</td></tr><tr><th>지역</th><td>" + esc(c.region + " " + c.city) + "</td></tr><tr><th>실적</th><td>" + won(c.count) + "건</td></tr></table></div>" +
      '<aside class="pro-side"><div class="side-card"><p class="eyebrow">견적 문의</p><b>' + esc(c.name) + '</b><p>현장 지역과 규모를 남기면 업체가 직접 연락합니다.</p><a class="btn btn-accent wide" href="#/quote?to=' + c.id + '">견적 문의하기</a></div>' +
      (same.length ? '<div class="side-list"><p class="eyebrow">같은 공종 업체</p>' + same.map(function (x) { return '<a href="#/company/' + x.id + '">' + mono(x.name) + "<span><b>" + esc(x.name) + "</b>" + esc(typeName(x.type) + " · " + x.region) + "</span></a>"; }).join("") + "</div>" : "") + "</aside></section>";
  }

  function expertRow(x) {
    return '<article class="row xrow"><div class="row-id">' + mono(x.name, "round") + '<div><p class="tag">' + esc(x.title) + '</p><h3><a href="#/expert/' + x.id + '">' + esc(x.name) + "</a></h3>" +
      '<p class="meta">' + I.pin + esc(x.region) + " · 경력 " + x.years + "년 · " + esc(x.affil === "개인" ? "개인 전문가" : x.affil) + '</p><p class="lic">' + esc(x.intro) + "</p></div></div>" +
      '<ul class="xproj">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
      '<div class="row-act"><p class="works">' + workNames(x.works).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("") + '</p><a class="btn btn-line-dark" href="#/expert/' + x.id + '">전문가 정보</a><a class="btn btn-dark" href="#/quote?to=' + x.id + '">견적 문의</a></div></article>';
  }
  function experts(r) {
    var q = r.query, list = BG.findExperts({ work: q.work, region: q.region, q: q.q }).sort(function (a, b) { return b.years - a.years; });
    app.innerHTML = '<section class="page-h"><div class="wrap">' + tabs("experts") + '<h1>전문가 찾기</h1><p>건축사·기술사·현장소장급 기술자를 공종과 지역으로 찾습니다.</p>' + searchForm("experts", q) + "</div></section>" +
      '<section class="wrap list"><p class="count"><b>' + list.length + "명</b>의 전문가 · 경력 많은 순</p>" + (list.length ? list.map(expertRow).join("") : '<p class="empty">조건에 맞는 전문가가 없습니다.</p>') + "</section>";
  }
  function expert(r) {
    var x = BG.EX[r.id] || D.experts[0];
    app.innerHTML = '<section class="pro-h"><div class="wrap"><p class="crumb"><a href="#/experts">전문가 찾기</a> / ' + esc(x.title) + "</p>" +
      '<div class="pro-top">' + mono(x.name, "lg round") + '<div><h1>' + esc(x.name) + ' <small>' + esc(x.title) + '</small></h1><p class="meta">' + esc(x.region) + " · 경력 " + x.years + "년 · " + esc(x.affil === "개인" ? "개인 전문가" : x.affil) + "</p></div>" +
      '<div class="pro-act"><a class="btn btn-accent" href="#/quote?to=' + x.id + '">견적 문의 ' + I.arrow + "</a>" + saveBtn(x.id) + "</div></div></div></section>" +
      '<section class="wrap pro-body"><div class="pro-main"><h2>소개</h2><p class="lead">' + esc(x.intro) + '</p><h2>대표 실적</h2><ol class="plist">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>" +
      '<h2>자격과 분야</h2><table class="spec"><tr><th>자격</th><td>' + esc(x.title) + "</td></tr><tr><th>분야</th><td>" + esc(workNames(x.works).join(", ")) + "</td></tr><tr><th>경력</th><td>" + x.years + "년</td></tr><tr><th>지역</th><td>" + esc(x.region) + "</td></tr></table></div>" +
      '<aside class="pro-side"><div class="side-card"><p class="eyebrow">견적 문의</p><b>' + esc(x.name + " " + x.title) + '</b><p>현장 정보와 일정을 남기면 전문가가 직접 연락합니다.</p><a class="btn btn-accent wide" href="#/quote?to=' + x.id + '">견적 문의하기</a></div></aside></section>';
  }

  function priceCell(m) {
    if (S.member) return '<span class="pmem"><s data-pop class="mo-ib">' + won(m.price) + '원</s><b><span data-roll="' + m.id + '">' + won(S.priceOf(m)) + "</span>원</b></span>";
    return '<span class="pmem"><b><span data-roll="' + m.id + '">' + won(m.price) + '</span>원</b><button type="button" class="plock" data-act="login" data-pop>로그인하고 회원가 보기</button></span>';
  }
  function matRow(m) {
    return '<article class="prow"><a class="pimg" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></a>' +
      '<div class="pname"><p class="tag">' + esc(BG.MC[m.cat].name) + '</p><h3><a href="#/item/' + m.id + '">' + esc(m.name) + "</a></h3><p>" + esc(m.spec) + "</p></div>" +
      '<div class="pcell"><span>단위</span><b>' + esc(m.unit) + '</b></div><div class="pcell"><span>최소 주문</span><b>' + esc(m.moq) + '</b></div><div class="pcell"><span>출고</span><b>' + esc(m.ship) + "</b></div>" +
      '<div class="pprice">' + priceCell(m) + '</div><div class="pbtn"><button type="button" class="btn btn-dark" data-act="cart" data-id="' + m.id + '">담기</button></div></article>';
  }
  function mall(r) {
    var c = r.query.c || "", list = D.materials.filter(function (m) { return !c || m.cat === c; });
    var t = S.tier();
    var tiles = D.matCats.map(function (x) { return '<a class="tile' + (c === x.id ? " on" : "") + '" href="#/mall' + (c === x.id ? "" : "?c=" + x.id) + '"><img loading="lazy" src="' + photo(x.ph) + '" alt=""><span>' + esc(x.name) + "</span></a>"; }).join("");
    app.innerHTML = '<section class="mall-h"><img src="' + photo("mt_warehouse") + '" alt=""><div class="wrap"><p class="eyebrow">회원 자재몰</p><h1>자재는 회원가로,<br>현장까지 바로</h1>' +
      '<p>' + (t ? esc(D.demoUser.company + " " + D.demoUser.name + " " + D.demoUser.role) + "님 · <b>" + esc(t.name) + " 회원가 " + t.discount + "%</b> 적용 중" : "사업자 회원으로 로그인하면 등급별 회원가가 보입니다.") + "</p>" +
      (t ? "" : '<button type="button" class="btn btn-accent" data-act="login">사업자 회원 로그인 ' + I.arrow + "</button>") + "</div></section>" +
      '<section class="wrap mall"><div class="tiles">' + tiles + '</div><p class="count"><b>' + list.length + "종</b>" + (c ? " · " + esc(BG.MC[c].name) : " · 전체 자재") + "</p>" +
      '<div class="phead"><span>자재</span><span></span><span>단위</span><span>최소 주문</span><span>출고</span><span>' + (t ? esc(t.name) + " 회원가" : "가격") + "</span><span></span></div>" + list.map(matRow).join("") + "</section>" + cartBar();
  }
  function cartBar() {
    var tt = S.cartTotals();
    if (!tt.count) return "";
    return '<div class="cartbar" id="cartbar"><div class="wrap"><p>담은 자재 <b>' + tt.count + "건</b> · " + (S.member ? "회원가 합계 " : "합계 ") + "<b>" + won(tt.pay) + '원</b></p><a class="btn btn-accent" href="#/cart">견적서 받기 ' + I.arrow + "</a></div></div>";
  }
  function item(r) {
    var m = BG.MT[r.id] || D.materials[0], co = BG.CO[m.seller];
    app.innerHTML = '<section class="wrap item"><p class="crumb"><a href="#/mall">회원 자재몰</a> / <a href="#/mall?c=' + m.cat + '">' + esc(BG.MC[m.cat].name) + "</a></p>" +
      '<div class="item-in"><div class="item-img"><img src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></div><div class="item-info"><p class="tag">' + esc(BG.MC[m.cat].name) + "</p><h1>" + esc(m.name) + "</h1>" +
      '<p class="iprice">' + priceCell(m) + "<small> / " + esc(m.unit) + "</small></p>" +
      '<div class="ifield"><span>규격</span><div class="specs" id="specs">' + m.specs.map(function (s) { return '<button type="button" class="' + (s === m.spec ? "on" : "") + '" data-spec="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div></div>" +
      '<div class="ifield"><span>수량 (' + esc(m.unit) + ')</span><div class="qty"><button type="button" data-q="-1" aria-label="빼기">' + I.minus + '</button><input id="qty" inputmode="numeric" value="1" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">' + I.plus + "</button></div></div>" +
      '<table class="spec"><tr><th>최소 주문</th><td>' + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a>" : "BUILDGO") + "</td></tr></table>" +
      '<div class="iact"><button type="button" class="btn btn-dark" data-act="cart-item" data-id="' + m.id + '">담기</button><a class="btn btn-accent" href="#/quote?item=' + m.id + '">대량 구매 문의</a></div></div></div></section>' + cartBar();
    var spec = m.spec;
    document.getElementById("specs").onclick = function (ev) { var b = ev.target.closest("[data-spec]"); if (!b) return; spec = b.dataset.spec; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    app.querySelector(".qty").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var inp = document.getElementById("qty"); inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + +b.dataset.q); };
    app.querySelector('[data-act="cart-item"]').onclick = function () { S.addCart(m.id, Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1), spec); BG.toast("견적 목록에 담았습니다"); refreshCart(); };
  }
  function refreshCart() {
    var old = document.getElementById("cartbar"); if (old) old.remove();
    var html = cartBar(); if (!html) return;
    app.insertAdjacentHTML("beforeend", html);
    var bar = document.getElementById("cartbar");
    if (!BG.reduced() && bar.animate) bar.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
  }
  function cart() {
    var tt = S.cartTotals();
    app.innerHTML = '<section class="page-h slim"><div class="wrap"><h1>견적 목록</h1><p>담은 자재로 견적서를 받습니다. 사업자 회원은 회원가로 계산됩니다.</p></div></section><section class="wrap list">' +
      (S.cart.length ? S.cart.map(function (row) { var m = BG.MT[row.id]; return '<div class="crow"><img src="' + photo(m.ph) + '" alt=""><div><b>' + esc(m.name) + "</b><span>" + esc(row.spec || m.spec) + " · " + row.qty + esc(m.unit) + "</span></div><p>" + won(S.priceOf(m) * row.qty) + "원</p></div>"; }).join("") +
        '<div class="csum"><p><span>정가 합계</span><b>' + won(tt.list) + "원</b></p><p><span>회원 할인</span><b>-" + won(tt.discount) + '원</b></p><p class="t"><span>견적 금액</span><b>' + won(tt.pay) + '원</b></p><button type="button" class="btn btn-accent wide" data-act="estimate">견적서 받기</button></div>'
        : '<p class="empty">담은 자재가 없습니다.</p><a class="btn btn-dark" href="#/mall">회원 자재몰로</a>') + "</section>";
  }
  function quote(r) {
    var to = BG.CO[r.query.to] || BG.EX[r.query.to], m = BG.MT[r.query.item];
    var target = to ? (to.title ? to.name + " " + to.title : to.name) : m ? m.name + " 대량 구매" : "";
    app.innerHTML = '<section class="page-h slim"><div class="wrap"><h1>견적 문의</h1><p>' + (target ? "<b>" + esc(target) + "</b>에 보내는 문의입니다." : "맡길 일과 현장 정보를 남기면 맞는 업체가 연락합니다.") + "</p></div></section>" +
      '<section class="wrap qform"><form id="qf" novalidate><fieldset><legend><em>1</em>맡길 일</legend><label class="fsel big"><span>공종</span><select name="work">' + opts(D.works, to && to.works ? to.works[0] : "", "공종을 고르세요") + "</select>" + I.down + "</label></fieldset>" +
      '<fieldset><legend><em>2</em>현장</legend><div class="g2"><label class="fsel big"><span>지역</span><select name="region">' + opts(D.regions, to ? to.region : "", "지역을 고르세요") + "</select>" + I.down + '</label><label class="ftxt big"><span>규모</span><input name="size" placeholder="예: 연면적 1,200㎡"></label></div>' +
      '<label class="ftxt big"><span>착공 예정</span><input name="when" placeholder="예: 2027년 3월"></label></fieldset>' +
      '<fieldset><legend><em>3</em>연락처</legend><div class="g2"><label class="ftxt big"><span>회사명</span><input name="co" autocomplete="organization"></label><label class="ftxt big"><span>담당자</span><input name="name" autocomplete="name"></label></div>' +
      '<label class="ftxt big"><span>휴대폰</span><input name="phone" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label></fieldset><p class="err" id="qerr"></p><button type="submit" class="btn btn-accent wide">견적 문의 보내기</button></form></section>';
    document.getElementById("qf").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, miss = [];
      if (!f.work.value) miss.push("공종"); if (!f.region.value) miss.push("지역"); if (!f.co.value.trim()) miss.push("회사명"); if (!f.name.value.trim()) miss.push("담당자");
      if (!/^0\d{8,10}$/.test(f.phone.value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("qerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ work: f.work.value, region: f.region.value, to: target });
      app.innerHTML = '<section class="wrap done"><p class="eyebrow">문의 접수</p><h1>견적 문의를 보냈습니다</h1><p>' + (target ? esc(target) + "에서" : "맞는 업체가") + " 확인한 뒤 남기신 번호로 연락드립니다.</p>" + '<div class="cta"><a class="btn btn-dark" href="#/companies">다른 업체 보기</a><a class="btn btn-line-dark" href="#/">처음으로</a></div></section>';
      window.scrollTo(0, 0);
    };
  }
  function login() {
    app.innerHTML = '<section class="wrap login"><div class="login-in"><p class="eyebrow">사업자 회원</p><h1>로그인</h1><p>사업자 회원은 등급별 회원가와 견적 목록을 쓸 수 있습니다.</p>' +
      '<label class="ftxt big"><span>아이디</span><input value="hankyul_gm" autocomplete="username"></label><label class="ftxt big"><span>비밀번호</span><input type="password" value="buildgo1998" autocomplete="current-password"></label>' +
      '<button type="button" class="btn btn-accent wide" data-act="do-login">로그인</button><p class="join">아직 회원이 아니신가요? <a href="#/quote">가입 문의</a></p></div></section>';
  }

  function sync(r) {
    var name = r ? r.name : BG.parseHash().name;
    document.body.classList.toggle("on-hero", name === "home");
    if (name !== "home") clearInterval(heroTimer);
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === name || (name === "company" && a.dataset.nav === "companies") || (name === "expert" && a.dataset.nav === "experts") || ((name === "item" || name === "cart") && a.dataset.nav === "mall")); });
    ["loginBtn", "loginBtn2"].forEach(function (id) { var b = document.getElementById(id); if (b) b.textContent = S.member ? "로그아웃" : "로그인"; });
    closeMenu();
  }
  function closeMenu() { var d = document.getElementById("drawer"); if (d && !d.hidden) { d.hidden = true; document.body.classList.remove("lock"); } }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-act]");
    if (!a) return;
    var act = a.dataset.act;
    if (act === "login") {
      ev.preventDefault();
      if (S.member) { S.member = false; S.save(); BG.toast("로그아웃했습니다"); window.dispatchEvent(new HashChangeEvent("hashchange")); }
      else location.hash = "#/login";
    }
    if (act === "do-login") { S.member = true; S.save(); BG.toast(D.demoUser.company + " " + D.demoUser.name + "님, 골드 회원가가 적용됩니다"); location.hash = "#/mall"; }
    if (act === "menu") { var d = document.getElementById("drawer"); d.hidden = false; document.body.classList.add("lock"); if (!BG.reduced() && d.animate) d.firstElementChild.animate([{ transform: "translateX(100%)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.7,.1,1)" }); }
    if (act === "menu-close") closeMenu();
    if (act === "save") { var on = S.toggleSave(a.dataset.id); a.classList.toggle("on", on); a.querySelector("span").textContent = on ? "저장됨" : "저장"; BG.toast(on ? "저장했습니다" : "저장을 취소했습니다"); }
    if (act === "cart") { var m = BG.MT[a.dataset.id]; S.addCart(m.id, 1, m.spec); BG.toast(m.name + " 1" + m.unit + ", 견적 목록에 담았습니다"); refreshCart(); }
    if (act === "estimate") BG.toast("견적서를 만들고 있습니다. 담당자가 확인 후 연락드립니다");
  });
  document.getElementById("drawer").addEventListener("click", function (ev) { if (ev.target === this || ev.target.closest("a")) closeMenu(); });
  document.addEventListener("submit", function (ev) {
    var f = ev.target.closest("[data-finder]"); if (!f) return;
    ev.preventDefault();
    location.hash = "#/" + f.dataset.finder + BG.qs({ work: f.work.value, region: f.region.value, q: f.q.value.trim() });
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.matches("[data-sort]")) { var r = BG.parseHash(); r.query.sort = ev.target.value; location.hash = "#/companies" + BG.qs(r.query); }
  });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;

  var MOTION = [
    [".hero h1", "lines", { delay: 250, gap: 120, dur: 1100 }],
    [".hero .eyebrow, .hero .sub", "up", { y: 14, delay: 650, stagger: 140 }],
    [".hero .cta", "up", { y: 14, delay: 900 }],
    [".fields li", "up", { y: 10, stagger: 70, delay: 800 }],
    [".door", "card", { stagger: 120, delay: 1000, y: 40, dur: 1000 }],
    [".sec-h h2, .page-h h1, .pro-h h1, .band h2, .mall-h h1, .done h1, .login h1", "lines", { gap: 100 }],
    [".sec-h .eyebrow, .about-r > p, .page-h > .wrap > p", "up", { y: 14, lag: 160 }],
    [".num b", "count", { dur: 1300 }],
    [".biz-row", "card", { y: 50, dur: 1100 }],
    [".step", "up", { y: 28, stagger: 140 }],
    [".finder", "up", { y: 18, lag: 200 }],
    [".row", "card", { y: 26, stagger: 70, max: 6, dur: 800 }],
    [".tile", "up", { y: 18, stagger: 50 }],
    [".prow", "up", { y: 16, stagger: 40, max: 8 }],
    [".gallery figure", "wipe", { stagger: 90 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
