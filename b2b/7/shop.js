(function () {
  var A = window.APP, D = A.D, S = A.S, esc = A.esc, won = A.won, photo = A.photo, I = A.I, app = A.app;
  var MT = BG.MT, MC = BG.MC, CO = BG.CO, EX = BG.EX;
  var SI = {
    star: '<svg viewBox="0 0 24 24"><path d="m12 3.8 2.45 5.1 5.6.75-4.1 3.9 1.03 5.55L12 16.4l-4.98 2.7 1.03-5.55-4.1-3.9 5.6-.75z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M3.5 8h3.2l1.8-2.6h7l1.8 2.6h3.2v11h-17z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    erase: '<svg viewBox="0 0 24 24"><path d="M4 20h16M8 16.5 4.5 13 13 4.5l6 6-6.5 6z"/></svg>'
  };
  var SHORT = { m1: "철근", m2: "H형강", m3: "강관", m4: "구조목", m5: "합판", m6: "시멘트", m7: "레미탈", m8: "석고보드", m9: "단열재", m10: "천장틀", m11: "타일", m12: "판재", m13: "동관", m14: "이중벽관", m15: "방수재", m16: "도료" };
  var SITE = {
    steel: ["w_rebar", "n_rebarman", "frame_work"], wood: ["pf_wood", "mt_workshop", "pf_house"], cement: ["concrete1", "concrete2", "mt_plaster"],
    board: ["pf_drywall", "mt_drywall", "pf_white"], stone: ["pf_bath", "pf_interior", "mt_brick"], pipe: ["pf_pipework", "pf_mep", "mt_tube"], finish: ["pf_water", "pf_white", "facade"]
  };
  var NOTE = {
    steel: ["KS 규격 제품을 공장 출고분 그대로 보냅니다.", "출고 때 시험성적서(밀시트)를 함께 드립니다.", "절단·가공은 따로 견적을 드립니다."],
    wood: ["건조 상태를 확인한 뒤 묶음째 보냅니다.", "현장에서는 비를 맞지 않게 덮개를 씌워 보관해 주세요.", "재단은 따로 견적을 드립니다."],
    cement: ["파렛트 단위로 출고합니다.", "제조일이 3개월 안쪽인 제품만 보냅니다.", "습기에 약하니 받은 날 바로 덮어 보관해 주세요."],
    board: ["모서리가 깨지지 않게 파렛트에 묶어 보냅니다.", "규격마다 수량을 나눠 담을 수 있습니다.", "층 올림은 따로 견적을 드립니다."],
    stone: ["같은 생산 차수(로트)로 맞춰 보냅니다.", "주문 제작 품목은 견적 확정 뒤 생산에 들어갑니다.", "시공 전에 색상 샘플을 먼저 받아 보실 수 있습니다."],
    pipe: ["규격별로 묶어 꼬리표를 달아 보냅니다.", "이음관·부속도 같은 견적서에 함께 담을 수 있습니다.", "절단은 따로 견적을 드립니다."],
    finish: ["제조일과 사용 기한을 확인한 제품만 보냅니다.", "색상은 견적 확정 전에 색상표로 다시 확인합니다.", "개봉한 제품은 교환·반품이 어렵습니다."]
  };
  var WHO = ["ky***", "hs***", "jw***", "dh***", "sm***", "yj***", "bc***", "tk***", "mj***", "sw***", "jh***"];
  var ROLE = ["현장소장", "공무팀", "자재 담당", "구매 담당", "대표"];
  var GEN = [
    [5, "{n} 수량 맞게 들어왔습니다. 하차 전에 기사님이 미리 전화 주셔서 현장 정리해 두기 편했습니다."],
    [5, "견적 요청하고 반나절 만에 담당 매니저 연락이 왔습니다. 납품 일정을 공정에 맞춰 준 게 제일 좋았습니다."],
    [4, "물건은 문제없습니다. 오후 늦게 도착해서 하차는 다음 날 오전에 했습니다."],
    [5, "규격 표기대로 왔고 포장 상태도 깨끗합니다. 다음 동에도 같은 걸로 받을 예정입니다."],
    [4, "가격은 다른 거래처와 비슷한데 세금계산서랑 서류 정리가 빨라서 계속 씁니다."],
    [5, "급하게 필요했는데 출고일을 정확히 지켜 줬습니다. 공정 안 밀리고 넘어갔습니다."],
    [3, "제품은 괜찮습니다. 출고가 하루 늦어졌는데 미리 연락은 받았습니다."],
    [5, "현장이 외곽인데도 견적 받은 금액 그대로 들어왔습니다."],
    [4, "처음 거래라 걱정했는데 매니저가 {n} 수량 계산을 같이 봐 줬습니다. 조금 남을 정도로 맞췄습니다."],
    [5, "두 번째 주문입니다. 지난번과 같은 상태로 들어와서 따로 손볼 게 없었습니다."]
  ];
  var CATR = {
    steel: [[5, "밀시트 같이 받았고 규격 표기 다 맞습니다. 감리 검수도 한 번에 통과했습니다."], [4, "녹 거의 없이 깨끗하게 왔습니다. 길이 오차도 없었습니다."]],
    wood: [[5, "건조 상태 좋습니다. 휜 것 거의 없어서 골라낼 게 없었습니다."], [4, "몇 장 모서리가 눌려 왔는데 사진 보내니 다음 출고 때 바로 바꿔 줬습니다."]],
    cement: [[5, "제조일 얼마 안 된 걸로 왔습니다. 굳은 포대 하나도 없었습니다."], [4, "파렛트째 내려 줘서 편했습니다. 비닐 덮개도 씌워서 왔습니다."]],
    board: [[5, "모서리 깨진 거 없이 왔습니다. 파렛트 묶음 상태 좋았습니다."], [4, "규격 두 가지를 섞어 주문했는데 나눠서 표시해 줘서 현장에서 헷갈리지 않았습니다."]],
    stone: [[5, "같은 로트로 맞춰 와서 색 차이 없습니다. 샘플과 똑같습니다."], [4, "주문 제작이라 일주일 걸렸는데 처음 안내받은 일정 그대로였습니다."]],
    pipe: [[5, "규격별로 꼬리표가 달려 와서 설비팀이 바로 나눠 썼습니다."], [4, "관 끝 마감이 깔끔합니다. 부속까지 한 번에 견적 받아서 편했습니다."]],
    finish: [[5, "제조일 최근 걸로 왔습니다. 색상표대로 맞게 왔습니다."], [4, "통 하나가 찌그러져 왔는데 내용물은 이상 없었습니다. 교환 안내도 바로 받았습니다."]]
  };
  var FIELDS = [["dev", "시행"], ["build", "시공"], ["mat", "자재"], ["design", "설계"], ["pm", "PM"], ["finance", "금융"]];
  var PURPOSES = [["land", "토지를 가지고 있어요"], ["tech", "기술을 가지고 있어요"], ["capital", "자본을 가지고 있어요"], ["dev", "시행사를 찾아요"], ["build", "시공사를 찾아요"], ["mat", "자재를 사려고 해요"], ["pm", "PM 상담"], ["finance", "금융 상담"]];
  var SERVICES = {
    pm: { id: "pm", name: "PM 상담", desc: "사업성 검토부터 인허가·공정·준공까지 일정과 비용을 함께 관리합니다.", href: "#/pm", ph: "n_plan" },
    finance: { id: "finance", name: "금융 상담", desc: "PF 등 사업비 조달 구조를 사업 단계에 맞춰 함께 봅니다.", href: "#/finance", ph: "w_review" }
  };
  var DOORS = [
    { t: "업체 찾기", d: "시행·시공·자재 업체를 분류와 지역으로 찾고, 채팅으로 상담을 요청합니다.", href: "#/companies", ph: "hero_rise" },
    { t: "전문가 찾기", d: "건축사·기술사·현장소장급 기술자에게 경력과 실적을 보고 상담을 요청합니다.", href: "#/experts", ph: "w_measure" },
    { t: "자재몰", d: "입점 업체의 자재를 담고 계약서에 서명하면 견적서가 바로 나옵니다.", href: "#/mall", ph: "mt_rebar" }
  ];
  var BASE = new Date(2026, 10, 8, 10, 0).getTime(), DAY = 864e5;
  var SEED = {};
  D.materials.forEach(function (m, i) {
    var cat = CATR[m.cat] || [], n = 4 + (i * 3) % 5, list = [], site = SITE[m.cat] || [];
    for (var k = 0; k < n; k++) {
      var src = k < cat.length ? cat[k] : GEN[(i * 3 + (k - cat.length) * 7) % GEN.length];
      var ph = k === 1 ? [m.ph, site[0]] : k === 3 ? [site[1]] : k === 5 ? [site[2], m.ph] : [];
      var q = minQty(m) * (1 + (i + k) % 3);
      list.push({ id: m.id + "-" + k, who: WHO[(i * 2 + k) % WHO.length], role: ROLE[(i + k * 2) % ROLE.length], stars: src[0], text: src[1].replace(/\{n\}/g, SHORT[m.id] || m.name), spec: m.specs[(i + k) % m.specs.length] + " · " + won(q) + m.unit, at: BASE - (2 + k * 11 + (i * 3) % 7) * DAY - k * 3600000, photos: ph.filter(Boolean) });
    }
    SEED[m.id] = list;
  });

  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function day(t) { var d = new Date(t); return d.getFullYear() + "." + pad2(d.getMonth() + 1) + "." + pad2(d.getDate()); }
  function user() { return A.keep("user"); }
  function reqs() { var r = A.keep("requests"); return Array.isArray(r) ? r : []; }
  function myQuotes() { var r = A.keep("myquotes"); return Array.isArray(r) ? r : []; }
  function minQty(m) { var p = /\((\d+)/.exec(m.moq); if (p) return +p[1]; var n = parseInt(m.moq, 10); return n > 0 ? n : 1; }
  function stepQty(m) { return /\(/.test(m.moq) ? minQty(m) : 1; }
  function fixQty(m, v) { var s = stepQty(m), n = parseInt(v, 10) || 0; n = Math.round(n / s) * s; return Math.max(minQty(m), n); }
  function okLine(c) {
    var map = { "면허": "면허", "사업자": "사업자등록", "보험": "보험 가입" };
    return c ? (c.checks || []).map(function (k) { return map[k] || k; }).join(" · ") + " 확인 · 2026.10" : "도아 직접 확인 · 2026.10";
  }
  function vendMeta(c) { return c ? A.typeName(c.type) + " · " + c.region + " " + c.city + " · " + c.since + "년 설립" : "도아 · (주)더원파트너스"; }
  function src(p) { return /^(data|blob):/.test(p) ? p : photo(p); }
  function stars(n, cls) { var h = ""; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= Math.round(n) ? "on" : "") + '">' + SI.star + "</i>"; return '<span class="s-stars' + (cls ? " " + cls : "") + '" aria-label="별점 ' + (Math.round(n * 10) / 10) + '점">' + h + "</span>"; }
  function reviewsOf(m) { var all = A.keep("reviews") || {}; return (all[m.id] || []).concat(SEED[m.id] || []); }
  function stat(list) { var c = [0, 0, 0, 0, 0, 0], s = 0; list.forEach(function (r) { c[r.stars] = (c[r.stars] || 0) + 1; s += r.stars; }); return { n: list.length, avg: list.length ? s / list.length : 0, c: c }; }
  function avg(st) { return st.avg.toFixed(1); }
  function head(title, sub, crumbs) {
    crumbs = crumbs && crumbs.length ? crumbs : [[title]];
    return '<section class="s-head"><p class="s-crumb"><a href="#/">홈</a>' + crumbs.map(function (c) { return '<span aria-hidden="true">›</span>' + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : "<em>" + esc(c[0]) + "</em>"); }).join("") + "</p><h1>" + esc(title) + "</h1>" + (sub ? '<p class="s-sub">' + esc(sub) + "</p>" : "") + "</section>";
  }
  function changed() { try { window.dispatchEvent(new CustomEvent("app:quote", { detail: quoteCount() })); } catch (e) {} }
  function quoteCount() { return S.cart.length + reqs().length; }
  function catsOf(c) { if (c.cat) return [].concat(c.cat); return c.type === "su" ? ["mat"] : c.type === "de" ? ["design"] : c.type === "gc" ? ["build", "dev"] : ["build"]; }
  function recommend(u) {
    var p = (u && u.purposes) || [], none = !p.length;
    function has() { for (var i = 0; i < arguments.length; i++) if (p.indexOf(arguments[i]) >= 0) return true; return false; }
    var cs = [], why = [];
    function take(cat, n) { D.companies.filter(function (c) { return catsOf(c).indexOf(cat) >= 0 && cs.indexOf(c) < 0; }).sort(function (a, b) { return b.count - a.count; }).slice(0, n).forEach(function (c) { cs.push(c); }); }
    if (none || has("dev", "land", "capital")) { take("dev", 2); why.push("시행사"); }
    if (none || has("build", "tech")) { take("build", 2); why.push("시공사"); }
    if (none || has("mat")) { take("mat", 2); why.push("자재 업체"); }
    var xs = none || has("build", "tech") ? D.experts.slice().sort(function (a, b) { return b.years - a.years; }).slice(0, 3) : [];
    var ms = none || has("mat") ? D.materials.slice().sort(function (a, b) { return (b.ship.indexOf("당일") >= 0) - (a.ship.indexOf("당일") >= 0); }).slice(0, 4) : has("build") ? [MT.m1, MT.m6].filter(Boolean) : [];
    var sv = [];
    if (none || has("pm", "dev", "land", "capital")) sv.push(SERVICES.pm);
    if (none || has("finance", "dev", "land", "capital")) sv.push(SERVICES.finance);
    return { companies: cs.slice(0, 4), experts: xs, materials: ms, services: sv, label: why.join("·") };
  }
  A.recommend = recommend;
  A.quoteCount = quoteCount;

  function priceBlock(m) {
    if (S.member) return '<div class="s-price"><p class="s-p1"><span class="s-pl">회원가</span><b>' + won(S.priceOf(m)) + '원</b><span class="s-pu">/ ' + esc(m.unit) + '</span></p><p class="s-p2">정가 ' + won(m.price) + "원</p></div>";
    return '<div class="s-price"><p class="s-p1"><b>' + won(m.price) + '원</b><span class="s-pu">/ ' + esc(m.unit) + '</span></p><p class="s-p2"><a href="#/join">가입하면 회원가</a>로 견적을 받습니다</p></div>';
  }
  function cbar() {
    var t = S.cartTotals();
    return '<div class="s-cbar" id="s-cbar"' + (t.count ? "" : " hidden") + '><p>견적 목록 <b>' + t.count + '품목</b><span> · ' + (S.member ? "회원가 합계 " : "합계 ") + "<b>" + won(t.pay) + '원</b></span></p><a class="btn" href="#/cart">견적 목록 보기</a></div>';
  }
  function refreshBar() {
    var b = document.getElementById("s-cbar"); if (!b) return;
    var was = b.hidden; b.outerHTML = cbar();
    var n = document.getElementById("s-cbar");
    document.body.classList.toggle("s-barred", !n.hidden);
    if (was && !n.hidden && !BG.reduced() && n.animate) n.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
  }

  var GUIDE = [["자재 고르기", "분류와 규격으로 필요한 자재를 고릅니다."], ["견적 목록에 담기", "수량을 정해 견적 목록에 담습니다."], ["계약서 온라인 서명", "담은 자재로 계약서를 확인하고 서명합니다."], ["견적서 받기", "업체·전문가 견적과 함께 한 장으로 받습니다."], ["출고 · 배송", "담당 매니저가 출고 일정을 안내합니다."]];
  function guideHtml() { return '<section class="s-guide" aria-label="자재 구매 순서"><p class="s-guide-h">자재 구매 순서</p><ol class="h-flow-l">' + GUIDE.map(function (g, i) { return '<li><span class="h-flow-n">STEP 0' + (i + 1) + '</span><i class="h-flow-dot" aria-hidden="true"></i><b>' + esc(g[0]) + "</b><p>" + esc(g[1]) + "</p></li>"; }).join("") + "</ol></section>"; }
  function mallHead() {
    return '<section class="s-head s-mh"><div class="s-mh-t"><p class="s-crumb"><a href="#/">홈</a><span aria-hidden="true">›</span><em>자재몰</em></p><p class="s-mh-k">자재몰</p><h1>입점 업체가 직접 올린 건설 자재를<br>회원가로 견적 받으세요.</h1><p class="s-sub">견적 목록에 담고 계약서에 서명하면 견적서가 나옵니다.</p></div><figure class="s-mh-ph"><img src="' + photo("n_truss") + '" alt="올려다본 철골 트러스 구조"></figure></section>';
  }
  var MALL = null;
  function mcard(m) {
    var co = CO[m.seller], st = stat(reviewsOf(m));
    return '<article class="s-card"><a class="s-card-im" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></a><div class="s-card-b">' +
      '<p class="s-seller"><span>판매</span>' + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a> · " + esc(co.region + " " + co.city) : "도아") + "</p>" +
      '<h3><a href="#/item/' + m.id + '">' + esc(m.name) + "</a></h3>" +
      '<p class="s-spec">' + esc(m.spec) + (m.specs.length > 1 ? " 외 " + (m.specs.length - 1) + "개 규격" : "") + " · 최소 " + esc(m.moq) + "</p>" + priceBlock(m) +
      '<p class="s-meta">평점 ' + avg(st) + " · 리뷰 " + st.n + " · " + esc(m.ship) + "</p>" +
      '<button type="button" class="btn line-l s-add" data-act="s-add" data-id="' + m.id + '"><span>견적 목록에 담기</span></button></div></article>';
  }
  function moreBtn() {
    var left = MALL ? MALL.items.length - MALL.shown : 0;
    return left > 0 ? '<div class="s-more-w" id="s-more-w"><button type="button" class="btn line-l s-morebtn" data-act="s-more">더 보기 (남은 ' + left + "개)</button></div>" : "";
  }
  function mall(r) {
    var q = r.query, c = MC[q.c] ? q.c : "", sort = q.sort || "";
    var items = D.materials.filter(function (m) { return !c || m.cat === c; });
    if (sort === "low") items.sort(function (a, b) { return a.price - b.price; });
    if (sort === "review") items.sort(function (a, b) { return reviewsOf(b).length - reviewsOf(a).length; });
    var tiles = [{ id: "", name: "전체", ph: "mt_warehouse", n: D.materials.length }].concat(D.matCats.map(function (x) { return { id: x.id, name: x.name, ph: x.ph, n: D.materials.filter(function (m) { return m.cat === x.id; }).length }; }));
    var u = user();
    var mem = S.member ? '<p class="s-mem">' + esc((u && (u.company || u.name)) || "회원") + "님 · 회원가로 보고 있습니다</p>" : '<p class="s-mem">정가로 보고 있습니다 · <a href="#/join">회원가입</a>하면 회원가로 견적을 받습니다</p>';
    var per = window.matchMedia && matchMedia("(max-width: 600px)").matches ? 6 : 12;
    MALL = { items: items, per: per, shown: Math.min(per, items.length) };
    var cards = items.slice(0, MALL.shown).map(mcard).join("");
    app.innerHTML = '<div class="s-pg s-mall">' + mallHead() + guideHtml() +
      '<nav class="s-cats" aria-label="자재 분류">' + tiles.map(function (t) { return '<a class="s-cat' + (c === t.id ? " on" : "") + '" href="#/mall' + BG.qs({ c: t.id, sort: sort }) + '"' + (c === t.id ? ' aria-current="page"' : "") + '><span class="s-cat-im"><img src="' + photo(t.ph) + '" alt=""></span><span class="s-cat-t">' + esc(t.name) + '</span><span class="s-cat-n">' + t.n + "종</span></a>"; }).join("") + "</nav>" +
      '<div class="s-bar"><p class="s-cnt">' + esc(c ? MC[c].name : "전체 자재") + " <b>" + items.length + "</b>종</p>" + mem +
      '<p class="s-sort">' + [["", "기본순"], ["low", "낮은 가격순"], ["review", "리뷰 많은 순"]].map(function (o) { return '<a href="#/mall' + BG.qs({ c: c, sort: o[0] }) + '" class="' + (sort === o[0] ? "on" : "") + '">' + o[1] + "</a>"; }).join("") + "</p></div>" +
      '<div class="s-grid" id="s-grid">' + cards + "</div>" + moreBtn() + cbar() + "</div>";
  }

  var cur = null;
  function thumbs(m) {
    var s = SITE[m.cat] || [];
    return [{ ph: m.ph, alt: m.name + " 제품 사진" }, { ph: m.ph, z: 1.45, o: "28% 32%", alt: m.name + " 가까이 본 사진" }, { ph: m.ph, z: 1.45, o: "72% 68%", alt: m.name + " 단면 가까이 본 사진" }, { ph: s[0] || m.ph, alt: MC[m.cat].name + " 현장 사진" }];
  }
  function timg(t, lazy) { return "<img" + (lazy ? ' loading="lazy"' : "") + ' src="' + photo(t.ph) + '" alt="' + esc(t.alt) + '"' + (t.z ? ' style="transform:scale(' + t.z + ");transform-origin:" + t.o + '"' : "") + ">"; }
  function qaOf(m) {
    var steel = m.cat === "steel", co = CO[m.seller];
    return [
      { q: "세금계산서 발행되나요?", a: "네. 견적이 확정되고 납품이 끝나면 가입 때 적으신 사업자 정보로 세금계산서를 발행합니다.", who: "jw***", at: BASE - 6 * DAY },
      { q: steel ? "현장 하차까지 해 주시나요?" : "층 올림도 되나요?", a: steel ? "5톤 이상은 크레인 차량으로 현장 하차해 드립니다. 현장 진입로는 담당 매니저가 출고 전에 전화로 확인합니다." : "1층 하차까지 견적에 들어 있습니다. 층 올림은 현장 여건을 보고 따로 견적을 드립니다.", who: "dh***", at: BASE - 19 * DAY },
      { q: m.specs.length > 1 ? "규격을 섞어서 주문해도 되나요?" : "다른 자재와 같이 받을 수 있나요?", a: "", secret: true, who: "sm***", at: BASE - 33 * DAY }
    ].map(function (x) { x.by = co ? co.name : "도아"; return x; });
  }
  function rvItem(x) {
    return '<li class="s-rv"><div class="s-rv-top">' + stars(x.stars, "sm") + '<span class="s-rv-who">' + esc(x.who) + (x.role ? " · " + esc(x.role) : "") + (x.mine ? " · 내 리뷰" : "") + '</span><span class="s-rv-at">' + day(x.at) + '</span></div><p class="s-rv-opt">선택 ' + esc(x.spec) + '</p><p class="s-rv-t">' + esc(x.text) + "</p>" +
      (x.photos && x.photos.length ? '<div class="s-rv-im">' + x.photos.map(function (p, i) { return '<span><img loading="lazy" src="' + esc(src(p)) + '" alt="리뷰 사진 ' + (i + 1) + '"></span>'; }).join("") + "</div>" : "") + "</li>";
  }
  function rvList() {
    var list = reviewsOf(cur.m).slice();
    if (cur.sort === "photo") list = list.filter(function (x) { return x.photos && x.photos.length; });
    list.sort(cur.sort === "rate" ? function (a, b) { return (b.stars - a.stars) || (b.at - a.at); } : function (a, b) { return b.at - a.at; });
    return list.length ? list.map(rvItem).join("") : '<li class="s-rv-none">사진이 있는 리뷰가 아직 없습니다.</li>';
  }
  function item(r) {
    var m = MT[r.id] || D.materials[0];
    cur = { m: m, spec: m.spec, qty: minQty(m), sort: "new", th: 0, r: r };
    drawItem();
  }
  function drawItem() {
    var m = cur.m, co = CO[m.seller], list = reviewsOf(m), st = stat(list), qa = qaOf(m), th = thumbs(m), u = S.priceOf(m);
    var phs = []; list.forEach(function (x) { (x.photos || []).slice(0, 1).forEach(function (p) { phs.push(p); }); });
    var bars = [5, 4, 3, 2, 1].map(function (k) { var n = st.c[k] || 0, w = st.n ? Math.round(n / st.n * 100) : 0; return '<li><span class="s-bk">' + k + '점</span><span class="s-bb"><i style="width:' + w + '%"></i></span><span class="s-bn">' + n + "</span></li>"; }).join("");
    var specs = m.specs.map(function (s) { return '<button type="button" class="s-sp' + (s === cur.spec ? " on" : "") + '" data-act="s-spec" data-v="' + esc(s) + '" aria-pressed="' + (s === cur.spec) + '">' + esc(s) + "</button>"; }).join("");
    app.innerHTML = '<div class="s-pg s-item">' +
      '<nav class="s-ztab" aria-label="상품 구역">' + [["s-t-info", "제품 정보"], ["s-sp-tbl", "규격표"], ["s-t-how", "구매 방법"], ["s-t-pay", "결제"], ["s-t-ship", "운송"]].map(function (t, i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-act="s-jump" data-to="' + t[0] + '">' + t[1] + "</button>"; }).join("") + "</nav>" +
      '<p class="s-crumb s-crumb-it"><a href="#/">홈</a><span aria-hidden="true">›</span><a href="#/mall">자재몰</a><span aria-hidden="true">›</span><a href="#/mall?c=' + m.cat + '">' + esc(MC[m.cat].name) + "</a></p>" +
      '<div class="s-it"><div class="s-gal"><div class="s-gal-main" id="s-gm">' + timg(th[0]) + '</div><div class="s-gal-th" role="group" aria-label="사진 고르기">' + th.map(function (t, i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-act="s-th" data-i="' + i + '" aria-label="' + esc(t.alt) + ' 보기">' + timg(t) + "</button>"; }).join("") + "</div></div>" +
      '<div class="s-info" id="s-it-top"><p class="s-vend1"><span>판매</span>' + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a>" : "도아") + '<em>' + SI.check + esc(okLine(co)) + "</em></p>" +
      "<h1>" + esc(m.name) + '</h1><a class="s-rate" href="#s-t-rv">' + stars(st.avg, "sm") + "<b>" + avg(st) + "</b><span>리뷰 " + st.n + "</span></a>" + priceBlock(m) +
      '<table class="s-sptbl" id="s-sp-tbl">' + spRows(m) + "</table>" +
      '<div class="s-pick"><label class="selbox"><span class="h-vh">규격 고르기</span><select id="s-spsel" aria-label="규격 고르기">' + m.specs.map(function (s) { return "<option" + (s === cur.spec ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" + I.down + '</label><div class="qty"><button type="button" data-act="s-q" data-d="-1" aria-label="수량 줄이기">' + I.minus + '</button><input id="s-qty" inputmode="numeric" value="' + cur.qty + '" aria-label="수량"><button type="button" data-act="s-q" data-d="1" aria-label="수량 늘리기">' + I.plus + "</button></div></div>" +
      '<p class="s-amt"><span>선택 금액 <small>' + esc(m.unit) + ' 단위 · 최소 ' + esc(m.moq) + '</small></span><b id="s-amt">' + won(u * cur.qty) + "원</b></p>" +
      '<div class="s-act"><button type="button" class="btn" data-act="s-add-it">견적 목록에 담기</button><button type="button" class="btn line-l" data-act="s-buy">바로 견적서 받기</button></div><p class="s-added" id="s-added" hidden>' + SI.check + '견적 목록에 담았습니다 <a href="#/cart">견적 목록 보기</a></p></div></div>' +
      '<nav class="s-tabs" id="s-tabs" aria-label="상품 정보"><a href="#s-t-info" class="on">상세정보</a><a href="#s-t-rv">리뷰 <b>' + st.n + '</b></a><a href="#s-t-qa">문의 <b>' + qa.length + '</b></a><a href="#s-t-ret">교환·반품 안내</a></nav>' +
      '<section class="s-sec" id="s-t-info"><h2>상세정보</h2><table class="s-tbl s-spec"><tr><th>품명</th><td>' + esc(m.name) + "</td></tr><tr><th>분류</th><td>" + esc(MC[m.cat].name) + "</td></tr><tr><th>규격</th><td>" + m.specs.map(esc).join("<br>") + "</td></tr><tr><th>단위</th><td>" + esc(m.unit) + "</td></tr><tr><th>최소 주문</th><td>" + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + esc(co ? co.name + " · " + co.region + " " + co.city : "도아") + "</td></tr><tr><th>확인 항목</th><td>" + esc(okLine(co)) + "</td></tr><tr><th>견적 방식</th><td>견적 목록에 담고 계약서에 서명하면 견적서가 나옵니다. 대금은 견적 확정 뒤 판매 업체와 협의합니다.</td></tr></table>" +
      '<ul class="s-notes">' + (NOTE[m.cat] || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<figure class="s-big"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"><figcaption>' + esc(m.name + " · " + m.spec) + '</figcaption></figure><figure class="s-big"><img loading="lazy" src="' + photo((SITE[m.cat] || [m.ph])[0]) + '" alt="' + esc(MC[m.cat].name) + ' 현장"><figcaption>' + esc(MC[m.cat].name) + " 시공 현장</figcaption></figure></section>" +
      '<section class="s-sec s-howsec" id="s-t-how"><h2>구매 방법</h2><ol class="h-flow-l">' + GUIDE.map(function (g, i) { return '<li><span class="h-flow-n">STEP 0' + (i + 1) + '</span><i class="h-flow-dot" aria-hidden="true"></i><b>' + esc(g[0]) + "</b><p>" + esc(g[1]) + "</p></li>"; }).join("") + "</ol>" +
      '<table class="s-tbl s-paytbl"><tr id="s-t-pay"><th>결제</th><td>견적 확정 뒤 판매 업체와 협의 · 온라인 결제 없음 · 세금계산서 발행</td></tr><tr id="s-t-ship"><th>운송</th><td>' + esc(m.ship) + " · 화물차 현장 납품 · 1층 하차 기준 (층 올림은 따로 견적)</td></tr></table></section>" +
      '<section class="s-sec" id="s-t-rv"><div class="s-sec-h"><h2>리뷰 <b>' + st.n + '</b></h2><button type="button" class="btn s-wr" data-act="s-rv-open">리뷰 쓰기</button></div>' +
      '<div class="s-rv-sum"><div class="s-rv-avg"><b>' + avg(st) + "</b>" + stars(st.avg) + "<p>리뷰 " + st.n + '개 평균</p></div><ul class="s-rv-bars">' + bars + "</ul></div>" +
      (phs.length ? '<div class="s-rv-phs"><p class="s-lab">사진 리뷰 <span>' + phs.length + '</span></p><div class="s-rv-strip">' + phs.slice(0, 8).map(function (p, i) { return '<button type="button" data-act="s-rv-photo" aria-label="사진 리뷰만 보기 ' + (i + 1) + '"><img loading="lazy" src="' + esc(src(p)) + '" alt=""></button>'; }).join("") + "</div></div>" : "") +
      '<p class="s-rv-sort" role="group" aria-label="리뷰 정렬">' + [["new", "최신순"], ["rate", "평점순"], ["photo", "사진 리뷰만"]].map(function (o) { return '<button type="button" data-act="s-rv-sort" data-v="' + o[0] + '" class="' + (cur.sort === o[0] ? "on" : "") + '" aria-pressed="' + (cur.sort === o[0]) + '">' + o[1] + "</button>"; }).join("") + '</p><ul class="s-rv-list" id="s-rvl">' + rvList() + "</ul></section>" +
      '<section class="s-sec" id="s-t-qa"><div class="s-sec-h"><h2>문의 <b>' + qa.length + '</b></h2><button type="button" class="btn line-l s-wr" data-act="s-qa">상품 문의하기</button></div><ul class="s-qa">' + qa.map(function (x) {
        return '<li><p class="s-qa-q"><span>질문</span>' + esc(x.q) + '</p><p class="s-qa-m">' + esc(x.who) + " · " + day(x.at) + " · 답변 완료</p>" + (x.secret ? '<p class="s-qa-a s-qa-s">비밀 답변입니다. 질문한 회원과 판매 업체만 볼 수 있습니다.</p>' : '<p class="s-qa-a"><span>답변 · ' + esc(x.by) + "</span>" + esc(x.a) + "</p>") + "</li>";
      }).join("") + "</ul></section>" +
      '<section class="s-sec" id="s-t-ret"><h2>교환·반품 안내</h2><table class="s-tbl"><tr><th>신청 기간</th><td>받은 날부터 7일 안에 담당 매니저에게 알려 주세요.</td></tr><tr><th>비용</th><td>제품 하자나 다른 규격이 온 경우는 판매 업체가, 단순 변심은 구매자가 왕복 운송비를 냅니다.</td></tr><tr><th>교환·반품이 어려운 경우</th><td>절단·가공한 자재, 주문 제작 품목, 개봉해 사용한 자재, 현장 보관 중 젖거나 손상된 자재</td></tr><tr><th>문의</th><td>담당 매니저 · 대표번호 1588-9863</td></tr></table></section>' +
      '<div class="s-buy"><button type="button" class="btn" data-act="s-add-it">견적 목록에 담기</button><button type="button" class="btn line-l" data-act="s-buy">바로 견적서 받기</button></div></div>';
    var qi = document.getElementById("s-qty");
    qi.addEventListener("change", function () { cur.qty = fixQty(m, qi.value); qi.value = cur.qty; amt(); });
    var nav = document.getElementById("s-tabs");
    BG.spy(nav, function () { var h = document.getElementById("hd"); return (h ? h.offsetHeight : 64) + nav.offsetHeight; });
  }
  function spRows(m) {
    var parts = String(cur.spec || m.spec).split("·").map(function (x) { return x.trim(); }), last = m.name.split(" ").pop();
    var grade = /^[A-Z]{2,}\d/.test(last) ? last : m.name;
    return [["강종·재질", grade], ["규격", parts[0] || "—"], ["길이·크기", parts[1] || "—"], ["최소 주문", m.moq], ["출고", m.ship]].map(function (r, i) { return "<tr><th>" + esc(r[0]) + '</th><td' + (i === 1 || i === 2 ? ' class="s-spv"' : "") + ">" + esc(r[1]) + "</td></tr>"; }).join("");
  }
  function amt() { var e = document.getElementById("s-amt"); if (e) e.textContent = won(S.priceOf(cur.m) * cur.qty) + "원"; }
  function addCur() {
    var qi = document.getElementById("s-qty");
    if (qi) cur.qty = fixQty(cur.m, qi.value);
    S.addCart(cur.m.id, cur.qty, cur.spec); changed();
  }

  var MO = null;
  function closeModal() {
    if (!MO) return;
    (MO.files || []).forEach(function (x) { try { URL.revokeObjectURL(x.url); } catch (e) {} });
    MO.el.remove(); MO = null;
    document.body.classList.remove("s-mo-on");
    document.removeEventListener("keydown", escKey);
  }
  function escKey(e) { if (e.key === "Escape") closeModal(); }
  function shrink(url) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, 720 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * k)), h = Math.max(1, Math.round(im.naturalHeight * k));
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        try { c.getContext("2d").drawImage(im, 0, 0, w, h); res(c.toDataURL("image/jpeg", .8)); } catch (e) { res(null); }
      };
      im.onerror = function () { res(null); };
      im.src = url;
    });
  }
  var RATE = ["", "아쉬워요", "그저 그래요", "괜찮아요", "좋아요", "아주 좋아요"];
  function openReview() {
    closeModal();
    var m = cur.m, el = document.createElement("div");
    el.className = "s-modal"; el.id = "s-modal";
    el.innerHTML = '<div class="s-mo-bg" data-act="s-mo-x"></div><div class="s-mo" role="dialog" aria-modal="true" aria-labelledby="s-mo-t"><div class="s-mo-h"><h2 id="s-mo-t">리뷰 쓰기</h2><button type="button" class="s-mo-x" data-act="s-mo-x" aria-label="닫기">' + I.close + "</button></div>" +
      '<form id="s-rvf" novalidate><div class="s-mo-it"><img src="' + photo(m.ph) + '" alt=""><p><b>' + esc(m.name) + "</b><span>" + esc(CO[m.seller] ? CO[m.seller].name : "도아") + "</span></p></div>" +
      '<fieldset class="s-rate-in"><legend>별점</legend><div class="s-starsel">' + [1, 2, 3, 4, 5].map(function (k) { return '<button type="button" data-act="s-star" data-v="' + k + '" aria-label="별 ' + k + '개" aria-pressed="false">' + SI.star + "</button>"; }).join("") + '</div><p class="s-rate-t" id="s-rate-t">별을 눌러 주세요</p></fieldset>' +
      '<label class="s-fl"><span>고른 규격</span><span class="selbox"><select name="spec">' + m.specs.map(function (s) { return "<option" + (s === cur.spec ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" + I.down + "</span></label>" +
      '<label class="s-fl"><span>리뷰</span><textarea name="text" rows="5" maxlength="500" placeholder="받은 자재 상태, 출고 일정, 하차처럼 현장에서 겪은 일을 적어 주세요."></textarea><em class="s-tc" id="s-tc">0 / 500</em></label>' +
      '<div class="s-fl"><span>사진 <em>최대 3장</em></span><div class="s-ups" id="s-ups"><label class="s-up">' + SI.cam + '<span>사진 첨부</span><input type="file" id="s-file" accept="image/*" multiple></label></div></div>' +
      '<p class="s-err" id="s-rverr" role="alert"></p><button type="submit" class="btn s-wide">리뷰 등록</button></form></div>';
    document.body.appendChild(el);
    document.body.classList.add("s-mo-on");
    MO = { el: el, stars: 0, files: [] };
    document.addEventListener("keydown", escKey);
    var f = el.querySelector("#s-rvf"), ups = el.querySelector("#s-ups"), inp = el.querySelector("#s-file"), ta = f.text;
    ta.addEventListener("input", function () { el.querySelector("#s-tc").textContent = ta.value.length + " / 500"; el.querySelector("#s-rverr").textContent = ""; });
    function drawUps() {
      [].forEach.call(ups.querySelectorAll(".s-upi"), function (x) { x.remove(); });
      var lab = ups.querySelector(".s-up");
      MO.files.forEach(function (x, i) { lab.insertAdjacentHTML("beforebegin", '<span class="s-upi"><img src="' + x.url + '" alt="첨부한 사진 ' + (i + 1) + '"><button type="button" data-act="s-up-x" data-i="' + i + '" aria-label="사진 ' + (i + 1) + ' 빼기">' + I.close + "</button></span>"); });
      lab.hidden = MO.files.length >= 3;
    }
    MO.drawUps = drawUps;
    inp.addEventListener("change", function () {
      [].slice.call(inp.files || []).forEach(function (fl) { if (MO.files.length < 3 && /^image\//.test(fl.type)) MO.files.push({ f: fl, url: URL.createObjectURL(fl) }); });
      inp.value = ""; drawUps();
    });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var miss = [], text = ta.value.trim(), err = el.querySelector("#s-rverr");
      if (!MO.stars) miss.push("별점");
      if (text.length < 10) miss.push("리뷰 10자 이상");
      if (miss.length) { err.textContent = "확인해 주세요 — " + miss.join(", "); return; }
      var btn = f.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = "등록하는 중";
      var spec = f.spec.value, st = MO.stars;
      Promise.all(MO.files.map(function (x) { return shrink(x.url); })).then(function (urls) {
        var u = user(), who = u ? (u.id ? u.id.slice(0, 2) + "***" : (u.name || "회원").charAt(0) + "**") : "회원";
        var rv = { id: "u" + Date.now(), who: who, role: "", stars: st, text: text, spec: spec, at: Date.now(), photos: urls.filter(Boolean), mine: true };
        var all = A.keep("reviews") || {};
        all[m.id] = [rv].concat(all[m.id] || []);
        A.keep("reviews", all);
        var back = A.keep("reviews");
        if (!back || !back[m.id] || back[m.id][0].id !== rv.id) { rv.photos = []; all[m.id][0] = rv; A.keep("reviews", all); }
        closeModal();
        cur.sort = "new";
        drawItem();
        var sec = document.getElementById("s-t-rv"), h = document.getElementById("hd"), nav = document.getElementById("s-tabs");
        if (sec) window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - (h ? h.offsetHeight : 64) - (nav ? nav.offsetHeight : 0));
        var first = document.querySelector("#s-rvl .s-rv");
        if (first) BG.mo.play([first], "up", { y: 16 });
      });
    });
    var b1 = el.querySelector(".s-starsel button"); if (b1) b1.focus();
    if (!BG.reduced() && el.animate) el.querySelector(".s-mo").animate([{ transform: "translateY(24px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.7,.1,1)" });
  }

  function cartRows() {
    return S.cart.map(function (row, i) { var m = MT[row.id]; if (!m) return null; var u = S.priceOf(m); return { i: i, m: m, spec: row.spec || m.spec, qty: row.qty, unit: u, amt: u * row.qty, list: m.price * row.qty }; }).filter(Boolean);
  }
  function bySeller(rows) {
    var g = [], idx = {};
    rows.forEach(function (x) { var k = x.m.seller || "doa"; if (!(k in idx)) { idx[k] = g.length; g.push({ c: CO[k] || null, rows: [] }); } g[idx[k]].rows.push(x); });
    return g;
  }
  function cartRow(x) {
    var m = x.m;
    return '<article class="s-row"><a class="s-row-im" href="#/item/' + m.id + '"><img src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></a><div class="s-row-i"><h3><a href="#/item/' + m.id + '">' + esc(m.name) + "</a></h3>" +
      (m.specs.length > 1 ? '<label class="selbox s-row-sp"><select data-s-spec="' + x.i + '" aria-label="' + esc(m.name) + ' 규격">' + m.specs.map(function (s) { return "<option" + (s === x.spec ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" + I.down + "</label>" : '<p class="s-row-s">' + esc(x.spec) + "</p>") +
      '<p class="s-row-u">' + (S.member ? "회원가 " : "") + won(x.unit) + "원 / " + esc(m.unit) + " · 최소 " + esc(m.moq) + "</p></div>" +
      '<div class="s-row-q"><div class="qty"><button type="button" data-act="s-cq" data-i="' + x.i + '" data-d="-1" aria-label="수량 줄이기">' + I.minus + '</button><input data-s-qty="' + x.i + '" inputmode="numeric" value="' + x.qty + '" aria-label="' + esc(m.name) + ' 수량"><button type="button" data-act="s-cq" data-i="' + x.i + '" data-d="1" aria-label="수량 늘리기">' + I.plus + '</button></div><span>' + esc(m.unit) + "</span></div>" +
      '<p class="s-row-p">' + won(x.amt) + '원</p><button type="button" class="s-row-x" data-act="s-cdel" data-i="' + x.i + '" aria-label="' + esc(m.name) + ' 빼기">빼기</button></article>';
  }
  function sumBox() {
    var t = S.cartTotals();
    return '<aside class="s-sumb"><h2>견적 합계</h2><dl><div><dt>품목</dt><dd>' + t.count + "개</dd></div><div><dt>정가 합계</dt><dd>" + won(t.list) + "원</dd></div>" + (S.member ? "<div><dt>회원가 합계</dt><dd>" + won(t.pay) + "원</dd></div>" : "") + '<div class="t"><dt>견적 금액</dt><dd>' + won(t.pay) + "원</dd></div></dl>" +
      (S.member ? "" : '<p class="s-sumb-n"><a href="#/join">회원가입</a>하면 회원가로 다시 계산됩니다.</p>') + '<a class="btn s-wide" href="#/sign">계약서 쓰고 견적서 받기</a><p class="s-sumb-n">대금은 견적 확정 뒤 판매 업체와 협의합니다. 이 사이트에서는 결제하지 않습니다.</p></aside>';
  }
  function cart() {
    var rows = cartRows();
    app.innerHTML = '<div class="s-pg s-cartp">' + head("자재 견적 목록", "담은 자재를 입점 업체별로 모았습니다. 계약서에 서명하면 견적서가 나옵니다.", [["자재몰", "#/mall"], ["자재 견적 목록"]]) +
      (rows.length ? '<div class="s-cart"><div class="s-cl">' + bySeller(rows).map(function (g) {
        return '<section class="s-grp"><header class="s-grp-h"><p class="s-grp-n"><span>판매</span>' + (g.c ? '<a href="#/company/' + g.c.id + '">' + esc(g.c.name) + "</a>" : "도아") + '</p><p class="s-grp-m">' + esc(vendMeta(g.c)) + " · " + esc(okLine(g.c)) + "</p></header>" + g.rows.map(cartRow).join("") + "</section>";
      }).join("") + "</div>" + sumBox() + "</div>" : '<div class="s-empty"><p>담은 자재가 없습니다.</p><a class="btn" href="#/mall">자재몰로 가기</a></div>') + "</div>";
  }
  function redrawCart() { var y = window.scrollY; cart(); window.scrollTo(0, y); changed(); }
  function setSpec(i, spec) {
    var row = S.cart[i]; if (!row) return;
    var dup = S.cart.filter(function (r, k) { return k !== i && r.id === row.id && r.spec === spec; })[0];
    if (dup) { dup.qty += row.qty; S.cart.splice(i, 1); } else row.spec = spec;
    S.save();
  }

  function docItems(rows, foot) {
    return '<table class="s-dt"><thead><tr><th>품목</th><th>규격</th><th class="n">수량</th><th class="n">단가</th><th class="n">금액</th></tr></thead><tbody>' + rows.map(function (x) {
      return "<tr><td>" + esc(x.name) + '<small>' + esc(x.seller) + "</small></td><td>" + esc(x.spec) + '</td><td class="n">' + won(x.qty) + esc(x.unitName) + '</td><td class="n">' + won(x.unit) + '</td><td class="n">' + won(x.amt) + "</td></tr>";
    }).join("") + "</tbody>" + foot + "</table>";
  }
  function flat(rows) { return rows.map(function (x) { var c = CO[x.m.seller]; return { id: x.m.id, name: x.m.name, seller: c ? c.name : "도아", sellerId: x.m.seller, spec: x.spec, qty: x.qty, unitName: x.m.unit, unit: x.unit, list: x.list, amt: x.amt }; }); }
  function partyRows(items) {
    var g = [], idx = {};
    items.forEach(function (x) { if (!(x.sellerId in idx)) { idx[x.sellerId] = g.length; g.push({ c: CO[x.sellerId], names: [] }); } g[idx[x.sellerId]].names.push(x.name); });
    return g.map(function (x) { return "<li><b>" + esc(x.c ? x.c.name : "도아") + "</b><span>" + esc(x.c ? x.c.region + " " + x.c.city + " · " + okLine(x.c) : "") + "</span><em>" + esc(x.names.join(", ")) + "</em></li>"; }).join("");
  }
  var PAD = null;
  function signPad(cv, onInk) {
    var ctx = cv.getContext("2d"), strokes = [], line = null, ph = cv.parentNode.querySelector(".s-pad-ph");
    function draw() {
      var w = cv.width, h = cv.height, rw = cv.getBoundingClientRect().width || 1, d = w / rw;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#f2f4f6"; ctx.lineWidth = 2.6 * d;
      strokes.forEach(function (s) {
        ctx.beginPath();
        s.forEach(function (p, i) { if (i) ctx.lineTo(p[0] * w, p[1] * w); else ctx.moveTo(p[0] * w, p[1] * w); });
        if (s.length === 1) ctx.lineTo(s[0][0] * w + .5, s[0][1] * w + .5);
        ctx.stroke();
      });
      if (ph) ph.hidden = strokes.length > 0;
    }
    function fit() {
      if (!document.body.contains(cv)) { window.removeEventListener("resize", fit); return; }
      var r = cv.getBoundingClientRect(), dp = Math.min(window.devicePixelRatio || 1, 3), w = Math.max(1, Math.round(r.width * dp)), h = Math.max(1, Math.round(r.height * dp));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      draw();
    }
    function pt(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.width]; }
    cv.addEventListener("pointerdown", function (e) { if (e.button > 0) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} line = [pt(e)]; strokes.push(line); draw(); });
    cv.addEventListener("pointermove", function (e) {
      if (!line) return; e.preventDefault();
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      (evs.length ? evs : [e]).forEach(function (x) { line.push(pt(x)); });
      draw();
    });
    function end() { if (line) { line = null; onInk(); } }
    cv.addEventListener("pointerup", end);
    cv.addEventListener("pointercancel", end);
    cv.addEventListener("lostpointercapture", end);
    cv.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
    window.addEventListener("resize", fit);
    fit();
    requestAnimationFrame(fit);
    return { empty: function () { return !strokes.length; }, clear: function () { strokes = []; draw(); onInk(); }, data: function () { return cv.toDataURL("image/png"); }, fit: fit };
  }
  function sign() {
    var rows = cartRows();
    if (!rows.length) {
      app.innerHTML = '<div class="s-pg">' + head("계약서 쓰고 견적서 받기", "", [["견적서 받기", "#/quote"], ["계약서 서명"]]) + '<div class="s-empty"><p>견적 목록에 담은 자재가 없습니다. 자재를 먼저 담아 주세요.</p><a class="btn" href="#/mall">자재몰로 가기</a></div></div>';
      return;
    }
    var u = user() || {}, items = flat(rows), t = S.cartTotals();
    var foot = "<tfoot>" + (S.member ? '<tr><th colspan="4">정가 합계</th><td class="n">' + won(t.list) + "</td></tr>" : "") + '<tr class="t"><th colspan="4">견적 금액 (원)</th><td class="n">' + won(t.pay) + "</td></tr></tfoot>";
    app.innerHTML = '<div class="s-pg s-signp">' + head("계약서 쓰고 견적서 받기", "계약서 내용을 확인하고 서명하면 견적서가 바로 나옵니다. 대금은 견적 확정 뒤 협의하며, 이 화면에서는 결제가 일어나지 않습니다.", [["견적서 받기", "#/quote"], ["자재 견적 목록", "#/cart"], ["계약서 서명"]]) +
      '<div class="s-sign"><article class="s-doc" aria-label="자재 공급 계약서 미리보기"><header class="s-doc-h"><p>계약서 미리보기</p><h2>자재 공급 계약서</h2><p>작성일 ' + day(Date.now()) + "</p></header>" +
      '<dl class="s-doc-pt"><div><dt>공급자</dt><dd><ul class="s-pts">' + partyRows(items) + '</ul></dd></div><div><dt>구매자</dt><dd id="s-doc-buyer">' + esc(u.company || u.name || "구매자 회사명을 적어 주세요") + "</dd></div><div><dt>중개</dt><dd>도아 · (주)더원파트너스 (대표 권병철 · 대표번호 1588-9863)</dd></div></dl>" +
      '<p class="s-doc-p">공급자와 구매자는 아래 자재의 공급에 관하여 다음과 같이 계약합니다.</p>' + docItems(items, foot) +
      '<ol class="s-arts"><li><b>제1조 (목적)</b> 이 계약은 공급자가 위 표의 자재를 구매자가 정한 현장에 납품하고, 구매자가 이를 인수하는 데 필요한 사항을 정합니다.</li>' +
      "<li><b>제2조 (납품 조건)</b> 납품 장소는 구매자가 정한 현장이며, 납기는 품목별 출고 기준(당일 출고·2일·3일·주문 제작 7일)에 따릅니다. 하차는 1층 하차를 기준으로 하고 층 올림은 따로 정합니다.</li>" +
      "<li><b>제3조 (대금)</b> 대금은 견적 확정 뒤 공급자와 구매자가 협의하여 정합니다. 이 계약서 서명으로 결제가 일어나지 않습니다.</li>" +
      "<li><b>제4조 (검수와 교환)</b> 구매자는 받은 날부터 7일 안에 수량과 상태를 확인하고, 하자가 있으면 공급자가 교환합니다. 절단·가공한 자재와 주문 제작 품목은 교환하지 않습니다.</li>" +
      "<li><b>제5조 (중개)</b> 도아는 거래를 중개하며, 담당 매니저가 견적 확정과 납품 일정 조율을 돕습니다.</li></ol>" +
      '<div class="s-pi"><b>개인정보 수집·이용 동의</b><p>수집 항목 회사명, 서명자 이름, 휴대폰 번호 · 이용 목적 견적서 발급과 납품 연락 · 보유 기간 거래가 끝난 뒤 5년</p></div>' +
      '<div class="s-doc-sg"><p>구매자 <b id="s-doc-who">' + esc(u.name || "") + '</b> (서명)</p><span class="s-doc-im"><img id="s-doc-sig" alt="구매자 서명" hidden></span></div></article>' +
      '<form class="s-sform" id="s-sform" novalidate><h2>서명</h2>' +
      '<label class="s-fl"><span>구매자 회사명</span><input class="inp" name="buyer" value="' + esc(u.company || "") + '" autocomplete="organization" placeholder="개인은 이름을 적어 주세요"></label>' +
      '<label class="s-fl"><span>서명자 이름</span><input class="inp" name="signer" value="' + esc(u.name || "") + '" autocomplete="name"></label>' +
      '<label class="s-fl"><span>휴대폰</span><input class="inp" name="phone" value="' + esc(u.phone || "") + '" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label>' +
      '<label class="s-fl"><span>납품 현장 <em>선택</em></span><input class="inp" name="site" placeholder="예: 경기 용인시 처인구 신축 현장"></label>' +
      '<div class="s-fl"><span>서명 <em>손가락이나 마우스로 그려 주세요</em></span><div class="s-pad"><canvas id="s-cv" aria-label="서명 칸"></canvas><p class="s-pad-ph" aria-hidden="true">여기에 서명해 주세요</p><button type="button" class="s-pad-x" data-act="s-clear">' + SI.erase + "지우기</button></div></div>" +
      '<label class="s-cb"><input type="checkbox" name="ag1"><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>[필수] 계약서 내용을 확인했고 동의합니다</span></label>" +
      '<label class="s-cb"><input type="checkbox" name="ag2"><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>[필수] 개인정보 수집·이용에 동의합니다</span></label>" +
      '<p class="s-err" id="s-serr" role="alert"></p><button type="submit" class="btn s-wide">서명하고 견적서 받기</button><p class="s-note">결제는 일어나지 않습니다. 담당 매니저가 견적을 확인한 뒤 연락드립니다.</p></form></div></div>';
    var f = document.getElementById("s-sform"), sig = document.getElementById("s-doc-sig");
    PAD = signPad(document.getElementById("s-cv"), function () { if (PAD && !PAD.empty()) { sig.src = PAD.data(); sig.hidden = false; } else { sig.hidden = true; sig.removeAttribute("src"); } });
    f.buyer.addEventListener("input", function () { document.getElementById("s-doc-buyer").textContent = f.buyer.value.trim() || "구매자 회사명을 적어 주세요"; });
    f.signer.addEventListener("input", function () { document.getElementById("s-doc-who").textContent = f.signer.value.trim(); });
    f.addEventListener("change", function () { var e = document.getElementById("s-serr"); if (e) e.textContent = ""; });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var miss = [], first = null;
      function need(ok, name, el) { if (!ok) { miss.push(name); if (!first) first = el; } }
      need(f.buyer.value.trim(), "구매자 회사명", f.buyer);
      need(f.signer.value.trim(), "서명자 이름", f.signer);
      need(/^01\d{8,9}$/.test(f.phone.value.replace(/\D/g, "")), "휴대폰 번호", f.phone);
      need(PAD && !PAD.empty(), "서명", document.getElementById("s-cv"));
      need(f.ag1.checked, "계약서 내용 동의", f.ag1);
      need(f.ag2.checked, "개인정보 수집·이용 동의", f.ag2);
      var err = document.getElementById("s-serr");
      if (miss.length) { err.textContent = "빠진 것이 있습니다 — " + miss.join(", "); if (first && first.focus) first.focus({ preventScroll: true }); if (first) first.scrollIntoView({ block: "center", behavior: BG.reduced() ? "auto" : "smooth" }); return; }
      var list = myQuotes(), now = new Date(), no = "DOA-" + String(now.getFullYear()).slice(2) + pad2(now.getMonth() + 1) + pad2(now.getDate()) + "-" + ("00" + (list.length + 1)).slice(-3);
      var qd = { no: no, at: now.getTime(), buyer: f.buyer.value.trim(), signer: f.signer.value.trim(), phone: f.phone.value.trim(), site: f.site.value.trim(), items: items, list: t.list, pay: t.pay, member: S.member, sig: PAD.data() };
      list.unshift(qd);
      A.keep("myquotes", list.slice(0, 12));
      S.cart = []; S.save(); changed();
      location.hash = "#/quote/done?no=" + no;
    });
  }
  function done(r) {
    var list = myQuotes(), qd = r.query.no ? list.filter(function (x) { return x.no === r.query.no; })[0] : list[0];
    if (!qd) {
      app.innerHTML = '<div class="s-pg">' + head("견적서", "", [["견적서 받기", "#/quote"], ["견적서"]]) + '<div class="s-empty"><p>아직 받은 견적서가 없습니다.</p><a class="btn" href="#/quote">견적서 받기로 가기</a></div></div>';
      return;
    }
    var foot = "<tfoot>" + (qd.member ? '<tr><th colspan="4">정가 합계</th><td class="n">' + won(qd.list) + "</td></tr>" : "") + '<tr class="t"><th colspan="4">견적 금액 (원)</th><td class="n">' + won(qd.pay) + "</td></tr></tfoot>";
    app.innerHTML = '<div class="s-pg s-donep">' + head("견적서 받기 완료", "서명한 계약서로 견적서가 나왔습니다. 담당 매니저가 확인 후 연락드립니다.", [["견적서 받기", "#/quote"], ["견적서"]]) +
      '<div class="s-done"><article class="s-doc s-qdoc"><header class="s-doc-h"><p>도아 BUILDGO 자재 견적</p><h2>견적서</h2></header>' +
      '<dl class="s-qmeta"><div><dt>견적번호</dt><dd>' + esc(qd.no) + "</dd></div><div><dt>견적일</dt><dd>" + day(qd.at) + "</dd></div><div><dt>수신</dt><dd>" + esc(qd.buyer) + " 귀하</dd></div><div><dt>유효 기간</dt><dd>견적일부터 14일</dd></div>" + (qd.site ? "<div><dt>납품 현장</dt><dd>" + esc(qd.site) + "</dd></div>" : "") + "</dl>" +
      '<dl class="s-doc-pt"><div><dt>공급자</dt><dd><ul class="s-pts">' + partyRows(qd.items) + "</ul></dd></div><div><dt>중개</dt><dd>도아 · (주)더원파트너스 · 대표 권병철 · 사업자 399-86-03838 · 서울 영등포구 국회대로 800 317호 · 1588-9863</dd></div></dl>" +
      docItems(qd.items, foot) +
      '<div class="s-qfoot"><p class="s-qmsg">담당 매니저가 확인 후 연락드립니다.</p><div class="s-qsig"><p>구매자 서명<span>' + esc(qd.signer) + " · " + day(qd.at) + '</span></p><span class="s-doc-im"><img src="' + esc(qd.sig || "") + '" alt="구매자 서명"></span></div></div></article>' +
      '<aside class="s-done-a"><button type="button" class="btn s-wide" data-act="s-dl">견적서 내려받기</button><a class="btn line-l s-wide" href="#/quote">견적서 받기 화면으로</a><a class="btn line-l s-wide" href="#/mall">자재 더 보기</a>' +
      '<ol class="s-flow"><li><b>담당 매니저 확인</b><span>견적서와 서명한 계약서를 확인합니다.</span></li><li><b>공급자와 견적 확정</b><span>재고와 출고일을 입점 업체와 맞춥니다.</span></li><li><b>대금 협의 · 납품 일정</b><span>확정된 견적으로 대금과 납품일을 정합니다.</span></li></ol></aside></div></div>';
  }

  function reqName(x) {
    var c = CO[x.to], e = EX[x.to];
    if (c) return { n: c.name, s: A.typeName(c.type) + " · " + c.region + " " + c.city, href: "#/company/" + c.id, k: "업체 상담" };
    if (e) return { n: e.name + " " + e.title, s: e.region + " · 경력 " + e.years + "년", href: "#/expert/" + e.id, k: "전문가 상담" };
    if (x.to === "pm") return { n: "PM 상담", s: "도아 PM 담당", href: "#/pm", k: "PM 상담" };
    if (x.to === "finance") return { n: "금융 상담", s: "도아 금융 담당", href: "#/finance", k: "금융 상담" };
    return { n: String(x.title || x.to || "상담 요청"), s: x.label || "", href: "#/quote", k: x.kind === "expert" ? "전문가 상담" : "업체 상담" };
  }
  function answers(a, rows) {
    if (Array.isArray(rows) && rows.length) return '<dl class="s-ans">' + rows.filter(function (x) { return x && x[1]; }).slice(0, 4).map(function (x) { return "<div><dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") + "</dl>";
    if (!a || typeof a !== "object") return "";
    var keys = Object.keys(a).filter(function (k) { var v = a[k]; return v != null && v !== "" && typeof v !== "object" || Array.isArray(v); }).slice(0, 4);
    return keys.length ? '<dl class="s-ans">' + keys.map(function (k) { var v = a[k]; return "<div><dt>" + esc(k) + "</dt><dd>" + esc(Array.isArray(v) ? v.join(", ") : v) + "</dd></div>"; }).join("") + "</dl>" : "";
  }
  function doorsHtml(big) {
    return '<div class="s-doors' + (big ? " s-doors-big" : "") + '">' + DOORS.map(function (d) { return '<a class="s-door" href="' + d.href + '"><span class="s-door-im"><img loading="lazy" src="' + photo(d.ph) + '" alt=""></span><span class="s-door-b"><b>' + esc(d.t) + "</b><span>" + esc(d.d) + "</span><em>" + esc(d.t) + " 가기 " + I.arrow + "</em></span></a>"; }).join("") + "</div>";
  }
  function quote(r) {
    if (r.id === "done") return done(r);
    if (r.query.to && A.views.match) { location.replace("#/match?to=" + encodeURIComponent(r.query.to)); return; }
    var rows = cartRows(), rq = reqs().slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); }), qs = myQuotes(), t = S.cartTotals(), emptyAll = !rows.length && !rq.length && !qs.length;
    var html = '<div class="s-pg s-hub">' + head("견적서 받기", emptyAll ? "업체 찾기·전문가 찾기·자재몰을 한곳에서 받습니다. 먼저 찾으실 것을 골라 주세요." : "업체·전문가 상담 요청과 자재 견적을 한곳에서 확인합니다. 담당 매니저가 확인한 뒤 연락드립니다.", [["견적서 받기"]]);
    if (emptyAll) {
      html += doorsHtml(true) + '<p class="s-hub-n">고르신 업체·전문가에 상담을 요청하거나 자재를 담으면 이 화면에 모입니다. 담당 매니저가 확인한 뒤 연락드립니다.</p>';
    } else {
      html += '<dl class="s-hub-sum"><div><dt>자재 견적 목록</dt><dd>' + rows.length + '품목</dd></div><div><dt>상담 요청</dt><dd>' + rq.length + "건</dd></div><div><dt>받은 견적서</dt><dd>" + qs.length + "건</dd></div></dl>";
      html += '<section class="s-hs"><div class="s-hs-h"><h2>자재 견적 목록</h2>' + (rows.length ? '<a class="s-more" href="#/cart">목록 고치기 ' + I.arrow + "</a>" : "") + "</div>" +
        (rows.length ? '<ul class="s-mini">' + rows.map(function (x) { return '<li><img src="' + photo(x.m.ph) + '" alt=""><p><b>' + esc(x.m.name) + "</b><span>" + esc((CO[x.m.seller] ? CO[x.m.seller].name + " · " : "") + x.spec + " · " + won(x.qty) + x.m.unit) + "</span></p><strong>" + won(x.amt) + "원</strong></li>"; }).join("") + '</ul><div class="s-hs-f"><p>견적 금액 <b>' + won(t.pay) + '원</b></p><a class="btn" href="#/sign">계약서 쓰고 견적서 받기</a></div>' : '<p class="s-hs-e">담은 자재가 없습니다. <a href="#/mall">자재몰</a>에서 담으면 여기에 모입니다.</p>') + "</section>";
      html += '<section class="s-hs"><div class="s-hs-h"><h2>업체·전문가 상담 요청</h2></div>' + (rq.length ? '<ul class="s-rqs">' + rq.map(function (x) {
        var nm = reqName(x);
        return '<li class="s-rq"><div class="s-rq-i"><p class="s-rq-k">' + esc(nm.k) + (x.at ? " · " + day(x.at) : "") + '</p><h3><a href="' + nm.href + '">' + esc(nm.n) + "</a></h3>" + (nm.s ? '<p class="s-rq-s">' + esc(nm.s) + "</p>" : "") + answers(x.answers, x.rows) + '</div><p class="s-rq-st">매니저 확인 중</p></li>';
      }).join("") + "</ul>" : '<p class="s-hs-e">아직 보낸 상담 요청이 없습니다. <a href="#/companies">업체 찾기</a>나 <a href="#/experts">전문가 찾기</a>에서 요청하면 여기에 모입니다.</p>') + "</section>";
      if (qs.length) html += '<section class="s-hs"><div class="s-hs-h"><h2>받은 견적서</h2></div><ul class="s-qs">' + qs.map(function (x) { return '<li><a href="#/quote/done?no=' + encodeURIComponent(x.no) + '"><b>' + esc(x.no) + "</b><span>" + day(x.at) + " · " + esc(x.items[0] ? x.items[0].name : "") + (x.items.length > 1 ? " 외 " + (x.items.length - 1) + "품목" : "") + "</span><strong>" + won(x.pay) + "원</strong>" + I.arrow + "</a></li>"; }).join("") + "</ul></section>";
      html += '<section class="s-hs"><div class="s-hs-h"><h2>더 담으러 가기</h2></div>' + doorsHtml(false) + "</section>";
    }
    app.innerHTML = html + "</div>";
  }

  var J = null;
  function join(r) {
    var k = r.query.kind === "biz" || r.query.kind === "person" ? r.query.kind : "";
    J = { step: k ? 2 : 1, kind: k, f: {}, p: [], ref: "" };
    drawJoin(false);
  }
  function fv(n) { return esc(J.f[n] || ""); }
  function joinBody() {
    if (J.step === 1) {
      return '<div class="s-kinds"><button type="button" class="s-kind" data-act="s-kind" data-k="biz"><span class="s-kind-im"><img src="' + photo("hero_rise") + '" alt=""></span><span class="s-kind-b"><b>업체 입점 (사업자)</b><span>시행·시공·자재·설계·PM·금융 업체로 입점해 상담과 견적 요청을 받습니다.</span><em>사업자등록번호로 가입 ' + I.arrow + "</em></span></button>" +
        '<button type="button" class="s-kind" data-act="s-kind" data-k="person"><span class="s-kind-im"><img src="' + photo("site_aerial") + '" alt=""></span><span class="s-kind-b"><b>일반회원 (개인)</b><span>토지·기술·자본을 가지고 계신 분, 자재를 사려는 분이 가입합니다.</span><em>휴대폰 번호로 가입 ' + I.arrow + "</em></span></button></div>";
    }
    if (J.step === 2) {
      var biz = J.kind === "biz";
      return '<form class="s-jf" id="s-jf" novalidate><p class="s-jk">' + (biz ? "업체 입점 (사업자)" : "일반회원 (개인)") + ' <button type="button" class="s-link" data-act="s-jprev">회원 종류 바꾸기</button></p><div class="s-jg">' +
        (biz ? '<label class="s-fl"><span>회사명</span><input class="inp" name="company" value="' + fv("company") + '" autocomplete="organization"></label><label class="s-fl"><span>사업자등록번호</span><input class="inp" name="bizNo" value="' + fv("bizNo") + '" inputmode="numeric" placeholder="000-00-00000"></label><label class="s-fl"><span>담당자 이름</span><input class="inp" name="name" value="' + fv("name") + '" autocomplete="name"></label>' : '<label class="s-fl"><span>이름</span><input class="inp" name="name" value="' + fv("name") + '" autocomplete="name"></label>') +
        '<label class="s-fl"><span>휴대폰</span><input class="inp" name="phone" value="' + fv("phone") + '" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label>' +
        '<label class="s-fl"><span>아이디</span><input class="inp" name="id" value="' + fv("id") + '" autocomplete="username" placeholder="영문·숫자 4자 이상"></label><label class="s-fl"><span>비밀번호</span><input class="inp" type="password" name="pw" autocomplete="new-password" placeholder="8자 이상"></label></div>' +
        (biz ? '<fieldset class="s-fs"><legend>업종</legend><div class="s-chips">' + FIELDS.map(function (x) { return '<label class="s-chip"><input type="radio" name="field" value="' + x[0] + '"' + (J.f.field === x[0] ? " checked" : "") + "><span>" + x[1] + "</span></label>"; }).join("") + "</div></fieldset>" : "") +
        '<p class="s-err" id="s-jerr" role="alert"></p><div class="s-jact"><button type="button" class="btn line-l" data-act="s-jprev">이전</button><button type="submit" class="btn">다음</button></div></form>';
    }
    return '<form class="s-jf" id="s-jf" novalidate><fieldset class="s-fs"><legend>가입 목적 <em>여러 개 고를 수 있습니다</em></legend><div class="s-pur">' + PURPOSES.map(function (x) { return '<label class="s-cb s-pur-i"><input type="checkbox" name="pur" value="' + x[0] + '"' + (J.p.indexOf(x[0]) >= 0 ? " checked" : "") + '><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>" + x[1] + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<label class="s-fl s-ref"><span>추천인 아이디 <em>선택</em></span><input class="inp" name="ref" value="' + esc(J.ref) + '" placeholder="추천해 준 회원의 아이디"></label><p class="s-refn">가입하면 추천인에게 포인트가 적립됩니다. 포인트는 가입 추천 적립과 관리자 지급으로만 쌓입니다.</p>' +
      '<label class="s-cb"><input type="checkbox" name="agree"><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>[필수] 이용약관과 개인정보 수집·이용에 동의합니다</span></label>" +
      '<p class="s-err" id="s-jerr" role="alert"></p><div class="s-jact"><button type="button" class="btn line-l" data-act="s-jprev">이전</button><button type="submit" class="btn">가입하기</button></div></form>';
  }
  function drawJoin(anim) {
    var had = user();
    app.innerHTML = '<div class="s-pg s-joinp">' + head("회원가입", "가입 목적을 알려 주시면 자주 찾으실 업체·전문가·자재를 골라 첫 화면에 보여 드립니다.", [["회원가입"]]) +
      '<div class="s-join"><ol class="s-steps">' + ["회원 종류", "정보 입력", "가입 목적"].map(function (t, i) { var n = i + 1; return '<li class="' + (J.step === n ? "on" : J.step > n ? "ok" : "") + '"' + (J.step === n ? ' aria-current="step"' : "") + "><span>" + t + "</span></li>"; }).join("") + "</ol>" +
      (had && J.step === 1 ? '<p class="s-had">이미 가입한 정보가 있습니다. 다시 가입하면 새 정보로 바뀝니다. <a href="#/my">내 정보 보기</a></p>' : "") +
      '<div class="s-jb" id="s-jb">' + joinBody() + "</div></div></div>";
    var f = document.getElementById("s-jf");
    if (f) f.addEventListener("submit", function (ev) { ev.preventDefault(); J.step === 2 ? step2(f) : step3(f); });
    if (anim) {
      var top = document.querySelector(".s-steps"), hd = document.getElementById("hd");
      if (top && top.getBoundingClientRect().top < 0) window.scrollTo(0, top.getBoundingClientRect().top + window.scrollY - (hd ? hd.offsetHeight : 64) - 20);
      BG.mo.play(app.querySelectorAll(".s-jb > *, .s-kind"), "up", { y: 16, stagger: 60 });
    }
  }
  function step2(f) {
    var biz = J.kind === "biz", miss = [], first = null;
    function need(ok, n, el) { if (!ok) { miss.push(n); if (!first) first = el; } }
    ["company", "bizNo", "name", "phone", "id"].forEach(function (n) { if (f[n]) J.f[n] = f[n].value.trim(); });
    var fd = f.querySelector('input[name="field"]:checked'); J.f.field = fd ? fd.value : "";
    if (biz) { need(J.f.company, "회사명", f.company); need(J.f.bizNo.replace(/\D/g, "").length === 10, "사업자등록번호 10자리", f.bizNo); need(J.f.name, "담당자 이름", f.name); }
    else need(J.f.name, "이름", f.name);
    need(/^01\d{8,9}$/.test(J.f.phone.replace(/\D/g, "")), "휴대폰 번호", f.phone);
    need(/^[A-Za-z0-9_]{4,20}$/.test(J.f.id), "아이디(영문·숫자 4자 이상)", f.id);
    need(f.pw.value.length >= 8, "비밀번호 8자 이상", f.pw);
    if (biz) need(J.f.field, "업종", f.querySelector('input[name="field"]'));
    if (miss.length) { document.getElementById("s-jerr").textContent = "확인해 주세요 — " + miss.join(", "); if (first) first.focus(); return; }
    J.step = 3; drawJoin(true);
  }
  function step3(f) {
    J.p = [].map.call(f.querySelectorAll('input[name="pur"]:checked'), function (x) { return x.value; });
    J.ref = f.ref.value.trim();
    var miss = [];
    if (!J.p.length) miss.push("가입 목적 1개 이상");
    if (!f.agree.checked) miss.push("약관 동의");
    if (miss.length) { document.getElementById("s-jerr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
    var biz = J.kind === "biz";
    var u = { kind: J.kind, name: J.f.name, company: biz ? J.f.company : "", purposes: J.p, referrer: J.ref, points: [], id: J.f.id, phone: J.f.phone, field: biz ? J.f.field : "", bizNo: biz ? J.f.bizNo : "", at: Date.now() };
    A.keep("user", u);
    S.member = true; S.save();
    A.sync && A.sync();
    changed();
    welcome(u);
  }
  function recHtml(rec) {
    var parts = [];
    if (rec.companies.length) parts.push('<section><h3>추천 업체</h3><ul class="s-rec-l">' + rec.companies.map(function (c) { return '<li><a href="#/company/' + c.id + '"><img loading="lazy" src="' + photo(c.projects && c.projects[0] ? c.projects[0].ph : "hero_rise") + '" alt=""><span><b>' + esc(c.name) + "</b><em>" + esc(A.typeName(c.type) + " · " + c.region + " " + c.city + " · 실적 " + c.count + "건") + "</em></span></a></li>"; }).join("") + "</ul></section>");
    if (rec.experts.length) parts.push('<section><h3>추천 전문가</h3><ul class="s-rec-l">' + rec.experts.map(function (x) { return '<li><a href="#/expert/' + x.id + '"><span class="s-ini" aria-hidden="true">' + esc(BG.initial(x.name)) + "</span><span><b>" + esc(x.name + " " + x.title) + "</b><em>" + esc(x.region + " · 경력 " + x.years + "년") + "</em></span></a></li>"; }).join("") + "</ul></section>");
    if (rec.materials.length) parts.push('<section><h3>추천 자재</h3><ul class="s-rec-l">' + rec.materials.map(function (m) { return '<li><a href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt=""><span><b>' + esc(m.name) + "</b><em>" + esc((CO[m.seller] ? CO[m.seller].name : "도아") + " · 회원가 " + won(S.priceOf(m)) + "원 / " + m.unit) + "</em></span></a></li>"; }).join("") + "</ul></section>");
    if (rec.services.length) parts.push('<section><h3>도아 상담</h3><ul class="s-rec-l">' + rec.services.map(function (s) { return '<li><a href="' + s.href + '"><img loading="lazy" src="' + photo(s.ph) + '" alt=""><span><b>' + esc(s.name) + "</b><em>" + esc(s.desc) + "</em></span></a></li>"; }).join("") + "</ul></section>");
    return '<div class="s-rec">' + parts.join("") + "</div>";
  }
  function welcome(u) {
    var rec = recommend(u), names = PURPOSES.filter(function (x) { return u.purposes.indexOf(x[0]) >= 0; }).map(function (x) { return x[1]; });
    app.innerHTML = '<div class="s-pg s-welp">' + head("가입을 환영합니다", (u.company ? u.company + " " : "") + u.name + "님께 맞는 업체·전문가·자재를 골라 두었습니다. 첫 화면에서도 같은 추천을 보실 수 있습니다.", [["회원가입", "#/join"], ["가입 완료"]]) +
      '<div class="s-wel"><dl class="s-wsum"><div><dt>회원 종류</dt><dd>' + (u.kind === "biz" ? "업체 입점 (사업자)" : "일반회원 (개인)") + "</dd></div><div><dt>가입 목적</dt><dd>" + esc(names.join(", ")) + "</dd></div>" + (u.referrer ? "<div><dt>추천인</dt><dd>" + esc(u.referrer) + " · 추천인에게 포인트가 적립됩니다</dd></div>" : "") + "</dl>" + recHtml(rec) +
      '<div class="s-btns"><a class="btn" href="#/">첫 화면에서 추천 보기</a><a class="btn line-l" href="#/my">내 정보</a></div></div></div>';
    window.scrollTo(0, 0);
    BG.mo.play(app.querySelectorAll(".s-head h1, .s-head .s-sub, .s-wsum, .s-rec section, .s-btns"), "up", { y: 18, stagger: 80 });
  }

  function login(r) {
    app.innerHTML = '<div class="s-pg s-loginp">' + head("로그인", "가입한 아이디로 로그인하면 회원가와 내 견적·상담 요청을 볼 수 있습니다.", [["로그인"]]) +
      '<form class="s-login" id="s-lf" novalidate><label class="s-fl"><span>아이디</span><input class="inp" name="id" autocomplete="username"></label><label class="s-fl"><span>비밀번호</span><input class="inp" type="password" name="pw" autocomplete="current-password"></label>' +
      '<p class="s-err" id="s-lerr" role="alert"></p><button type="submit" class="btn s-wide" data-act="s-login">로그인</button><div class="s-lj"><p>아직 회원이 아니신가요?</p><div><a class="btn line-l" href="#/join?kind=biz">업체 입점 (사업자)</a><a class="btn line-l" href="#/join?kind=person">일반회원 (개인)</a></div></div></form></div>';
    document.getElementById("s-lf").addEventListener("submit", function (ev) { ev.preventDefault(); doLogin(r); });
  }
  function doLogin(r) {
    var f = document.getElementById("s-lf"); if (!f) return;
    var u = user(), err = document.getElementById("s-lerr"), id = f.id.value.trim();
    if (!u) { err.innerHTML = '가입한 정보가 없습니다. 회원가입을 먼저 해 주세요. <a href="#/join">회원가입</a>'; return; }
    if (!id || !f.pw.value) { err.textContent = "아이디와 비밀번호를 적어 주세요."; return; }
    if (u.id && id !== u.id) { err.textContent = "아이디나 비밀번호를 다시 확인해 주세요."; return; }
    S.member = true; S.save(); A.sync && A.sync(); changed();
    location.hash = (r && r.query.back) || "#/my";
  }
  function my() {
    var u = user();
    if (!S.member || !u) {
      app.innerHTML = '<div class="s-pg">' + head("내 정보", "", [["내 정보"]]) + '<div class="s-empty"><p>' + (u ? "로그인하면 내 정보와 포인트를 볼 수 있습니다." : "가입하면 내 정보와 포인트, 견적·상담 요청을 한곳에서 봅니다.") + '</p><div class="s-btns">' + (u ? '<a class="btn" href="#/login">로그인</a>' : '<a class="btn" href="#/join">회원가입</a><a class="btn line-l" href="#/login">로그인</a>') + "</div></div></div>";
      return;
    }
    var pts = Array.isArray(u.points) ? u.points : [], total = pts.reduce(function (s, x) { return s + (+x.amt || 0); }, 0), rq = reqs(), qs = myQuotes();
    var names = PURPOSES.filter(function (x) { return (u.purposes || []).indexOf(x[0]) >= 0; }).map(function (x) { return x[1]; });
    var fname = (FIELDS.filter(function (x) { return x[0] === u.field; })[0] || [])[1];
    var phone = String(u.phone || "").replace(/\D/g, ""), ph = phone.length >= 10 ? phone.slice(0, 3) + "-****-" + phone.slice(-4) : u.phone || "";
    app.innerHTML = '<div class="s-pg s-myp">' + head("내 정보", (u.company ? u.company + " " : "") + u.name + "님", [["내 정보"]]) +
      '<div class="s-my"><section class="s-hs"><div class="s-hs-h"><h2>가입 정보</h2></div><table class="s-tbl"><tr><th>회원 종류</th><td>' + (u.kind === "biz" ? "업체 입점 (사업자)" : "일반회원 (개인)") + "</td></tr>" + (u.company ? "<tr><th>회사명</th><td>" + esc(u.company) + "</td></tr>" : "") + "<tr><th>" + (u.kind === "biz" ? "담당자" : "이름") + "</th><td>" + esc(u.name) + "</td></tr>" + (fname ? "<tr><th>업종</th><td>" + esc(fname) + "</td></tr>" : "") + "<tr><th>휴대폰</th><td>" + esc(ph) + "</td></tr><tr><th>아이디</th><td>" + esc(u.id || "") + "</td></tr><tr><th>가입 목적</th><td>" + esc(names.join(", ") || "—") + "</td></tr>" + (u.referrer ? "<tr><th>추천인</th><td>" + esc(u.referrer) + "</td></tr>" : "") + "</table></section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>포인트</h2><p class="s-pt"><b>' + won(total) + "</b>P</p></div>" +
      '<p class="s-pt-n">포인트는 가입 추천 적립과 관리자 지급으로만 쌓입니다. 내 아이디 <b>' + esc(u.id || "") + "</b>를 추천인으로 적고 가입한 회원이 생기면 적립됩니다.</p>" +
      '<table class="s-tbl s-ptt"><thead><tr><th>일자</th><th>내용</th><th>구분</th><th class="n">포인트</th></tr></thead><tbody>' + (pts.length ? pts.slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); }).map(function (x) { return "<tr><td>" + day(x.at) + "</td><td>" + esc(x.t || "") + "</td><td>" + esc(x.kind === "admin" || /관리자/.test(x.t || "") ? "관리자 지급" : "추천 가입 적립") + '</td><td class="n">' + (x.amt > 0 ? "+" : "") + won(x.amt || 0) + "</td></tr>"; }).join("") : '<tr><td colspan="4" class="s-none">아직 쌓인 포인트가 없습니다.</td></tr>') + "</tbody></table></section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>내 견적서</h2><a class="s-more" href="#/quote">견적서 받기 ' + I.arrow + "</a></div>" + (qs.length ? '<ul class="s-qs">' + qs.map(function (x) { return '<li><a href="#/quote/done?no=' + encodeURIComponent(x.no) + '"><b>' + esc(x.no) + "</b><span>" + day(x.at) + " · " + esc(x.items[0] ? x.items[0].name : "") + (x.items.length > 1 ? " 외 " + (x.items.length - 1) + "품목" : "") + "</span><strong>" + won(x.pay) + "원</strong>" + I.arrow + "</a></li>"; }).join("") + "</ul>" : '<p class="s-hs-e">아직 받은 견적서가 없습니다.</p>') + "</section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>상담 요청</h2></div>' + (rq.length ? '<ul class="s-rqs">' + rq.map(function (x) { var nm = reqName(x); return '<li class="s-rq"><div class="s-rq-i"><p class="s-rq-k">' + esc(nm.k) + (x.at ? " · " + day(x.at) : "") + '</p><h3><a href="' + nm.href + '">' + esc(nm.n) + '</a></h3></div><p class="s-rq-st">매니저 확인 중</p></li>'; }).join("") + "</ul>" : '<p class="s-hs-e">아직 보낸 상담 요청이 없습니다.</p>') + "</section>" +
      '<div class="s-btns"><button type="button" class="btn line-l" data-act="s-logout">로그아웃</button></div></div></div>';
  }

  document.addEventListener("change", function (e) {
    if (!e.target || e.target.id !== "s-spsel" || !cur) return;
    cur.spec = e.target.value;
    var t = document.getElementById("s-sp-tbl"); if (t) t.innerHTML = spRows(cur.m);
  });
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-act="s-jump"]') : null;
    if (!b) return;
    var el = document.getElementById(b.dataset.to); if (!el) return;
    [].forEach.call(document.querySelectorAll(".s-ztab button"), function (x) { x.classList.toggle("on", x === b); });
    var h = document.getElementById("hd"), y = el.getBoundingClientRect().top + window.scrollY - (h ? h.offsetHeight : 64) - 70;
    window.scrollTo({ top: Math.max(0, y), behavior: BG.reduced() ? "auto" : "smooth" });
  });
  if (MT.m1) MT.m1.ph = "n_steel";
  A.views.mall = mall;
  A.views.item = item;
  A.views.cart = cart;
  A.views.sign = sign;
  A.views.quote = quote;
  A.views.join = join;
  A.views.login = login;
  A.views.my = my;

  var H = {
    "s-add": function (b) {
      var m = MT[b.dataset.id]; if (!m) return;
      S.addCart(m.id, minQty(m), m.spec); changed(); refreshBar();
      var sp = b.querySelector("span"); b.classList.add("on"); sp.textContent = "담았습니다";
      clearTimeout(b.__t); b.__t = setTimeout(function () { b.classList.remove("on"); sp.textContent = "견적 목록에 담기"; }, 1600);
    },
    "s-more": function () {
      var g = document.getElementById("s-grid"), w = document.getElementById("s-more-w"); if (!MALL || !g) return;
      var next = MALL.items.slice(MALL.shown, MALL.shown + MALL.per), from = g.children.length;
      MALL.shown += next.length;
      g.insertAdjacentHTML("beforeend", next.map(mcard).join(""));
      if (w) w.outerHTML = moreBtn();
      BG.mo.play([].slice.call(g.children, from), "up", { y: 18, stagger: 60 });
      var fl = g.children[from] && g.children[from].querySelector(".s-card-b h3 a"); if (fl) fl.focus({ preventScroll: true });
    },
    "s-th": function (b) {
      var i = +b.dataset.i, t = thumbs(cur.m)[i], gm = document.getElementById("s-gm"); if (!t || !gm) return;
      gm.innerHTML = timg(t);
      [].forEach.call(b.parentNode.children, function (x) { x.classList.toggle("on", x === b); });
      if (!BG.reduced() && gm.animate) gm.firstChild.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 320 });
    },
    "s-spec": function (b) {
      cur.spec = b.dataset.v;
      [].forEach.call(b.parentNode.children, function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
    },
    "s-q": function (b) {
      var qi = document.getElementById("s-qty"), m = cur.m;
      cur.qty = fixQty(m, (parseInt(qi.value, 10) || 0) + (+b.dataset.d) * stepQty(m)); qi.value = cur.qty; amt();
    },
    "s-add-it": function () {
      addCur();
      var a = document.getElementById("s-added"); if (a) { a.hidden = false; if (!BG.reduced() && a.animate) a.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 320 }); }
      [].forEach.call(document.querySelectorAll('[data-act="s-add-it"]'), function (x) { x.textContent = "한 번 더 담기"; });
    },
    "s-buy": function () { addCur(); location.hash = "#/sign"; },
    "s-rv-open": function () { openReview(); },
    "s-mo-x": function () { closeModal(); },
    "s-star": function (b) {
      if (!MO) return; MO.stars = +b.dataset.v;
      [].forEach.call(MO.el.querySelectorAll(".s-starsel button"), function (x) { var on = +x.dataset.v <= MO.stars; x.classList.toggle("on", on); x.setAttribute("aria-pressed", +x.dataset.v === MO.stars); });
      MO.el.querySelector("#s-rate-t").textContent = MO.stars + "점 · " + RATE[MO.stars];
      MO.el.querySelector("#s-rverr").textContent = "";
    },
    "s-up-x": function (b) { if (!MO) return; var x = MO.files.splice(+b.dataset.i, 1)[0]; if (x) URL.revokeObjectURL(x.url); MO.drawUps(); },
    "s-rv-sort": function (b) {
      cur.sort = b.dataset.v;
      [].forEach.call(b.parentNode.children, function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
      document.getElementById("s-rvl").innerHTML = rvList();
    },
    "s-rv-photo": function () { var b = document.querySelector('[data-act="s-rv-sort"][data-v="photo"]'); if (b) H["s-rv-sort"](b); var l = document.getElementById("s-rvl"); if (l) l.scrollIntoView({ block: "start", behavior: BG.reduced() ? "auto" : "smooth" }); },
    "s-qa": function () { A.notice && A.notice("상품 문의하기"); },
    "s-cq": function (b) {
      var i = +b.dataset.i, row = S.cart[i], m = row && MT[row.id]; if (!m) return;
      row.qty = fixQty(m, row.qty + (+b.dataset.d) * stepQty(m)); S.save(); redrawCart();
    },
    "s-cdel": function (b) { S.cart.splice(+b.dataset.i, 1); S.save(); redrawCart(); },
    "s-clear": function () { if (PAD) PAD.clear(); },
    "s-dl": function () { A.notice && A.notice("견적서 내려받기"); },
    "s-kind": function (b) { J.kind = b.dataset.k; J.step = 2; drawJoin(true); },
    "s-jprev": function () {
      var f = document.getElementById("s-jf");
      if (J.step === 3 && f) { J.p = [].map.call(f.querySelectorAll('input[name="pur"]:checked'), function (x) { return x.value; }); J.ref = f.ref.value.trim(); }
      if (J.step === 2 && f) ["company", "bizNo", "name", "phone", "id"].forEach(function (n) { if (f[n]) J.f[n] = f[n].value.trim(); });
      J.step = Math.max(1, J.step - 1); drawJoin(true);
    },
    "s-login": function (b, ev) { ev.preventDefault(); doLogin(BG.parseHash()); },
    "s-logout": function () { S.member = false; S.save(); A.sync && A.sync(); changed(); my(); }
  };
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (!b) return;
    var act = b.dataset.act;
    if (act.indexOf("s-") !== 0 || !H[act]) return;
    ev.preventDefault();
    H[act](b, ev);
  });
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.matches && t.matches("select[data-s-spec]")) { setSpec(+t.dataset.sSpec, t.value); redrawCart(); }
    if (t.matches && t.matches("input[data-s-qty]")) { var row = S.cart[+t.dataset.sQty], m = row && MT[row.id]; if (!m) return; row.qty = fixQty(m, t.value); S.save(); redrawCart(); }
  });
  A.after.push(function (r) {
    if (MO) closeModal();
    document.body.classList.toggle("s-buying", r.name === "item");
    document.body.classList.toggle("s-barred", r.name === "mall" && S.cart.length > 0);
  });
  A.motion.push(
    [".s-head h1", "lines", { dur: 1000 }],
    [".s-head .s-sub", "up", { y: 14, delay: 120 }],
    [".s-cat", "up", { y: 14, stagger: 40, max: 8 }],
    [".s-card", "card", { y: 24, stagger: 60, max: 9 }],
    [".s-gal-main", "wipe", { dur: 1100 }],
    [".s-info", "up", { y: 18, delay: 120 }],
    [".s-big", "wipe", { dur: 1100 }],
    [".s-door", "card", { y: 28, stagger: 100 }],
    [".s-kind", "card", { y: 24, stagger: 100 }],
    [".s-doc", "up", { y: 20 }],
    [".s-sform, .s-sumb, .s-done-a", "up", { y: 20, delay: 120 }],
    [".s-grp, .s-hs", "up", { y: 16, stagger: 60 }]
  );
})();
