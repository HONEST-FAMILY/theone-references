(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, man = BG.man, photo = BG.photo;
  var S = new BG.Session("bg1");
  var app = document.getElementById("app");
  var heroTimer = null;

  var HERO = [
    { img: "pf_e3_1", title: "주방 리모델링\n설계부터 시공까지", sub: "검증된 전문가 견적을 비교하고\n자재는 회원가로 함께 준비하세요" },
    { img: "x_bath", title: "욕실 리모델링\n무료 실측 상담", sub: "면허·사업자·보험을 확인한 전문가가\n직접 방문해 실측합니다" },
    { img: "cat_exterior", title: "창호·중문 교체\n실측부터 설치까지", sub: "창호 자재는 회원 등급가로\n시공은 견적 비교로" }
  ];
  var ICON = {
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v9H4z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="m9 6 6 6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="m6 9 6 6 6-6"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>'
  };

  function liked(id) { return S.likes.indexOf(id) >= 0; }
  function likeBtn(id) { return '<button type="button" class="like' + (liked(id) ? " on" : "") + '" data-like="' + id + '" aria-label="찜하기">' + ICON.heart + "</button>"; }
  function tierRate() { var t = S.tier(); return t ? t.discount : 0; }

  function matCard(m) {
    var price = S.priceOf(m), rate = tierRate();
    var priceHtml = S.member
      ? '<div class="pstrike">' + won(m.price) + '원</div><div class="pprice"><span class="rate">' + rate + "%</span>" + won(price) + "<small>원</small></div>"
      : '<div class="pprice">' + won(m.price) + '<small>원</small></div><button type="button" class="pmember" data-act="login">회원가 보기 ' + ICON.chev + "</button>";
    return '<div class="pcard"><a href="#/goods/' + m.id + '" class="pthumb"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"><span class="pflag">회원<br>전용</span></a>' + likeBtn(m.id) +
      '<a href="#/goods/' + m.id + '"><p class="pname">[' + esc(BG.MAT_CAT[m.category].name) + "] " + esc(m.name) + " " + esc(m.spec) + "</p></a>" + priceHtml +
      '<div class="ptags"><span>' + esc(m.stock) + "</span><span>최소 " + m.moq + esc(m.unit.replace(/\(.*\)/, "")) + "</span></div></div>";
  }
  function expertCard(e) {
    var c = BG.CAT[e.category];
    return '<a class="ecard" href="#/expert/' + e.id + '"><div class="pthumb"><img loading="lazy" src="' + photo(e.portfolio[0].photo) + '" alt="' + esc(e.portfolio[0].title) + '"></div>' +
      '<p class="ename">' + esc(e.name) + (e.verified.license ? '<span class="vf">검증</span>' : "") + "</p>" +
      '<p class="emeta">' + esc(c.name) + " · " + esc(e.region) + " · 경력 " + e.years + "년</p>" +
      '<p class="estar">★ <b>' + e.rating + "</b> 후기 " + e.reviews + "개</p>" +
      '<p class="eprice">' + (e.startPrice ? man(e.startPrice) + "부터" : "현장 실측 후 견적") + "</p></a>";
  }
  function caseItems(cat) {
    var out = [];
    D.experts.forEach(function (e) { if (!cat || e.category === cat) e.portfolio.forEach(function (p) { out.push({ p: p, e: e }); }); });
    return out;
  }
  function caseCard(x) {
    return '<a class="ccard" href="#/expert/' + x.e.id + '"><img loading="lazy" src="' + photo(x.p.photo) + '" alt="' + esc(x.p.title) + '"><span class="cap"><b>' + esc(x.p.title) + "</b>" + esc(x.e.name) + "</span></a>";
  }

  function home() {
    document.body.classList.add("on-hero");
    var slides = HERO.map(function (h, i) { return '<div class="slide' + (i === 0 ? " on" : "") + '"><img src="' + photo(h.img) + '" alt=""></div>'; }).join("");
    var tiles = '<a class="tile" href="#/tiers"><span class="tbox brand">BUILDGO<br>회원가</span>회원 등급<br>혜택보기</a>' +
      D.categories.map(function (c) { return '<a class="tile" href="#/experts?cat=' + c.id + '"><span class="tbox"><img class="ic" src="' + BG.icon(c.id) + '" alt=""></span>' + esc(c.name) + "</a>"; }).join("") +
      '<a class="tile" href="#/quote"><span class="tbox"><img class="ic" src="' + BG.icon("quote") + '" alt=""></span>무료 견적상담</a>' +
      '<a class="tile" href="#/cases"><span class="tbox"><img class="ic" src="' + BG.icon("cases") + '" alt=""></span>시공사례</a>' +
      '<a class="tile" href="#/mall"><span class="tbox"><img class="ic" src="' + BG.icon("mall") + '" alt=""></span>회원 자재몰</a>';
    app.innerHTML =
      '<section class="hero" id="hero">' + slides +
      '<div class="hero-copy"><div class="wrap"><h1 id="heroTitle">' + esc(HERO[0].title) + '</h1><p id="heroSub">' + esc(HERO[0].sub) + "</p></div></div>" +
      '<div class="hero-ctl"><span id="heroNum">1 / ' + HERO.length + '</span><button type="button" data-act="pause" aria-label="일시정지">' + ICON.pause + "</button></div>" +
      '<div class="hero-bar"><i id="heroBar"></i></div></section>' +
      '<div class="wrap"><nav class="tiles" aria-label="바로가기">' + tiles + "</nav>" +
      '<section class="sec"><div class="sec-head"><h2>회원 자재몰 이번 주 추천</h2><p>로그인하면 등급별 회원가로 바로 보여 드립니다</p><a class="more" href="#/mall">더보기 ›</a></div>' +
      '<div class="chips" data-chipset="mall"><button class="chip on" data-mcat="">전체</button>' + D.materialCategories.map(function (c) { return '<button class="chip" data-mcat="' + c.id + '">' + esc(c.name) + "</button>"; }).join("") + "</div>" +
      '<div class="pgrid" id="homeMall">' + D.materials.slice(0, 8).map(matCard).join("") + "</div></section>" +
      '<section class="sec"><div class="sec-head"><h2>BUILDGO가 제안하는 분야별 시공사례</h2></div>' +
      '<div class="chips" data-chipset="cases">' + D.categories.map(function (c, i) { return '<button class="chip' + (i === 2 ? " on" : "") + '" data-ccat="' + c.id + '">' + esc(c.name) + "</button>"; }).join("") + "</div>" +
      '<div class="cgrid" id="homeCases">' + caseItems("").slice(0, 8).map(caseCard).join("") + '</div><div class="more-pill"><a href="#/cases" id="casesMore">시공사례 전체보기 ' + ICON.chev + "</a></div></section>" +
      '<section class="sec"><div class="sec-head"><h2>나에게 딱 맞는 시공 전문가</h2><p>분야부터 지역까지, 면허와 후기를 확인한 전문가를 추천해 드려요</p></div>' +
      '<div class="band"><div class="band-copy"><h3>회원 등급이 오를수록\n자재 단가가 내려갑니다</h3><p>일반 · 실버 · 골드 · VIP, 등급마다 할인율과 적립률이 다릅니다</p><a href="#/tiers">등급 혜택 보기 ›</a></div><div class="band-photo"><img loading="lazy" src="' + photo("hero_worker") + '" alt=""></div></div>' +
      '<div class="egrid" style="margin-top:40px">' + D.experts.slice(0, 4).map(expertCard).join("") + "</div></section></div>";
    var i = 0;
    clearInterval(heroTimer);
    function go(n) {
      i = n % HERO.length;
      var s = document.querySelectorAll("#hero .slide");
      s.forEach(function (el, k) { el.classList.toggle("on", k === i); });
      document.getElementById("heroTitle").textContent = HERO[i].title;
      document.getElementById("heroSub").textContent = HERO[i].sub;
      document.getElementById("heroNum").textContent = (i + 1) + " / " + HERO.length;
      document.getElementById("heroBar").style.transform = "translateX(" + (i * 100) + "%)";
    }
    if (!BG.reduced()) heroTimer = setInterval(function () { if (!document.getElementById("hero")) return clearInterval(heroTimer); go(i + 1); }, 5000);
    app.querySelector('[data-act="pause"]').onclick = function () { clearInterval(heroTimer); heroTimer = null; BG.toast("자동 넘김을 멈췄어요"); };
    app.querySelector('[data-chipset="mall"]').onclick = function (ev) {
      var b = ev.target.closest(".chip"); if (!b) return;
      this.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c === b); });
      var list = D.materials.filter(function (m) { return !b.dataset.mcat || m.category === b.dataset.mcat; });
      document.getElementById("homeMall").innerHTML = list.slice(0, 8).map(matCard).join("");
    };
    var cc = app.querySelector('[data-chipset="cases"]');
    function setCases(cat) {
      var list = caseItems(cat);
      var fill = list.concat(caseItems("").filter(function (x) { return x.e.category !== cat; }));
      document.getElementById("homeCases").innerHTML = fill.slice(0, 8).map(caseCard).join("");
      document.getElementById("casesMore").innerHTML = esc(BG.CAT[cat].name) + " 시공사례 전체보기 " + ICON.chev;
      document.getElementById("casesMore").setAttribute("href", "#/cases?cat=" + cat);
    }
    setCases("interior");
    cc.onclick = function (ev) {
      var b = ev.target.closest(".chip"); if (!b) return;
      cc.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c === b); });
      setCases(b.dataset.ccat);
    };
  }

  function crumb(parts) {
    return '<div class="crumb"><a href="#/" aria-label="홈">' + ICON.home + "</a>" + parts.map(function (p, i) { return ICON.chev + (i === parts.length - 1 ? "<b>" + esc(p[0]) + "</b>" : '<a href="' + p[1] + '">' + esc(p[0]) + "</a>"); }).join("") + "</div>";
  }

  function experts(r) {
    var cat = r.query.cat || "";
    var list = D.experts.filter(function (e) { return !cat || e.category === cat; });
    app.innerHTML = '<div class="wrap page-top">' + crumb([["시공 맡기기", "#/experts"]].concat(cat ? [[BG.CAT[cat].name, ""]] : [])) +
      '<div class="list-head"><h1>' + (cat ? esc(BG.CAT[cat].name) : "시공 맡기기") + "</h1><span>전문가 " + list.length + "곳</span></div>" +
      '<div class="chips left"><a class="chip' + (!cat ? " on" : "") + '" href="#/experts" style="display:inline-flex;align-items:center">전체</a>' +
      D.categories.map(function (c) { return '<a class="chip' + (cat === c.id ? " on" : "") + '" href="#/experts?cat=' + c.id + '" style="display:inline-flex;align-items:center">' + esc(c.name) + "</a>"; }).join("") + "</div>" +
      '<div class="egrid">' + (list.length ? list.map(expertCard).join("") : '<p class="empty">이 분야 전문가를 모으는 중입니다.</p>') + "</div></div>";
  }

  function mall(r) {
    var cat = r.query.cat || "";
    var list = D.materials.filter(function (m) { return !cat || m.category === cat; });
    app.innerHTML = '<div class="wrap page-top">' + crumb([["회원 자재몰", "#/mall"]].concat(cat ? [[BG.MAT_CAT[cat].name, ""]] : [])) +
      '<div class="list-head"><h1>' + (cat ? esc(BG.MAT_CAT[cat].name) : "회원 자재몰") + "</h1><span>" + (S.member ? "골드 회원가 적용 중" : "로그인하면 회원가가 보여요") + " · 상품 " + list.length + "개</span></div>" +
      '<div class="chips left"><a class="chip' + (!cat ? " on" : "") + '" href="#/mall" style="display:inline-flex;align-items:center">전체</a>' +
      D.materialCategories.map(function (c) { return '<a class="chip' + (cat === c.id ? " on" : "") + '" href="#/mall?cat=' + c.id + '" style="display:inline-flex;align-items:center">' + esc(c.name) + "</a>"; }).join("") + "</div>" +
      '<div class="pgrid">' + list.map(matCard).join("") + "</div></div>";
  }

  function cases(r) {
    var cat = r.query.cat || "";
    var list = caseItems(cat);
    app.innerHTML = '<div class="wrap page-top">' + crumb([["시공사례", ""]]) + '<div class="list-head"><h1>' + (cat ? esc(BG.CAT[cat].name) + " 시공사례" : "시공사례") + "</h1><span>" + list.length + "건 · 예시 사진</span></div>" +
      '<div class="chips left"><a class="chip' + (!cat ? " on" : "") + '" href="#/cases" style="display:inline-flex;align-items:center">전체</a>' + D.categories.map(function (c) { return '<a class="chip' + (cat === c.id ? " on" : "") + '" href="#/cases?cat=' + c.id + '" style="display:inline-flex;align-items:center">' + esc(c.name) + "</a>"; }).join("") + "</div>" +
      '<div class="cgrid">' + list.map(caseCard).join("") + "</div></div>";
  }

  function goods(r) {
    var m = BG.MAT[r.id] || D.materials[0];
    var c = BG.MAT_CAT[m.category], price = S.priceOf(m), rate = tierRate();
    var shots = [m.photo].concat(D.materials.filter(function (x) { return x.category === m.category && x.id !== m.id; }).map(function (x) { return x.photo; })).slice(0, 4);
    app.innerHTML = '<div class="wrap page-top">' + crumb([["회원 자재몰", "#/mall"], [c.name, "#/mall?cat=" + c.id], [m.name, ""]]) + "</div>" +
      '<div class="wrap"><div class="pd" style="margin-top:16px">' +
      '<div class="pd-media"><div class="pd-main"><img id="pdImg" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"><span class="pflag" style="width:64px;font-size:17px;padding:8px 0">회원<br>전용</span></div>' +
      '<div class="pd-thumbs">' + shots.map(function (k, i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div>" +
      '<div class="pd-info"><p class="pd-brand">BUILDGO 회원 자재몰 ›</p><h1 class="pd-title">[' + esc(c.name) + "] " + esc(m.name) + " " + esc(m.spec) + '</h1><p class="pd-star">판매 단위 <b>' + esc(m.unit) + "</b> · 최소 주문 <b>" + m.moq + "</b></p>" +
      '<div class="pd-price"><div>' + (S.member ? '<span class="rate">' + rate + '%</span><span class="was">' + won(m.price) + "원</span>" : "") + '<span class="now">' + won(price) + "원</span></div>" + (S.member ? '<span class="btn-dark">골드 회원가 적용</span>' : '<button type="button" class="btn-dark" data-act="login">회원가 보기 ↓</button>') + "</div>" +
      (S.member ? "" : '<p class="member-hint">회원 가입 시 예상 혜택가 <button type="button" data-act="login">' + won(Math.round(m.price * 0.94 / 10) * 10) + "원(골드) ›</button></p>") +
      '<dl class="pd-row"><dt>출고</dt><dd>' + esc(m.stock) + " · 현장 직배송(일부 지역 제외)</dd></dl>" +
      '<dl class="pd-row"><dt>적립</dt><dd>' + (S.member ? "구매액의 " + S.tier().pointRate + "% 포인트 적립" : "회원 등급에 따라 0.5~2% 적립") + "</dd></dl>" +
      '<dl class="pd-row"><dt>시공</dt><dd><a href="#/experts" style="color:var(--blue)">이 자재로 시공할 전문가 견적 받기 ›</a></dd></dl></div>' +
      '<div class="pd-events"><p class="ev-t">혜택 <b>2</b></p><div class="coupons"><a class="cpn" href="#/tiers"><div><b>회원 등급가 할인</b><p>실버 3% · 골드 6% · VIP 10%<br>등급이 오르면 단가가 내려갑니다</p></div><span>~10%</span></a>' +
      '<a class="cpn" href="#/tiers"><div><b>추천 적립 포인트</b><p>내가 추천한 회원이 첫 구매하면<br>1번 적립 (예시)</p></div><span>' + won(D.points.referral) + "P</span></a></div></div>" +
      '<aside class="pd-side"><div class="side-sticky"><button type="button" class="sel">' + esc(m.spec) + " " + ICON.chev + '</button><p class="sel-note">규격을 고른 뒤 수량을 정하세요. 최소 주문 ' + m.moq + esc(m.unit) + ".</p>" +
      '<div class="qty"><span>수량</span><div><button type="button" data-q="-1" aria-label="빼기">−</button><input id="qty" value="' + m.moq + '" inputmode="numeric" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">+</button></div></div>' +
      '<div class="sum"><div class="sum-total"><span>총 구매가</span><b id="tot">0 원</b></div><div class="sum-row"><span>적립 예정</span><span id="pts">-</span></div><p class="sum-note">회원가와 적립 포인트는 장바구니에서 다시 확인할 수 있습니다.</p></div>' +
      '<div class="side-btns"><button type="button" class="heart" data-like="' + m.id + '" aria-label="찜하기">' + ICON.heart + '</button><button type="button" class="btn-line" data-act="cart">장바구니</button><span></span><button type="button" class="btn-fill" data-act="buy">바로 구매</button></div></div></aside></div>' +
      '<div class="pd-tabs"><button class="on" type="button">상품정보</button><button type="button">문의 (0)</button></div>' +
      '<div class="pd-body"><div class="chips left"><button class="chip on">기본정보</button><button class="chip">규격</button><button class="chip">배송</button><button class="chip">등급별 가격</button></div>' +
      '<div class="infobox"><b>회원 등급별 가격</b><p>같은 자재도 등급에 따라 단가가 달라집니다.</p></div>' +
      '<table class="pkg"><thead><tr><th>등급</th><th>할인</th><th>1' + esc(m.unit.replace(/\(.*\)/, "")) + ' 단가</th><th>적립</th></tr></thead><tbody>' +
      D.tiers.map(function (t) { return "<tr><td>" + esc(t.name) + "</td><td>" + (t.discount ? "-" + t.discount + "%" : "-") + "</td><td>" + won(Math.round(m.price * (100 - t.discount) / 100 / 10) * 10) + "원</td><td>" + t.pointRate + "%</td></tr>"; }).join("") + "</tbody></table></div></div>";
    function calc() {
      var q = Math.max(1, parseInt(document.getElementById("qty").value, 10) || 1);
      document.getElementById("tot").textContent = won(price * q) + " 원";
      document.getElementById("pts").textContent = S.member ? won(S.pointsOf(price * q)) + "P" : "로그인 후 적립";
    }
    calc();
    app.querySelector(".qty").onclick = function (ev) {
      var b = ev.target.closest("[data-q]"); if (!b) return;
      var el = document.getElementById("qty"); el.value = Math.max(1, (parseInt(el.value, 10) || 1) + parseInt(b.dataset.q, 10)); calc();
    };
    document.getElementById("qty").oninput = calc;
    app.querySelector(".pd-thumbs").onclick = function (ev) {
      var b = ev.target.closest("[data-shot]"); if (!b) return;
      this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.getElementById("pdImg").src = photo(b.dataset.shot);
    };
    app.querySelector('[data-act="cart"]').onclick = function () { S.addCart(m.id, parseInt(document.getElementById("qty").value, 10) || 1); syncHeader(); BG.toast("장바구니에 담았어요"); };
    app.querySelector('[data-act="buy"]').onclick = function () { S.addCart(m.id, parseInt(document.getElementById("qty").value, 10) || 1); location.hash = "#/cart"; };
  }

  function expert(r) {
    var e = BG.EXP[r.id] || D.experts[0];
    var c = BG.CAT[e.category];
    var shots = e.portfolio.map(function (p) { return p.photo; });
    var first = e.packages[0];
    app.innerHTML = '<div class="wrap page-top">' + crumb([["시공 맡기기", "#/experts"], [c.name, "#/experts?cat=" + c.id], [e.name, ""]]) + "</div>" +
      '<div class="wrap"><div class="pd" style="margin-top:16px">' +
      '<div class="pd-media"><div class="pd-main"><img id="pdImg" src="' + photo(shots[0]) + '" alt="' + esc(e.portfolio[0].title) + '"></div><div class="pd-thumbs">' +
      shots.map(function (k, i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div>" +
      '<div class="pd-info"><p class="pd-brand">' + esc(e.name) + ' ›</p><h1 class="pd-title">' + esc(e.service) + '</h1><p class="pd-star">★ <b>' + e.rating + "</b> 후기 " + e.reviews + "개 · 평균 응답 " + e.responseHours + "시간</p>" +
      '<div class="vrow">' + [e.verified.license ? e.verified.license + " 면허 확인" : null, e.verified.business ? "사업자 확인" : null, e.verified.insurance ? "보험 가입" : null].filter(Boolean).map(function (t) { return "<span>" + ICON.check + esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="pd-price"><div><span class="now">' + (e.startPrice ? man(e.startPrice) + "부터" : "현장 실측 후 견적") + "</span></div></div>" +
      '<dl class="pd-row"><dt>지역</dt><dd>' + esc(e.region) + " 주변</dd></dl><dl class=\"pd-row\"><dt>경력</dt><dd>" + e.years + "년 · " + esc(c.name) + '</dd></dl><dl class="pd-row"><dt>자재</dt><dd>필요한 자재는 <a href="#/mall" style="color:var(--blue)">회원 자재몰</a> 회원가로 함께 준비</dd></dl></div>' +
      '<aside class="pd-side"><div class="side-sticky"><label class="field" style="margin:0">패키지 선택<select id="pkgSel">' + e.packages.map(function (p, i) { return '<option value="' + i + '">' + esc(p.tier) + " · " + (p.price == null ? "현장 견적" : man(p.price)) + "</option>"; }).join("") + "</select></label>" +
      '<p class="sel-note" id="pkgNote">' + esc(first.items.join(" · ")) + "</p>" +
      '<div class="sum"><div class="sum-total"><span>예상 금액</span><b id="pkgPrice">' + (first.price == null ? "현장 견적" : man(first.price)) + '</b></div><div class="sum-row"><span>작업 기간</span><span id="pkgDays">' + (first.days ? first.days + "일" : "협의") + "</span></div></div>" +
      '<div class="side-btns"><button type="button" class="heart" data-like="' + e.id + '" aria-label="찜하기">' + ICON.heart + '</button><button type="button" class="btn-line" data-act="ask">문의하기</button><span></span><a class="btn-fill" style="display:flex;align-items:center;justify-content:center" href="#/quote?e=' + e.id + '">무료 견적 상담</a></div></div></aside></div>' +
      '<div class="pd-tabs"><button class="on" type="button">시공정보</button><button type="button">후기 (' + e.reviews + ")</button></div>" +
      '<div class="pd-body"><div class="infobox"><b>' + esc(e.tagline) + "</b><p>면허·사업자·보험을 BUILDGO가 확인했습니다. 계약은 전문가와 고객이 직접 맺습니다.</p></div>" +
      '<table class="pkg"><thead><tr><th>구분</th>' + e.packages.map(function (p) { return "<th>" + esc(p.tier) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      "<tr><td>금액</td>" + e.packages.map(function (p) { return "<td><b>" + (p.price == null ? "현장 견적" : man(p.price)) + "</b></td>"; }).join("") + "</tr>" +
      "<tr><td>기간</td>" + e.packages.map(function (p) { return "<td>" + (p.days ? p.days + "일" : "협의") + "</td>"; }).join("") + "</tr>" +
      "<tr><td>포함</td>" + e.packages.map(function (p) { return "<td><ul>" + p.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></td>"; }).join("") + "</tr></tbody></table>" +
      '<div class="sec-head" style="text-align:left;margin:50px 0 0"><h2 style="font-size:22px">고객 후기</h2></div><div class="reviews">' +
      e.reviewsSample.map(function (v) { return '<div class="review"><div class="r-top"><span>' + "★".repeat(v.rating) + "</span><span>" + esc(v.author) + "</span></div><p>" + esc(v.text) + "</p></div>"; }).join("") + "</div></div></div>";
    document.getElementById("pkgSel").onchange = function () {
      var p = e.packages[this.value];
      document.getElementById("pkgPrice").textContent = p.price == null ? "현장 견적" : man(p.price);
      document.getElementById("pkgDays").textContent = p.days ? p.days + "일" : "협의";
      document.getElementById("pkgNote").textContent = p.items.join(" · ");
    };
    app.querySelector(".pd-thumbs").onclick = function (ev) {
      var b = ev.target.closest("[data-shot]"); if (!b) return;
      this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.getElementById("pdImg").src = photo(b.dataset.shot);
    };
    app.querySelector('[data-act="ask"]').onclick = function () { BG.toast("시안에서는 문의가 실제로 보내지지 않아요"); };
  }

  function quote(r) {
    var pre = BG.EXP[r.query.e];
    app.innerHTML = '<div class="wrap"><form class="form" id="qf" novalidate><h1>무료 견적상담 신청</h1><p class="lead">' + (pre ? esc(pre.name) + "에게 보낼 상담을 적어 주세요" : "공사 내용을 남기면 맞는 전문가가 연락드립니다") + "</p>" +
      '<div class="fstep"><h3><em>01</em>어떤 공사인가요?</h3><div class="chips left" id="qcat">' + D.categories.map(function (c) { return '<button type="button" class="chip' + (pre && pre.category === c.id ? " on" : "") + '" data-v="' + c.id + '">' + esc(c.name) + "</button>"; }).join("") + "</div></div>" +
      '<div class="fstep"><h3><em>02</em>규모와 일정</h3><div class="fgrid"><label class="field">면적<select name="size"><option value="">선택</option><option>20평 미만</option><option>20~30평</option><option>30~40평</option><option>40평 이상</option></select></label>' +
      '<label class="field">희망 시작<select name="when"><option value="">선택</option><option>한 달 안</option><option>1~3개월</option><option>3개월 이후</option></select></label>' +
      '<label class="field">지역<select name="region"><option value="">선택</option>' + D.regions.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field">예산<select name="budget"><option value="">선택</option><option>500만원 미만</option><option>500~2,000만원</option><option>2,000~5,000만원</option><option>5,000만원 이상</option><option>아직 모름</option></select></label></div></div>' +
      '<div class="fstep"><h3><em>03</em>연락처</h3><div class="fgrid"><label class="field">이름<input name="name" autocomplete="name"></label><label class="field">휴대폰<input name="phone" inputmode="tel" autocomplete="tel"></label></div></div>' +
      '<p class="err" id="qerr"></p><button class="btn-submit" type="submit">상담 신청하기</button></form></div>';
    var cat = pre ? pre.category : "";
    document.getElementById("qcat").onclick = function (ev) {
      var b = ev.target.closest(".chip"); if (!b) return;
      this.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x === b); }); cat = b.dataset.v;
    };
    document.getElementById("qf").onsubmit = function (ev) {
      ev.preventDefault();
      var f = this, miss = [];
      if (!cat) miss.push("공사 종류");
      ["size", "when", "region", "budget"].forEach(function (k) { if (!f[k].value) miss.push({ size: "면적", when: "시작 시기", region: "지역", budget: "예산" }[k]); });
      if (!f.name.value.trim()) miss.push("이름");
      if (!/^0\d{8,10}$/.test(f.phone.value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("qerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ cat: cat, size: f.size.value, region: f.region.value, budget: f.budget.value, to: pre ? pre.name : "맞는 전문가 추천" });
      app.innerHTML = '<div class="wrap done"><h1>상담 신청이 접수됐어요</h1><p>시안이라 실제로 보내지지는 않습니다. 실제 서비스에서는 전문가가 연락드립니다.</p><a class="btn-dark" href="#/quotes">견적함 보기</a></div>';
      syncHeader();
    };
  }

  function quotesView() {
    app.innerHTML = '<div class="wrap form"><h1>견적함</h1><p class="lead">보낸 상담 신청과 받은 견적을 모아 봅니다</p><div class="qlist">' +
      (S.quotes.length ? S.quotes.map(function (q) { return '<div class="qitem"><b>' + esc(BG.CAT[q.cat] ? BG.CAT[q.cat].name : "공사") + " · " + esc(q.size) + "</b><span>" + esc(q.region) + " · " + esc(q.budget) + " · " + esc(q.to) + "</span></div>"; }).join("") : '<p class="empty">아직 보낸 상담이 없어요.</p>') +
      '</div><a class="btn-submit" style="display:flex;align-items:center;justify-content:center" href="#/quote">무료 견적상담 신청</a></div>';
  }

  function cart() {
    var t = S.cartTotals();
    app.innerHTML = '<div class="wrap form"><h1>장바구니</h1><p class="lead">' + (S.member ? "골드 회원가가 적용된 금액입니다" : "로그인하면 회원가가 적용됩니다") + "</p>" +
      (S.cart.length ? S.cart.map(function (row) { var m = BG.MAT[row.id]; return '<div class="cart-row"><img src="' + photo(m.photo) + '" alt=""><div><p class="cn">' + esc(m.name) + '</p><p class="cs">' + esc(m.spec) + " · " + row.qty + esc(m.unit) + '</p></div><p class="cp">' + won(S.priceOf(m) * row.qty) + "원</p></div>"; }).join("") +
        '<div class="cart-sum"><div><span>정가 합계</span><span>' + won(t.list) + '원</span></div><div><span>등급 할인</span><span>-' + won(t.discount) + '원</span></div><div><span>적립 예정</span><span>' + won(t.points) + 'P</span></div><div class="tt"><span>결제 예정</span><span>' + won(t.pay) + "원</span></div></div>" +
        '<button class="btn-submit" type="button" data-act="order">주문하기</button>' : '<p class="empty">장바구니가 비어 있어요.</p><a class="btn-submit" style="display:flex;align-items:center;justify-content:center" href="#/mall">회원 자재몰 보기</a>') + "</div>";
    var o = app.querySelector('[data-act="order"]');
    if (o) o.onclick = function () { BG.toast("시안에서는 주문이 진행되지 않아요"); };
  }

  function tiers() {
    var me = S.tier();
    app.innerHTML = '<div class="wrap"><div class="form" style="max-width:none"><h1>BUILDGO 회원 등급 혜택</h1><p class="lead">등급이 오를수록 자재 단가가 내려가고 적립률이 올라갑니다</p></div>' +
      '<div class="tiers">' + D.tiers.map(function (t) { return '<div class="tier' + (me && me.id === t.id ? " me" : "") + '"><h3>' + esc(t.name) + '</h3><p class="disc">' + (t.discount ? t.discount + "%" : "0%") + "<small>자재 할인</small></p><p class=\"pts\">적립 " + t.pointRate + "%</p><p class=\"rule\">" + esc(t.rule) + "</p>" + (me && me.id === t.id ? '<span class="meb">' + esc(D.demoUser.name) + "님 현재 등급</span>" : "") + "</div>"; }).join("") + "</div>" +
      '<div class="refbox"><div><b>친구 추천 적립</b><p>' + esc(D.points.referralRule) + "</p><p>" + esc(D.points.use) + '</p></div><span class="pt">' + won(D.points.referral) + "P</span></div>" +
      (me ? '<div class="refbox" style="margin-top:12px"><div><b>' + esc(D.demoUser.name) + "님 보유 포인트</b><p>" + esc(D.demoUser.company) + '</p></div><span class="pt">' + won(D.demoUser.points) + "P</span></div>" : '<div class="more-pill"><a href="#" data-act="login">데모 로그인하고 내 등급 보기</a></div>') + "</div>";
  }

  function search(r) {
    var q = (r.query.q || "").trim();
    var ex = D.experts.filter(function (e) { return (e.name + e.service + BG.CAT[e.category].name + e.region).indexOf(q) >= 0; });
    var ms = D.materials.filter(function (m) { return (m.name + m.spec + BG.MAT_CAT[m.category].name).indexOf(q) >= 0; });
    app.innerHTML = '<div class="wrap page-top"><div class="list-head"><h1>‘' + esc(q) + "’ 검색 결과</h1><span>전문가 " + ex.length + " · 자재 " + ms.length + "</span></div>" +
      (ex.length ? '<div class="egrid">' + ex.map(expertCard).join("") + "</div>" : "") +
      (ms.length ? '<div class="pgrid" style="margin-top:40px">' + ms.map(matCard).join("") + "</div>" : "") +
      (!ex.length && !ms.length ? '<p class="empty">검색 결과가 없어요. 분야 이름(예: 인테리어, 타일)으로 찾아보세요.</p>' : "") + "</div>";
  }

  function syncHeader() {
    var n = S.cartTotals().count, b = document.getElementById("cartN");
    b.hidden = !n; b.textContent = n;
    document.getElementById("loginLabel").textContent = S.member ? "로그아웃" : "로그인";
  }

  document.addEventListener("click", function (ev) {
    var lk = ev.target.closest("[data-like]");
    if (lk) { ev.preventDefault(); var on = S.toggleLike(lk.dataset.like); lk.classList.toggle("on", on); BG.toast(on ? "찜했어요" : "찜을 해제했어요"); return; }
    var act = ev.target.closest("[data-act]");
    if (!act) return;
    if (act.dataset.act === "login") {
      ev.preventDefault();
      S.member = !S.member; S.save(); syncHeader();
      BG.toast(S.member ? D.demoUser.name + "님(골드)으로 데모 로그인했어요 — 회원가가 보입니다" : "로그아웃했어요");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    if (act.dataset.act === "menu") { location.hash = "#/experts"; }
  });
  document.querySelector("[data-search]").onsubmit = function (ev) { ev.preventDefault(); var v = this.q.value.trim(); if (v) location.hash = "#/search?q=" + encodeURIComponent(v); };
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  document.getElementById("notice").textContent = D.notice;
  document.getElementById("ftNotice").textContent = D.notice;
  document.getElementById("ftCredit").textContent = BG.credit;

  BG.router({ home: home, experts: experts, expert: expert, mall: mall, goods: goods, cases: cases, quote: quote, quotes: quotesView, cart: cart, tiers: tiers, search: search }, function (r) {
    if (r.name !== "home") { document.body.classList.remove("on-hero"); clearInterval(heroTimer); }
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === r.name || (r.name === "expert" && a.dataset.nav === "experts") || (r.name === "goods" && a.dataset.nav === "mall")); });
    syncHeader();
  });
})();
