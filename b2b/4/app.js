(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b4");
  var app = document.getElementById("app");

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
  var LINEUP = [
    { ic: "co", t: "업체 찾기", d: "종합·전문건설사, 설계사무소, 자재 공급사를 공종과 지역으로 찾습니다. 면허·사업자·보험을 확인한 업체만 올라옵니다.", href: "#/companies", ph: "n_crew" },
    { ic: "ex", t: "전문가 찾기", d: "건축사·구조기술사·감리원·현장소장급 기술자를 경력과 대표 실적으로 고릅니다.", href: "#/experts", ph: "n_draft" },
    { ic: "mt", t: "회원 자재몰", d: "철근·형강부터 마감재까지 사업자 회원은 등급별 회원가로 삽니다. 수도권 일부 품목은 당일 출고합니다.", href: "#/mall", ph: "n_steel" },
    { ic: "qt", t: "견적 요청", d: "공종·지역·규모를 한 번 남기면 담당 매니저가 맞는 업체를 골라 견적을 모아 드립니다.", href: "#/quote", ph: "n_slab" }
  ];
  var STEPS4 = [
    { t: "공종·지역 고르기", d: "필요한 공사와 현장 지역을 고르면 목록이 바로 좁혀집니다.", ui: "chips" },
    { t: "업체 비교", d: "면허·실적·확인 항목을 같은 기준으로 나란히 봅니다.", ui: "rows" },
    { t: "견적 요청", d: "규모와 착공 시기를 남기면 여러 곳에 한 번에 요청합니다.", ui: "form" },
    { t: "담당 매니저 연결", d: "받은 견적을 정리하고 일정 조율까지 한 사람이 챙깁니다.", ui: "chat" },
    { t: "견적 비교·결정", d: "같은 조건으로 받은 금액과 공기를 비교해 고릅니다.", ui: "bars" },
    { t: "자재 주문", d: "현장 자재는 회원가로 담아 견적서까지 한 번에 받습니다.", ui: "cart" }
  ];
  var STRONG = [
    { g: "강점", ic: "bld", t: "28년 개발 현장의 기준", d: "1998년부터 부동산을 개발하고 공급해 온 더원파트너스가 업체를 고르는 기준을 세웠습니다." },
    { g: "강점", ic: "chk", t: "확인한 업체만", d: "면허·사업자·보험을 확인한 업체만 목록에 올라갑니다.", hot: true },
    { g: "강점", ic: "mgr", t: "담당 매니저", d: "견적 정리부터 계약·일정 조율까지 한 사람이 맡습니다." },
    { g: "안심", ic: "won", t: "사업자 전용 회원가", d: "가입한 사업자 회원에게만 등급별 자재 가격을 보여 줍니다." },
    { g: "안심", ic: "truck", t: "수도권 당일 출고", d: "자재 상세에서 당일 출고 품목을 바로 확인합니다." },
    { g: "안심", ic: "cmp", t: "같은 기준의 견적", d: "같은 조건으로 받은 견적을 한 화면에서 나란히 봅니다." }
  ];
  var FAQ = [
    { q: "누가 가입할 수 있나요?", a: "사업자등록번호가 있는 건설사·설계사무소·자재 공급사와 기업 담당자가 가입합니다. 개인 고객용 서비스가 아닙니다." },
    { q: "회원가는 어떻게 정해지나요?", a: "가입한 사업자 회원의 등급에 따라 자재 가격이 달라집니다. 로그인하면 자재몰 가격이 회원가로 바뀝니다." },
    { q: "견적 요청은 몇 곳에 가나요?", a: "공종·지역·규모를 남기면 담당 매니저가 확인한 뒤 맞는 업체를 골라 요청합니다." },
    { q: "업체 등록은 어떻게 하나요?", a: "면허·사업자·보험 서류를 확인한 뒤 목록에 올라갑니다. 업체 등록 문의를 남겨 주세요." },
    { q: "당일 출고는 어디까지 되나요?", a: "수도권 일부 품목이 대상입니다. 자재 상세 화면에서 출고 안내를 확인하세요." }
  ];
  var IC = {
    co: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5M9 11h.01M15 11h.01"/></svg>',
    ex: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6"/></svg>',
    mt: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18M7 7v10M17 7v10"/></svg>',
    qt: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/></svg>',
    bld: '<svg viewBox="0 0 24 24"><path d="M4 21V6l8-3v18M12 21V9l8 3v9M3 21h18M7 9h2M7 13h2M7 17h2M15 14h2M15 18h2"/></svg>',
    chk: '<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    mgr: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>',
    won: '<svg viewBox="0 0 24 24"><path d="M4 7l3 10 3-8 2 6 2-6 3 8 3-10M3 11h18M3 14h18"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    cmp: '<svg viewBox="0 0 24 24"><path d="M5 20V10M10 20V4M15 20v-7M20 20v-4"/></svg>'
  };
  function mockUi(k) {
    var ck = '<i class="ck"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9"/></svg></i>';
    if (k === "chips") return '<div class="mk chips"><span class="on">철근콘크리트' + ck + '</span><span>방수·도장</span><span class="on">서울' + ck + '</span><span>경기</span><span>철골</span><span class="on">종합건설' + ck + "</span></div>";
    if (k === "rows") return '<div class="mk rows">' + ["한", "대", "정"].map(function (c, i) { return '<div class="r"><b>' + c + '</b><i class="bar" style="--w:' + [86, 70, 58][i] + '%"></i>' + (i < 2 ? ck : '<i class="x">×</i>') + "</div>"; }).join("") + "</div>";
    if (k === "form") return '<div class="mk form"><p><span>공종</span><b>철근콘크리트</b></p><p><span>지역</span><b>서울 강동구</b></p><p><span>규모</span><b>연면적 1,200㎡</b></p><i class="send">요청 보내기</i></div>';
    if (k === "chat") return '<div class="mk chat"><div class="av">담당</div><p class="b1">견적 3건이 도착했어요. 같은 조건으로 정리해 드릴게요.</p><p class="b2">좋습니다. 내일 오전에 통화해요.</p></div>';
    if (k === "bars") return '<div class="mk bars">' + [[62, "A사"], [48, "B사"], [74, "C사"]].map(function (b, i) { return '<div class="c' + (i === 1 ? " pick" : "") + '"><i style="--h:' + b[0] + '%"></i><span>' + b[1] + "</span></div>"; }).join("") + "</div>";
    return '<div class="mk cart"><p><span>철근 SD400 · 3톤</span><b>2,876,400원</b></p><p><span>H형강 SS275 · 10본</span><b>6,768,000원</b></p><p class="t"><span>회원가 합계</span><b>9,644,400원</b></p></div>';
  }

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checks(c) { return '<span class="chk">' + ["면허", "사업자", "보험"].map(function (k) { return '<i class="' + (c.checks.indexOf(k) >= 0 ? "on" : "") + '">' + k + (c.checks.indexOf(k) >= 0 ? " 확인" : " 미확인") + "</i>"; }).join("") + "</span>"; }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="btn line-l save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '">' + I.save + "<span>" + (saved(id) ? "관심 업체" : "관심 업체 저장") + "</span></button>"; }
  function list(v) { return v ? String(v).split(",").filter(Boolean) : []; }
  function pill(text, href, cls) { return '<a class="pill' + (cls ? " " + cls : "") + '" href="' + href + '"><span>' + esc(text) + '</span><i aria-hidden="true"></i></a>'; }

  function home() {
    var lineup = LINEUP.map(function (l) { return '<a class="lu" href="' + l.href + '"><span class="lu-bg"><img loading="lazy" src="' + photo(l.ph) + '" alt=""></span><span class="lu-ic">' + IC[l.ic] + "</span><b>" + esc(l.t) + "</b><p>" + esc(l.d) + '</p><span class="more">자세히 보기<i>' + I.plus + "</i></span></a>"; }).join("");
    var steps = STEPS4.map(function (s, i) { return '<article class="st"><span class="sp">STEP 0' + (i + 1) + "</span><h3>" + esc(s.t) + "</h3><p>" + esc(s.d) + '</p><div class="st-ui">' + mockUi(s.ui) + "</div></article>"; }).join("");
    var strong = ["강점", "안심"].map(function (g) { return '<p class="sg">' + g + '</p><div class="sgrid">' + STRONG.filter(function (s) { return s.g === g; }).map(function (s) { return '<article class="sc' + (s.hot ? " hot" : "") + '"><span class="sc-ic">' + IC[s.ic] + "</span><b>" + esc(s.t) + "</b><p>" + esc(s.d) + "</p></article>"; }).join("") + "</div>"; }).join("");
    var faq = FAQ.map(function (f, i) { return '<details' + (i ? "" : " open") + '><summary><i>Q</i>' + esc(f.q) + '<span aria-hidden="true"></span></summary><p><i>A</i>' + esc(f.a) + "</p></details>"; }).join("");
    app.innerHTML =
      '<section class="hero" id="top"><canvas id="wave" aria-hidden="true"></canvas><div class="h-in"><h1 class="h-t">설계부터 시공, 자재까지<br>한 곳에서, BUILDGO</h1><p class="h-s">1998년부터 부동산을 개발해 온 더원파트너스가 <br>면허를 확인한 업체·전문가와 사업자 회원가 자재를 <br>한 곳에 모았습니다.</p></div></section>' +
      '<nav class="sub" id="sub" aria-label="이 화면 바로가기"><a href="#top" class="on">처음</a><a href="#lineup">서비스</a><a href="#flow">이용 흐름</a><a href="#strong">왜 BUILDGO</a><a href="#faq">자주 묻는 질문</a></nav>' +
      '<section class="say"><p class="say-p">공종과 지역만 고르면 면허와 실적을 확인한 업체가 나오고, <br>견적은 한 번에 여러 곳에, 자재는 사업자 회원가로. <br>개발 현장에서 직접 겪은 일을 그대로 풀었습니다.</p><h2>현장의 일, 더 빠르고 바르게.</h2><p class="say-s">현장소장과 기업 담당자를 위한 사업자 전용 거래 사이트입니다.</p></section>' +
      '<section class="sec" id="lineup"><p class="lbl">BUILDGO 서비스</p><h2 class="h2"><b>업체를 찾는 일부터 자재 주문까지,</b><br>현장에 필요한 것을 한 곳에서.</h2><div class="lgrid">' + lineup + "</div></section>" +
      '<section class="sec" id="flow"><p class="lbl">이용 흐름</p><h2 class="h2"><b>고르고, 비교하고, 맡기면</b><br>담당 매니저가 끝까지 챙깁니다.</h2><div class="sgrid6">' + steps + "</div></section>" +
      '<section class="sec" id="strong"><p class="lbl">왜 BUILDGO</p><h2 class="h2"><b>28년 개발 현장의 기준으로,</b><br>믿고 맡길 수 있게.</h2>' + strong + "</section>" +
      '<section class="sec faqs" id="faq"><h2 class="fq-t">자주 묻는 질문</h2><div class="fq">' + faq + "</div></section>" +
      '<section class="end"><h2>지금 필요한 공사를<br>남겨 주세요.</h2><div class="btns"><a class="pill" href="#/quote"><span>견적 요청하기</span><i aria-hidden="true"></i></a><a class="pill ghost" href="#/companies"><span>업체 먼저 보기</span><i aria-hidden="true"></i></a></div></section>';
    wave();
  }
  function wave() {
    var cv = document.getElementById("wave"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0, t0 = performance.now(), raf = 0, live = true;
    var small = window.innerWidth < 760, ROWS = small ? 44 : 64;
    function size() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var f = H * .9, hy = H * .46, cam = 1.25, cx = W / 2, step = small ? 3.4 : 3.2;
      for (var j = 0; j < ROWS; j++) {
        var q = j / (ROWS - 1), z = 1 + Math.pow(q, 1.35) * 6.5, gap = step * (1 + q * 1.6), fade = Math.max(0, 1 - q * 1.05);
        for (var sx = (j % 2) * gap / 2; sx <= W; sx += gap) {
          var x = (sx - cx) * z / f;
          var y = Math.sin(x * .62 + t * .55 + z * .5) * .5 + Math.sin(x * .27 - t * .32 + z * 1.05) * .42 + Math.cos(z * 1.6 + t * .45 + x * .1) * .2;
          var sy = hy + (cam - y * 1.7) * f / z * .52;
          if (sy < 0 || sy > H + 2) continue;
          var a = fade * (.28 + Math.max(0, y + .55) * .62), r = Math.max(.7, 2.3 / Math.sqrt(z));
          if (a < .03) continue;
          ctx.fillStyle = "rgba(236,236,240," + Math.min(.92, a).toFixed(3) + ")";
          ctx.fillRect(sx - r / 2, sy - r / 2, r, r);
        }
      }
    }
    function loop(now) { if (!document.getElementById("wave")) return; if (live && !document.hidden) draw((now - t0) / 1000); raf = requestAnimationFrame(loop); }
    size(); draw(0);
    window.addEventListener("resize", function () { if (document.getElementById("wave")) { size(); draw((performance.now() - t0) / 1000); } });
    if (BG.reduced()) return;
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { live = es[0].isIntersecting; }).observe(cv);
    raf = requestAnimationFrame(loop);
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
    if (act === "topbar-x") { var tb = document.getElementById("topbar"); if (tb) tb.remove(); }
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
  function subSpy() {
    var nav = document.getElementById("sub"); if (!nav) return;
    var ids = ["top", "lineup", "flow", "strong", "faq"], y = window.scrollY + window.innerHeight * .4, cur = "top";
    ids.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = id; });
    [].forEach.call(nav.querySelectorAll("a"), function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", subSpy, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;

  var MOTION = [
    [".h-t", "lines", { delay: 250, gap: 160, dur: 1200 }],
    [".h-s", "up", { y: 18, delay: 800 }],
    [".say-p", "up", { y: 18 }],
    [".say h2", "lines", { gap: 100, lag: 200 }],
    [".say-s", "up", { y: 14, lag: 300 }],
    [".lbl", "up", { y: 12 }],
    [".h2", "lines", { gap: 110, lag: 100 }],
    [".lu", "card", { y: 36, stagger: 110 }],
    [".st", "card", { y: 36, stagger: 90 }],
    [".sc", "up", { y: 26, stagger: 90 }],
    [".fq-t", "lines", { gap: 100 }],
    [".fq details", "up", { y: 14, stagger: 70 }],
    [".end h2", "lines", { gap: 110 }],
    [".rcard", "up", { y: 18, stagger: 50, max: 8 }],
    [".mcard", "card", { y: 22, stagger: 50, max: 9 }],
    [".pj figure", "wipe", { stagger: 110 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
