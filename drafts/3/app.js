(function () {
  var D = BG.data, esc = BG.esc, won = BG.won, man = BG.man, photo = BG.photo;
  var S = new BG.Session("bg3");
  var app = document.getElementById("app");
  var I = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" style="width:12px;height:12px"><path d="m9 6 6 6-6 6"/></svg>'
  };
  var CAT_ICON = {
    all: '<svg viewBox="0 0 32 32"><rect x="7" y="7" width="7" height="7" rx="1.5"/><rect x="18" y="7" width="7" height="7" rx="1.5"/><rect x="7" y="18" width="7" height="7" rx="1.5"/><rect x="18" y="18" width="7" height="7" rx="1.5"/></svg>'
  };

  function stars(n) { var r = Math.round(n); return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r); }
  var THUMB = {
    e1: { em: "평면 3안 비교", b: "주택 설계\n<span>인허가까지</span>" },
    e2: { em: "무료 현장 실측", b: "신축 골조\n공정표대로" },
    e3: { em: "30평 기준", b: "아파트 전체\n리모델링", i: "디자인부터 준공 청소까지" },
    e4: { em: "점검 리포트 제공", b: "보일러\n배관 교체", i: "전기 증설까지" },
    e5: { em: "하자보증 3년", b: "옥상·욕실\n방수", i: "외단열까지 한 번에" },
    e6: { em: "실측 당일 견적", b: "시스템창호\n중문 교체" }
  };
  function thumbText(t) { return '<span class="tt">' + (t.em ? "<em>" + t.em + "</em>" : "") + "<b>" + t.b + "</b>" + (t.i ? "<i>" + t.i + "</i>" : "") + "</span>"; }
  function heartBtn(id) { return '<button type="button" class="heart' + (S.likes.indexOf(id) >= 0 ? " on" : "") + '" data-like="' + id + '" aria-label="찜">' + I.heart + "</button>"; }
  function gig(e) {
    var minPrice = e.packages.filter(function (p) { return p.price; }).map(function (p) { return p.price; })[0];
    return '<div class="gig"><div class="gimg th th-' + e.id + '"><a href="#/gig/' + e.id + '"><img loading="lazy" src="' + photo(e.portfolio[0].photo) + '" alt="' + esc(e.portfolio[0].title) + '">' + thumbText(THUMB[e.id]) + "</a>" + heartBtn(e.id) + "</div>" +
      '<a href="#/gig/' + e.id + '">' + (e.verified.license ? '<span class="gtag">검증</span>' : "") + '<p class="gtitle">' + esc(e.service) + '</p><p class="grate"><span class="st">★</span><b>' + e.rating + "</b> (" + e.reviews + ')</p><p class="gprice">' + (minPrice ? won(minPrice) + "원~" : "현장 견적") + '</p><p class="gseller"><span class="mono">' + esc(BG.initial(e.name)) + "</span>" + esc(e.name) + "</p></a></div>";
  }
  function mat(m) {
    var t = S.tier();
    return '<div class="gig"><div class="gimg th th-mat"><a href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.photo) + '" alt="' + esc(m.name) + '">' + thumbText({ em: m.stock, b: esc(m.name) }) + "</a>" + heartBtn(m.id) + '</div><a href="#/item/' + m.id + '"><span class="gtag" style="background:#2337D9">회원전용</span><p class="gtitle">' + esc(m.name) + " " + esc(m.spec) + '</p><p class="grate">' + esc(BG.MAT_CAT[m.category].name) + " · " + esc(m.stock) + "</p>" +
      '<p class="gprice">' + (t ? won(S.priceOf(m)) + "원<s>" + won(m.price) + "원</s>" : won(m.price) + '원 <span class="lock">· 회원가 보기</span>') + '</p><p class="gseller"><span class="mono" style="background:#212224">B</span>BUILDGO 자재몰</p></a></div>';
  }
  function setGnb(active) {
    document.body.classList.toggle("sub", active !== "home");
    document.getElementById("gnb").innerHTML = '<a href="#/category" class="' + (active === "all" ? "on" : "") + '">전체</a>' +
      D.categories.map(function (c) { return '<a href="#/category?c=' + c.id + '" class="' + (active === c.id ? "on" : "") + '">' + esc(c.name) + "</a>"; }).join("") +
      '<span class="right"><a href="#/mall">회원 자재몰</a><a href="#/tiers">등급 혜택</a><a href="#/join">전문가 등록</a></span>';
    document.querySelectorAll("[data-tab]").forEach(function (a) { a.classList.toggle("on", a.dataset.tab === active || (active !== "home" && D.categories.some(function (c) { return c.id === active; }) && a.dataset.tab === "category")); });
  }

  var SLIDES = [
    { bg: "#FFE5CF", art: ["mall", "mat-tool", "mat-board"], t: "회원 자재몰<br>회원가로 바로 확인", s: "골드 등급부터 시작해요", href: "#/mall" },
    { bg: "#DCE6FF", art: ["frame", "design", "mat-insul"], t: "집 짓기 시작할 때<br>설계부터 시공까지", s: "전문가 패키지 비교하기", href: "#/category?c=design" },
    { bg: "#EADFFF", art: ["waterproof", "exterior", "mat-window"], t: "장마 오기 전에<br>옥상 방수 점검", s: "실측 후 견적을 받아요", href: "#/gig/e5" }
  ];
  var promoAt = 0, promoLock = 0, promoHold = 0, promoT = 0;
  function promoMark(j) {
    var box = document.getElementById("promo"); if (!box) return;
    promoAt = j;
    box.querySelectorAll(".pslide").forEach(function (x, k) { x.classList.toggle("on", k === j); x.setAttribute("aria-hidden", k === j ? "false" : "true"); });
    box.style.setProperty("--n1", SLIDES[(j + 1) % SLIDES.length].bg);
    box.style.setProperty("--n2", SLIDES[(j + 2) % SLIDES.length].bg);
    document.getElementById("promoPg").innerHTML = "<b>" + (j + 1) + "</b> / " + SLIDES.length + " ›";
  }
  function promoGo() {
    var box = document.getElementById("promo"); if (!box) return;
    var tr = box.querySelector(".ptrack"), j = (promoAt + 1) % SLIDES.length;
    if (tr.scrollWidth > tr.clientWidth + 4) { promoLock = Date.now() + 900; tr.scrollTo({ left: j * tr.clientWidth, behavior: BG.reduced() ? "auto" : "smooth" }); }
    promoMark(j);
  }
  setInterval(function () { if (!BG.reduced() && !document.hidden && Date.now() > promoHold) promoGo(); }, 4500);
  document.addEventListener("scroll", function (ev) {
    var t = ev.target; if (!t.classList || !t.classList.contains("ptrack")) return;
    if (Date.now() > promoLock) promoHold = Date.now() + 6000;
    clearTimeout(promoT);
    promoT = setTimeout(function () { var j = Math.round(t.scrollLeft / t.clientWidth); if (j !== promoAt) promoMark(j); }, 120);
  }, true);
  function home() {
    setGnb("home");
    var bands = [
      { t: "<mark>리모델링</mark>할 때<br>많이 찾아요", cols: [["인테리어", D.experts[2]], ["창호·중문", D.experts[5]], ["배관·전기", D.experts[3]], ["욕실 방수", D.experts[4]]] },
      { t: "<mark>집 짓기</mark> 시작할 때<br>많이 찾아요", cols: [["설계·인허가", D.experts[0]], ["골조·철거", D.experts[1]], ["방수·단열", D.experts[4]], ["외장·창호", D.experts[5]]] }
    ];
    var matsBand = { t: "<mark>현장 소장님</mark>이<br>많이 찾아요", cols: [["보드·합판", BG.MAT.m1], ["구조재·철물", BG.MAT.m3], ["단열·지붕", BG.MAT.m8], ["타일·바닥재", BG.MAT.m5]] };
    var cats = D.categories.map(function (c) { return '<a href="#/category?c=' + c.id + '"><span class="ci"><img src="' + BG.icon(c.id) + '" alt="">' + "</span>" + esc(c.name) + "</a>"; }).join("") +
      '<a href="#/mall"><span class="bd">회원가</span><span class="ci"><img src="' + BG.icon("mall") + '" alt="">' + "</span>회원 자재몰</a>" +
      '<a href="#/tiers"><span class="ci"><img src="' + BG.icon("tiers") + '" alt="">' + "</span>등급 혜택</a>" +
      '<a href="#/request"><span class="bd">무료</span><span class="ci"><img src="' + BG.icon("quote") + '" alt="">' + "</span>견적 요청</a>" +
      '<a href="#/category"><span class="ci">' + CAT_ICON.all + "</span>전체보기</a>";
    var mchips = [["욕실", "waterproof"], ["창호", "exterior"], ["인테리어", "interior"], ["석고보드", "mat-board"], ["단열재", "mat-insul"]].map(function (k) { return '<a href="#/search?q=' + encodeURIComponent(k[0]) + '"><img src="' + BG.icon(k[1]) + '" alt="">' + esc(k[0]) + "</a>"; }).join("");
    var verified = D.experts.filter(function (e) { return e.rating >= 4.8; });
    promoAt = 0;
    app.innerHTML = '<div class="top"><div class="wrap top-in"><section class="hero"><div class="hero-copy"><h1>설계부터 시공까지,<br>딱 맞는 전문가를 찾아보세요</h1>' +
      '<form class="big-search" data-search><input type="search" name="q" placeholder="어떤 시공 전문가가 필요하세요?" aria-label="검색"><button type="submit" aria-label="검색">' + I.search + "</button></form>" +
      '<div class="kw">' + ["인테리어", "욕실", "방수", "창호", "설계", "석고보드", "타일", "단열재"].map(function (k) { return '<a href="#/search?q=' + encodeURIComponent(k.split(" ")[0]) + '">' + esc(k) + "</a>"; }).join("") + "</div></div>" +
      '<div class="promo" id="promo" style="--n1:' + SLIDES[1].bg + ";--n2:" + SLIDES[2].bg + '"><div class="ptrack">' + SLIDES.map(function (x, i) { return '<a class="pslide' + (i ? "" : " on") + '" href="' + x.href + '" style="--bg:' + x.bg + '" aria-hidden="' + (i ? "true" : "false") + '"><span class="art">' + x.art.map(function (k) { return '<img src="' + BG.icon(k) + '" alt="">'; }).join("") + '</span><span class="pt"><b>' + x.t + "</b><p>" + esc(x.s) + "</p></span></a>"; }).join("") + "</div>" +
      '<button type="button" class="pg" data-act="promo-next" id="promoPg" aria-label="다음 배너"><b>1</b> / ' + SLIDES.length + " ›</button></div></section>" +
      '<nav class="cats" aria-label="카테고리">' + cats + '<div class="mchips">' + mchips + "</div></nav></div></div>" +
      '<section class="band"><div class="wrap">' + bands.map(function (b) {
        return '<div class="brow"><h2>' + b.t + '</h2><div class="cols">' + b.cols.map(function (c) { return '<div><a class="subcat" href="#/category?c=' + c[1].category + '">' + esc(c[0]) + "<span>+</span></a>" + gig(c[1]) + "</div>"; }).join("") + "</div></div>";
      }).join("") +
      '<div class="brow"><h2>' + matsBand.t + '</h2><div class="cols">' + matsBand.cols.map(function (c) { return '<div><a class="subcat" href="#/mall?c=' + c[1].category + '">' + esc(c[0]) + "<span>+</span></a>" + mat(c[1]) + "</div>"; }).join("") + "</div></div></div></section>" +
      '<div class="wrap"><section class="boxes">' +
      '<div class="box"><h3><span>인테리어</span>에서 놓치지 마세요</h3><div class="tiles">' + [["x_kitchen", "주방"], ["x_bath", "욕실"], ["x_living", "거실"], ["pf_e3_2", "원룸·오피스텔"]].map(function (x) { return '<a href="#/category?c=interior"><img loading="lazy" src="' + photo(x[0]) + '" alt="">' + x[1] + "</a>"; }).join("") + "</div></div>" +
      '<div class="box"><h3><span>시공 전</span>에 확인하세요</h3><div class="tiles">' + [["cat_design", "설계·도면"], ["x_drywall", "철거·내장"], ["cat_mep", "전기·배관"], ["cat_waterproof", "방수"]].map(function (x, i) { return '<a href="#/category?c=' + ["design", "frame", "mep", "waterproof"][i] + '"><img loading="lazy" src="' + photo(x[0]) + '" alt="">' + x[1] + "</a>"; }).join("") + "</div></div>" +
      '<div class="box"><h3><span>회원 자재</span>, 많이 담아요</h3><div class="tiles">' + ["m2", "m5", "m11", "m10"].map(function (id) { var m = BG.MAT[id]; return '<a href="#/item/' + id + '"><img loading="lazy" src="' + photo(m.photo) + '" alt="">' + esc(m.name) + "</a>"; }).join("") + "</div></div></section>" +
      '<section class="verified"><h2>BUILDGO가 검증한<br>평균 4.8점 이상 전문가</h2><div class="vrow">' + verified.slice(0, 4).map(gig).join("") + "</div></section></div>";
  }

  function category(r) {
    var c = r.query.c || "";
    setGnb(c || "all");
    var list = D.experts.filter(function (e) { return !c || e.category === c; });
    app.innerHTML = '<div class="wrap"><div class="list"><aside class="side"><h3>시공 분야</h3><a href="#/category" class="' + (!c ? "on" : "") + '">전체</a>' + D.categories.map(function (x) { return '<a href="#/category?c=' + x.id + '" class="' + (c === x.id ? "on" : "") + '">' + esc(x.name) + "</a>"; }).join("") + '<h3 style="margin-top:26px">자재</h3><a href="#/mall">회원 자재몰</a></aside>' +
      '<div><p class="crumb">홈 ' + I.chev + " " + (c ? esc(BG.CAT[c].name) : "전체") + '</p><div class="ltitle"><h1>' + (c ? esc(BG.CAT[c].name) : "전체 서비스") + "</h1><span>" + list.length + "개 서비스</span></div>" +
      '<div class="filters"><button class="on" type="button">추천순</button><button type="button">평점 높은 순</button><button type="button">후기 많은 순</button><button type="button">검증 업체만</button>' + D.regions.slice(0, 4).map(function (x) { return '<button type="button">' + esc(x) + "</button>"; }).join("") + "</div>" +
      '<div class="lgrid">' + list.map(gig).join("") + "</div></div></div></div>";
    app.querySelector(".filters").onclick = function (ev) { var b = ev.target.closest("button"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); };
  }

  function areas(e) {
    var info = [[e.verified.license, 1], [e.verified.business ? "사업자 등록" : "", 1], [e.verified.insurance ? "보험 가입" : "보험 미가입", e.verified.insurance ? 1 : 0]].filter(function (x) { return x[0]; });
    return '<div class="areas"><h3>지역</h3><div>' + D.regions.map(function (x) { return '<span class="' + (e.region.indexOf(x.split("·")[0]) === 0 ? "on" : "") + '">' + esc(x) + "</span>"; }).join("") + "</div></div>" +
      '<div class="areas" style="margin-top:22px"><h3>확인된 정보</h3><div>' + info.map(function (x) { return '<span class="' + (x[1] ? "on" : "") + '">' + esc(x[0]) + "</span>"; }).join("") + "</div></div>";
  }
  function gigView(r) {
    var e = BG.EXP[r.id] || D.experts[0];
    setGnb(e.category);
    var c = BG.CAT[e.category];
    var shots = e.portfolio.map(function (p) { return p.photo; });
    var sel = Math.min(1, e.packages.length - 1);
    app.innerHTML = '<section class="gband"><div class="wrap ghead"><div><div class="gmeta"><span class="crumb">' + esc(c.name) + " " + I.chev + " " + esc(e.region) + '</span><span class="act"><button type="button" data-like="' + e.id + '" class="' + (S.likes.indexOf(e.id) >= 0 ? "on" : "") + '" style="display:inline-flex;gap:4px;align-items:center">' + I.heart + '</button><button type="button" data-act="share" aria-label="공유">' + I.share + "</button></span></div>" +
      "<h1>" + esc(e.service) + '</h1><p class="stars">' + stars(e.rating) + "<b>" + e.rating + " (" + e.reviews + ')</b></p>' +
      '<div class="seller"><span class="mono">' + esc(BG.initial(e.name)) + "</span><div><b>" + esc(e.name) + "</b><span>경력 " + e.years + "년 · 평균 응답 " + e.responseHours + "시간 이내 · " + [e.verified.license ? e.verified.license + " 확인" : "", e.verified.insurance ? "보험 가입" : ""].filter(Boolean).join(" · ") + '</span></div><button type="button" data-act="ask">문의하기</button></div></div>' +
      '<div class="gal"><div class="main gimg th th-' + e.id + '" id="gmain"><a class="gl"><img id="gimg" src="' + photo(shots[0]) + '" alt="">' + thumbText(THUMB[e.id]) + '</a></div><div class="thumbs">' + shots.map(function (k, i) { return '<button type="button" class="' + (i ? "" : "on") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div></div></section>" +
      '<div class="wrap gbody"><div><div class="rev-head" id="rv"><h2>최근 받은 후기</h2><a href="#rv" style="font-size:13px;font-weight:600">전체보기</a></div><div class="revs">' + e.reviewsSample.map(function (v) { return '<div class="rev"><span class="stars">' + stars(v.rating) + "</span><small>" + esc(v.author) + "</small><p>" + esc(v.text) + "</p></div>"; }).join("") + "</div>" +
      '<nav class="gtabs"><a class="on" href="#pf">포트폴리오</a><a href="#sv">서비스 설명</a><a href="#pr">가격 정보</a><a href="#rv">후기(' + e.reviews + ")</a></nav>" +
      '<div class="gsec" id="pf"><h2>포트폴리오</h2><div class="pf">' + e.portfolio.map(function (p) { return '<div><img loading="lazy" src="' + photo(p.photo) + '" alt=""><small>' + esc(c.name) + "</small><b>" + esc(p.title) + '</b><div class="chips"><span>지역 ' + esc(e.region.split(" ")[0]) + "</span><span>예시 사진</span></div></div>"; }).join("") + "</div></div>" +
      '<div class="gsec desc" id="sv" style="margin-top:46px"><h2 style="text-align:left">서비스 설명</h2><p>' + esc(e.tagline) + "</p>" + e.packages.map(function (p) { return "<h4>" + esc(p.tier) + "</h4><p>" + esc(p.items.join(" · ")) + "</p>"; }).join("") + '<p style="color:#9A9BA7;font-size:12px">필요한 자재는 BUILDGO 회원 자재몰에서 회원가로 함께 준비할 수 있어요</p></div>' + areas(e) + '</div>' +
      '<aside><div class="pkgbox" id="pr"><div class="pkgtabs">' + e.packages.map(function (p, i) { return '<button type="button" data-pk="' + i + '" class="' + (i === sel ? "on" : "") + '">' + esc(p.tier) + "</button>"; }).join("") + '</div><div class="pkgin" id="pkgin"></div>' +
      '<div class="pkgbtns"><button type="button" class="b-outline" data-act="ask">전문가에게 문의하기</button><a class="b-black" href="#/request?e=' + e.id + '">견적 요청하기</a></div></div><p class="pknote">· 계약과 대금은 고객과 전문가가 직접 주고받아요<br>· 견적을 받아 보고 결정해도 비용이 들지 않아요</p></aside></div>' +
      '<div class="mcta"><button type="button" class="b-outline" data-act="ask">문의</button><a class="b-black" href="#/request?e=' + e.id + '">견적 요청하기</a></div>';
    function pk(i) {
      var p = e.packages[i];
      document.getElementById("pkgin").innerHTML = '<p class="pp">' + (p.price == null ? "현장 견적" : p.price === 0 ? "무료" : won(p.price) + "원") + "<small>" + (p.price == null ? "실측 후 확정" : p.price === 0 ? "현장 방문" : "(VAT 포함)") + '</small></p><p class="pt">' + esc(p.tier) + "</p><p style=\"margin:0;font-size:13px;color:#5D5E67\">" + esc(e.tagline) + "</p><ul>" + p.items.map(function (t) { return "<li>" + esc(t) + I.check + "</li>"; }).join("") + "<li>작업 기간<span>" + (p.days ? p.days + "일" : "협의") + "</span></li></ul>";
    }
    pk(sel);
    app.querySelector(".pkgtabs").onclick = function (ev) { var b = ev.target.closest("[data-pk]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); pk(+b.dataset.pk); };
    app.querySelector(".thumbs").onclick = function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("gimg").src = photo(b.dataset.shot); document.getElementById("gmain").classList.toggle("plain", b !== this.querySelector("button")); };
  }

  function mall(r) {
    var c = r.query.c || "";
    setGnb("mall");
    var list = D.materials.filter(function (m) { return !c || m.category === c; });
    app.innerHTML = '<div class="wrap"><div class="list"><aside class="side"><h3>회원 자재몰</h3><a href="#/mall" class="' + (!c ? "on" : "") + '">전체</a>' + D.materialCategories.map(function (x) { return '<a href="#/mall?c=' + x.id + '" class="' + (c === x.id ? "on" : "") + '">' + esc(x.name) + "</a>"; }).join("") + "</aside>" +
      '<div><p class="crumb">홈 ' + I.chev + ' 회원 자재몰</p><div class="ltitle"><h1>' + (c ? esc(BG.MAT_CAT[c].name) : "회원 자재몰") + "</h1><span>" + (S.member ? esc(S.tier().name) + " 회원가 적용 중" : "회원가 모드를 켜면 등급가가 보여요") + "</span></div>" +
      '<div class="filters"><a href="#/mall" class="' + (!c ? "on" : "") + '">전체</a>' + D.materialCategories.map(function (x) { return '<a href="#/mall?c=' + x.id + '" class="' + (c === x.id ? "on" : "") + '">' + esc(x.name) + "</a>"; }).join("") + "</div>" +
      '<div class="lgrid">' + list.map(mat).join("") + "</div></div></div></div>";
  }

  function item(r) {
    var m = BG.MAT[r.id] || D.materials[0];
    setGnb("mall");
    var t = S.tier(), unit = S.priceOf(m);
    var others = D.materials.filter(function (x) { return x.category === m.category && x.id !== m.id; });
    var shots = [m.photo].concat(others.map(function (x) { return x.photo; })).slice(0, 3);
    app.innerHTML = '<section class="gband"><div class="wrap ghead"><div><div class="gmeta"><span class="crumb">회원 자재몰 ' + I.chev + " " + esc(BG.MAT_CAT[m.category].name) + '</span><span class="act"><button type="button" data-like="' + m.id + '" style="display:inline-flex">' + I.heart + "</button></span></div>" +
      "<h1>" + esc(m.name) + " " + esc(m.spec) + '</h1><p class="stars" style="color:#5D5E67">판매 단위 ' + esc(m.unit) + " · 최소 주문 " + m.moq + " · " + esc(m.stock) + "</p>" +
      '<div class="seller"><span class="mono" style="background:#212224">B</span><div><b>BUILDGO 회원 자재몰</b><span>사업자 회원 등급가 · 현장 직배송 · 세금계산서 발행</span></div><button type="button" data-act="login">' + (S.member ? "회원가 적용 중" : "회원가 보기") + "</button></div></div>" +
      '<div class="gal"><div class="main"><img id="gimg" src="' + photo(m.photo) + '" alt=""></div><div class="thumbs">' + shots.map(function (k, i) { return '<button type="button" class="' + (i ? "" : "on") + '" data-shot="' + k + '"><img src="' + photo(k) + '" alt=""></button>'; }).join("") + "</div></div></div></section>" +
      '<div class="wrap gbody"><div><nav class="gtabs" style="margin-top:0"><a class="on" href="#tg">등급별 가격</a><a href="#sp">규격·배송</a></nav><div class="gsec" id="tg"><h2>등급별 회원가</h2><div class="revs">' +
      D.tiers.map(function (x) { return '<div class="rev"' + (t && t.id === x.id ? ' style="outline:2px solid #2337D9"' : "") + "><small>" + esc(x.rule) + "</small><p><b>" + esc(x.name) + "</b> · " + (x.discount ? x.discount + "% 할인" : "정가") + " · 적립 " + x.pointRate + "%</p><p style=\"font-size:18px;font-weight:800\">" + won(Math.round(m.price * (100 - x.discount) / 100 / 10) * 10) + "원</p></div>"; }).join("") +
      "</div></div>" +
      '<div class="gsec" id="sp" style="margin-top:46px"><h2>규격·배송</h2><dl class="spec"><div><dt>규격</dt><dd>' + esc(m.spec) + "</dd></div><div><dt>판매 단위</dt><dd>" + esc(m.unit) + "</dd></div><div><dt>최소 주문</dt><dd>" + m.moq + " " + esc(m.unit) + "</dd></div><div><dt>출고</dt><dd>" + esc(m.stock) + '</dd></div><div><dt>배송</dt><dd>현장 직배송 · 지역별 배송비 별도</dd></div><div><dt>증빙</dt><dd>사업자 회원 세금계산서 발행</dd></div></dl></div></div>' +
      '<aside><div class="pkgbox"><div class="pkgtabs" style="grid-template-columns:1fr 1fr"><button type="button" class="' + (t ? "" : "on") + '" data-act="' + (t ? "login" : "") + '">일반가</button><button type="button" class="' + (t ? "on" : "") + '" data-act="' + (t ? "" : "login") + '">회원가</button></div>' +
      '<div class="pkgin"><p class="pp">' + won(unit) + "원<small>/ " + esc(m.unit) + "</small></p>" + (t ? '<p class="pt" style="color:#2337D9">' + esc(t.name) + " 회원가 " + t.discount + "% 적용</p>" : '<p class="pt">회원가 모드를 켜면 등급가로 바뀌어요</p>') +
      '<div class="qtybox"><span>수량</span><div><button type="button" data-q="-1" aria-label="빼기">−</button><input id="q" value="' + m.moq + '" inputmode="numeric" aria-label="수량"><button type="button" data-q="1" aria-label="더하기">+</button></div></div><div class="rows" id="rows"></div></div>' +
      '<div class="pkgbtns"><button type="button" class="b-outline" data-act="cart">장바구니 담기</button><button type="button" class="b-black" data-act="buy">구매하기</button></div></div><p class="pknote">· 최소 주문 ' + m.moq + esc(m.unit) + " · " + esc(m.stock) + "<br>· 사업자 회원은 세금계산서가 발행돼요</p></aside></div>" +
      '<div class="mcta"><button type="button" class="b-outline" data-act="cart">장바구니</button><button type="button" class="b-black" data-act="buy">구매하기</button></div>';
    function calc() {
      var q = Math.max(1, parseInt(document.getElementById("q").value, 10) || 1);
      document.getElementById("rows").innerHTML = "<div><span>정가</span><span>" + won(m.price * q) + "원</span></div><div><span>등급 할인</span><span>-" + won((m.price - unit) * q) + "원</span></div><div><span>적립 예정</span><span>" + (t ? won(S.pointsOf(unit * q)) + "P" : "-") + '</span></div><div class="t"><span>결제 예정</span><span>' + won(unit * q) + "원</span></div>";
    }
    calc();
    app.querySelector(".qtybox").onclick = function (ev) { var b = ev.target.closest("[data-q]"); if (!b) return; var el = document.getElementById("q"); el.value = Math.max(1, (parseInt(el.value, 10) || 1) + parseInt(b.dataset.q, 10)); calc(); };
    document.getElementById("q").oninput = calc;
    app.querySelector(".thumbs").onclick = function (ev) { var b = ev.target.closest("[data-shot]"); if (!b) return; this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); document.getElementById("gimg").src = photo(b.dataset.shot); };
    app.querySelectorAll('[data-act="cart"]').forEach(function (b) { b.onclick = function () { S.addCart(m.id, parseInt(document.getElementById("q").value, 10) || 1); sync(); BG.toast("장바구니에 담았어요"); }; });
    app.querySelectorAll('[data-act="buy"]').forEach(function (b) { b.onclick = function () { S.addCart(m.id, parseInt(document.getElementById("q").value, 10) || 1); location.hash = "#/cart"; }; });
  }

  function request(r) {
    setGnb("request");
    var pre = BG.EXP[r.query.e];
    var st = { cat: pre ? pre.category : "", size: "", when: "" };
    app.innerHTML = '<div class="wrap"><form class="req" id="f" novalidate><h1>맞춤 견적 요청</h1><p class="lead">' + (pre ? esc(pre.name) + "에게 보내는 요청이에요" : "요청서를 올리면 맞는 전문가들이 견적을 보내요") + "</p>" +
      '<div class="rcard"><h3>어떤 공사인가요?</h3><div class="opts" data-k="cat">' + D.categories.map(function (c) { return '<button type="button" data-v="' + c.id + '" class="' + (st.cat === c.id ? "on" : "") + '">' + esc(c.name) + "</button>"; }).join("") + "</div></div>" +
      '<div class="rcard"><h3>규모</h3><div class="opts" data-k="size">' + ["20평 미만", "20~30평", "30~40평", "40평 이상", "잘 모름"].map(function (x) { return '<button type="button" data-v="' + x + '">' + x + "</button>"; }).join("") + "</div></div>" +
      '<div class="rcard"><h3>언제 시작하나요?</h3><div class="opts" data-k="when">' + ["한 달 안", "1~3개월", "3개월 이후"].map(function (x) { return '<button type="button" data-v="' + x + '">' + x + "</button>"; }).join("") + "</div></div>" +
      '<div class="rcard"><h3>연락처</h3><input class="inp" id="nm" placeholder="이름" autocomplete="name"><input class="inp" id="ph" placeholder="휴대폰 번호" inputmode="tel" autocomplete="tel"></div>' +
      '<p class="err" id="er"></p><button class="btn-block" type="submit">견적 요청 보내기</button></form></div>';
    app.querySelectorAll(".opts").forEach(function (g) { g.onclick = function (ev) { var b = ev.target.closest("button"); if (!b) return; g.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); st[g.dataset.k] = b.dataset.v; }; });
    document.getElementById("f").onsubmit = function (ev) {
      ev.preventDefault();
      var miss = [];
      if (!st.cat) miss.push("공사 종류"); if (!st.size) miss.push("규모"); if (!st.when) miss.push("시작 시기");
      if (!document.getElementById("nm").value.trim()) miss.push("이름");
      if (!/^0\d{8,10}$/.test(document.getElementById("ph").value.replace(/\D/g, ""))) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("er").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      S.addQuote({ cat: st.cat, size: st.size, when: st.when, to: pre ? pre.name : "맞는 전문가들" });
      app.innerHTML = '<div class="wrap done"><h1>견적 요청을 올렸어요</h1><p>전문가들의 견적이 도착하면 알려 드려요.</p><a class="btn-black" href="#/quotes">요청 내역 보기</a></div>';
    };
  }
  function quotes() {
    setGnb("request");
    app.innerHTML = '<div class="wrap"><div class="req"><h1>요청 내역</h1><p class="lead">올린 견적 요청을 모아 봐요</p>' + (S.quotes.length ? S.quotes.map(function (q) { return '<div class="qline"><b>' + esc(BG.CAT[q.cat] ? BG.CAT[q.cat].name : "공사") + " · " + esc(q.size) + "</b><span>" + esc(q.when) + " · " + esc(q.to) + "</span></div>"; }).join("") : '<p class="empty">아직 올린 요청이 없어요</p>') + '<a class="btn-block" href="#/request">견적 요청하기</a></div></div>';
  }
  function cart() {
    setGnb("mall");
    var t = S.cartTotals();
    app.innerHTML = '<div class="wrap"><div class="req"><h1>장바구니</h1><p class="lead">' + (S.member ? "회원가가 적용됐어요" : "회원가 모드를 켜면 등급가가 적용돼요") + "</p>" +
      (S.cart.length ? S.cart.map(function (row) { var m = BG.MAT[row.id]; return '<div class="cartl"><img src="' + photo(m.photo) + '" alt=""><div>' + esc(m.name) + "<small>" + esc(m.spec) + " · " + row.qty + esc(m.unit) + "</small></div><b>" + won(S.priceOf(m) * row.qty) + "원</b></div>"; }).join("") +
        '<div class="rows" style="margin-top:16px"><div><span>정가</span><span>' + won(t.list) + "원</span></div><div><span>등급 할인</span><span>-" + won(t.discount) + "원</span></div><div><span>적립 예정</span><span>" + won(t.points) + 'P</span></div><div class="t"><span>결제 예정</span><span>' + won(t.pay) + '원</span></div></div><button class="btn-block" type="button" data-act="order">주문하기</button>'
        : '<p class="empty">장바구니가 비었어요</p><a class="btn-block" href="#/mall">회원 자재몰 보기</a>') + "</div></div>";
    var o = app.querySelector('[data-act="order"]'); if (o) o.onclick = function () { BG.toast("주문서를 준비하고 있어요"); };
  }
  function tiers() {
    setGnb("tiers");
    var me = S.tier();
    app.innerHTML = '<div class="wrap"><div class="req" style="max-width:none"><h1>회원 등급 혜택</h1><p class="lead">사업자 회원은 골드부터 시작해요. 등급이 오를수록 자재 단가가 내려가요</p></div><div class="tgrid">' +
      D.tiers.map(function (x) { return '<div class="tbox' + (me && me.id === x.id ? " me" : "") + '"><b>' + esc(x.name) + '</b><p class="d">' + x.discount + "%</p><p>자재 할인 · 적립 " + x.pointRate + "%</p><p>" + esc(x.rule) + "</p>" + (me && me.id === x.id ? '<p style="color:#2337D9;font-weight:700">' + esc(D.demoUser.name) + "님 · " + won(D.demoUser.points) + "P</p>" : "") + "</div>"; }).join("") +
      '</div><div class="rev" style="margin-top:16px"><p><b>추천 적립 ' + won(D.points.referral) + "P</b></p><p>" + esc(D.points.referralRule) + "</p><p>" + esc(D.points.use) + "</p></div></div>";
  }
  function join() {
    setGnb("join");
    app.innerHTML = '<div class="wrap joinwrap"><div><h1>설계·시공 기술을<br>패키지로 올리고 일감을 받으세요</h1><p>기본·표준·프리미엄 패키지를 등록하면 고객이 비교해 견적을 요청해요. 면허·사업자·보험을 확인한 업체에는 검증 표시가 붙어요.</p><a class="btn-black" href="#/tiers" style="height:48px;padding:0 20px">전문가로 시작하기</a></div>' +
      '<div class="calc"><b>예상 월 매출 계산 (단순 곱셈)</b><label>한 달 처리 건수 <span id="cv">3</span>건<input type="range" id="cnt" min="1" max="20" value="3"></label><label>평균 계약 금액 <span id="av">500</span>만원<input type="range" id="avg" min="50" max="5000" step="50" value="500"></label><p class="res" id="res"></p><small>건수 × 평균 금액으로만 계산한 값이에요. 실제 수수료·비용은 정해지면 반영합니다</small></div></div>';
    function calc() { var n = +document.getElementById("cnt").value, a = +document.getElementById("avg").value; document.getElementById("cv").textContent = n; document.getElementById("av").textContent = a.toLocaleString("ko-KR"); document.getElementById("res").textContent = "월 " + (n * a).toLocaleString("ko-KR") + "만원"; }
    calc(); document.getElementById("cnt").oninput = calc; document.getElementById("avg").oninput = calc;
  }
  function search(r) {
    var q = (r.query.q || "").trim();
    setGnb("all");
    var es = D.experts.filter(function (e) { return (e.name + e.service + BG.CAT[e.category].name + e.tagline).indexOf(q) >= 0; });
    var ms = D.materials.filter(function (m) { return (m.name + m.spec + BG.MAT_CAT[m.category].name).indexOf(q) >= 0; });
    app.innerHTML = '<div class="wrap" style="padding-top:30px"><div class="ltitle"><h1>‘' + esc(q) + "’ 검색 결과</h1><span>서비스 " + es.length + " · 자재 " + ms.length + "</span></div>" +
      '<div class="lgrid">' + es.map(gig).join("") + ms.map(mat).join("") + "</div>" + (!es.length && !ms.length ? '<p class="empty">검색 결과가 없어요</p>' : "") + "</div>";
  }

  function sync() {
    var on = S.member, r = BG.parseHash();
    document.body.classList.toggle("detail", r.name === "gig" || r.name === "item");
    document.getElementById("bizBtn").setAttribute("aria-pressed", on ? "true" : "false");
    document.getElementById("loginBtn").textContent = on ? "로그아웃" : "로그인";
    var n = S.cartTotals().count;
    document.getElementById("cartLink").textContent = n ? "장바구니 " + n : "장바구니";
  }
  document.addEventListener("click", function (ev) {
    var lk = ev.target.closest("[data-like]");
    if (lk) { ev.preventDefault(); var on = S.toggleLike(lk.dataset.like); lk.classList.toggle("on", on); BG.toast(on ? "찜했어요" : "찜을 해제했어요"); return; }
    var a = ev.target.closest("[data-act]");
    if (!a || !a.dataset.act) return;
    if (a.dataset.act === "login") { ev.preventDefault(); S.member = !S.member; S.save(); sync(); document.getElementById("bizTip").classList.add("off"); BG.toast(S.member ? D.demoUser.name + "님(골드) 회원가 모드 — 자재가 등급가로 보여요" : "회원가 모드를 껐어요"); var y = window.scrollY; window.dispatchEvent(new HashChangeEvent("hashchange")); window.scrollTo(0, y); }
    if (a.dataset.act === "tip-close") document.getElementById("bizTip").classList.add("off");
    if (a.dataset.act === "promo-next") { ev.preventDefault(); promoHold = Date.now() + 6000; promoGo(); }
    if (a.dataset.act === "appbar-close") { ev.preventDefault(); document.getElementById("appbar").remove(); }
    if (a.dataset.act === "ask" || a.dataset.act === "share") BG.toast("문의 내용을 전문가에게 전달할게요");
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target.closest("[data-search]"); if (!f) return;
    ev.preventDefault(); var v = f.q.value.trim(); if (v) location.hash = "#/search?q=" + encodeURIComponent(v);
  });
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 8); if (window.scrollY > 120) document.getElementById("bizTip").classList.add("off"); }, { passive: true });
    document.getElementById("ftCredit").textContent = BG.credit;
  BG.router({ home: home, category: category, gig: gigView, mall: mall, item: item, request: request, quotes: quotes, cart: cart, tiers: tiers, join: join, search: search }, sync);
})();
