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
  var ALLIN = [
    { src: "../assets/photos/d_hall_line.jpg?v=1", k: "설계", d: "인허가와 도면을 맡을 설계사무소·건축사" },
    { ph: "n_crew", k: "시공", d: "면허를 확인한 종합·전문건설사" },
    { ph: "n_glassbox", k: "분양", d: "준공부터 분양·매입까지 한 흐름으로" }
  ];
  var DOAWORK = [
    { k: "PM", d: "사업 관리" }, { k: "시행", d: "개발 사업 추진" }, { k: "시공", d: "건축·토목 공사" }, { k: "금융", d: "사업비 조달" }, { k: "자재", d: "현장 자재 공급" }
  ];
  var FAQ = [
    { q: "누가 가입할 수 있나요?", a: "사업자등록번호가 있는 건설사·설계사무소·자재 공급사와 기업 담당자가 가입합니다. 개인 고객용 서비스가 아닙니다." },
    { q: "전문가는 어떻게 찾나요?", a: "맨 위 검색창에 공종이나 자격을 적거나, 아래 분야 버튼을 누르면 그 분야 전문가 목록이 바로 나옵니다." },
    { q: "견적 요청은 몇 곳에 가나요?", a: "공종·지역·규모를 남기면 담당 매니저가 확인한 뒤 맞는 업체와 전문가를 골라 요청합니다." },
    { q: "회원가는 어떻게 정해지나요?", a: "가입한 사업자 회원의 등급에 따라 자재 가격이 달라집니다. 로그인하면 자재몰 가격이 회원가로 바뀝니다." }
  ];
  function doaMark(cls) { return '<svg class="' + (cls || "mk") + '" viewBox="0 0 104 55" aria-hidden="true"><rect class="fr" x="1" y="1" width="102" height="53" rx="6" pathLength="1"/><path class="an" d="' + window.DOA.ant + '" pathLength="1"/><path class="tx" d="' + window.DOA.text + '"/></svg>'; }

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checks(c) { return '<span class="chk">' + ["면허", "사업자", "보험"].map(function (k) { return '<i class="' + (c.checks.indexOf(k) >= 0 ? "on" : "") + '">' + k + (c.checks.indexOf(k) >= 0 ? " 확인" : " 미확인") + "</i>"; }).join("") + "</span>"; }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="btn line-l save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '">' + I.save + "<span>" + (saved(id) ? "관심 업체" : "관심 업체 저장") + "</span></button>"; }
  function list(v) { return v ? String(v).split(",").filter(Boolean) : []; }
  function pill(text, href, cls) { return '<a class="pill' + (cls ? " " + cls : "") + '" href="' + href + '"><span>' + esc(text) + '</span><i aria-hidden="true"></i></a>'; }

  function home() {
    var chips = D.works.map(function (w) { var n = D.experts.filter(function (x) { return x.works.indexOf(w.id) >= 0; }).length + D.companies.filter(function (c) { return c.works.indexOf(w.id) >= 0; }).length; return '<a class="chip" href="#/experts?work=' + w.id + '">' + esc(w.name) + "<b>" + n + "</b></a>"; }).join("");
    var exs = D.experts.slice().sort(function (a, b) { return b.years - a.years; }).slice(0, 6).map(function (x) {
      return '<a class="ex" href="#/expert/' + x.id + '"><span class="ex-av">' + esc(BG.initial(x.name)) + '</span><span class="ex-n"><b>' + esc(x.name) + "</b>" + esc(x.title) + '</span><span class="ex-w">' + workNames(x.works).slice(0, 2).map(function (w) { return "<i>" + esc(w) + "</i>"; }).join("") + '</span><span class="ex-m"><em>' + esc(x.region) + "</em><em>경력 " + x.years + "년</em></span><span class=\"ex-go\">" + I.arrow + "</span></a>";
    }).join("");
    var cos = D.companies.slice().sort(function (a, b) { return (b.checks.length - a.checks.length) || (b.count - a.count); }).slice(0, 4).map(function (c) {
      return '<a class="co" href="#/company/' + c.id + '"><span class="co-ph">' + c.projects.map(function (p) { return '<img loading="lazy" src="' + photo(p.ph) + '" alt="">'; }).join("") + '</span><span class="co-b"><b>' + esc(c.name) + "</b><span>" + esc(typeName(c.type) + " · " + c.region + " " + c.city) + "</span><span>" + esc(workNames(c.works).join(", ")) + "</span>" + checks(c) + "</span></a>";
    }).join("");
    var allin = ALLIN.map(function (a, i) { return '<li><div class="ai-im"><img loading="lazy" src="' + (a.src || photo(a.ph)) + '" alt=""></div><p><b>0' + (i + 1) + "</b>" + esc(a.k) + "</p><span>" + esc(a.d) + "</span></li>"; }).join("");
    var works = DOAWORK.map(function (w) { return "<li><b>" + w.k + "</b><span>" + w.d + "</span></li>"; }).join("");
    var faq = FAQ.map(function (f, i) { return "<details" + (i ? "" : " open") + "><summary><i>Q</i>" + esc(f.q) + '<span aria-hidden="true"></span></summary><p><i>A</i>' + esc(f.a) + "</p></details>"; }).join("");
    app.innerHTML =
      '<section class="sh"><canvas id="wave" aria-hidden="true"></canvas><div class="sh-in"><p class="sh-k">도아 BUILDGO · 사업자 전용 건설 거래</p><h1 class="sh-t">어떤 분야의 전문가를<br>찾고 계신가요?</h1>' +
      '<form class="hs" id="hs"><label class="hs-q">' + I.search + '<input name="q" type="search" placeholder="공종이나 자격으로 찾기 (예: 구조기술사, 방수, 철골)" aria-label="찾을 전문가" autocomplete="off"></label><label class="hs-r">' + I.pin + '<select name="region" aria-label="지역"><option value="">전국</option>' + D.regions.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") + '</select>' + I.down + '</label><button type="submit">찾기</button></form>' +
      '<p class="hs-pop"><span>많이 찾는 분야</span><a href="#/experts?q=구조기술사">구조기술사</a><a href="#/experts?work=water">방수</a><a href="#/experts?work=design">감리·인허가</a><a href="#/experts?work=mech">기계설비</a></p><div class="chips">' + chips + "</div></div></section>" +
      '<section class="blk"><div class="blk-h"><p class="lbl">전문가</p><h2>지금 바로 연결할 수 있는 전문가</h2><a class="more" href="#/experts">전체 ' + D.experts.length + "명 보기 " + I.arrow + '</a></div><div class="exs">' + exs + "</div></section>" +
      '<section class="blk"><div class="blk-h"><p class="lbl">업체</p><h2>면허·사업자·보험을 확인한 업체</h2><a class="more" href="#/companies">전체 ' + D.companies.length + "곳 보기 " + I.arrow + '</a></div><div class="cos">' + cos + "</div></section>" +
      '<section class="allin"><p class="lbl">도아가 다른 이유</p><h2>설계 · 시공 · 분양을<br>한 회사가 한 번에.</h2><p class="al-p">단계마다 다른 회사를 거치지 않으니 중간에 붙는 비용이 줄어듭니다. 도아는 처음 설계부터 분양까지 한 흐름으로 맡아, 같은 품질을 더 합리적인 비용으로 만듭니다.</p><ol class="ai">' + allin + "</ol></section>" +
      '<section class="who"><div class="who-l">' + doaMark("who-mk") + '<p>LH 민간신축매입약정사업 전문기업</p></div><div class="who-r"><h2>현장을 직접 해 온 회사가<br>만든 거래 사이트</h2><p>도아는 (주)더원파트너스의 브랜드입니다. 사업 관리부터 시행·시공·금융·자재까지 직접 해 온 일을, 현장소장과 기업 담당자가 한 곳에서 쓰도록 BUILDGO에 담았습니다.</p><ul class="dw">' + works + "</ul></div></section>" +
      '<section class="blk faqs"><h2 class="fq-t">자주 묻는 질문</h2><div class="fq">' + faq + "</div></section>" +
      '<section class="end"><h2>지금 필요한 공사를 남겨 주세요.</h2><div class="btns"><a class="pill" href="#/quote"><span>견적 요청하기</span><i aria-hidden="true"></i></a><button type="button" class="pill ghost" data-act="replay"><span>인트로 다시 보기</span><i aria-hidden="true"></i></button></div></section>';
    document.getElementById("hs").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, q = f.q.value.trim(), w = D.works.filter(function (x) { return q && (x.name.indexOf(q) >= 0 || q.indexOf(x.name) >= 0); })[0];
      location.hash = "#/experts" + BG.qs({ q: w ? "" : q, work: w ? w.id : "", region: f.region.value });
    };
    wave();
  }
  function intro(force) {
    var seen = false;
    try { seen = sessionStorage.getItem("doa-intro") === "1"; } catch (e) {}
    document.documentElement.classList.remove("intro-pending");
    if ((seen && !force && !/[?&]intro\b/.test(location.search)) || BG.reduced()) return;
    try { sessionStorage.setItem("doa-intro", "1"); } catch (e) {}
    var el = document.createElement("div");
    el.className = "intro"; el.id = "intro";
    el.innerHTML = '<div class="in-bg"><img src="../assets/photos/d_hall_line.jpg?v=1" alt=""><img src="' + photo("n_crew") + '" alt=""><img src="' + photo("n_glassbox") + '" alt=""></div><div class="in-shade"></div>' +
      '<div class="in-logo">' + doaMark("in-mk") + '<p class="in-tag">LH 민간신축매입약정사업 전문기업</p></div>' +
      '<p class="in-word" aria-hidden="true"><span>설계</span><span>시공</span><span>분양</span></p>' +
      '<div class="in-end"><p class="in-e1">설계부터 시공, 분양까지</p><p class="in-e2">한 회사가 한 번에 하니까<br><b>더 합리적인 가격으로.</b></p><div class="in-e3">' + doaMark("in-mk2") + '<span>BUILDGO</span></div></div>' +
      '<button type="button" class="in-skip" data-act="skip">건너뛰기</button><div class="in-bar"><b></b></div>';
    document.body.appendChild(el);
    document.body.classList.add("lock", "has-intro");
    var T = [], done = false;
    function at(ms, fn) { T.push(setTimeout(fn, ms)); }
    function show(sel, on) { var n = el.querySelector(sel); if (n) n.classList.toggle("on", on !== false); }
    function finish() {
      if (done) return; done = true;
      T.forEach(clearTimeout);
      el.classList.add("out");
      document.body.classList.remove("lock");
      setTimeout(function () { el.remove(); document.body.classList.remove("has-intro"); }, 1100);
      var t = document.querySelector(".sh-in");
      if (t && t.animate) BG.mo.play([document.querySelector(".sh-t"), document.querySelector(".hs"), document.querySelector(".hs-pop"), document.querySelector(".chips")], "up", { y: 34, stagger: 120, delay: 450, dur: 1000 });
    }
    el.addEventListener("click", function (ev) { if (ev.target.closest('[data-act="skip"]')) finish(); });
    el.querySelector(".in-bar b").animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 8600, easing: "linear", fill: "forwards" });
    at(80, function () { show(".in-logo"); });
    at(2300, function () { show(".in-tag"); });
    at(3300, function () { show(".in-logo", false); el.classList.add("w1"); });
    at(4300, function () { el.classList.remove("w1"); el.classList.add("w2"); });
    at(5300, function () { el.classList.remove("w2"); el.classList.add("w3"); });
    at(6300, function () { el.classList.remove("w3"); el.classList.add("fin"); });
    at(8600, finish);
  }
  function wave() {
    var cv = document.getElementById("wave"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0, t0 = performance.now(), raf = 0, live = true;
    var small = window.innerWidth < 760, ROWS = small ? 44 : 64;
    function size() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var f = H * .9, hy = H * .5, cam = 1.25, cx = W / 2, step = small ? 3.6 : 3.4;
      for (var j = 0; j < ROWS; j++) {
        var q = j / (ROWS - 1), z = 1 + Math.pow(q, 1.35) * 6.5, gap = step * (1 + q * 1.6), fade = Math.max(0, 1 - q * 1.05);
        for (var sx = (j % 2) * gap / 2; sx <= W; sx += gap) {
          var x = (sx - cx) * z / f;
          var y = Math.sin(x * .62 + t * .32 + z * .5) * .5 + Math.sin(x * .27 - t * .2 + z * 1.05) * .42 + Math.cos(z * 1.6 + t * .28 + x * .1) * .2;
          var sy = hy + (cam - y * 1.6) * f / z * .52;
          if (sy < 0 || sy > H + 2) continue;
          var a = fade * (.14 + Math.max(0, y + .55) * .34), r = Math.max(.6, 2 / Math.sqrt(z));
          if (a < .03) continue;
          ctx.fillStyle = "rgba(230,230,236," + Math.min(.6, a).toFixed(3) + ")";
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
      (res.length ? '<div class="rgrid">' + cards + "</div>" : '<p class="empty">조건에 맞는 전문가가 없습니다. <a href="#/companies' + BG.qs({ work: works.join(","), region: regions.join(","), q: kw }) + '">같은 조건의 업체 보기 →</a></p>') + "</section></div></div>";
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
    if (act === "replay") { window.scrollTo(0, 0); intro(true); }
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
  var lgm = document.getElementById("lgm"); if (lgm) lgm.innerHTML = doaMark("lg-svg");

  var MOTION = [
    [".sh-k", "up", { y: 12, delay: 100 }],
    [".sh-t", "lines", { delay: 200, gap: 140, dur: 1100 }],
    [".hs", "up", { y: 24, delay: 500 }],
    [".hs-pop, .chips", "up", { y: 16, delay: 700, stagger: 120 }],
    [".blk-h h2, .allin h2, .who h2, .fq-t, .end h2", "lines", { gap: 110 }],
    [".ex", "up", { y: 22, stagger: 70 }],
    [".co", "card", { y: 30, stagger: 100 }],
    [".al-p", "up", { y: 16, lag: 200 }],
    [".ai li", "card", { y: 36, stagger: 140 }],
    [".who-l, .who-r p, .dw li", "up", { y: 16, stagger: 60 }],
    [".fq details", "up", { y: 14, stagger: 70 }],
    [".rcard", "up", { y: 18, stagger: 50, max: 8 }],
    [".mcard", "card", { y: 22, stagger: 50, max: 9 }],
    [".pj figure", "wipe", { stagger: 110 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
  if (BG.parseHash().name === "home") intro();
})();
