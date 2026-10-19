(function () {
  var D = window.BUILDGO, P = window.BGPhotos || {};
  var SERVICE_TITLES = {
    e1: "단독·다가구 주택 설계부터 인허가까지 한 번에 진행해 드립니다",
    e2: "철근콘크리트·경량목구조 신축, 공정표대로 시공합니다",
    e3: "아파트·오피스텔 전체 리모델링, 디자인부터 준공 청소까지",
    e4: "배관·보일러·전기 증설, 점검 리포트와 함께 고쳐 드립니다",
    e5: "옥상·욕실 방수와 외단열, 하자보증 기간까지 책임집니다",
    e6: "시스템창호·중문 교체, 실측 당일 견적을 드립니다"
  };
  var CAT = {}, MAT_CAT = {}, EXP = {}, MAT = {};
  D.categories.forEach(function (c) { CAT[c.id] = c; });
  D.materialCategories.forEach(function (c) { MAT_CAT[c.id] = c; });
  D.experts.forEach(function (e) { e.service = SERVICE_TITLES[e.id] || e.tagline; EXP[e.id] = e; });
  D.materials.forEach(function (m) { MAT[m.id] = m; });

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function won(n) { return Math.round(n).toLocaleString("ko-KR"); }
  function man(n) { if (n == null) return "현장 견적"; if (n === 0) return "무료"; return n >= 10000 ? (n / 10000).toLocaleString("ko-KR") + "만원" : won(n) + "원"; }
  function photo(key) { return P[key] ? P[key].src : ""; }
  var ICON_FILES = {
    design: "triangular_ruler", frame: "building_construction", interior: "couch_and_lamp", mep: "wrench", waterproof: "umbrella_with_rain_drops", exterior: "window",
    "mat-struct": "nut_and_bolt", "mat-board": "wood", "mat-finish": "brick", "mat-insul": "house", "mat-window": "door", "mat-tool": "toolbox",
    mall: "brick", quote: "memo", cases: "framed_picture", tiers: "crown", deal: "fire", best: "trophy", today: "delivery_truck", pkg: "package", pro: "magnifying_glass_tilted_left", tool: "hammer", referral: "coin"
  };
  function icon(key) { return ICON_FILES[key] ? "../assets/icons/" + ICON_FILES[key] + ".png" : ""; }
  function store(key, val) {
    try {
      if (val === undefined) { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  function Session(prefix) {
    this.prefix = prefix;
    this.member = !!store(prefix + "-member");
    this.cart = store(prefix + "-cart") || [];
    this.quotes = store(prefix + "-quotes") || [];
    this.likes = store(prefix + "-likes") || [];
  }
  Session.prototype.save = function () {
    store(this.prefix + "-member", this.member);
    store(this.prefix + "-cart", this.cart);
    store(this.prefix + "-quotes", this.quotes);
    store(this.prefix + "-likes", this.likes);
  };
  Session.prototype.tier = function () { return this.member ? D.tiers.filter(function (t) { return t.id === D.demoUser.tier; })[0] : null; };
  Session.prototype.priceOf = function (m) { var t = this.tier(); return t ? Math.round(m.price * (100 - t.discount) / 100 / 10) * 10 : m.price; };
  Session.prototype.pointsOf = function (amount) { var t = this.tier() || D.tiers[0]; return Math.floor(amount * t.pointRate / 100); };
  Session.prototype.addCart = function (id, qty) {
    var row = this.cart.filter(function (r) { return r.id === id; })[0];
    if (row) row.qty += qty; else this.cart.push({ id: id, qty: qty });
    this.save();
  };
  Session.prototype.cartTotals = function () {
    var self = this, list = 0, pay = 0;
    this.cart.forEach(function (r) { var m = MAT[r.id]; if (!m) return; list += m.price * r.qty; pay += self.priceOf(m) * r.qty; });
    return { list: list, pay: pay, discount: list - pay, points: this.member ? this.pointsOf(pay) : 0, count: this.cart.reduce(function (s, r) { return s + r.qty; }, 0) };
  };
  Session.prototype.toggleLike = function (id) {
    var i = this.likes.indexOf(id);
    if (i >= 0) this.likes.splice(i, 1); else this.likes.push(id);
    this.save();
    return i < 0;
  };
  Session.prototype.addQuote = function (q) { q.at = new Date().toISOString(); this.quotes.unshift(q); this.save(); };

  function parseHash() {
    var h = (location.hash || "#/").replace(/^#\/?/, "");
    var q = {}, qi = h.indexOf("?");
    if (qi >= 0) { h.slice(qi + 1).split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ""); }); h = h.slice(0, qi); }
    var parts = h.split("/").filter(Boolean);
    return { name: parts[0] || "home", id: parts[1] || null, query: q };
  }
  function router(views, after) {
    function run() {
      var r = parseHash();
      var view = views[r.name] || views.home;
      view(r);
      if (after) after(r);
    }
    window.addEventListener("hashchange", function () { run(); window.scrollTo(0, 0); });
    run();
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.className = "show";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.className = ""; }, 2200);
  }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function initial(name) { return name.replace(/[^가-힣A-Za-z0-9]/g, "").charAt(0); }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var h = a.getAttribute("href");
    if (h === "#" || h.charAt(1) === "/") return;
    ev.preventDefault();
    var el = document.getElementById(h.slice(1));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: reduced() ? "auto" : "smooth" });
    var nav = a.parentNode;
    if (nav && nav.tagName === "NAV") Array.prototype.forEach.call(nav.children, function (x) { x.classList.toggle("on", x === a); });
  });

  window.BG = {
    data: D, CAT: CAT, MAT_CAT: MAT_CAT, EXP: EXP, MAT: MAT,
    esc: esc, won: won, man: man, photo: photo, icon: icon, Session: Session,
    router: router, parseHash: parseHash, toast: toast, reduced: reduced, initial: initial,
    credit: (window.BGPhotosCredit || "") + " · 입체 아이콘: Microsoft Fluent Emoji (MIT 라이선스)"
  };
})();
