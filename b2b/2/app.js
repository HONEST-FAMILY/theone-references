(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, photo = BG.photo;
  var S = new BG.Session("b2b2");
  var app = document.getElementById("app");

  var I = {
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
  };
  var STRIP = ["hero_kr", "w_draft", "concrete1", "w_measure", "mt_lumber"];
  var DOORS = [
    { href: "#/companies", t: "업체 찾기", d: "면허를 확인한 시공사·설계사무소·자재사", ph: "w_women" },
    { href: "#/experts", t: "전문가 찾기", d: "건축사·기술사·현장소장급 기술자", ph: "w_review" },
    { href: "#/mall", t: "회원 자재몰", d: "사업자 회원 등급별 가격", ph: "mt_plywood" }
  ];

  function typeName(id) { return BG.TYPE[id] ? BG.TYPE[id].name : ""; }
  function workNames(ws) { return ws.map(function (w) { return BG.WORK[w].name; }); }
  function mono(name, cls) { return '<span class="mono' + (cls ? " " + cls : "") + '" aria-hidden="true">' + esc(BG.initial(name)) + "</span>"; }
  function checks(c) {
    var label = { "면허": "면허 확인", "사업자": "사업자 확인", "보험": "보험 가입" };
    return '<ul class="checks">' + c.checks.map(function (k) { return "<li>" + I.check + esc(label[k]) + "</li>"; }).join("") + "</ul>";
  }
  function saved(id) { return S.saved.indexOf(id) >= 0; }
  function saveBtn(id) { return '<button type="button" class="save' + (saved(id) ? " on" : "") + '" data-act="save" data-id="' + id + '">' + I.save + "<span>" + (saved(id) ? "저장됨" : "저장") + "</span></button>"; }
  function opts(list, cur, all) { return '<option value="">' + esc(all) + "</option>" + list.map(function (x) { var v = x.id || x; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(x.name || x) + "</option>"; }).join(""); }

  function home() {
    var strip = STRIP.map(function (k) { return '<figure><img src="' + photo(k) + '" alt=""></figure>'; }).join("");
    var doors = DOORS.map(function (d, i) {
      return '<a class="door" href="' + d.href + '"><em>0' + (i + 1) + "</em><b>" + esc(d.t) + "</b><span>" + esc(d.d) + '</span><i class="dimg"><img loading="lazy" src="' + photo(d.ph) + '" alt=""></i><i class="darr">' + I.arrow + "</i></a>";
    }).join("");
    var nums = [
      { n: BG.years(D.company.since) + "년", l: "1998년 설립" },
      { n: D.companies.length + "곳", l: "면허·사업자를 확인한 업체" },
      { n: D.experts.length + "명", l: "자격을 확인한 전문가" }
    ].map(function (x) { return '<div class="num"><b>' + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("");
    var biz = [
      { t: "부동산 개발", d: "1998년부터 이어 온 더원파트너스의 본업입니다.", ph: "hero_glass" },
      { t: "설계·시공 연결", d: "공종과 지역으로 업체와 전문가를 찾고 견적을 받습니다.", ph: "w_blueprint" },
      { t: "회원 자재 공급", d: "사업자 회원에게 등급별 가격으로 자재를 공급합니다.", ph: "mt_cement" }
    ].map(function (b) { return '<article class="bcard"><div class="bimg"><img loading="lazy" src="' + photo(b.ph) + '" alt=""></div><h3>' + esc(b.t) + "</h3><p>" + esc(b.d) + "</p></article>"; }).join("");
    app.innerHTML =
      '<section class="intro wrap"><p class="label">부동산 개발 · 설계·시공·자재 연결 · 1998년부터</p><h1>믿고 맡길 업체를<br>찾는 일부터 바르게</h1>' +
      '<p class="sub">더원파트너스가 만든 건설 B2B 거래 사이트, BUILDGO입니다.</p><div class="cta"><a class="pill pill-blue" href="#/companies">업체 찾기</a><a class="pill pill-line" href="#/experts">전문가 찾기</a></div></section>' +
      '<section class="strip" aria-hidden="true">' + strip + "</section>" +
      '<section class="doors wrap"><p class="label">무엇을 찾으세요?</p>' + doors + "</section>" +
      '<section class="about wrap" id="about"><p class="label">회사 소개</p><div><h2>1998년부터 부동산을 개발하고 공급해 온 회사가 만든 곳입니다</h2>' +
      "<p>개발 현장에서 늘 필요했던 일 — 믿을 만한 업체를 찾고, 견적을 비교하고, 자재를 제값에 구하는 일 — 을 한 곳에서 할 수 있도록 BUILDGO를 엽니다. 개인 고객이 아니라 현장소장과 기업 담당자를 위한 곳입니다.</p></div></section>" +
      '<section class="nums wrap">' + nums + "</section>" +
      '<section class="biz wrap"><p class="label">사업 분야</p><div class="bgrid">' + biz + "</div></section>" +
      '<section class="end wrap"><h2>현장에 맞는 업체를 찾아보세요</h2><div class="cta"><a class="pill pill-blue" href="#/companies">업체 찾기</a><a class="pill pill-line" href="#/quote">견적 문의</a></div></section>';
  }

  function finder(kind, q) {
    return '<form class="finder" data-finder="' + kind + '">' +
      (kind === "companies" ? '<label class="sel"><span>업체 종류</span><select name="type">' + opts(D.types, q.type, "모든 업체") + "</select>" + I.down + "</label>" : "") +
      '<label class="sel"><span>공종</span><select name="work">' + opts(D.works, q.work, "모든 공종") + "</select>" + I.down + '</label>' +
      '<label class="sel"><span>지역</span><select name="region">' + opts(D.regions, q.region, "전국") + "</select>" + I.down + "</label>" +
      '<label class="txt"><span>검색</span><input name="q" type="search" value="' + esc(q.q || "") + '" placeholder="' + (kind === "companies" ? "업체명·면허" : "이름·자격") + '"></label>' +
      '<button type="submit" class="pill pill-blue">' + I.search + "찾기</button></form>";
  }
  function companyRow(c) {
    return '<article class="row"><div class="row-l">' + mono(c.name) + '<div class="row-t"><h3><a href="#/company/' + c.id + '">' + esc(c.name) + "</a></h3>" +
      '<p class="meta">' + esc(typeName(c.type)) + " · " + esc(c.region + " " + c.city) + " · " + c.since + "년 설립</p>" +
      '<p class="lic">' + esc(c.licenses.join(" · ")) + " · 실적 " + won(c.count) + "건</p>" + checks(c) +
      '<div class="row-b"><a class="pill pill-blue sm" href="#/quote?to=' + c.id + '">견적 문의</a><a class="lk" href="#/company/' + c.id + '">업체 정보 ' + I.arrow + "</a></div></div></div>" +
      '<div class="row-ph">' + c.projects.map(function (p) { return '<figure><img loading="lazy" src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"><figcaption>' + esc(p.t) + " · " + p.y + "</figcaption></figure>"; }).join("") + "</div></article>";
  }
  function companies(r) {
    var q = r.query;
    var list = BG.findCompanies({ type: q.type, work: q.work, region: q.region, q: q.q }).sort(function (a, b) { return (b.checks.length - a.checks.length) || (b.count - a.count); });
    app.innerHTML = '<section class="page-h wrap"><nav class="seg"><a class="on" href="#/companies">업체</a><a href="#/experts">전문가</a></nav><h1>업체 찾기</h1><p>공종과 지역을 고르면 면허와 사업자 정보를 확인한 업체가 나옵니다.</p>' + finder("companies", q) + "</section>" +
      '<section class="wrap list"><p class="count">' + list.length + "곳" + (q.type ? " · " + esc(typeName(q.type)) : "") + (q.work ? " · " + esc(BG.WORK[q.work].name) : "") + (q.region ? " · " + esc(q.region) : "") + "</p>" +
      (list.length ? list.map(companyRow).join("") : '<p class="empty">조건에 맞는 업체가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</section>";
  }
  function company(r) {
    var c = BG.CO[r.id] || D.companies[0];
    app.innerHTML = '<section class="pro-h wrap"><p class="crumb"><a href="#/companies">업체 찾기</a> · ' + esc(typeName(c.type)) + '</p><h1>' + esc(c.name) + '</h1><p class="meta">' + esc(c.region + " " + c.city) + " · " + c.since + "년 설립 · 실적 " + won(c.count) + "건</p>" + checks(c) +
      '<div class="cta"><a class="pill pill-blue" href="#/quote?to=' + c.id + '">견적 문의</a>' + saveBtn(c.id) + "</div></section>" +
      '<section class="pro-strip">' + c.projects.map(function (p) { return '<figure><img src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"><figcaption><b>' + esc(p.t) + "</b>" + p.y + "년</figcaption></figure>"; }).join("") + "</section>" +
      '<section class="pro-body wrap"><p class="statement">' + esc(c.intro) + '</p><table class="spec"><tr><th>업체 종류</th><td>' + esc(typeName(c.type)) + "</td></tr><tr><th>공종</th><td>" + esc(workNames(c.works).join(", ")) + "</td></tr><tr><th>면허·등록</th><td>" + esc(c.licenses.join(", ")) + "</td></tr><tr><th>지역</th><td>" + esc(c.region + " " + c.city) + "</td></tr><tr><th>설립</th><td>" + c.since + "년 (" + BG.years(c.since) + "년)</td></tr></table>" +
      '<div class="cta center"><a class="pill pill-blue" href="#/quote?to=' + c.id + '">' + esc(c.name) + "에 견적 문의</a></div></section>";
  }
  function expertRow(x) {
    return '<article class="row xrow"><div class="row-l">' + mono(x.name, "round") + '<div class="row-t"><h3><a href="#/expert/' + x.id + '">' + esc(x.name) + " <small>" + esc(x.title) + "</small></a></h3>" +
      '<p class="meta">' + esc(x.region) + " · 경력 " + x.years + "년 · " + esc(x.affil === "개인" ? "개인 전문가" : x.affil) + '</p><p class="lic">' + esc(x.intro) + "</p>" +
      '<div class="row-b"><a class="pill pill-blue sm" href="#/quote?to=' + x.id + '">견적 문의</a><a class="lk" href="#/expert/' + x.id + '">전문가 정보 ' + I.arrow + "</a></div></div></div>" +
      '<ol class="xproj">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol></article>";
  }
  function experts(r) {
    var q = r.query, list = BG.findExperts({ work: q.work, region: q.region, q: q.q }).sort(function (a, b) { return b.years - a.years; });
    app.innerHTML = '<section class="page-h wrap"><nav class="seg"><a href="#/companies">업체</a><a class="on" href="#/experts">전문가</a></nav><h1>전문가 찾기</h1><p>건축사·기술사·현장소장급 기술자를 공종과 지역으로 찾습니다.</p>' + finder("experts", q) + "</section>" +
      '<section class="wrap list"><p class="count">' + list.length + "명 · 경력 많은 순</p>" + (list.length ? list.map(expertRow).join("") : '<p class="empty">조건에 맞는 전문가가 없습니다.</p>') + "</section>";
  }
  function expert(r) {
    var x = BG.EX[r.id] || D.experts[0];
    app.innerHTML = '<section class="pro-h wrap"><p class="crumb"><a href="#/experts">전문가 찾기</a> · ' + esc(x.title) + "</p>" + mono(x.name, "round lg") + '<h1>' + esc(x.name) + '</h1><p class="meta">' + esc(x.title) + " · " + esc(x.region) + " · 경력 " + x.years + "년 · " + esc(x.affil === "개인" ? "개인 전문가" : x.affil) + "</p>" +
      '<div class="cta"><a class="pill pill-blue" href="#/quote?to=' + x.id + '">견적 문의</a>' + saveBtn(x.id) + "</div></section>" +
      '<section class="pro-body wrap"><p class="statement">' + esc(x.intro) + '</p><ol class="plist">' + x.projects.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>" +
      '<table class="spec"><tr><th>자격</th><td>' + esc(x.title) + "</td></tr><tr><th>분야</th><td>" + esc(workNames(x.works).join(", ")) + "</td></tr><tr><th>경력</th><td>" + x.years + "년</td></tr><tr><th>지역</th><td>" + esc(x.region) + "</td></tr></table></section>";
  }
  function priceHtml(m) {
    if (S.member) return '<p class="price"><s data-pop class="mo-ib">' + won(m.price) + '원</s><b><span data-roll="' + m.id + '">' + won(S.priceOf(m)) + "</span>원</b><small>/" + esc(m.unit) + "</small></p>";
    return '<p class="price"><b><span data-roll="' + m.id + '">' + won(m.price) + "</span>원</b><small>/" + esc(m.unit) + '</small></p><button type="button" class="lock" data-act="login" data-pop>로그인하면 회원가</button>';
  }
  function matCard(m) {
    return '<article class="mcard"><a class="mimg" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></a><p class="mcat">' + esc(BG.MC[m.cat].name) + '</p><h3><a href="#/item/' + m.id + '">' + esc(m.name) + "</a></h3><p class=\"mspec\">" + esc(m.spec) + " · 최소 " + esc(m.moq) + "</p>" + priceHtml(m) +
      '<div class="mfoot"><span>' + esc(m.ship) + '</span><button type="button" class="pill pill-line sm" data-act="cart" data-id="' + m.id + '">담기</button></div></article>';
  }
  function mall(r) {
    var c = r.query.c || "", list = D.materials.filter(function (m) { return !c || m.cat === c; }), t = S.tier();
    app.innerHTML = '<section class="page-h wrap"><h1>회원 자재몰</h1><p>' + (t ? esc(D.demoUser.company + " " + D.demoUser.name) + "님 · <b>" + esc(t.name) + " 회원가 " + t.discount + "%</b> 적용 중" : "사업자 회원으로 로그인하면 등급별 회원가가 보입니다.") + "</p>" +
      (t ? "" : '<div class="cta"><button type="button" class="pill pill-blue" data-act="login">사업자 회원 로그인</button></div>') + "</section>" +
      '<nav class="cats wrap"><a class="' + (c ? "" : "on") + '" href="#/mall">전체</a>' + D.matCats.map(function (x) { return '<a class="' + (c === x.id ? "on" : "") + '" href="#/mall?c=' + x.id + '">' + esc(x.name) + "</a>"; }).join("") + "</nav>" +
      '<section class="wrap mgrid">' + list.map(matCard).join("") + "</section>" + cartBar();
  }
  function cartBar() {
    var tt = S.cartTotals(); if (!tt.count) return "";
    return '<div class="cartbar" id="cartbar"><p>담은 자재 <b>' + tt.count + "건</b> · " + won(tt.pay) + '원</p><a class="pill pill-blue sm" href="#/cart">견적서 받기</a></div>';
  }
  function refreshCart() {
    var old = document.getElementById("cartbar"); if (old) old.remove();
    var html = cartBar(); if (!html) return;
    app.insertAdjacentHTML("beforeend", html);
    var bar = document.getElementById("cartbar");
    if (!BG.reduced() && bar.animate) bar.animate([{ transform: "translate(-50%, 140%)" }, { transform: "translate(-50%, 0)" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
  }
  function item(r) {
    var m = BG.MT[r.id] || D.materials[0], co = BG.CO[m.seller];
    app.innerHTML = '<section class="wrap item"><p class="crumb"><a href="#/mall">회원 자재몰</a> · ' + esc(BG.MC[m.cat].name) + '</p><div class="item-in"><div class="item-img"><img src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></div><div class="item-info"><h1>' + esc(m.name) + "</h1>" + priceHtml(m) +
      '<p class="ilab">규격</p><div class="specs" id="specs">' + m.specs.map(function (s) { return '<button type="button" class="' + (s === m.spec ? "on" : "") + '" data-spec="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div>" +
      '<p class="ilab">수량 (' + esc(m.unit) + ')</p><div class="qty"><button type="button" data-q="-1" aria-label="빼기">' + I.minus + '</button><input id="qty" inputmode="numeric" value="1" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">' + I.plus + "</button></div>" +
      '<table class="spec"><tr><th>최소 주문</th><td>' + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a>" : "BUILDGO") + "</td></tr></table>" +
      '<div class="cta"><button type="button" class="pill pill-blue" data-act="cart-item">담기</button><a class="pill pill-line" href="#/quote?item=' + m.id + '">대량 구매 문의</a></div></div></div></section>' + cartBar();
    var spec = m.spec;
    document.getElementById("specs").onclick = function (ev) { var b = ev.target.closest("[data-spec]"); if (!b) return; spec = b.dataset.spec; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    app.querySelector(".qty").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var inp = document.getElementById("qty"); inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + +b.dataset.q); };
    app.querySelector('[data-act="cart-item"]').onclick = function () { S.addCart(m.id, Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1), spec); BG.toast("견적 목록에 담았습니다"); refreshCart(); };
  }
  function cart() {
    var tt = S.cartTotals();
    app.innerHTML = '<section class="page-h wrap"><h1>견적 목록</h1><p>담은 자재로 견적서를 받습니다.</p></section><section class="wrap list">' +
      (S.cart.length ? S.cart.map(function (row) { var m = BG.MT[row.id]; return '<div class="crow"><img src="' + photo(m.ph) + '" alt=""><div><b>' + esc(m.name) + "</b><span>" + esc(row.spec || m.spec) + " · " + row.qty + esc(m.unit) + "</span></div><p>" + won(S.priceOf(m) * row.qty) + "원</p></div>"; }).join("") +
        '<div class="csum"><p><span>정가 합계</span><b>' + won(tt.list) + "원</b></p><p><span>회원 할인</span><b>-" + won(tt.discount) + '원</b></p><p class="t"><span>견적 금액</span><b>' + won(tt.pay) + '원</b></p><button type="button" class="pill pill-blue wide" data-act="estimate">견적서 받기</button></div>'
        : '<p class="empty">담은 자재가 없습니다.</p><div class="cta"><a class="pill pill-line" href="#/mall">회원 자재몰로</a></div>') + "</section>";
  }
  function quote(r) {
    var to = BG.CO[r.query.to] || BG.EX[r.query.to], m = BG.MT[r.query.item];
    var target = to ? (to.title ? to.name + " " + to.title : to.name) : m ? m.name + " 대량 구매" : "";
    app.innerHTML = '<section class="page-h wrap"><h1>견적 문의</h1><p>' + (target ? "<b>" + esc(target) + "</b>에 보내는 문의입니다." : "맡길 일과 현장 정보를 남기면 맞는 업체가 연락합니다.") + "</p></section>" +
      '<section class="wrap qform"><form id="qf" novalidate><div class="qgrid"><label class="sel big"><span>공종</span><select name="work">' + opts(D.works, to && to.works ? to.works[0] : "", "공종을 고르세요") + "</select>" + I.down + '</label>' +
      '<label class="sel big"><span>현장 지역</span><select name="region">' + opts(D.regions, to ? to.region : "", "지역을 고르세요") + "</select>" + I.down + '</label>' +
      '<label class="txt big"><span>규모</span><input name="size" placeholder="예: 연면적 1,200㎡"></label><label class="txt big"><span>착공 예정</span><input name="when" placeholder="예: 2027년 3월"></label>' +
      '<label class="txt big"><span>회사명</span><input name="co" autocomplete="organization"></label><label class="txt big"><span>담당자</span><input name="name" autocomplete="name"></label>' +
      '<label class="txt big full"><span>휴대폰</span><input name="phone" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label></div><p class="err" id="qerr"></p><button type="submit" class="pill pill-blue wide">견적 문의 보내기</button></form></section>';
    document.getElementById("qf").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, miss = [];
      if (!f.work.value) miss.push("공종"); if (!f.region.value) miss.push("지역"); if (!f.co.value.trim()) miss.push("회사명"); if (!f.name.value.trim()) miss.push("담당자");
      if (!/^0\d{8,10}$/.test(f.phone.value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("qerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ work: f.work.value, region: f.region.value, to: target });
      app.innerHTML = '<section class="wrap done"><h1>견적 문의를 보냈습니다</h1><p>' + (target ? esc(target) + "에서" : "맞는 업체가") + ' 확인한 뒤 남기신 번호로 연락드립니다.</p><div class="cta"><a class="pill pill-blue" href="#/companies">다른 업체 보기</a><a class="pill pill-line" href="#/">처음으로</a></div></section>';
      window.scrollTo(0, 0);
    };
  }
  function login() {
    app.innerHTML = '<section class="wrap login"><h1>사업자 회원 로그인</h1><p>등급별 회원가와 견적 목록을 쓸 수 있습니다.</p>' +
      '<label class="txt big"><span>아이디</span><input value="hankyul_gm" autocomplete="username"></label><label class="txt big"><span>비밀번호</span><input type="password" value="buildgo1998" autocomplete="current-password"></label>' +
      '<button type="button" class="pill pill-blue wide" data-act="do-login">로그인</button><p class="join">아직 회원이 아니신가요? <a href="#/quote">가입 문의</a></p></section>';
  }

  function sync(r) {
    var name = r ? r.name : BG.parseHash().name;
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
    if (act === "menu") { var d = document.getElementById("drawer"); d.hidden = false; document.body.classList.add("lock"); if (!BG.reduced() && d.animate) d.firstElementChild.animate([{ transform: "translateY(-24px)", opacity: 0 }, { opacity: 1, offset: .4 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" }); }
    if (act === "menu-close") closeMenu();
    if (act === "save") { var on = S.toggleSave(a.dataset.id); a.classList.toggle("on", on); a.querySelector("span").textContent = on ? "저장됨" : "저장"; BG.toast(on ? "저장했습니다" : "저장을 취소했습니다"); }
    if (act === "cart") { var m = BG.MT[a.dataset.id]; S.addCart(m.id, 1, m.spec); BG.toast(m.name + " 1" + m.unit + ", 견적 목록에 담았습니다"); refreshCart(); }
    if (act === "estimate") BG.toast("견적서를 만들고 있습니다. 담당자가 확인 후 연락드립니다");
  });
  document.getElementById("drawer").addEventListener("click", function (ev) { if (ev.target === this || ev.target.closest("a")) closeMenu(); });
  document.addEventListener("submit", function (ev) {
    var f = ev.target.closest("[data-finder]"); if (!f) return;
    ev.preventDefault();
    location.hash = "#/" + f.dataset.finder + BG.qs({ type: f.type ? f.type.value : "", work: f.work.value, region: f.region.value, q: f.q.value.trim() });
  });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 10); }, { passive: true });
  document.getElementById("ftCredit").textContent = BG.credit;

  var MOTION = [
    [".intro .label", "up", { y: 12, delay: 150 }],
    [".intro h1", "lines", { delay: 300, gap: 130, dur: 1200 }],
    [".intro .sub, .intro .cta", "up", { y: 14, delay: 800, stagger: 140 }],
    [".strip figure", "wipe", { stagger: 110, delay: 900, dur: 1200 }],
    [".label", "up", { y: 10 }],
    [".door", "up", { y: 24, stagger: 110 }],
    [".about h2, .end h2, .page-h h1, .pro-h h1, .done h1, .login h1", "lines", { gap: 110 }],
    [".about p, .page-h > p, .pro-h .meta, .statement", "up", { y: 14, lag: 160 }],
    [".num b", "count", { dur: 1300 }],
    [".bcard", "card", { stagger: 120, y: 34 }],
    [".finder", "up", { y: 16, lag: 220 }],
    [".row", "card", { y: 26, stagger: 70, max: 5 }],
    [".pro-strip figure", "wipe", { stagger: 120 }],
    [".mcard", "card", { y: 24, stagger: 60, max: 6 }]
  ];
  BG.router({ home: home, companies: companies, company: company, experts: experts, expert: expert, mall: mall, item: item, cart: cart, quote: quote, login: login }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
