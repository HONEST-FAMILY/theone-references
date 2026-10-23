(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b2");
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
  var STRIP = [
    { ph: "hero_kr", c: "공동주택 · 신축" },
    { ph: "n_room", c: "골조 · 철근콘크리트" },
    { ph: "n_pair", c: "현장 관리 · 감리" },
    { ph: "n_plan", c: "설계 · 인허가" },
    { ph: "n_hall", c: "철골 · 자재 공급" }
  ];
  var FACTS = [
    { t: "설계·시공·분양", d: "한 회사가 처음부터 끝까지 맡는 도아가 만들었습니다." },
    { t: "사업자 전용", d: "현장소장과 기업 담당자를 위한 B2B 거래 사이트입니다." },
    { t: "확인한 업체만", d: "면허·사업자·보험을 확인한 업체가 목록에 올라옵니다." },
    { t: "회원가 자재", d: "등급별 회원가와 수도권 당일 출고 품목을 갖췄습니다." }
  ];
  var POP = [["구조기술사", "#/experts?q=구조기술사"], ["방수·도장", "#/experts?work=water"], ["설계·인허가", "#/experts?work=design"], ["기계설비", "#/experts?work=mech"], ["철골", "#/experts?work=steel"]];
  var OPPH = ["n_draft", "n_slab", "n_wide"];
  var DOORS = [
    { t: "업체 찾기", d: "종합·전문건설사, 설계사무소, 자재 공급사를 공종과 지역으로 찾습니다.", go: "업체 목록", href: "#/companies" },
    { t: "전문가 찾기", d: "건축사·기술사·현장소장급 기술자를 경력과 실적으로 고릅니다.", go: "전문가 목록", href: "#/experts" },
    { t: "회원 자재몰", d: "철근·형강부터 마감재까지, 사업자 회원가로 삽니다.", go: "자재몰", href: "#/mall" }
  ];
  var STEPS = [
    { t: "공종과 지역 고르기", d: "필요한 공사와 현장 지역만 고르면 목록이 좁혀집니다.", ph: "n_room" },
    { t: "업체·전문가 비교", d: "면허, 실적, 대표 사진을 같은 기준으로 나란히 봅니다.", ph: "n_crew" },
    { t: "견적 요청", d: "규모와 착공 시기를 남기면 여러 곳에 한 번에 요청합니다.", ph: "n_plan" },
    { t: "담당 매니저 연결", d: "받은 견적을 정리하고 계약과 일정 조율까지 돕습니다.", ph: "n_pair" },
    { t: "자재 주문", d: "현장에 필요한 자재는 회원가로 견적 목록에 담아 주문합니다.", ph: "n_steel" }
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
    var strip = STRIP.map(function (s) { return '<figure><figcaption>' + esc(s.c) + '</figcaption><div class="st-img"><img src="' + photo(s.ph) + '" alt="' + esc(s.c) + '"></div></figure>'; }).join("");
    var doors = DOORS.map(function (d, i) {
      return '<a class="door d' + (i + 1) + '" href="' + d.href + '"><div class="dr-t"><h3>' + esc(d.t) + "</h3><p>" + esc(d.d) + '</p></div><div class="dr-art" aria-hidden="true"></div><div class="dr-b"><span class="no">0' + (i + 1) + '</span><span class="go">' + esc(d.go) + " " + I.arrow + "</span></div></a>";
    }).join("");
    var steps = STEPS.map(function (s, i) { return '<li><span class="sn">0' + (i + 1) + '</span><span class="stt">' + esc(s.t) + '</span><span class="sd">' + esc(s.d) + '</span><span class="si"><img loading="lazy" src="' + photo(s.ph) + '" alt=""></span></li>'; }).join("");
    app.innerHTML =
      '<section class="top"><p class="kick">설계 · 시공 · 분양 — LH 민간신축매입약정사업 전문기업 도아</p><h1 class="state">어떤 분야의 전문가를<br>찾고 계신가요?</h1>' +
      '<form class="t-s" id="hs"><label class="t-q">' + I.search + '<input name="q" type="search" placeholder="공종이나 자격으로 찾기 (예: 구조기술사, 방수)" aria-label="찾을 전문가" autocomplete="off"></label><label class="t-r"><select name="region" aria-label="지역"><option value="">전국</option>' + D.regions.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") + "</select>" + I.down + '</label><button type="submit">찾기 ' + I.arrow + "</button></form>" +
      '<p class="t-pop"><span>많이 찾는 분야</span>' + POP.map(function (x) { return '<a href="' + x[1] + '">' + esc(x[0]) + "</a>"; }).join("") + "</p></section>" +
      '<section class="strip">' + strip + "</section>" +
      '<h2 class="giant g1">함께 짓는 거래</h2>' +
      '<section class="about"><p class="big">도아는 LH 민간신축매입약정사업을 전문으로 하는 (주)더원파트너스의 브랜드입니다. 현장에서 직접 겪은 일 — 믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제때 구하는 일 — 을 기업 고객이 한 곳에서 하도록 BUILDGO를 만들었습니다.</p>' +
      '<div class="wide"><img loading="lazy" src="' + photo("n_wide") + '" alt="바다 가까이 올라가는 아파트 신축 현장"></div>' +
      '<div class="facts4">' + FACTS.map(function (f) { return "<div><b>" + esc(f.t) + "</b><p>" + esc(f.d) + "</p></div>"; }).join("") + "</div></section>" +
      '<h2 class="giant g2">무엇을 찾으세요</h2><p class="gsub">고르시면 바로 목록이 나옵니다.</p><section class="doors">' + doors + "</section>" +
      '<h2 class="giant g3">이렇게 진행합니다</h2><ol class="steps">' + steps + "</ol>" +
      '<section class="reach"><h2>편하게 연락 주세요.<br>담당 매니저가 바로 답합니다.</h2><div class="rc2">' +
      '<a class="rcd" href="#/quote"><div><b>견적 문의</b><p>공종·지역·규모를 남기면 맞는 업체를 골라 연결합니다.</p><span class="go">견적 요청하기 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("n_pair") + '" alt=""></a>' +
      '<a class="rcd" href="#/quote"><div><b>사업자 회원 가입 문의</b><p>사업자등록번호로 가입하면 등급별 회원가와 견적 목록을 씁니다.</p><span class="go">가입 문의하기 ' + I.arrow + '</span></div><img loading="lazy" src="' + photo("n_plan") + '" alt=""></a></div></section>';
    if (window.matchMedia && matchMedia("(max-width: 600px)").matches) document.querySelector("#hs input").placeholder = "예: 구조기술사, 방수, 철골";
    document.getElementById("hs").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, q = f.q.value.trim(), w = D.works.filter(function (x) { return q && (x.name.indexOf(q) >= 0 || q.indexOf(x.name) >= 0); })[0];
      location.hash = "#/experts" + BG.qs({ q: w ? "" : q, work: w ? w.id : "", region: f.region.value });
    };
  }
  function opening(force) {
    var html = '<div class="o2-lock"><div class="o2-mkw">' + BG.doaMark("o2-mk") + '</div><p class="o2-tag"><i><span>LH 민간신축매입약정사업</span></i><i><span>전문기업</span></i></p></div>' +
      '<div class="o2-win" aria-hidden="true"><div class="o2-phs">' + OPPH.map(function (p, i) { return '<div class="o2-ph p' + (i + 1) + '"><img src="' + photo(p) + '" alt=""></div>'; }).join("") + "</div></div>" +
      '<div class="o2-word"><p class="o2-w"><span class="o2-st"><b>설계</b><b>시공</b><b>분양</b></span></p><p class="o2-c"><span class="o2-st"><b>2023년까지 직접 설계 109건</b><b>시행과 시공을 동시에</b><b>준공 뒤 분양까지 이어서</b></span></p></div>' +
      '<div class="o2-copy"><p class="o2-c1"><span>설계부터 분양까지, 한 회사가 한 번에.</span></p><p class="o2-c2"><span>그래서 더 저렴합니다.</span></p></div>';
    return BG.opening({
      key: "doa-op-2", cls: "op2", html: html, total: 8700, force: force,
      start: function (el, at, anim) {
        var mk = el.querySelector(".o2-mk"), win = el.querySelector(".o2-win"), E = "cubic-bezier(.76,0,.24,1)";
        function frame() { var r = mk.getBoundingClientRect(), k = r.width / 104; return { l: r.left, t: r.top, w: r.width, h: r.height, b: 2.8 * k, r: 6.4 * k }; }
        function big() { var W = el.clientWidth, H = el.clientHeight, m = W <= 640, w = m ? W - 40 : Math.round(W * .6), h = Math.round(H * (m ? .46 : .56)); return { l: (W - w) / 2, t: Math.round(H * (m ? .12 : .1)), w: w, h: h, b: 2, r: m ? 18 : 26 }; }
        function kf(g) { return { left: g.l + "px", top: g.t + "px", width: g.w + "px", height: g.h + "px", borderWidth: g.b + "px", borderRadius: g.r + "px" }; }
        var a = frame(), b = big(), fr = mk.querySelector(".fr");
        anim(win, [{ visibility: "visible" }, { visibility: "visible" }], { duration: 4400, delay: 2500 });
        anim(fr, [{ visibility: "hidden" }, { visibility: "hidden" }], { duration: 4400, delay: 2500 });
        anim(win, [kf(a), kf(b)], { duration: 820, delay: 2500, easing: E, fill: "forwards" });
        anim(win, [kf(b), kf(a)], { duration: 800, delay: 6100, easing: E, fill: "forwards" });
      },
      exit: function (el, skipped, anim) {
        var mk = el.querySelector(".o2-mk"), dst = document.querySelector("#hdm svg");
        el.classList.add("shut", "out");
        if (dst) {
          var a = mk.getBoundingClientRect(), b = dst.getBoundingClientRect();
          anim(mk, [{ transform: "none" }, { transform: "translate(" + (b.left - a.left) + "px," + (b.top - a.top) + "px) scale(" + (b.width / a.width) + ")" }], { duration: 900, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
        }
        BG.mo.play(document.querySelectorAll(".hd .gnb a, .hd-r > *"), "up", { y: 10, stagger: 40, delay: 380, dur: 700 });
        BG.mo.play([document.querySelector(".kick"), document.querySelector(".state"), document.querySelector(".t-s"), document.querySelector(".t-pop")], "up", { y: 28, stagger: 110, delay: 260, dur: 950 });
        BG.mo.play(document.querySelectorAll(".strip figure"), "up", { y: 30, stagger: 80, delay: 520, dur: 950 });
        return 950;
      }
    });
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
  function selectBox(name, all, items, cur) {
    return '<label class="fsel"><span>' + esc(all[0]) + '</span><select name="' + name + '"><option value="">' + esc(all[1]) + "</option>" + items.map(function (x) { var v = x.id || x; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(x.name || x) + "</option>"; }).join("") + "</select>" + I.down + "</label>";
  }
  function companies(r) {
    var q = r.query, kw = (q.q || "").trim();
    var res = D.companies.filter(function (c) {
      if (q.type && c.type !== q.type) return false;
      if (q.work && c.works.indexOf(q.work) < 0) return false;
      if (q.region && c.region !== q.region) return false;
      if (kw && (c.name + c.licenses.join(" ") + workNames(c.works).join(" ")).indexOf(kw) < 0) return false;
      return true;
    });
    var sort = q.sort || "trust";
    res.sort(function (a, b) { return sort === "count" ? b.count - a.count : sort === "since" ? a.since - b.since : (b.checks.length - a.checks.length) || (b.count - a.count); });
    var rows = res.map(function (c) {
      return '<article class="frow"><div class="fr-l">' + mono(c.name) + '<div class="fr-i"><h3><a href="#/company/' + c.id + '">' + esc(c.name) + '</a></h3><p class="meta">' + esc(typeName(c.type) + " · " + c.region + " " + c.city + " · " + c.since + "년 설립") + '</p><p class="meta2">' + esc(workNames(c.works).join(", ")) + " · 실적 " + won(c.count) + "건</p>" + checks(c) +
        '<div class="fr-b"><a class="btn sm" href="#/quote?to=' + c.id + '">견적 요청</a><a class="btn line-l sm" href="#/company/' + c.id + '">업체 정보</a></div></div></div>' +
        '<a class="fr-ph" href="#/company/' + c.id + '" aria-label="' + esc(c.name) + ' 대표 실적">' + c.projects.map(function (p) { return '<img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '">'; }).join("") + "</a></article>";
    }).join("");
    app.innerHTML = '<div class="lp"><section class="fband"><h1>업체 찾기</h1><form class="fform" data-finder="companies">' + selectBox("type", ["업체 종류", "모든 업체"], D.types, q.type) + selectBox("work", ["공종", "모든 공종"], D.works, q.work) + selectBox("region", ["지역", "전국"], D.regions, q.region) +
      '<label class="fsel fq"><span>검색</span><input name="q" type="search" value="' + esc(kw) + '" placeholder="업체명·면허"></label><button type="submit" class="btn">' + I.search + "찾기</button></form></section>" +
      '<section class="flist"><div class="fl-h"><h2>업체 <b>' + res.length + '</b>곳</h2><p class="sortl">정렬 ' + [["trust", "확인 항목 많은 순"], ["count", "실적 많은 순"], ["since", "업력 오래된 순"]].map(function (o) { return '<a href="#/companies' + BG.qs({ type: q.type, work: q.work, region: q.region, q: kw, sort: o[0] === "trust" ? "" : o[0] }) + '" class="' + (sort === o[0] ? "on" : "") + '">' + o[1] + "</a>"; }).join(" · ") + "</p></div>" +
      (res.length ? rows : '<p class="empty">조건에 맞는 업체가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</section></div>";
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
    var q = r.query, kw = (q.q || "").trim();
    var res = D.experts.filter(function (x) {
      if (q.work && x.works.indexOf(q.work) < 0) return false;
      if (q.region && x.region !== q.region) return false;
      if (kw && (x.name + x.title + x.affil + workNames(x.works).join(" ")).indexOf(kw) < 0) return false;
      return true;
    }).sort(function (a, b) { return b.years - a.years; });
    var rows = res.map(function (x) {
      return '<article class="frow ex"><div class="fr-l">' + mono(x.name, "round") + '<div class="fr-i"><h3><a href="#/expert/' + x.id + '">' + esc(x.name) + "</a> <small>" + esc(x.title) + '</small></h3><p class="meta">' + esc(x.region + " · 경력 " + x.years + "년 · " + (x.affil === "개인" ? "개인" : x.affil)) + '</p><p class="meta2">' + esc(workNames(x.works).join(", ")) + "</p>" +
        '<div class="fr-b"><a class="btn sm" href="#/quote?to=' + x.id + '">견적 요청</a><a class="btn line-l sm" href="#/expert/' + x.id + '">전문가 정보</a></div></div></div><ul class="fr-pl">' + x.projects.slice(0, 3).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></article>";
    }).join("");
    app.innerHTML = '<div class="lp"><section class="fband"><h1>전문가 찾기</h1><form class="fform" data-finder="experts">' + selectBox("work", ["분야", "모든 분야"], D.works, q.work) + selectBox("region", ["지역", "전국"], D.regions, q.region) +
      '<label class="fsel fq"><span>검색</span><input name="q" type="search" value="' + esc(kw) + '" placeholder="이름·자격"></label><button type="submit" class="btn">' + I.search + "찾기</button></form></section>" +
      '<section class="flist"><div class="fl-h"><h2>전문가 <b>' + res.length + "</b>명</h2></div>" + (res.length ? rows : '<p class="empty">조건에 맞는 전문가가 없습니다.</p>') + "</section></div>";
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
    var f = document.querySelector('form.fform[data-finder="' + kind + '"]'); if (!f) return;
    var v = function (n) { return f[n] ? f[n].value.trim() : ""; };
    location.hash = "#/" + kind + BG.qs({ type: v("type"), work: v("work"), region: v("region"), q: v("q") });
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
  document.addEventListener("submit", function (ev) { var f = ev.target.closest("form.fform"); if (!f) return; ev.preventDefault(); go(f.dataset.finder); });
  document.addEventListener("change", function (ev) {
    var f = ev.target.closest("form.fform"); if (!f || ev.target.name === "q") return;
    var y = window.scrollY;
    go(f.dataset.finder);
    setTimeout(function () { window.scrollTo(0, y); }, 0);
  });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;
  var hdm = document.getElementById("hdm"); if (hdm) hdm.innerHTML = BG.doaMark("dm-h");

  var MOTION = [
    [".kick", "up", { y: 12, delay: 100 }],
    [".state", "lines", { delay: 180, gap: 120, dur: 1100 }],
    [".t-s", "up", { y: 22, delay: 480 }],
    [".t-pop", "up", { y: 14, delay: 620 }],
    [".strip figure", "wipe", { delay: 600, stagger: 110, dur: 1100 }],
    [".giant", "lines", { dur: 1100 }],
    [".big, .gsub", "up", { y: 20 }],
    [".wide", "wipe", { dur: 1300 }],
    [".facts4 > div", "up", { y: 18, stagger: 90 }],
    [".door", "card", { y: 40, stagger: 120 }],
    [".steps li", "up", { y: 16, stagger: 70 }],
    [".reach h2", "lines", { gap: 110 }],
    [".rcd", "card", { y: 30, stagger: 120 }],
    [".frow", "up", { y: 18, stagger: 50, max: 8 }],
    [".mcard", "card", { y: 22, stagger: 50, max: 9 }],
    [".pj figure", "wipe", { stagger: 110 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
  if (window.DOA_INTRO_ONLY) opening(true);
})();
