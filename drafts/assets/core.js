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
  var MAIN_ONLY = /[?&]main(=|&|$)/.test(location.search);
  function homeHash() { history.replaceState(null, "", location.pathname + location.search + "#/"); }
  if (MAIN_ONLY) {
    document.documentElement.classList.add("main-only");
    if (parseHash().name !== "home") homeHash();
    document.addEventListener("click", function (e) {
      if (!e.target.closest) return;
      var a = e.target.closest("a[href], button, [data-act], [data-like]");
      if (!a || a.tagName !== "A" || a.hasAttribute("data-act") || a.hasAttribute("data-like")) return;
      var h = a.getAttribute("href");
      if (h.length > 1 && h.charAt(0) === "#" && h.charAt(1) !== "/") return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
    document.addEventListener("submit", function (e) { e.preventDefault(); e.stopPropagation(); }, true);
    var st = document.createElement("style");
    st.textContent = '.main-only a[href^="#/"], .main-only a[href^="../"], .main-only a[href^="http"] { cursor: default; } .main-only a[href="../../"] { display: none; }';
    document.head.appendChild(st);
  }
  function router(views, after) {
    function run() {
      var r = parseHash();
      var view = views[r.name] || views.home;
      view(r);
      if (after) after(r);
    }
    window.addEventListener("hashchange", function () {
      if (MAIN_ONLY && parseHash().name !== "home") { homeHash(); return; }
      run();
      window.scrollTo(0, 0);
    });
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
    var off = +(a.parentNode && a.parentNode.dataset && a.parentNode.dataset.offset) || 130;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: reduced() ? "auto" : "smooth" });
    var nav = a.parentNode;
    if (nav && nav.tagName === "NAV") Array.prototype.forEach.call(nav.children, function (x) { x.classList.toggle("on", x === a); });
  });

  function swipe(el, next, prev) {
    if (!el) return;
    var x0 = null, y0 = 0, fired = false;
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse" && e.button !== 0) return; x0 = e.clientX; y0 = e.clientY; fired = false; });
    el.addEventListener("pointermove", function (e) {
      if (x0 === null || fired) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { fired = true; el.dataset.swiped = "1"; (dx < 0 ? next : prev)(); }
    });
    function end() { x0 = null; setTimeout(function () { delete el.dataset.swiped; }, 80); }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("click", function (e) { if (el.dataset.swiped) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  function slide(from, to, dir, ms, ease) {
    if (!from || !to || from === to || reduced() || !from.animate) return;
    var e = ease || "cubic-bezier(.25,.1,.25,1)";
    from.classList.add("out");
    var a = from.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + (-100 * dir) + "%)" }], { duration: ms, easing: e });
    to.animate([{ transform: "translateX(" + (100 * dir) + "%)" }, { transform: "translateX(0)" }], { duration: ms, easing: e });
    a.onfinish = a.oncancel = function () { from.classList.remove("out"); };
  }

  function onScrollDir(fn) {
    var last = window.scrollY, busy = false;
    window.addEventListener("scroll", function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () {
        busy = false;
        var y = window.scrollY, d = y - last;
        if (Math.abs(d) < 5 && y > 0) return;
        fn(d > 0 ? 1 : -1, y);
        last = y;
      });
    }, { passive: true });
  }

  function spy(nav, offset) {
    var links = [].slice.call(nav.querySelectorAll("a[href]")).filter(function (a) { var h = a.getAttribute("href"); return h.length > 1 && h.charAt(0) === "#" && h.charAt(1) !== "/"; });
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    var tops = [];
    function pinned(el) { for (var e = el, n = 0; e && e !== document.body && n < 4; e = e.parentElement, n++) { var p = getComputedStyle(e).position; if (p === "sticky" || p === "fixed") return true; } return false; }
    function measure() { tops = secs.map(function (s) { return !s || pinned(s) ? Infinity : s.getBoundingClientRect().top + window.scrollY; }); nav.dataset.offset = Math.round(offset()); }
    function update() {
      if (!document.body.contains(nav)) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure); return; }
      var y = window.scrollY + offset() + 2, k = 0, best = -Infinity;
      tops.forEach(function (t, i) { if (t <= y && t > best) { best = t; k = i; } });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) { var far = -Infinity; tops.forEach(function (t, i) { if (t !== Infinity && t > far) { far = t; k = i; } }); }
      links.forEach(function (a, i) { a.classList.toggle("on", i === k); });
    }
    var busy = false;
    function onScroll() { if (busy) return; busy = true; requestAnimationFrame(function () { busy = false; update(); }); }
    measure();
    setTimeout(measure, 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    update();
  }

  window.BG = {
    data: D, CAT: CAT, MAT_CAT: MAT_CAT, EXP: EXP, MAT: MAT,
    esc: esc, won: won, man: man, photo: photo, icon: icon, Session: Session,
    router: router, parseHash: parseHash, toast: toast, reduced: reduced, initial: initial,
    swipe: swipe, slide: slide, onScrollDir: onScrollDir, spy: spy,
    credit: (window.BGPhotosCredit || "") + " · 입체 아이콘: Microsoft Fluent Emoji (MIT 라이선스)"
  };
})();
