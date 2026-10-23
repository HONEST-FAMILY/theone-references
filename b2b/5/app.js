(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b5");
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
  var STAGES = [
    { n: "01", t: "설계", d: "도면과 인허가를 맡길 건축사·구조기술사를 찾습니다." },
    { n: "02", t: "업체 선정", d: "공종과 지역으로 면허를 확인한 시공사를 고릅니다." },
    { n: "03", t: "견적 비교", d: "같은 조건으로 받은 견적을 나란히 봅니다." },
    { n: "04", t: "자재 준비", d: "철강·목재·마감재를 사업자 회원가로 준비합니다." },
    { n: "05", t: "시공", d: "담당 매니저가 일정 조율까지 함께합니다." }
  ];
  var FINDS = [
    { ph: "n_crew", t: "업체 찾기", c: "종합·전문건설 · 설계사무소 · 자재 공급", href: "#/companies" },
    { ph: "n_draft", t: "전문가 찾기", c: "건축사 · 기술사 · 현장소장급 기술자", href: "#/experts" },
    { ph: "n_steel", t: "회원 자재몰", c: "사업자 회원가 · 수도권 당일 출고", href: "#/mall" }
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
    var rows = D.works.map(function (w) {
      var n = D.companies.filter(function (c) { return c.works.indexOf(w.id) >= 0; }).length;
      var regs = D.companies.filter(function (c) { return c.works.indexOf(w.id) >= 0; }).map(function (c) { return c.region; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", ");
      return '<a class="ix-r" href="#/companies?work=' + w.id + '"><span>' + esc(w.name) + "</span><span>등록 업체 " + n + "곳</span><span>" + esc(regs || "—") + '</span><span class="ar">' + I.arrow + "</span></a>";
    }).join("");
    var stages = STAGES.map(function (s, i) { return '<li data-i="' + i + '"><b>' + s.n + "</b><span>" + esc(s.t) + "</span><em>" + esc(s.d) + "</em></li>"; }).join("");
    var finds = FINDS.map(function (f, i) { return '<a class="fd f' + (i + 1) + '" href="' + f.href + '"><div class="fd-im"><img loading="lazy" src="' + photo(f.ph) + '" alt="' + esc(f.t) + '"></div><p class="fd-c"><b>' + esc(f.t) + "</b><span>" + esc(f.c) + '</span><span class="no">0' + (i + 1) + "</span></p></a>"; }).join("");
    app.innerHTML =
      '<section class="kv"><img src="' + photo("n_glassbox") + '" alt="유리 커튼월 건물의 모서리"><h1 class="kv-t"><span>BUILDGO</span><span>설계에서 준공까지</span></h1><p class="kv-m">THE ONE PARTNERS<br>도아</p></section>' +
      '<section class="cl"><h2 class="mega">설계에서<br>준공까지</h2><div class="cl-p"><p>도아는 LH 민간신축매입약정사업을 전문으로 하는 (주)더원파트너스의 브랜드입니다.</p><p>BUILDGO는 그 현장에서 쓰던 기준으로 업체·전문가·자재를 한 곳에 모은 사업자 전용 거래 사이트입니다.</p></div></section>' +
      '<section class="full"><img loading="lazy" src="' + photo("hero_glass") + '" alt="크레인 옆에 올라가는 유리 고층 건물"></section>' +
      '<section class="info"><dl class="meta"><div><dt>브랜드</dt><dd>도아 · (주)더원파트너스</dd></div><div><dt>본업</dt><dd>LH 민간신축매입약정</dd></div><div><dt>대상</dt><dd>현장소장 · 기업 담당자</dd></div><div><dt>거래</dt><dd>사업자 회원 전용</dd></div></dl><p class="info-p">믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제때 구하는 일. 개발 현장에서 매번 겪던 일을 한 화면으로 옮겼습니다. 면허·사업자·보험을 확인한 업체만 올리고, 견적은 같은 기준으로 비교하며, 자재는 등급별 회원가로 삽니다.</p></section>' +
      '<section class="st5"><h2 class="big5">업체 찾기, 전문가 찾기, 회원 자재몰. 현장에 필요한 세 가지를 한 곳에서.</h2><div class="ix"><p class="ix-h"><span>공종</span><span>등록 업체</span><span>지역</span><span></span></p>' + rows + "</div></section>" +
      '<section class="draw" id="draw"><div class="dw-pin"><h2 class="dw-t">도면에서<br>건물로</h2><div class="dw-fig"><img class="dw-line" src="../assets/photos/d_hall_line.jpg?v=1" alt="철골 창고의 선 도면"><img class="dw-photo" src="../assets/photos/d_hall_photo.jpg?v=1" alt="완성된 철골 창고" style="--p:0"><span class="dw-bar" style="--p:0"></span></div><ol class="dw-st">' + stages + "</ol></div></section>" +
      '<section class="cl two"><h2 class="big5">현장의 경험이<br>거래의 기준이 됩니다.</h2><div class="cl-p"><p>공종과 지역만 고르면 확인을 마친 업체가 나옵니다. 견적은 한 번의 요청으로 여러 곳에, 받은 금액과 공기는 같은 표로 비교합니다.</p><p>담당 매니저가 계약과 일정 조율까지 함께하고, 현장 자재는 회원 자재몰에서 견적서까지 한 번에 받습니다.</p></div></section>' +
      '<section class="fds"><h2 class="fds-t">BUILDGO에서 찾는 것 <sup>(3)</sup></h2><div class="fd-g">' + finds + "</div></section>" +
      '<section class="bye"><h2 class="big5">함께 짓겠습니다.</h2><div class="bye-g"><a href="#/quote"><span>견적 요청</span><b>공종·지역·규모 남기기 ' + I.arrow + '</b></a><a href="#/quote"><span>사업자 회원</span><b>가입 문의하기 ' + I.arrow + '</b></a><a href="#/quote"><span>업체 등록</span><b>등록 문의하기 ' + I.arrow + "</b></a></div></section>";
    drawSetup();
  }
  function drawSetup() {
    var sec = document.getElementById("draw"); if (!sec) return;
    var ph = sec.querySelector(".dw-photo"), bar = sec.querySelector(".dw-bar"), lis = sec.querySelectorAll(".dw-st li");
    function upd() {
      if (!document.body.contains(sec)) { window.removeEventListener("scroll", upd); return; }
      var r = sec.getBoundingClientRect(), span = r.height - window.innerHeight, p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      var q = Math.min(1, Math.max(0, (p - .08) / .8));
      ph.style.setProperty("--p", q.toFixed(4)); bar.style.setProperty("--p", q.toFixed(4));
      var k = Math.min(lis.length - 1, Math.floor(q * lis.length));
      [].forEach.call(lis, function (li, i) { li.classList.toggle("on", i === k); li.classList.toggle("done", i < k); });
    }
    if (BG.reduced()) { ph.style.setProperty("--p", "1"); bar.style.setProperty("--p", "1"); [].forEach.call(lis, function (li) { li.classList.add("done"); }); return; }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
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
    [".kv > img", "settle", { s: 1.08, dur: 2600 }],
    [".kv-t span", "up", { y: 30, delay: 300, stagger: 140, dur: 1100 }],
    [".mega", "lines", { gap: 140, dur: 1200 }],
    [".cl-p p", "up", { y: 16, lag: 300, stagger: 120 }],
    [".full", "wipe", { dur: 1400 }],
    [".meta > div", "up", { y: 12, stagger: 70 }],
    [".info-p", "up", { y: 20, lag: 150 }],
    [".big5", "up", { y: 34, dur: 1100 }],
    [".ix-r", "up", { y: 10, stagger: 40, max: 12 }],
    [".dw-t", "lines", { gap: 120 }],
    [".fds-t", "up", { y: 20 }],
    [".fd", "card", { y: 40, stagger: 140 }],
    [".bye-g a", "up", { y: 18, stagger: 100 }],
    [".rcard", "up", { y: 18, stagger: 50, max: 8 }],
    [".mcard", "card", { y: 22, stagger: 50, max: 9 }],
    [".pj figure", "wipe", { stagger: 110 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
