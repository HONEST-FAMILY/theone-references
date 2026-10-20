(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, man = BG.man, photo = BG.photo;
  var S = new BG.Session("bg2");
  var app = document.getElementById("app");
  var I = {
    scrap: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chev: '<svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="m9 6 6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:currentColor;stroke:none"><path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.3l-5.2 2.8 1-5.8L3.5 9.2l5.9-.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" style="width:30px;height:30px;stroke-width:2.4"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  };
  var SUB = {
    home: [["", "홈"], ["rec", "추천"], ["cases", "시공사례"], ["photos", "현장사진"], ["pros", "전문가"], ["quote", "견적요청"]],
    store: [["", "자재몰홈"], ["cat", "카테고리"], ["best", "베스트"], ["deal", "회원특가"], ["today", "당일출고"], ["pkg", "현장패키지"], ["plan", "기획전"]],
    cases: [["", "시공사례홈"], ["interior", "인테리어"], ["design", "설계·인허가"], ["frame", "골조·철거"], ["waterproof", "방수·단열"], ["exterior", "외장·창호"]],
    pros: [["", "전문가 찾기"], ["quote", "견적 요청"], ["tiers", "회원 혜택"]]
  };

  function tierLabel() { var t = S.tier(); return t ? t.name : ""; }
  function scrapBtn(id) { return '<button type="button" class="scrap' + (S.likes.indexOf(id) >= 0 ? " on" : "") + '" data-like="' + id + '" aria-label="스크랩">' + I.scrap + "</button>"; }
  function mcard(m) {
    var t = S.tier();
    var price = t ? '<p class="special" data-pop>' + esc(t.name) + ' 회원가</p><p class="price"><span class="pct mo-ib" data-pop>' + t.discount + '%</span><span data-roll="' + m.id + '">' + won(S.priceOf(m)) + "</span></p>"
      : '<p class="special" data-pop>회원가 최대 ' + D.tiers[D.tiers.length - 1].discount + '% 할인</p><p class="price"><span data-roll="' + m.id + '">' + won(m.price) + '</span></p><button type="button" class="lock" data-act="login" data-pop>' + I.lock + "로그인하고 회원가 보기</button>";
    return '<div class="card"><div class="tw"><a class="thumb" href="#/goods/' + m.id + '"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '">' + (m.stock === "당일 출고" ? '<span class="pick">당일<br>출고</span>' : "") + "</a>" + scrapBtn(m.id) + "</div>" +
      '<a href="#/goods/' + m.id + '"><p class="brand">' + esc(BG.MAT_CAT[m.category].name) + '</p><p class="name">' + esc(m.name) + " " + esc(m.spec) + "</p>" + price + (m.stock === "당일 출고" ? '<p class="ship">오늘 14:00까지 주문 시 당일 출고</p>' : '<p class="meta">' + esc(m.stock) + " 출고 · 현장 직배송</p>") +
      '<div class="tags"><span>최소 ' + m.moq + "</span><span>세금계산서 발행</span>" + (t ? '<span class="cp">적립 ' + t.pointRate + "%</span>" : "") + "</div></a></div>";
  }
  function setSub(group, active) {
    var nav = document.getElementById("subNav");
    if (group === "home") {
      var hm = { "": "#/", rec: "#/", cases: "#/cases", photos: "#/cases", pros: "#/pros", quote: "#/quote" };
      nav.innerHTML = SUB.home.map(function (x) { return '<a href="' + hm[x[0]] + '" class="' + (x[0] === active ? "on" : "") + '">' + esc(x[1]) + "</a>"; }).join("") + '<span class="ticker"><b>4</b><em>NEW</em>석고보드</span>';
      document.querySelectorAll("[data-main]").forEach(function (a) { a.classList.toggle("on", a.dataset.main === "home"); });
      return;
    }
    var base = group === "store" ? "#/shop" : group === "cases" ? "#/cases" : "#/pros";
    nav.innerHTML = SUB[group].map(function (x) {
      var href = group === "pros" ? (x[0] === "quote" ? "#/quote" : x[0] === "tiers" ? "#/tiers" : "#/pros") : (x[0] ? base + (group === "store" ? "store" : "") + "?c=" + x[0] : base);
      if (group === "store" && x[0]) href = "#/store?c=" + x[0];
      return '<a href="' + href + '" class="' + (x[0] === active ? "on" : "") + '">' + esc(x[1]) + "</a>";
    }).join("") + (group === "store" ? '<span class="ticker"><b>6</b><em>NEW</em>단열·지붕 자재 기획전</span>' : "");
    document.querySelectorAll("[data-main]").forEach(function (a) { a.classList.toggle("on", a.dataset.main === group); });
    document.querySelectorAll("[data-tab]").forEach(function (a) { a.classList.toggle("on", a.dataset.tab === group); });
  }

  var MC = { e1: "#2337D9", e2: "#334155", e3: "#B45309", e4: "#0F766E", e5: "#7C3AED", e6: "#BE123C" };
  var BANNERS = [
    { tag: "#사업자회원", t: "골드부터 자재 6% 할인", img: "mat_m7", bg: "#E9EEFF", href: "#/tiers" },
    { tag: "#욕실리모델링", t: "욕실 방수부터 타일까지", img: "f_bath", bg: "#E5F5EE", href: "#/pro/e5" },
    { tag: "#당일출고", t: "오늘 주문, 오늘 출고", img: "mat_m1", bg: "#F6EFE6", href: "#/store?c=today" }
  ];
  var QUICK = [["#/shop", "mat-tool", "자재몰"], ["#/store?c=deal", "deal", "회원특가"], ["#/cases", "cases", "시공사례"], ["#/tiers", "referral", "포인트적립"], ["#/store?c=pkg", "pkg", "현장패키지"], ["#/quote", "quote", "견적요청"], ["#/store?c=today", "today", "당일출고"], ["#/pros", "pro", "전문가찾기"], ["#/store?c=best", "best", "베스트"], ["#/tiers", "tiers", "등급혜택"]];
  var RECS = [
    { ph: "f_living2", e: "e3", ov: "30평 아파트\n화이트 우드 시공" },
    { ph: "f_kitchen", e: "e3" }, { ph: "f_bath2", e: "e5" }, { ph: "pf_e3_2", e: "e3" },
    { ph: "f_house3", e: "e6" }, { ph: "f_draw1", e: "e1" }, { ph: "pf_e6_2", e: "e6" }
  ];
  var HOUSES = [
    { ph: "f_kitchen2", e: "e3", t: "마포 34평, 주방부터 욕실까지 화이트 우드로 바꾼 집" },
    { ph: "f_hero", e: "e2", t: "용인 2층 단독주택, 골조부터 준공까지 6개월의 기록" },
    { ph: "f_living", e: "e3", t: "합정 13평 오피스텔, 수납을 두 배로 늘린 거실" },
    { ph: "f_house2", e: "e1", t: "양평 단독주택 설계, 인허가까지 한 번에 끝낸 이야기" }
  ];
  var DEALS = [
    { id: "m7", off: 12, rate: 4.8, rv: 1284, badge: "" },
    { id: "m5", off: 9, rate: 4.7, rv: 812, badge: "" },
    { id: "m2", off: 7, rate: 4.9, rv: 2031, badge: "당일\n출고" },
    { id: "m8", off: 15, rate: 4.8, rv: 1577, badge: "당일\n출고" }
  ];
  var REVS = [
    { ph: "x_kitchen", e: "e3", t: "30평 아파트 전체 리모델링을 맡겼어요. 세 곳에서 견적을 받아 비교했는데 패키지마다 들어가는 항목이 다 적혀 있어서 고르기 쉬웠어요. 자재는 회원가로 바꿔 넣으니 처음 견적보다 내려갔고, 매일 작업 사진을 보내 주셔서 안심됐습니다." },
    { ph: "pf_e5_2", e: "e5", t: "오래된 상가 옥상 방수가 급했는데 장마 전에 끝내야 해서 걱정이 많았어요. 현장 실측 당일에 견적을 받고 3일 만에 공사가 끝났습니다. 하자보증 기간도 계약서에 적어 주셔서 믿음이 갔어요." },
    { ph: "pf_e6_2", e: "e6", t: "베란다 창호 교체를 알아보다가 실측 예약을 했어요. 동네 업체 견적보다 범위가 분명했고, 시스템창호 자재도 회원가로 함께 주문할 수 있어서 한 번에 끝났습니다." }
  ];
  var PLANS = [
    { ph: "mat_m8", ov: "단열 자재\n기획전", s: "겨울 오기 전 단열 보강", t: "단열·지붕 자재 최대 15% 할인", href: "#/store?c=insul" },
    { ph: "f_bath", ov: "현장 패키지", s: "욕실 한 번에 바꾸기", t: "30평 욕실 리모델링 자재 묶음", href: "#/store?c=pkg" },
    { ph: "mat_m1", ov: "오늘 주문\n오늘 출고", s: "급한 현장에 바로", t: "당일 출고 자재 모음", href: "#/store?c=today" },
    { ph: "", ov: "사업자 회원\n전용 혜택", s: "회원 등급 혜택", t: "골드 등급부터 자재 6% 할인", href: "#/tiers" }
  ];
  var BEST = ["m1", "m3", "m2", "m7", "m5", "m8", "m4", "m6", "m12", "m9", "m11", "m10"];
  var KW = [["석고보드", "new"], ["욕실 방수", "new"], ["강마루", "up"], ["시스템창호", "new"], ["유리섬유 단열재", "new"], ["포세린 타일", "up"], ["구조용 합판", "new"], ["옥상 방수", "new"], ["중문 교체", "up"], ["노출 콘크리트", "new"]];
  function mono2(e) { return '<span class="mono" style="background:' + (MC[e.id] || "#2337D9") + '">' + esc(BG.initial(e.name)) + "</span>"; }
  function arr() { return '<span class="arr" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></span>'; }
  function head(title, sub, href) { return '<div class="oh-h"><div><h2>' + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + '</div><a class="more" href="' + href + '">더보기</a><a class="arrlink" href="' + href + '" aria-label="' + esc(title) + ' 더보기">' + arr() + "</a></div>"; }
  function left() {
    var n = new Date(), end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), d = Math.max(0, Math.floor((end - n) / 1000));
    function z(x) { return (x < 10 ? "0" : "") + x; }
    return z(Math.floor(d / 3600)) + ":" + z(Math.floor(d % 3600 / 60)) + ":" + z(d % 60) + " 남음";
  }
  function dealCard(x) {
    var m = BG.MAT[x.id], price = Math.round(m.price * (100 - x.off) / 100 / 10) * 10;
    return '<div class="dl-card"><div class="dl-img"><a href="#/goods/' + m.id + '"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"></a><span class="timer" data-cd>' + left() + "</span>" + (x.badge ? '<span class="dl-badge" style="white-space:pre-line">' + esc(x.badge) + "</span>" : "") + scrapBtn(m.id) + "</div>" +
      '<a class="dl-info" href="#/goods/' + m.id + '"><p class="br">BUILDGO 자재몰</p><p class="nm">[회원특가] ' + esc(m.name) + " " + esc(m.spec) + '</p><p class="rate">' + I.star + "<b>" + x.rate + "</b>· 리뷰 " + won(x.rv) + '</p><p class="pr"><em>' + x.off + "%</em>" + won(price) + "<small> 외</small></p>" + (m.stock === "당일 출고" ? '<span class="tag-box">당일출고</span>' : '<span class="tag-box">현장 직배송</span>') + "</a></div>";
  }
  function bestCard(id, i) {
    var m = BG.MAT[id], t = S.tier(), off = t ? t.discount : 0, price = S.priceOf(m);
    return '<div class="bs-card"><div class="bs-img"><a href="#/goods/' + m.id + '"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"></a><span class="rank">' + (i + 1) + "</span>" + scrapBtn(m.id) + "</div>" +
      '<a class="dl-info" href="#/goods/' + m.id + '"><p class="br">' + esc(BG.MAT_CAT[m.category].name) + '</p><p class="nm">' + esc(m.name) + " " + esc(m.spec) + "</p>" + (t ? '<p class="special" data-pop>' + esc(t.name) + " 회원가</p>" : '<p class="special" data-pop>회원가 최대 10%</p>') + '<p class="pr">' + (off ? '<em class="mo-ib" data-pop>' + off + "%</em>" : "") + '<span data-roll="' + m.id + '">' + won(price) + "</span></p>" +
      (m.stock === "당일 출고" ? '<p class="ship2"><b>당일출고</b><span>오늘 14:00까지 주문 시</span></p>' : "") + "</a></div>";
  }
  function home() {
    setSub("home", "");
    var e3 = BG.EXP.e3;
    app.innerHTML = '<div class="wrap oh">' +
      '<section class="oh-hero"><a class="oh-big" href="#/pro/e3"><img src="' + photo("f_kitchen2") + '" alt="화이트 우드 주방"><div class="bc"><h2>마포 34평, 주방부터 욕실까지 화이트 우드로 바꾼 집</h2><p class="by">' + mono2(e3) + esc(e3.name) + "</p></div></a>" +
      '<a class="oh-side" href="#/tiers"><div class="sc"><small>회원 혜택</small><p>사업자 회원이라면</p><b>골드 등급부터<br>자재 6% 할인</b></div><img src="' + photo("mat_m7") + '" alt=""><span class="cnt-pill">3 / 12 +</span></a></section>' +
      '<section class="oh-banner" id="ban">' + BANNERS.map(function (b, i) { return '<a class="bn' + (i ? "" : " on") + '" href="' + b.href + '" style="background:' + b.bg + '"><div class="bt"><small>' + esc(b.tag) + "</small><b>" + esc(b.t) + '</b></div><img src="' + photo(b.img) + '" alt=""></a>'; }).join("") + '<span class="cnt-pill" id="banN">1 / 12 +</span></section>' +
      '<nav class="oh-quick" aria-label="바로가기">' + QUICK.map(function (q) { return '<a href="' + q[0] + '"><span class="qi"><img src="' + BG.icon(q[1]) + '" alt=""></span>' + esc(q[2]) + "</a>"; }).join("") + "</nav>" +
      '<section class="oh-sec">' + head("이런 시공 찾고 있나요?", "관심 가질 만한 시공 사진을 추천해 드려요", "#/cases") + '<div class="oh-photos">' + RECS.slice(0, 6).concat(RECS.slice(6)).map(function (x) { var e = BG.EXP[x.e]; return '<a class="ph-card" href="#/pro/' + e.id + '"><img loading="lazy" src="' + photo(x.ph) + '" alt="">' + (x.ov ? '<span class="ov">' + esc(x.ov) + "</span>" : "") + '<span class="who">' + mono2(e) + esc(e.name) + "</span></a>"; }).join("") + "</div></section>" +
      '<section class="oh-sec">' + head("오늘의 추천 시공사례 구경해보세요", "", "#/cases") + '<div class="oh-houses">' + HOUSES.map(function (h) { return '<a class="hs-card" href="#/pro/' + h.e + '"><div class="hs-img"><img loading="lazy" src="' + photo(h.ph) + '" alt=""></div><p>' + esc(h.t) + "</p></a>"; }).join("") + "</div></section>" +
      '<section class="oh-sec">' + head("카테고리별 자재 찾기", "", "#/shop").replace('<a class="more"', '<a class="more" style="visibility:hidden"') + '<div class="oh-cats">' +
      D.materialCategories.map(function (c) { return '<a href="#/store?c=' + c.id + '"><img src="' + BG.icon("mat-" + c.id) + '" alt="">' + esc(c.name) + "</a>"; }).join("") +
      D.categories.map(function (c) { return '<a href="#/cases?c=' + c.id + '"><img src="' + BG.icon(c.id) + '" alt="">' + esc(c.name) + "</a>"; }).join("") + "</div></section>" +
      '<section class="oh-sec">' + head("회원 특가", "", "#/store?c=deal") + '<div class="oh-deals">' + DEALS.map(dealCard).join("") + '</div><a class="btn-more" href="#/store?c=deal">회원 특가 더보기</a></section>' +
      '<section class="oh-sec">' + head("고객들의 시공 리뷰", "", "#/pros") + '<div class="oh-revs">' + REVS.map(function (r) { var e = BG.EXP[r.e]; return '<a class="rv-card" href="#/pro/' + e.id + '"><div class="rv-img"><img loading="lazy" src="' + photo(r.ph) + '" alt=""></div><div><b>BUILDGO 시공 · ' + esc(e.name) + "</b><p>" + esc(r.t) + "</p></div></a>"; }).join("") + '</div><a class="btn-more" href="#/pros">시공 전문가 찾기</a></section>' +
      '<section class="oh-sec">' + head("이번 주 기획전", "", "#/store?c=plan") + '<div class="oh-plans">' + PLANS.map(function (x) { return '<a class="pl-card" href="' + x.href + '"><div class="pl-img' + (x.ph ? "" : " blue") + '">' + (x.ph ? '<img loading="lazy" src="' + photo(x.ph) + '" alt="">' : "") + "<span>" + esc(x.ov) + "</span></div><div><small>" + esc(x.s) + "</small><b>" + esc(x.t) + "</b></div></a>"; }).join("") + '</div><a class="btn-more" href="#/store?c=plan">기획전 더보기</a></section>' +
      '<section class="oh-sec">' + head("베스트", "", "#/store?c=best") + '<div class="bs-chips" id="bsChips"><button type="button" class="on" data-bc="">전체</button>' + D.materialCategories.map(function (c) { return '<button type="button" data-bc="' + c.id + '">' + esc(c.name) + "</button>"; }).join("") + '</div><div class="oh-best" id="bsGrid"></div></section>' +
      '<section class="oh-sec oh-kw"><div class="oh-h"><div><h2>인기 검색어</h2></div></div><ol class="kw-list">' + KW.map(function (k, i) { return '<li><b>' + (i + 1) + "</b><i>" + (k[1] === "new" ? "NEW" : "▲") + '</i><a href="#/search?q=' + encodeURIComponent(k[0]) + '">' + esc(k[0]) + "</a></li>"; }).join("") + "</ol></section>" +
      "</div>";
    function best(c, anim) {
      var ids = BEST.filter(function (id) { return !c || BG.MAT[id].category === c; }).slice(0, 3);
      var g = document.getElementById("bsGrid");
      g.innerHTML = ids.map(bestCard).join("") || '<p class="empty">준비 중인 자재예요</p>';
      if (anim) BG.mo.play(g.children, "card", { stagger: 60, dur: 600, y: 20 });
    }
    best("");
    document.getElementById("bsChips").onclick = function (ev) { var b = ev.target.closest("[data-bc]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); best(b.dataset.bc, true); };
    BG.swipe(document.getElementById("ban"), function () { banHold = Date.now() + 6000; banGo(1); }, function () { banHold = Date.now() + 6000; banGo(-1); });
  }
  setInterval(function () {
    document.querySelectorAll("[data-cd]").forEach(function (el) { el.textContent = left(); });
  }, 1000);
  var banHold = 0;
  function banGo(dir) {
    var box = document.getElementById("ban"); if (!box) return;
    var bs = box.querySelectorAll(".bn"), i = 0;
    bs.forEach(function (b, k) { if (b.classList.contains("on")) i = k; });
    var j = (i + dir + bs.length) % bs.length;
    BG.slide(bs[i], bs[j], dir, 360, "cubic-bezier(.2,0,.2,1)");
    bs[i].classList.remove("on"); bs[j].classList.add("on");
    BG.mo.play([bs[j].querySelector(".bt small")], "up", { y: 10, delay: 160, dur: 600 });
    BG.mo.play([bs[j].querySelector(".bt b")], "lines", { delay: 220, dur: 700 });
    BG.mo.play([bs[j].querySelector("img")], "settle", { s: 1.15, dur: 1400 });
    document.getElementById("banN").textContent = (j + 1) + " / 12 +";
  }
  setInterval(function () { if (BG.reduced() || document.hidden || Date.now() < banHold) return; banGo(1); }, 4800);
  function subH() { var w = document.querySelector(".sub-wrap"); if (w) document.documentElement.style.setProperty("--subh", w.offsetHeight + "px"); }
  subH();
  window.addEventListener("resize", subH);
  BG.onScrollDir(function (d, y) { document.body.classList.toggle("nav-up", d > 0 && y > 160); });

  function storeHome() {
    setSub("store", "");
    var heroes = [
      { img: "x_kitchen", t: "주방 리모델링\n자재부터 시공까지", s: "전문가 견적 비교와 자재 회원가를 한 번에", href: "#/pros" },
      { img: "hero_site", t: "현장 하나로 묶어\n자재를 한 번에 주문", s: "보드·합판·구조재 대량 주문", href: "#/store?c=pkg", chip: D.materials[1] },
      { img: "cat_waterproof", t: "장마 전에\n옥상 방수 점검", s: "방수 전문가 무료 현장 실측", href: "#/pro/e5" }
    ];
    var row2 = [["#/store?c=deal", "deal", "회원특가"], ["#/store?c=best", "best", "베스트"], ["#/store?c=today", "today", "당일출고"], ["#/store?c=pkg", "pkg", "현장패키지"], ["#/quote", "quote", "견적 요청"], ["#/tiers", "tiers", "등급 혜택"], ["#/cases", "cases", "시공사례"], ["#/pros", "pro", "전문가 찾기"], ["#/store?c=tool", "tool", "공구·소모품"], ["#/tiers", "referral", "추천 적립"]];
    var cards = D.materials.map(mcard);
    cards.splice(3, 0, '<a class="dark-card" href="#/pros"><img loading="lazy" src="' + photo("pf_e3_2") + '" alt=""><div class="dc"><small>시공 맡기기</small><b>인테리어 전문가 견적 비교</b><p>면허·사업자·보험 확인한 전문가</p><span class="go">' + I.right + "</span></div></a>");
    app.innerHTML = '<div class="wrap"><section class="heroes">' + heroes.map(function (h) {
      return '<a class="hcard" href="' + h.href + '"><img src="' + photo(h.img) + '" alt=""><div class="hc"><h2>' + esc(h.t) + "</h2><p>" + esc(h.s) + "</p>" +
        (h.chip ? '<div class="hchip"><img src="' + photo(h.chip.photo) + '" alt=""><div><small>현장패키지 구성</small><span>' + esc(h.chip.name) + "</span><b>" + won(h.chip.price) + "원~</b></div></div>" : "") + "</div></a>";
    }).join("") + "</section>" +
      '<div class="pager pc-only"><div class="track"><i></i></div><button type="button" aria-label="이전">' + I.left + '</button><button type="button" aria-label="다음">' + I.right + "</button></div>" +
      '<section class="sec"><div class="sec-title"><h2>카테고리</h2></div><div class="cats">' +
      D.materialCategories.map(function (c) { return '<a class="cat" href="#/store?c=' + c.id + '"><img src="' + BG.icon("mat-" + c.id) + '" alt="">' + esc(c.name) + "</a>"; }).join("") +
      D.categories.map(function (c) { return '<a class="cat" href="#/cases?c=' + c.id + '"><img src="' + BG.icon(c.id) + '" alt="">' + esc(c.name) + "</a>"; }).join("") + "</div>" +
      '<div class="cat2">' + row2.map(function (x) { return '<a href="' + x[0] + '"><span class="ib"><img src="' + BG.icon(x[1]) + '" alt=""></span>' + esc(x[2]) + "</a>"; }).join("") + "</div></section>" +
      '<section class="sec"><div class="sec-title"><h2>추천 자재</h2><a href="#/store">더보기</a></div><div class="grid4">' + cards.join("") + "</div></section></div>";
  }

  function store(r) {
    var c = r.query.c || "";
    setSub("store", c);
    var list = D.materials.filter(function (m) {
      if (!c || c === "best" || c === "deal" || c === "pkg" || c === "plan") return true;
      if (c === "today") return m.stock === "당일 출고";
      if (c === "cat") return true;
      return m.category === c;
    });
    var title = { best: "베스트", deal: "회원특가", today: "당일출고", pkg: "현장패키지", plan: "기획전", cat: "카테고리" }[c] || (BG.MAT_CAT[c] ? BG.MAT_CAT[c].name : "전체 자재");
    app.innerHTML = '<div class="wrap"><div class="crumb">자재몰 ' + I.chev + "<b>" + esc(title) + "</b></div>" +
      '<div class="chipbar"><a href="#/store" class="' + (!c ? "on" : "") + '">전체</a>' + D.materialCategories.map(function (x) { return '<a href="#/store?c=' + x.id + '" class="' + (c === x.id ? "on" : "") + '">' + esc(x.name) + "</a>"; }).join("") + "</div>" +
      '<p class="meta" style="margin:0 0 14px">' + (S.member ? esc(tierLabel()) + " 회원가 적용 · " : "로그인하면 회원가가 보여요 · ") + "전체 " + list.length + "개</p>" +
      '<div class="grid4">' + list.map(mcard).join("") + "</div></div>";
  }

  function goods(r) {
    var m = BG.MAT[r.id] || D.materials[0];
    setSub("store", m.category);
    var t = S.tier(), price = S.priceOf(m);
    var shots = [m.photo].concat(D.materials.filter(function (x) { return x.id !== m.id && x.category === m.category; }).map(function (x) { return x.photo; })).slice(0, 5);
    app.innerHTML = '<div class="wrap"><div class="crumb">' + esc(BG.MAT_CAT[m.category].name) + " " + I.chev + " <b>" + esc(m.name) + "</b></div>" +
      '<div class="prod"><div class="prod-thumbs">' + shots.map(function (k, i) { return '<button type="button" class="' + (i ? "" : "on") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div>" +
      '<div class="prod-main"><img id="pimg" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '"><span class="only">회원전용</span></div>' +
      '<div class="prod-info"><p class="p-brand">BUILDGO 자재몰 · ' + esc(BG.MAT_CAT[m.category].name) + '</p><h1 class="p-title">' + esc(m.name) + " " + esc(m.spec) + "</h1>" +
      '<p class="p-review" style="color:#828C94;font-weight:500">판매 단위 ' + esc(m.unit) + ' · 최소 주문 ' + m.moq + '</p>' +
      (t ? '<p class="p-was"><span class="pct">' + t.discount + "%</span><s>" + won(m.price) + '원</s></p><p class="p-now">' + won(m.price) + '<small>원</small><span class="badge">정가</span></p><div class="p-member"><p><b>' + won(price) + "<small>원</small></b><span>" + esc(t.name) + ' 회원가</span></p><button type="button" class="btn-ghost" data-act="login">로그아웃</button></div>'
        : '<p class="p-now" style="margin-top:18px">' + won(m.price) + '<small>원</small></p><div class="p-member"><p style="margin:0;color:#828C94;font-size:13px">로그인하면 등급별 회원가가 보여요</p><button type="button" class="btn-ghost" data-act="login">회원가 보기 ↓</button></div>') +
      '<div class="p-box">회원 등급이 오를수록 단가가 내려가요<small>일반 0% · 실버 3% · 골드 6% · VIP 10%</small></div>' +
      '<a class="p-banner" href="#/pros">이 자재로 시공할 전문가 견적도 함께 받기 ' + I.chev + "</a>" +
      '<dl class="p-rows"><div class="p-row"><dt>혜택</dt><dd><b>' + (t ? won(S.pointsOf(price * m.moq)) + "P" : "로그인 후") + "</b> 적립 예정 (최소 주문 기준)<br>추천 적립: 추천한 회원 첫 구매 시 " + won(D.points.referral) + 'P</dd></div><div class="p-row"><dt>배송</dt><dd><b>' + esc(m.stock) + '</b> · 현장 직배송<br><small>일부 지역은 출고 일정이 달라질 수 있어요</small></dd></div></dl>' +
      '<p class="p-eta">단위 <b>' + esc(m.unit) + "</b> · 최소 주문 <b>" + m.moq + "</b></p>" +
      '<select class="opt" aria-label="규격"><option>' + esc(m.spec) + '</option></select><div class="p-qty"><span>수량</span><div><button type="button" data-q="-1" aria-label="빼기">−</button><input id="q" value="' + m.moq + '" inputmode="numeric" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">+</button></div></div>' +
      '<div class="p-sum"><span>주문금액</span><b id="sum"></b></div><div class="p-btns"><a class="b-pkg" href="#/quote">현장패키지</a><button type="button" class="b-cart" data-act="cart">장바구니</button><button type="button" class="b-buy" data-act="buy">바로구매</button></div></div></div></div>' +
      '<nav class="p-tabs"><a class="on" href="#info">상품정보</a><a href="#info">등급별 가격</a><a href="#info">배송/환불</a><a href="#info">추천</a></nav>' +
      '<div class="wrap"><div class="p-body" id="info"><div class="sec-title"><h2>등급별 회원가</h2></div><table class="tier-table"><thead><tr><th>등급</th><th>할인</th><th>' + esc(m.unit) + ' 단가</th><th>적립</th><th>조건</th></tr></thead><tbody>' +
      D.tiers.map(function (x) { return '<tr class="' + (t && t.id === x.id ? "me" : "") + '"><td>' + esc(x.name) + "</td><td>" + x.discount + "%</td><td>" + won(Math.round(m.price * (100 - x.discount) / 100 / 10) * 10) + "원</td><td>" + x.pointRate + "%</td><td>" + esc(x.rule) + "</td></tr>"; }).join("") + "</tbody></table></div></div>";
    function sum() { var q = Math.max(1, parseInt(document.getElementById("q").value, 10) || 1); document.getElementById("sum").textContent = won(price * q) + "원"; }
    sum();
    app.querySelector(".p-qty").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var el = document.getElementById("q"); el.value = Math.max(1, (parseInt(el.value, 10) || 1) + parseInt(b.dataset.q, 10)); sum(); };
    document.getElementById("q").oninput = sum;
    app.querySelector(".prod-thumbs").onclick = function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("pimg").src = photo(b.dataset.shot); };
    app.querySelector('[data-act="cart"]').onclick = function () { S.addCart(m.id, parseInt(document.getElementById("q").value, 10) || 1); sync(); BG.toast("장바구니에 담았어요"); };
    app.querySelector('[data-act="buy"]').onclick = function () { S.addCart(m.id, parseInt(document.getElementById("q").value, 10) || 1); location.hash = "#/cart"; };
  }

  function proCard(e) {
    var c = BG.CAT[e.category];
    return '<a class="pro" href="#/pro/' + e.id + '"><div class="pro-photos">' + e.portfolio.slice(0, 3).concat(e.portfolio.length < 3 ? [e.portfolio[0]] : []).slice(0, 3).map(function (p) { return '<img loading="lazy" src="' + photo(p.photo) + '" alt="' + esc(p.title) + '">'; }).join("") + "</div>" +
      '<div class="pro-head"><span class="mono">' + esc(BG.initial(e.name)) + "</span><div><b>" + esc(e.name) + "</b><span>" + esc(c.name) + " · " + esc(e.region) + "</span></div></div>" +
      '<div class="pro-tags"><span>★ ' + e.rating + " · 후기 " + e.reviews + "</span><span>경력 " + e.years + "년</span><span>평균 응답 " + e.responseHours + "시간</span>" + (e.verified.insurance ? "<span>보험 가입</span>" : "") + "</div>" +
      '<div class="pro-cta"><b>' + (e.startPrice ? man(e.startPrice) + "부터" : "현장 실측 후 견적") + '</b><span class="btn-blue">견적 요청</span></div></a>';
  }
  function pros() {
    setSub("pros", "");
    app.innerHTML = '<div class="wrap"><div class="crumb">시공 맡기기 ' + I.chev + "<b>전문가 찾기</b></div>" +
      '<div class="chipbar"><a class="on" href="#/pros">전체</a>' + D.categories.map(function (c) { return '<a href="#/cases?c=' + c.id + '">' + esc(c.name) + "</a>"; }).join("") + "</div>" +
      '<div class="pro-list">' + D.experts.map(proCard).join("") + "</div></div>";
  }
  function pro(r) {
    var e = BG.EXP[r.id] || D.experts[0];
    setSub("pros", "");
    var shots = e.portfolio.map(function (p) { return p.photo; });
    app.innerHTML = '<div class="wrap"><div class="crumb">시공 맡기기 ' + I.chev + " " + esc(BG.CAT[e.category].name) + " " + I.chev + " <b>" + esc(e.name) + "</b></div>" +
      '<div class="prod"><div class="prod-thumbs">' + shots.map(function (k, i) { return '<button type="button" class="' + (i ? "" : "on") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div>" +
      '<div class="prod-main"><img id="pimg" src="' + photo(shots[0]) + '" alt=""></div>' +
      '<div class="prod-info"><p class="p-brand">' + esc(e.name) + " · " + esc(e.region) + '</p><h1 class="p-title">' + esc(e.service) + '</h1><p class="p-review">' + I.star + " " + e.rating + ' <span style="color:#828C94;font-weight:500">후기 ' + e.reviews + "개 · 평균 응답 " + e.responseHours + "시간</span></p>" +
      '<p class="p-now" style="margin-top:18px">' + (e.startPrice ? man(e.startPrice) : "현장 견적") + '<small>' + (e.startPrice ? "부터" : "") + "</small></p>" +
      '<div class="p-box">' + [e.verified.license ? e.verified.license + " 면허 확인" : "", e.verified.business ? "사업자 확인" : "", e.verified.insurance ? "보험 가입" : ""].filter(Boolean).join(" · ") + "<small>BUILDGO가 서류를 확인했어요. 계약은 고객과 전문가가 직접 맺습니다.</small></div>" +
      '<a class="p-banner" href="#/store">필요한 자재는 회원가로 함께 준비하기 ' + I.chev + "</a>" +
      '<select class="opt" id="pk" aria-label="패키지">' + e.packages.map(function (p, i) { return '<option value="' + i + '">' + esc(p.tier) + " · " + (p.price == null ? "현장 견적" : man(p.price)) + (p.days ? " · " + p.days + "일" : "") + "</option>"; }).join("") + "</select>" +
      '<p class="p-eta" id="pkItems">' + esc(e.packages[0].items.join(" · ")) + "</p>" +
      '<div class="p-btns" style="grid-template-columns:1fr 1fr;margin-top:16px"><button type="button" class="b-cart" data-act="ask">상담하기</button><a class="b-buy" href="#/quote?e=' + e.id + '">견적 요청</a></div></div></div></div>' +
      '<nav class="p-tabs"><a class="on" href="#rv">후기<span>' + e.reviews + '</span></a><a href="#rv">패키지</a><a href="#rv">시공사례</a></nav>' +
      '<div class="wrap"><div class="p-body" id="rv"><div class="sec-title"><h2>고객 후기</h2></div>' + e.reviewsSample.map(function (v) { return '<div class="qrow"><b>' + "★".repeat(v.rating) + " " + esc(v.author) + "</b><span>" + esc(v.text) + "</span></div>"; }).join("") + "</div></div>";
    document.getElementById("pk").onchange = function () { document.getElementById("pkItems").textContent = e.packages[this.value].items.join(" · "); };
    app.querySelector(".prod-thumbs").onclick = function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("pimg").src = photo(b.dataset.shot); };
    app.querySelector('[data-act="ask"]').onclick = function () { BG.toast("상담 요청을 견적함에 담았어요"); };
  }

  function cases(r) {
    var c = r.query.c || "";
    setSub("cases", c);
    var list = [];
    D.experts.forEach(function (e) { if (!c || e.category === c) e.portfolio.forEach(function (p) { list.push({ p: p, e: e }); }); });
    app.innerHTML = '<div class="wrap"><div class="crumb">시공사례 ' + I.chev + "<b>" + (c ? esc(BG.CAT[c].name) : "전체") + '</b></div><p class="meta" style="margin:0 0 16px">' + list.length + "개의 시공사례 · 사진은 예시</p>" +
      '<div class="feed">' + list.map(function (x) { return '<a href="#/pro/' + x.e.id + '"><span class="thumb"><img loading="lazy" src="' + photo(x.p.photo) + '" alt=""></span><p>' + esc(x.p.title) + "</p><span>" + esc(x.e.name) + "</span></a>"; }).join("") + "</div></div>";
  }

  function quote(r) {
    setSub("pros", "quote");
    var pre = BG.EXP[r.query.e];
    var st = { cat: pre ? pre.category : "", size: "", budget: "" };
    app.innerHTML = '<div class="wrap"><form class="form" id="f" novalidate><h1>견적 요청</h1><p class="lead">' + (pre ? esc(pre.name) + "에게 보낼 견적 요청이에요" : "내용을 남기면 맞는 전문가 3곳의 견적을 비교할 수 있어요") + "</p>" +
      '<div class="fset"><p>어떤 공사인가요?</p><div class="choices" data-k="cat">' + D.categories.map(function (c) { return '<button type="button" data-v="' + c.id + '" class="' + (st.cat === c.id ? "on" : "") + '">' + esc(c.name) + "</button>"; }).join("") + "</div></div>" +
      '<div class="fset"><p>면적</p><div class="choices" data-k="size">' + ["20평 미만", "20~30평", "30~40평", "40평 이상"].map(function (x) { return '<button type="button" data-v="' + x + '">' + x + "</button>"; }).join("") + "</div></div>" +
      '<div class="fset"><p>예산</p><div class="choices" data-k="budget">' + ["500만원 미만", "500~2,000만원", "2,000~5,000만원", "5,000만원 이상", "아직 모름"].map(function (x) { return '<button type="button" data-v="' + x + '">' + x + "</button>"; }).join("") + "</div></div>" +
      '<div class="fset"><label for="nm">이름</label><input class="input" id="nm" autocomplete="name"></div><div class="fset"><label for="ph">휴대폰</label><input class="input" id="ph" inputmode="tel" autocomplete="tel"></div>' +
      '<p class="err" id="er"></p><button class="btn-full" type="submit">견적 요청하기</button></form></div>';
    app.querySelectorAll(".choices").forEach(function (g) {
      g.onclick = function (ev) { var b = ev.target.closest("button"); if (!b) return; g.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); st[g.dataset.k] = b.dataset.v; };
    });
    document.getElementById("f").onsubmit = function (ev) {
      ev.preventDefault();
      var miss = [];
      if (!st.cat) miss.push("공사 종류"); if (!st.size) miss.push("면적"); if (!st.budget) miss.push("예산");
      if (!document.getElementById("nm").value.trim()) miss.push("이름");
      if (!/^0\d{8,10}$/.test(document.getElementById("ph").value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("er").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ cat: st.cat, size: st.size, budget: st.budget, to: pre ? pre.name : "전문가 3곳 추천" });
      app.innerHTML = '<div class="wrap done"><div class="ok">' + I.check + "</div><h1>견적 요청을 보냈어요</h1><p>전문가들이 보낸 견적은 견적함에 모입니다.</p><a class=\"btn-blue\" href=\"#/quotes\">견적함 보기</a></div>";
    };
  }
  function quotes() {
    setSub("pros", "");
    app.innerHTML = '<div class="wrap"><div class="form"><h1>견적함</h1><p class="lead">보낸 요청과 받은 견적을 한곳에서 확인해요</p>' +
      (S.quotes.length ? S.quotes.map(function (q) { return '<div class="qrow"><b>' + esc(BG.CAT[q.cat] ? BG.CAT[q.cat].name : "공사") + " · " + esc(q.size) + "</b><span>" + esc(q.budget) + " · " + esc(q.to) + "</span></div>"; }).join("") : '<p class="empty">아직 보낸 견적 요청이 없어요</p>') +
      '<a class="btn-full" href="#/quote">견적 요청하기</a></div></div>';
  }
  function cart() {
    setSub("store", "");
    var t = S.cartTotals();
    app.innerHTML = '<div class="wrap"><div class="form"><h1>장바구니</h1><p class="lead">' + (S.member ? esc(tierLabel()) + " 회원가가 적용됐어요" : "로그인하면 회원가가 적용돼요") + "</p>" +
      (S.cart.length ? S.cart.map(function (row) { var m = BG.MAT[row.id]; return '<div class="cart-line"><img src="' + photo(m.photo) + '" alt=""><div>' + esc(m.name) + "<small>" + esc(m.spec) + " · " + row.qty + esc(m.unit) + "</small></div><b>" + won(S.priceOf(m) * row.qty) + "원</b></div>"; }).join("") +
        '<div class="summary"><div><span>정가</span><span>' + won(t.list) + '원</span></div><div><span>등급 할인</span><span>-' + won(t.discount) + '원</span></div><div><span>적립 예정</span><span>' + won(t.points) + 'P</span></div><div class="t"><span>결제 예정</span><span>' + won(t.pay) + '원</span></div></div><button class="btn-full" type="button" data-act="order">주문하기</button>'
        : '<p class="empty">장바구니가 비었어요</p><a class="btn-full" href="#/">자재 보러 가기</a>') + "</div></div>";
    var o = app.querySelector('[data-act="order"]'); if (o) o.onclick = function () { BG.toast("주문서를 준비하고 있어요"); };
  }
  function tiers() {
    setSub("pros", "tiers");
    var me = S.tier();
    app.innerHTML = '<div class="wrap"><div class="form" style="max-width:none"><h1>회원 등급 혜택</h1><p class="lead">등급이 오를수록 자재 단가가 내려가고 적립률이 올라가요</p></div><div class="tier-cards">' +
      D.tiers.map(function (x) { return '<div class="tcard' + (me && me.id === x.id ? " me" : "") + '"><b>' + esc(x.name) + '</b><p class="d">' + x.discount + "%</p><p>자재 할인 · 적립 " + x.pointRate + "%</p><p>" + esc(x.rule) + "</p>" + (me && me.id === x.id ? '<p style="color:#2337D9;font-weight:700">' + esc(D.demoUser.name) + "님 현재 등급 · " + won(D.demoUser.points) + "P</p>" : "") + "</div>"; }).join("") +
      '</div><div class="summary" style="margin-top:20px"><div><b>추천 적립 ' + won(D.points.referral) + "P</b></div><div><span>" + esc(D.points.referralRule) + "</span></div><div><span>" + esc(D.points.use) + "</span></div></div>" +
      (me ? "" : '<button class="btn-full" type="button" data-act="login" style="max-width:360px">데모 로그인하고 내 등급 보기</button>') + "</div>";
  }
  function search(r) {
    var q = (r.query.q || "").trim();
    setSub("store", "");
    var ms = D.materials.filter(function (m) { return (m.name + m.spec + BG.MAT_CAT[m.category].name).indexOf(q) >= 0; });
    var es = D.experts.filter(function (e) { return (e.name + e.service + BG.CAT[e.category].name).indexOf(q) >= 0; });
    app.innerHTML = '<div class="wrap"><div class="crumb">검색 ' + I.chev + "<b>‘" + esc(q) + "’</b></div>" +
      (es.length ? '<div class="sec-title"><h2>전문가 ' + es.length + '</h2></div><div class="pro-list">' + es.map(proCard).join("") + "</div>" : "") +
      (ms.length ? '<div class="sec-title" style="margin-top:36px"><h2>자재 ' + ms.length + '</h2></div><div class="grid4">' + ms.map(mcard).join("") + "</div>" : "") +
      (!es.length && !ms.length ? '<p class="empty">검색 결과가 없어요. ‘타일’, ‘인테리어’처럼 찾아보세요</p>' : "") + "</div>";
  }

  function sync() {
    var n = S.cartTotals().count, b = document.getElementById("cartN");
    b.hidden = !n; b.textContent = n;
    document.getElementById("loginLink").textContent = S.member ? "로그아웃" : "로그인";
  }
  document.addEventListener("click", function (ev) {
    var lk = ev.target.closest("[data-like]");
    if (lk) { ev.preventDefault(); var on = S.toggleLike(lk.dataset.like); lk.classList.toggle("on", on); BG.toast(on ? "스크랩했어요" : "스크랩을 취소했어요"); return; }
    var a = ev.target.closest("[data-act]");
    if (!a) return;
    if (a.dataset.act === "login") { ev.preventDefault(); S.member = !S.member; S.save(); sync(); BG.toast(S.member ? D.demoUser.name + "님(골드)으로 로그인했어요 — 회원가가 보여요" : "로그아웃했어요"); window.dispatchEvent(new HashChangeEvent("hashchange")); }
    if (a.dataset.act === "promo-close") document.getElementById("promo").classList.add("off");
    if (a.dataset.act === "appbar-close") document.getElementById("appbar").classList.add("off");
    if (a.dataset.act === "app") BG.toast("앱 출시 소식을 알려 드릴게요");
    if (a.dataset.act === "drawer") location.hash = "#/pros";
  });
  document.querySelector("[data-search]").onsubmit = function (ev) { ev.preventDefault(); var v = this.q.value.trim(); if (v) location.hash = "#/search?q=" + encodeURIComponent(v); };
  document.getElementById("ftCredit").textContent = BG.credit;
  var MOTION = [
    [".oh-big img", "settle", { s: 1.12, dur: 1800 }],
    [".oh-big h2", "lines", { delay: 220 }],
    [".oh-big .by", "up", { y: 12, delay: 520 }],
    [".oh-side", "up", { y: 30, delay: 260, dur: 900 }],
    ["#ban .bn.on small", "up", { y: 10, delay: 160 }],
    ["#ban .bn.on b", "lines", { delay: 220 }],
    [".oh-quick > a", "pop", { stagger: 35, delay: 300 }],
    [".oh-h h2, .crumb, .form h1, .done h1", "lines", {}],
    [".oh-h p, .form .lead", "lines", { lag: 120, dur: 800 }],
    [".oh-h .more", "up", { y: 10, lag: 200 }],
    [".ph-card", "side", { x: 56, stagger: 60 }],
    [".hs-card, .rv-card, .pl-card, .bs-card, .card", "card", { stagger: 80, max: 4 }],
    [".oh-cats > a", "pop", { stagger: 28, max: 12 }],
    [".dl-card", "card", { stagger: 80, max: 4, inner: [[".pr em", "count", 250, { dur: 900 }]] }],
    [".bs-chips button", "up", { y: 10, stagger: 30, max: 8 }],
    [".kw-list li", "up", { y: 14, stagger: 40, max: 10 }],
    [".btn-more", "up", { y: 12 }]
  ];
  BG.router({ home: home, shop: storeHome, store: store, goods: goods, pros: pros, pro: pro, cases: cases, quote: quote, quotes: quotes, cart: cart, tiers: tiers, search: search }, function (r) { sync(r); BG.mo.scan(app, MOTION); });
})();
