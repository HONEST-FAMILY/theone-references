(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b3");
  var app = document.getElementById("app");
  var slideTimer = null;

  var I = {
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',
    bld: '<svg viewBox="0 0 48 48"><path d="M8 42V12l14-6v36M22 42V18l18 6v18M4 42h40M14 18h2M14 24h2M14 30h2M30 28h2M30 34h2"/></svg>',
    co: '<svg viewBox="0 0 48 48"><rect x="6" y="14" width="36" height="26" rx="2"/><path d="M17 14V9h14v5M6 24h36M22 24v4h4v-4"/></svg>',
    hat: '<svg viewBox="0 0 48 48"><path d="M8 32a16 16 0 0 1 32 0M6 32h36v5H6zM20 17v-5h8v5M24 12v10"/></svg>',
    box: '<svg viewBox="0 0 48 48"><path d="M24 5 41 13v22L24 43 7 35V13z"/><path d="M7 13l17 8 17-8M24 21v22"/></svg>',
    mgr: '<svg viewBox="0 0 48 48"><circle cx="24" cy="16" r="8"/><path d="M9 42c2-9 8-13 15-13s13 4 15 13"/></svg>',
    cmp: '<svg viewBox="0 0 48 48"><rect x="6" y="10" width="14" height="28" rx="2"/><rect x="28" y="10" width="14" height="28" rx="2"/><path d="M10 18h6M10 24h6M32 18h6M32 24h6"/></svg>',
    doc: '<svg viewBox="0 0 48 48"><path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8M18 24h14M18 30h14M18 36h8"/></svg>'
  };
  var ART = {
    tower: '<svg viewBox="0 0 96 96"><path d="M14 86h68M24 86V30l18-10v66M42 86V36h30v50M50 44h4M60 44h4M50 54h4M60 54h4M50 64h4M60 64h4M50 74h4M60 74h4M30 38h6M30 48h6M30 58h6M30 68h6M30 78h6M72 36V18h-2M70 18H46l6 6M70 18l10 10M80 28v6"/></svg>',
    doc: '<svg viewBox="0 0 96 96"><path d="M26 12h32l14 14v58H26z"/><path d="M58 12v14h14M36 40h26M36 50h26M36 60h16"/><circle cx="62" cy="70" r="11"/><path d="m57 70 4 4 7-8"/></svg>',
    helmet: '<svg viewBox="0 0 96 96"><path d="M18 64a30 30 0 0 1 60 0"/><path d="M14 64h68v8H14zM42 36V24h12v12M30 44c2-6 6-10 12-12M66 44c-2-6-6-10-12-12M24 80h48"/></svg>',
    beam: '<svg viewBox="0 0 96 96"><path d="M14 30 50 18l32 10-36 12z"/><path d="M14 30v8l32 10v-8M46 48v8l36-12v-8M28 44v18M64 40v18M14 66l36-12 32 10-36 12z"/><path d="M14 66v8l32 10v-8M46 84v-8l36-12v8"/></svg>'
  };
  var POP = [["구조기술사", "#/experts?q=구조기술사"], ["방수·도장", "#/experts?work=water"], ["설계·인허가", "#/experts?work=design"], ["기계설비", "#/experts?work=mech"], ["철골", "#/experts?work=steel"]];
  var NEWS = [
    { d: "2026.10.20", t: "BUILDGO 사업자 회원 가입 안내" },
    { d: "2026.10.14", t: "회원 자재몰 수도권 당일 출고 품목 안내" },
    { d: "2026.10.02", t: "견적 요청 한 번으로 여러 업체에 요청하는 방법" },
    { d: "2026.09.25", t: "업체 등록 때 확인하는 면허·사업자·보험" }
  ];
  var BIZ = [
    { ph: "hero_glass", t: "LH 민간신축매입약정", d: "도아의 본업입니다. 민간이 짓고 LH가 매입하는 신축 사업을 설계부터 분양까지 맡습니다.", tags: ["민간신축매입", "PM", "시행"], href: "#intro" },
    { ph: "n_crew", t: "시공 업체 연결", d: "종합·전문건설사를 공종과 지역으로 찾고, 면허와 실적을 확인한 뒤 견적을 요청합니다.", tags: ["종합건설", "전문건설"], href: "#/companies" },
    { ph: "n_draft", t: "설계·감리 전문가", d: "건축사, 구조기술사, 감리원과 현장소장급 기술자를 경력과 실적으로 고릅니다.", tags: ["설계", "감리", "기술자"], href: "#/experts" },
    { ph: "n_steel", t: "회원 자재 공급", d: "철근·형강부터 마감재까지, 사업자 회원은 등급별 회원가로 삽니다.", tags: ["철강", "마감재"], href: "#/mall" },
    { ph: "n_glassbox", t: "외장·창호 공사", d: "커튼월과 창호, 외벽 공사 업체를 실적 사진과 함께 비교합니다.", tags: ["창호", "커튼월"], href: "#/companies?work=window" },
    { ph: "n_rebarman", t: "골조·철근콘크리트", d: "골조 공사 업체와 철근 자재를 한 곳에서 함께 준비합니다.", tags: ["골조", "철근콘크리트"], href: "#/companies?work=rc" }
  ];

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checkIcons(c) { return '<span class="chk">' + ["면허", "사업자", "보험"].map(function (k) { return '<i class="' + (c.checks.indexOf(k) >= 0 ? "on" : "") + '">' + k + "</i>"; }).join("") + "</span>"; }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '">' + I.save + "<span>" + (saved(id) ? "관심 업체" : "관심 업체 저장") + "</span></button>"; }
  function radios(name, list, cur, all, extra) {
    return '<div class="rgroup"><p>' + esc(all.title) + '</p><div class="ropts">' + [{ id: "", name: all.label }].concat(list.map(function (x) { return { id: x.id || x, name: x.name || x }; })).map(function (x) {
      return '<label class="radio"><input type="radio" name="' + name + '" value="' + esc(x.id) + '"' + (x.id === (cur || "") ? " checked" : "") + "><span>" + esc(x.name) + (extra ? "<b>" + extra(x.id) + "</b>" : "") + "</span></label>";
    }).join("") + "</div></div>";
  }

  function home() {
    var stats = [
      { k: "도아 사업 분야", n: 5, u: "개", art: ART.tower },
      { k: "면허·사업자 확인", n: D.companies.length, u: "곳", art: ART.doc },
      { k: "자격 확인 전문가", n: D.experts.length, u: "명", art: ART.helmet },
      { k: "사업자 회원 자재", n: D.materials.length, u: "종", art: ART.beam }
    ].map(function (s) { return '<li><p class="sk">' + esc(s.k) + '</p><div class="sart" aria-hidden="true">' + s.art + '</div><p class="snum"><b>' + s.n + "</b>" + s.u + "</p></li>"; }).join("");
    var news = NEWS.map(function (n) { return '<li><time>' + n.d + '</time><a href="#/quote">' + esc(n.t) + "</a></li>"; }).join("");
    var doors = [["#/companies", "업체 찾기", "종합·전문건설 · 설계 · 자재 공급", ART.tower], ["#/experts", "전문가 찾기", "건축사 · 기술사 · 현장소장", ART.helmet], ["#/mall", "회원 자재몰", "사업자 회원가 · 당일 출고", ART.beam]].map(function (d) {
      return '<a href="' + d[0] + '"><span class="bart" aria-hidden="true">' + d[3] + "</span><b>" + d[1] + "</b><span>" + d[2] + "</span><i>" + I.arrow + "</i></a>";
    }).join("");
    var biz = BIZ.map(function (b, i) { return '<article class="pj' + (i % 3 === 1 ? " tall" : "") + '"><a href="' + b.href + '"><div class="pj-im"><img loading="lazy" src="' + photo(b.ph) + '" alt="' + esc(b.t) + '"></div><h3>' + esc(b.t) + "</h3><p>" + esc(b.d) + '</p><p class="tags">' + b.tags.map(function (t) { return "#" + esc(t); }).join(" ") + "</p></a></article>"; }).join("");
    app.innerHTML =
      '<section class="hero" id="hero"><img src="' + photo("n_aerial") + '" alt=""><div class="shade"></div><div class="hero-in"><p class="eyebrow">THE ONE PARTNERS · 도아</p><h1 id="htitle">어떤 분야의 전문가를<br class="m-br"> 찾고 계신가요?</h1>' +
      '<form class="h3-s" id="hs"><label class="h3-q">' + I.search + '<input name="q" type="search" placeholder="공종이나 자격으로 찾기 (예: 구조기술사, 방수, 철골)" aria-label="찾을 전문가" autocomplete="off"></label><label class="h3-r"><select name="region" aria-label="지역"><option value="">전국</option>' + D.regions.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") + "</select>" + I.down + '</label><button type="submit">검색</button></form>' +
      '<p class="h3-pop"><span>많이 찾는 분야</span>' + POP.map(function (x) { return '<a href="' + x[1] + '">#' + esc(x[0]) + "</a>"; }).join("") + '</p></div><a class="hscroll" href="#intro" aria-label="아래로">SCROLL</a></section>' +
      '<section class="intro" id="intro"><div class="wrap"><h2>더원파트너스는 현장에서 답을 찾습니다</h2><p class="intro-p">LH 민간신축매입약정사업을 전문으로, 설계부터 시공·분양까지 한 회사가 맡습니다. 개발 현장에서 직접 겪은 일 — 믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제때 구하는 일 — 을<br>기업 고객이 한 곳에서 할 수 있도록 BUILDGO를 만들었습니다.</p><ul class="stats">' + stats + "</ul></div></section>" +
      '<section class="news"><div class="wrap"><div class="sec-h"><h2>BUILDGO 소식</h2><a href="#/quote">+ more</a></div><ul class="nlist">' + news + "</ul></div></section>" +
      '<section class="band"><div class="wrap band-in">' + doors + "</div></section>" +
      '<section class="biz"><div class="wrap"><div class="sec-h"><h2>사업 분야</h2></div><div class="mason">' + biz + "</div></div></section>" +
      '<section class="cta"><img loading="lazy" src="' + photo("n_slab") + '" alt=""><div class="shade2"></div><div class="wrap cta-in"><h2>기업 고객을 위한 건설 거래,<br>BUILDGO와 시작하세요</h2><div class="cta-b">' +
      '<a href="#/quote"><span aria-hidden="true">' + ART.doc + "</span><b>견적 요청</b><i>바로 가기</i></a>" +
      '<a href="#/quote"><span aria-hidden="true">' + ART.helmet + "</span><b>사업자 회원 가입 문의</b><i>바로 가기</i></a>" +
      '<a href="#/quote"><span aria-hidden="true">' + ART.tower + "</span><b>업체 등록 문의</b><i>바로 가기</i></a></div></div></section>";
    var im = app.querySelector(".hero img");
    BG.mo.play([im], "settle", { s: 1.08, dur: 3000 });
    if (window.matchMedia && matchMedia("(max-width: 760px)").matches) document.querySelector("#hs input").placeholder = "예: 구조기술사, 방수, 철골";
    document.getElementById("hs").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, q = f.q.value.trim(), w = D.works.filter(function (x) { return q && (x.name.indexOf(q) >= 0 || q.indexOf(x.name) >= 0); })[0];
      location.hash = "#/experts" + BG.qs({ q: w ? "" : q, work: w ? w.id : "", region: f.region.value });
    };
  }
  function opening(force) {
    var html = '<div class="o3-up"><div class="o3-top">' +
        '<div class="o3-s s1"><p class="o3-eq"><span class="o3-a"><b>설계</b><i>+</i><b>시공</b><i>+</i><b>분양</b></span><span class="o3-b"><i>=</i>' + BG.doaMark("o3-mk") + "</span></p></div>" +
        '<div class="o3-s s2"><p class="o3-num"><b>0</b><em>건</em></p></div>' +
        '<div class="o3-s s3"><p class="o3-fin">그래서 <b>더 저렴합니다.</b></p></div>' +
      '</div><i class="o3-ln"></i></div>' +
      '<div class="o3-dn"><div class="o3-bot"><p class="o3-t t1">보통은 설계 · 시공 · 분양을 세 회사에 따로 맡깁니다.</p><p class="o3-t t2">도아는 한 회사가 한 번에 합니다.</p><p class="o3-t t3">2023년까지 도아가 직접 설계한 건수</p><p class="o3-t t4">설계부터 시공 · 분양까지, 도아 한 곳에서.</p></div></div>';
    return BG.opening({
      key: "doa-op-3", cls: "op3", html: html, total: 7700, force: force,
      start: function (el, at) {
        var eq = el.querySelector(".o3-eq"), b = el.querySelector(".o3-b"), col = getComputedStyle(eq).flexDirection === "column", gap = parseFloat(getComputedStyle(eq).columnGap) || 0;
        if (col) eq.style.setProperty("--dy", (b.offsetHeight + (parseFloat(getComputedStyle(eq).rowGap) || 0)) / 2 + "px");
        else eq.style.setProperty("--dx", (b.offsetWidth + gap) / 2 + "px");
        var n = el.querySelector(".o3-num b"), clock = el.querySelector(".o3-ln").animate([{ opacity: 1 }, { opacity: 1 }], { duration: 5630 });
        (function step() { var k = Math.min(1, Math.max(0, ((clock.currentTime || 0) - 4480) / 1150)); n.textContent = Math.round(109 * (1 - Math.pow(1 - k, 3))); if (clock.playState !== "finished" && document.body.contains(n)) requestAnimationFrame(step); else n.textContent = "109"; })();
      },
      exit: function (el) {
        el.classList.add("out");
        BG.mo.play([document.querySelector(".hero > img")], "settle", { s: 1.1, dur: 2600 });
        BG.mo.play([document.querySelector(".hero .eyebrow"), document.querySelector(".hero h1"), document.querySelector(".h3-s"), document.querySelector(".h3-pop")], "up", { y: 30, stagger: 110, delay: 520, dur: 950 });
        return 1150;
      }
    });
  }
  function pageHead(title, sub, crumb) {
    return '<section class="page-h"><div class="wrap"><p class="crumb"><a href="#/">홈</a> · ' + esc(crumb || title) + "</p><h1>" + esc(title) + "</h1><p>" + esc(sub) + "</p></div></section>";
  }
  function companies(r) {
    var q = r.query, base = BG.findCompanies({ work: q.work, region: q.region, q: q.q });
    var list = (q.type ? base.filter(function (c) { return c.type === q.type; }) : base).sort(function (a, b) { return (b.checks.length - a.checks.length) || (b.count - a.count); });
    var cnt = function (t) { return t ? base.filter(function (c) { return c.type === t; }).length : base.length; };
    var rows = list.map(function (c) {
      return '<tr><td><div class="tn">' + mono(c.name) + '<div><a href="#/company/' + c.id + '">' + esc(c.name) + "</a><span>" + esc(c.licenses.join(" · ")) + "</span></div></div></td>" +
        '<td><b class="t1">' + esc(typeName(c.type)) + '</b><span class="t2">' + esc(c.region + " " + c.city) + "</span></td><td>" + esc(workNames(c.works).join(", ")) + '</td><td><b class="t1">' + won(c.count) + '건</b><span class="t2">' + c.since + "년 설립</span></td><td>" + checkIcons(c) + "</td>" +
        '<td class="tb"><a class="btn btn-blue sm" href="#/quote?to=' + c.id + '">견적 요청</a></td></tr>';
    }).join("");
    var cards = list.map(function (c) {
      return '<article class="mcardc"><div class="mh">' + mono(c.name) + '<div><a href="#/company/' + c.id + '">' + esc(c.name) + "</a><span>" + esc(typeName(c.type) + " · " + c.region + " " + c.city) + "</span></div></div>" +
        '<dl><div><dt>공종</dt><dd>' + esc(workNames(c.works).join(", ")) + "</dd></div><div><dt>면허</dt><dd>" + esc(c.licenses.join(", ")) + "</dd></div><div><dt>설립·실적</dt><dd>" + c.since + "년 · " + won(c.count) + "건</dd></div></dl>" + checkIcons(c) +
        '<div class="mb"><a class="btn btn-line-b" href="#/company/' + c.id + '">업체 정보</a><a class="btn btn-blue" href="#/quote?to=' + c.id + '">견적 요청</a></div></article>';
    }).join("");
    app.innerHTML = pageHead("업체 찾기", "공종과 지역을 고르면 면허와 사업자 정보를 확인한 업체가 나옵니다.") +
      '<section class="wrap finder-wrap"><form class="side" data-finder="companies">' + radios("type", D.types, q.type, { title: "업체 종류", label: "전체" }, cnt) + radios("work", D.works, q.work, { title: "공종", label: "모든 공종" }) + radios("region", D.regions, q.region, { title: "지역", label: "전국" }) + '<input type="hidden" name="q" value="' + esc(q.q || "") + '"></form>' +
      '<div class="res"><form class="sbar" data-finder="companies" data-keep="1"><input name="q" type="search" value="' + esc(q.q || "") + '" placeholder="업체명이나 면허로 찾기 (예: 방수, 건축공사업)" aria-label="업체 검색"><button type="submit" class="btn btn-blue">' + I.search + "검색</button></form>" +
      '<p class="count">검색 결과 <b>' + list.length + "</b>곳</p>" +
      (list.length ? '<table class="tbl"><thead><tr><th>업체명 · 면허</th><th>종류 · 지역</th><th>공종</th><th>실적</th><th>확인</th><th></th></tr></thead><tbody>' + rows + '</tbody></table><div class="mcards">' + cards + "</div>" : '<p class="empty">조건에 맞는 업체가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</div></section>";
  }
  function company(r) {
    var c = BG.CO[r.id] || D.companies[0];
    app.innerHTML = '<section class="page-h prof"><div class="wrap"><p class="crumb"><a href="#/companies">업체 찾기</a> · ' + esc(typeName(c.type)) + '</p><div class="ph-top">' + mono(c.name, "lg") + "<div><h1>" + esc(c.name) + '</h1><p>' + esc(c.intro) + "</p>" + checkIcons(c) + '</div><div class="ph-act"><a class="btn btn-blue" href="#/quote?to=' + c.id + '">견적 요청</a>' + saveBtn(c.id) + "</div></div></div></section>" +
      '<nav class="tabs"><div class="wrap"><a href="#ov" class="on">업체 개요</a><a href="#pj">대표 실적</a><a href="#lc">면허·공종</a></div></nav>' +
      '<section class="wrap prof-b"><div id="ov" class="ov"><div><span>업체 종류</span><b>' + esc(typeName(c.type)) + "</b></div><div><span>지역</span><b>" + esc(c.region + " " + c.city) + "</b></div><div><span>설립</span><b>" + c.since + "년 (" + BG.years(c.since) + "년)</b></div><div><span>실적</span><b>" + won(c.count) + "건</b></div></div>" +
      '<h2 id="pj">대표 실적</h2><div class="pjgrid">' + c.projects.map(function (p) { return '<figure><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"><figcaption><b>' + esc(p.t) + "</b><span>" + p.y + "년 준공</span></figcaption></figure>"; }).join("") + "</div>" +
      '<h2 id="lc">면허·공종</h2><table class="spec"><tr><th>면허·등록</th><td>' + esc(c.licenses.join(", ")) + "</td></tr><tr><th>공종</th><td>" + esc(workNames(c.works).join(", ")) + "</td></tr><tr><th>확인 항목</th><td>" + esc(c.checks.join(" · ")) + "</td></tr></table>" +
      '<div class="ask"><div><b>' + esc(c.name) + '에 견적을 요청하세요</b><span>현장 지역과 규모를 남기면 담당 매니저가 확인 후 연결합니다.</span></div><a class="btn btn-blue" href="#/quote?to=' + c.id + '">견적 요청하기</a></div></section>';
  }
  function experts(r) {
    var q = r.query, list = BG.findExperts({ work: q.work, region: q.region, q: q.q }).sort(function (a, b) { return b.years - a.years; });
    var rows = list.map(function (x) {
      return '<tr><td><div class="tn">' + mono(x.name, "round") + '<div><a href="#/expert/' + x.id + '">' + esc(x.name) + "</a><span>" + esc(x.title) + "</span></div></div></td><td>" + esc(workNames(x.works).join(", ")) + "</td><td>" + esc(x.region) + "</td><td>" + x.years + "년</td><td>" + esc(x.affil === "개인" ? "개인" : x.affil) + '</td><td class="tb"><a class="btn btn-blue sm" href="#/quote?to=' + x.id + '">견적 요청</a></td></tr>';
    }).join("");
    var cards = list.map(function (x) {
      return '<article class="mcardc"><div class="mh">' + mono(x.name, "round") + '<div><a href="#/expert/' + x.id + '">' + esc(x.name) + "</a><span>" + esc(x.title + " · " + x.region) + '</span></div></div><dl><div><dt>분야</dt><dd>' + esc(workNames(x.works).join(", ")) + "</dd></div><div><dt>경력</dt><dd>" + x.years + "년</dd></div><div><dt>소속</dt><dd>" + esc(x.affil === "개인" ? "개인" : x.affil) + "</dd></div></dl>" +
        '<div class="mb"><a class="btn btn-line-b" href="#/expert/' + x.id + '">전문가 정보</a><a class="btn btn-blue" href="#/quote?to=' + x.id + '">견적 요청</a></div></article>';
    }).join("");
    app.innerHTML = pageHead("전문가 찾기", "건축사·기술사·현장소장급 기술자를 공종과 지역으로 찾습니다.") +
      '<section class="wrap finder-wrap"><form class="side" data-finder="experts">' + radios("work", D.works, q.work, { title: "분야", label: "모든 분야" }) + radios("region", D.regions, q.region, { title: "지역", label: "전국" }) + '<input type="hidden" name="q" value="' + esc(q.q || "") + '"></form>' +
      '<div class="res"><form class="sbar" data-finder="experts" data-keep="1"><input name="q" type="search" value="' + esc(q.q || "") + '" placeholder="이름이나 자격으로 찾기 (예: 건축사, 감리)" aria-label="전문가 검색"><button type="submit" class="btn btn-blue">' + I.search + "검색</button></form>" +
      '<p class="count">검색 결과 <b>' + list.length + "</b>명</p>" +
      (list.length ? '<table class="tbl"><thead><tr><th>이름 · 자격</th><th>분야</th><th>지역</th><th>경력</th><th>소속</th><th></th></tr></thead><tbody>' + rows + '</tbody></table><div class="mcards">' + cards + "</div>" : '<p class="empty">조건에 맞는 전문가가 없습니다.</p>') + "</div></section>";
  }
  function expert(r) {
    var x = BG.EX[r.id] || D.experts[0];
    app.innerHTML = '<section class="page-h prof"><div class="wrap"><p class="crumb"><a href="#/experts">전문가 찾기</a> · ' + esc(x.title) + '</p><div class="ph-top">' + mono(x.name, "lg round") + "<div><h1>" + esc(x.name) + ' <small>' + esc(x.title) + "</small></h1><p>" + esc(x.intro) + '</p></div><div class="ph-act"><a class="btn btn-blue" href="#/quote?to=' + x.id + '">견적 요청</a>' + saveBtn(x.id) + "</div></div></div></section>" +
      '<section class="wrap prof-b"><div class="ov"><div><span>자격</span><b>' + esc(x.title) + "</b></div><div><span>분야</span><b>" + esc(workNames(x.works).join(", ")) + "</b></div><div><span>경력</span><b>" + x.years + "년</b></div><div><span>지역·소속</span><b>" + esc(x.region + " · " + (x.affil === "개인" ? "개인" : x.affil)) + "</b></div></div>" +
      '<h2>대표 실적</h2><ol class="plist">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>" +
      '<div class="ask"><div><b>' + esc(x.name + " " + x.title) + '에게 견적을 요청하세요</b><span>현장 정보와 일정을 남기면 담당 매니저가 연결합니다.</span></div><a class="btn btn-blue" href="#/quote?to=' + x.id + '">견적 요청하기</a></div></section>';
  }
  function priceHtml(m) {
    if (S.member) return '<p class="pr"><s data-pop class="mo-ib">' + won(m.price) + '원</s><b><span data-roll="' + m.id + '">' + won(S.priceOf(m)) + '</span>원</b><em data-pop class="mo-ib">회원가</em></p>';
    return '<p class="pr"><b><span data-roll="' + m.id + '">' + won(m.price) + '</span>원</b></p><button type="button" class="lock" data-act="login" data-pop>로그인하고 회원가 보기</button>';
  }
  function mall(r) {
    var c = r.query.c || "", list = D.materials.filter(function (m) { return !c || m.cat === c; }), t = S.tier();
    var cats = '<a class="' + (c ? "" : "on") + '" href="#/mall">전체 <b>' + D.materials.length + "</b></a>" + D.matCats.map(function (x) { return '<a class="' + (c === x.id ? "on" : "") + '" href="#/mall?c=' + x.id + '">' + esc(x.name) + " <b>" + D.materials.filter(function (m) { return m.cat === x.id; }).length + "</b></a>"; }).join("");
    app.innerHTML = '<section class="mall-h"><div class="wrap"><div><p class="eyebrow">기업 회원 전용</p><h1>BUILDGO 회원 자재몰</h1><p>' + (t ? esc(D.demoUser.company + " " + D.demoUser.name) + "님 · <b>" + esc(t.name) + " 회원가 " + t.discount + "%</b> 적용 중" : "사업자 회원은 등급별 회원가로 삽니다. 수도권 일부 품목은 당일 출고합니다.") + "</p></div>" +
      (t ? '<a class="btn btn-white" href="#/cart">견적 목록 보기</a>' : '<button type="button" class="btn btn-white" data-act="login">사업자 회원 로그인</button>') + "</div></section>" +
      '<section class="wrap mall"><nav class="mcats" aria-label="자재 분류"><p>자재 분류</p>' + cats + '</nav><div class="mres"><p class="count">' + (c ? esc(BG.MC[c].name) : "전체 자재") + " <b>" + list.length + '</b>종</p><div class="pgrid">' +
      list.map(function (m) {
        return '<article class="pcard"><a class="pimg" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '">' + (m.ship.indexOf("당일") >= 0 ? '<span class="today">당일 출고</span>' : "") + '</a><p class="seller">' + esc(BG.CO[m.seller] ? BG.CO[m.seller].name : "BUILDGO") + '</p><h3><a href="#/item/' + m.id + '">' + esc(m.name) + '</a></h3><p class="pspec">' + esc(m.spec) + " · " + esc(m.unit) + " · 최소 " + esc(m.moq) + "</p>" + priceHtml(m) +
          '<div class="pb"><button type="button" class="btn btn-line-b sm" data-act="cart" data-id="' + m.id + '">담기</button><a class="bulk" href="#/quote?item=' + m.id + '">대량구매 문의</a></div></article>';
      }).join("") + "</div></div></section>" + cartBar();
  }
  function cartBar() {
    var tt = S.cartTotals(); if (!tt.count) return "";
    return '<div class="cartbar" id="cartbar"><div class="wrap"><p>견적 목록 <b>' + tt.count + "건</b> · 합계 <b>" + won(tt.pay) + '원</b></p><a class="btn btn-blue" href="#/cart">견적서 받기</a></div></div>';
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
    app.innerHTML = '<section class="wrap item"><p class="crumb"><a href="#/mall">회원 자재몰</a> · <a href="#/mall?c=' + m.cat + '">' + esc(BG.MC[m.cat].name) + '</a></p><div class="item-in"><div class="item-img"><img src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></div><div class="item-info"><p class="seller">' + esc(co ? co.name : "BUILDGO") + "</p><h1>" + esc(m.name) + "</h1>" + priceHtml(m) +
      '<table class="spec"><tr><th>규격</th><td><label class="selbox"><select id="spec">' + m.specs.map(function (s) { return '<option' + (s === m.spec ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" + I.down + '</label></td></tr><tr><th>수량 (' + esc(m.unit) + ')</th><td><div class="qty"><button type="button" data-q="-1" aria-label="빼기">' + I.minus + '</button><input id="qty" inputmode="numeric" value="1" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">' + I.plus + "</button></div></td></tr>" +
      "<tr><th>최소 주문</th><td>" + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a>" : "BUILDGO") + "</td></tr></table>" +
      '<div class="iact"><button type="button" class="btn btn-line-b" data-act="cart-item">견적 목록에 담기</button><a class="btn btn-blue" href="#/quote?item=' + m.id + '">대량구매 문의</a></div></div></div></section>' + cartBar();
    app.querySelector(".qty").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var inp = document.getElementById("qty"); inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + +b.dataset.q); };
    app.querySelector('[data-act="cart-item"]').onclick = function () { S.addCart(m.id, Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1), document.getElementById("spec").value); BG.toast("견적 목록에 담았습니다"); refreshCart(); };
  }
  function cart() {
    var tt = S.cartTotals();
    app.innerHTML = pageHead("견적 목록", "담은 자재로 견적서를 받습니다. 사업자 회원은 회원가로 계산됩니다.") + '<section class="wrap list">' +
      (S.cart.length ? '<table class="tbl ctbl"><thead><tr><th>자재</th><th>규격</th><th>수량</th><th>금액</th></tr></thead><tbody>' + S.cart.map(function (row) { var m = BG.MT[row.id]; return '<tr><td><div class="tn"><img src="' + photo(m.ph) + '" alt=""><div><b>' + esc(m.name) + "</b></div></div></td><td>" + esc(row.spec || m.spec) + "</td><td>" + row.qty + esc(m.unit) + "</td><td><b>" + won(S.priceOf(m) * row.qty) + "원</b></td></tr>"; }).join("") + "</tbody></table>" +
        '<div class="csum"><p><span>정가 합계</span><b>' + won(tt.list) + "원</b></p><p><span>회원 할인</span><b>-" + won(tt.discount) + '원</b></p><p class="t"><span>견적 금액</span><b>' + won(tt.pay) + '원</b></p><button type="button" class="btn btn-blue wide" data-act="estimate">견적서 받기</button></div>'
        : '<p class="empty">담은 자재가 없습니다.</p><a class="btn btn-line-b" href="#/mall">회원 자재몰로</a>') + "</section>";
  }
  function quote(r) {
    var to = BG.CO[r.query.to] || BG.EX[r.query.to], m = BG.MT[r.query.item];
    var target = to ? (to.title ? to.name + " " + to.title : to.name) : m ? m.name + " 대량구매" : "";
    var sel = function (name, list, cur, all) { return '<label class="selbox big"><select name="' + name + '"><option value="">' + all + "</option>" + list.map(function (x) { var v = x.id || x; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(x.name || x) + "</option>"; }).join("") + "</select>" + I.down + "</label>"; };
    app.innerHTML = pageHead("견적 요청", target ? target + "에 보내는 요청입니다." : "현장 정보를 남기면 담당 매니저가 맞는 업체를 연결합니다.") +
      '<section class="wrap qform"><form id="qf" novalidate><table class="ftbl"><tr><th>공종 <i>*</i></th><td>' + sel("work", D.works, to && to.works ? to.works[0] : "", "공종 선택") + "</td></tr>" +
      "<tr><th>현장 지역 <i>*</i></th><td>" + sel("region", D.regions, to ? to.region : "", "지역 선택") + '</td></tr><tr><th>규모</th><td><input class="inp" name="size" placeholder="예: 연면적 1,200㎡"></td></tr><tr><th>착공 예정</th><td><input class="inp" name="when" placeholder="예: 2027년 3월"></td></tr>' +
      '<tr><th>회사명 <i>*</i></th><td><input class="inp" name="co" autocomplete="organization"></td></tr><tr><th>담당자 <i>*</i></th><td><input class="inp" name="name" autocomplete="name"></td></tr><tr><th>휴대폰 <i>*</i></th><td><input class="inp" name="phone" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></td></tr></table>' +
      '<p class="err" id="qerr"></p><div class="qact"><button type="submit" class="btn btn-blue">견적 요청하기</button></div></form></section>';
    document.getElementById("qf").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, miss = [];
      if (!f.work.value) miss.push("공종"); if (!f.region.value) miss.push("지역"); if (!f.co.value.trim()) miss.push("회사명"); if (!f.name.value.trim()) miss.push("담당자");
      if (!/^0\d{8,10}$/.test(f.phone.value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("qerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ work: f.work.value, region: f.region.value, to: target });
      app.innerHTML = pageHead("견적 요청 완료", "담당 매니저가 확인 후 남기신 번호로 연락드립니다.") + '<section class="wrap done"><p>' + (target ? esc(target) + "에 요청을 전달했습니다." : "맞는 업체를 골라 연결해 드립니다.") + '</p><div class="cta"><a class="btn btn-blue" href="#/companies">다른 업체 보기</a><a class="btn btn-line-b" href="#/">처음으로</a></div></section>';
      window.scrollTo(0, 0);
    };
  }
  function login() {
    app.innerHTML = pageHead("사업자 회원 로그인", "등급별 회원가와 견적 목록을 쓸 수 있습니다.") + '<section class="wrap login"><div class="login-in"><label class="lab">아이디</label><input class="inp" value="hankyul_gm" autocomplete="username"><label class="lab">비밀번호</label><input class="inp" type="password" value="buildgo1998" autocomplete="current-password">' +
      '<button type="button" class="btn btn-blue wide" data-act="do-login">로그인</button><p class="join">아직 회원이 아니신가요? <a href="#/quote">가입 문의</a></p></div></section>';
  }

  function sync(r) {
    var name = r ? r.name : BG.parseHash().name;
    document.body.classList.toggle("on-home", name === "home");
    if (name !== "home") clearInterval(slideTimer);
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === name || (name === "company" && a.dataset.nav === "companies") || (name === "expert" && a.dataset.nav === "experts") || ((name === "item" || name === "cart") && a.dataset.nav === "mall")); });
    ["loginBtn", "loginBtn2"].forEach(function (id) { var b = document.getElementById(id); if (b) b.textContent = S.member ? "로그아웃" : "로그인"; });
    closeMenu();
  }
  function closeMenu() { var d = document.getElementById("drawer"); if (d && !d.hidden) { d.hidden = true; document.body.classList.remove("lock"); } }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-act]");
    if (!a) return;
    var act = a.dataset.act;
    if (act === "login") { ev.preventDefault(); if (S.member) { S.member = false; S.save(); BG.toast("로그아웃했습니다"); window.dispatchEvent(new HashChangeEvent("hashchange")); } else location.hash = "#/login"; }
    if (act === "do-login") { S.member = true; S.save(); BG.toast(D.demoUser.company + " " + D.demoUser.name + "님, 골드 회원가가 적용됩니다"); location.hash = "#/mall"; }
    if (act === "menu") { var d = document.getElementById("drawer"); d.hidden = false; document.body.classList.add("lock"); if (!BG.reduced() && d.animate) d.firstElementChild.animate([{ transform: "translateX(100%)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.7,.1,1)" }); }
    if (act === "menu-close") closeMenu();
    if (act === "save") { var on = S.toggleSave(a.dataset.id); a.classList.toggle("on", on); a.querySelector("span").textContent = on ? "관심 업체" : "관심 업체 저장"; BG.toast(on ? "관심 업체로 저장했습니다" : "저장을 취소했습니다"); }
    if (act === "cart") { var m = BG.MT[a.dataset.id]; S.addCart(m.id, 1, m.spec); BG.toast(m.name + " 1" + m.unit + ", 견적 목록에 담았습니다"); refreshCart(); }
    if (act === "estimate") BG.toast("견적서를 만들고 있습니다. 담당 매니저가 확인 후 연락드립니다");
  });
  document.getElementById("drawer").addEventListener("click", function (ev) { if (ev.target === this || ev.target.closest("a")) closeMenu(); });
  function go(kind, f) {
    var side = document.querySelector('form.side[data-finder="' + kind + '"]');
    var val = function (n) { var el = side && side.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : ""; };
    var qv = f && f.q ? f.q.value.trim() : (side ? side.q.value : "");
    location.hash = "#/" + kind + BG.qs({ type: val("type"), work: val("work"), region: val("region"), q: qv });
  }
  document.addEventListener("submit", function (ev) { var f = ev.target.closest("[data-finder]"); if (!f) return; ev.preventDefault(); go(f.dataset.finder, f); });
  document.addEventListener("change", function (ev) { var f = ev.target.closest("form.side"); if (!f) return; var y = window.scrollY; go(f.dataset.finder, null); setTimeout(function () { window.scrollTo(0, y); }, 0); });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;
  var hdm = document.getElementById("hdm"); if (hdm) hdm.innerHTML = BG.doaMark("dm-h");

  var MOTION = [
    [".hero .eyebrow", "up", { y: 12, delay: 200 }],
    [".hero h1", "lines", { delay: 320, gap: 130, dur: 1100 }],
    [".h3-s", "up", { y: 22, delay: 560 }],
    [".h3-pop", "up", { y: 14, delay: 700 }],
    [".intro h2", "lines", { gap: 100 }],
    [".intro-p", "up", { y: 16, lag: 150 }],
    [".stats li", "up", { y: 20, stagger: 100 }],
    [".sart svg", "draw", { dur: 1200 }],
    [".snum b", "count", { dur: 1300 }],
    [".sec-h h2, .page-h h1", "lines", { gap: 100 }],
    [".nlist li", "up", { y: 14, stagger: 80 }],
    [".band-in a", "up", { y: 24, stagger: 120 }],
    [".pj", "card", { y: 30, stagger: 90 }],
    [".cta h2", "lines", { gap: 110 }],
    [".cta-b a", "up", { y: 18, stagger: 100 }],
    [".tbl tbody tr", "up", { y: 14, stagger: 40, max: 10 }],
    [".mcardc", "up", { y: 18, stagger: 60, max: 6 }],
    [".pcard", "card", { y: 22, stagger: 50, max: 8 }],
    [".pjgrid figure", "wipe", { stagger: 100 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
  if (window.DOA_INTRO_ONLY) opening(true);
})();
