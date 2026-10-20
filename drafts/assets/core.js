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
    var last = null;
    function run() {
      var r = parseHash(), again = location.hash === last, snap = again ? mo.snap() : null;
      var view = views[r.name] || views.home;
      last = location.hash;
      mo.quiet = again;
      view(r);
      if (after) after(r);
      mo.quiet = false;
      if (snap) mo.roll(snap);
    }
    window.addEventListener("hashchange", function () {
      if (MAIN_ONLY && parseHash().name !== "home") { homeHash(); return; }
      var again = location.hash === last;
      run();
      if (!again) window.scrollTo(0, 0);
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

  var mo = (function () {
    var EASE = "cubic-bezier(.2,.7,.1,1)", io = null, live = [], born = 0, api = { quiet: false };
    var css = document.createElement("style");
    css.textContent = "mo-l { display: block; clip-path: inset(-60% -12% -.14em -12%); } mo-l > mo-i { display: block; } .mo-num { font-variant-numeric: tabular-nums; } .mo-ib { display: inline-block; }";
    document.head.appendChild(css);
    function able() { return !reduced() && "IntersectionObserver" in window && !!document.documentElement.animate; }
    function spring(make, ms, z, hz) {
      var d = z || 0.6, w = 2 * Math.PI * (hz || 2.3), wd = w * Math.sqrt(1 - d * d), out = [];
      for (var k = 0; k <= 30; k++) {
        var t = k / 30 * ms / 1000, p = k === 30 ? 1 : 1 - Math.exp(-d * w * t) * (Math.cos(wd * t) + d * w / wd * Math.sin(wd * t));
        out.push(make(p, k / 30));
      }
      return out;
    }
    function num(s) { var m = String(s).match(/[\d,]*\.?\d+/); return m ? parseFloat(m[0].replace(/,/g, "")) : null; }
    function split(el) {
      var html = el.innerHTML, br = /<br\s*\/?>/i;
      var parts = br.test(html) ? html.split(br) : /pre/.test(getComputedStyle(el).whiteSpace) ? html.split("\n") : [html];
      el.innerHTML = parts.map(function (p) { return "<mo-l><mo-i>" + p + "</mo-i></mo-l>"; }).join("");
      var spans = [].slice.call(el.querySelectorAll("mo-l > mo-i")), first = el.firstChild;
      spans.restore = function () { if (first && first.parentNode === el) el.innerHTML = html; };
      return spans;
    }
    function clipped(im, stop) {
      for (var e = im.parentElement; e; e = e.parentElement) {
        if (getComputedStyle(e).overflowX !== "visible") return true;
        if (e === stop) return false;
      }
      return false;
    }
    function fade(y, x) { return [{ transform: "translate(" + (x || 0) + "px," + (y || 0) + "px)", opacity: 0 }, { opacity: 1, offset: .3 }, { transform: "none", opacity: 1 }]; }
    var K = {
      up: function (el, o) { return [{ el: el, kf: fade(o.y == null ? 28 : o.y), dur: o.dur || 800 }]; },
      side: function (el, o) { var x = hostOf(el) !== el; return [{ el: el, kf: fade(x ? 0 : 24, x ? o.x || 48 : 0), dur: o.dur || 800 }]; },
      lines: function (el, o) {
        var spans = split(el), r = spans.map(function (s, i) { return { el: s, kf: [{ transform: "translateY(120%)" }, { transform: "none" }], dur: o.dur || 900, off: i * (o.gap || 90) }; });
        if (r.length) r[0].restore = spans.restore;
        if (o.sweep) [].forEach.call(el.querySelectorAll(o.sweep), function (m) { r.push({ el: m, kf: [{ backgroundSize: "0% 100%", backgroundRepeat: "no-repeat" }, { backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }], dur: 700, off: 450 + (spans.length - 1) * (o.gap || 90), ease: "cubic-bezier(.4,0,.2,1)" }); });
        if (o.count) [].forEach.call(el.querySelectorAll(o.count), function (c) { r.push({ count: c, dur: 1100, off: 300 }); });
        return r;
      },
      wipe: function (el, o) {
        var r = [{ el: el, kf: [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], dur: o.dur || 1000 }], im = el.querySelector("img");
        if (im && clipped(im, el)) r.push({ el: im, kf: [{ transform: "scale(1.18)" }, { transform: "none" }], dur: (o.dur || 1000) + 500 });
        return r;
      },
      wipeX: function (el, o) {
        var r = [{ el: el, kf: [{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)" }], dur: o.dur || 1100 }], im = el.querySelector("img");
        if (im && clipped(im, el)) r.push({ el: im, kf: [{ transform: "scale(1.16)" }, { transform: "none" }], dur: (o.dur || 1100) + 600 });
        return r;
      },
      draw: function (el, o) { var rr = " round " + (o.r || 0) + "px", m = "-" + (o.m || 0) + "px"; return [{ el: el, kf: [{ clipPath: "inset(" + m + " 100% " + m + " " + m + rr + ")" }, { clipPath: "inset(" + m + " " + m + " " + m + " " + m + rr + ")" }], dur: o.dur || 800 }]; },
      pop: function (el, o) {
        var ms = o.dur || 700, y = o.y == null ? 12 : o.y, s = o.s || .6;
        return [{ el: el, kf: spring(function (p, t) { return { transform: "translateY(" + (y * (1 - p)).toFixed(2) + "px) scale(" + (s + (1 - s) * p).toFixed(4) + ")", opacity: Math.min(1, t * 5) }; }, ms, o.z, o.hz), dur: ms, ease: "linear" }];
      },
      settle: function (el, o) { return [{ el: el, kf: [{ transform: "scale(" + (o.s || 1.12) + ")" }, { transform: "none" }], dur: o.dur || 1600, ease: o.ease || "cubic-bezier(.25,.1,.25,1)" }]; },
      count: function (el, o) { return [{ count: el, dur: o.dur || 1000 }]; },
      card: function (el, o) {
        var r = [{ el: el, kf: fade(o.y || 36), dur: o.dur || 900 }], im = el.querySelector("img");
        if (im && clipped(im, el)) r.push({ el: im, kf: [{ transform: "scale(1.14)" }, { transform: "none" }], dur: (o.dur || 900) + 500 });
        (o.inner || []).forEach(function (x) { [].forEach.call(el.querySelectorAll(x[0]), function (c) { K[x[1]](c, x[3] || {}).forEach(function (p) { p.off = (p.off || 0) + x[2]; r.push(p); }); }); });
        return r;
      }
    };
    function countTo(el, from, ms, delay, done) {
      var txt = el.textContent, m = txt.match(/[\d,]*\.?\d+/);
      if (!m) { if (done) done(); return; }
      var to = parseFloat(m[0].replace(/,/g, "")), dec = (m[0].split(".")[1] || "").length, comma = m[0].indexOf(",") >= 0 || (from >= 1000 && to >= 1000);
      var pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length), t0 = 0;
      function fmt(v) { return pre + (comma ? Number(v.toFixed(dec)).toLocaleString("ko-KR", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + post; }
      el.classList.add("mo-num");
      el.textContent = fmt(from);
      setTimeout(function () {
        requestAnimationFrame(function step(now) {
          if (!t0) t0 = now;
          var p = Math.min(1, (now - t0) / ms);
          if (p < 1) { el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3))); requestAnimationFrame(step); }
          else { el.textContent = txt; if (done) done(); }
        });
      }, delay || 0);
    }
    function prep(el, kind, o) {
      var parts = K[kind](el, o);
      parts.forEach(function (p) {
        if (!p.kf) return;
        p.a = p.el.animate(p.kf, { duration: p.dur, easing: p.ease || o.ease || EASE, fill: "backwards" });
        p.a.pause();
        p.a.currentTime = 0;
      });
      return parts;
    }
    function go(parts, base) {
      var left = parts.length;
      function one() { if (--left === 0) parts.forEach(function (p) { if (p.restore) p.restore(); }); }
      parts.forEach(function (p) {
        var d = base + (p.off || 0);
        if (p.a) { p.a.effect.updateTiming({ delay: d }); p.a.onfinish = p.a.oncancel = one; p.a.play(); }
        else if (p.count) countTo(p.count, 0, p.dur, d, one);
        else one();
      });
    }
    function hostOf(el) {
      for (var e = el.parentElement, n = 0; e && n < 4; e = e.parentElement, n++) {
        var ox = getComputedStyle(e).overflowX;
        if ((ox === "auto" || ox === "scroll") && e.scrollWidth > e.clientWidth + 2) return e;
      }
      return el;
    }
    function fire(list) {
      var early = Date.now() - born < 800, n = {};
      list.sort(function (a, b) { return a.el.compareDocumentPosition(b.el) & 2 ? 1 : -1; });
      list.forEach(function (t) {
        if (t.done) return;
        t.done = true;
        var k = n[t.ri] = (n[t.ri] || 0) + 1, o = t.o;
        go(t.parts, (early ? o.delay || 0 : 0) + (o.lag || 0) + Math.min(k - 1, o.max || 12) * (o.stagger == null ? 60 : o.stagger));
      });
      if (io && !live.some(function (t) { return !t.done; })) { io.disconnect(); io = null; }
    }
    function scan(root, rules) {
      if (io) { io.disconnect(); io = null; }
      live.forEach(function (t) { if (!t.done) t.parts.forEach(function (p) { if (p.a) p.a.cancel(); }); });
      live = [];
      if (api.quiet || !able() || !root) return;
      born = Date.now();
      var hosts = [];
      rules.forEach(function (rule, ri) {
        [].forEach.call(root.querySelectorAll(rule[0]), function (el) {
          if (el.__mo) return;
          var t = { el: el, ri: ri, o: rule[2] || {} };
          el.__mo = t;
          t.parts = prep(el, rule[1], t.o);
          t.host = hostOf(el);
          live.push(t);
          if (hosts.indexOf(t.host) < 0) hosts.push(t.host);
        });
      });
      io = new IntersectionObserver(function (es) {
        var list = [];
        es.forEach(function (e) { if (e.isIntersecting) live.forEach(function (t) { if (!t.done && t.host === e.target) list.push(t); }); });
        if (list.length) fire(list);
      }, { rootMargin: "0px 0px -6% 0px" });
      hosts.forEach(function (h) { io.observe(h); });
    }
    window.addEventListener("scroll", function () {
      if (!io || window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
      fire(live.filter(function (t) { return !t.done && t.host.getBoundingClientRect().top < window.innerHeight; }));
    }, { passive: true });
    function play(els, kind, o) {
      if (!able()) return;
      o = o || {};
      [].forEach.call(els, function (el, i) { if (el) go(prep(el, kind, o), (o.delay || 0) + i * (o.stagger == null ? 50 : o.stagger)); });
    }
    function text(el, s, o) { el.textContent = s; play([el], "lines", o); }
    function bleed(el, x, y, ms) {
      if (!able() || !el) return null;
      var r = el.getBoundingClientRect(), R = Math.ceil(Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y), Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y)));
      return el.animate([{ clipPath: "circle(0px at " + x + "px " + y + "px)" }, { clipPath: "circle(" + R + "px at " + x + "px " + y + "px)" }], { duration: ms || 340, easing: "cubic-bezier(.4,0,.2,1)" });
    }
    function snap() { var m = {}; [].forEach.call(document.querySelectorAll("[data-roll]"), function (el) { (m[el.dataset.roll] = m[el.dataset.roll] || []).push(num(el.textContent)); }); return m; }
    function roll(m) {
      if (!able()) return;
      var seen = {};
      [].forEach.call(document.querySelectorAll("[data-roll]"), function (el) {
        var k = el.dataset.roll, i = seen[k] = (seen[k] || 0) + 1, old = (m[k] || [])[i - 1];
        if (old != null && old !== num(el.textContent)) countTo(el, old, 900, 0);
      });
      play(document.querySelectorAll("[data-pop]"), "pop", { stagger: 0, delay: 120, y: 6, s: .7 });
    }
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("[data-like]") : null;
      if (!b || !able()) return;
      setTimeout(function () {
        if (!b.classList.contains("on")) return;
        (b.querySelector("svg") || b).animate(spring(function (p) { return { transform: "scale(" + (.4 + .6 * p).toFixed(4) + ")" }; }, 650, .5, 2.6), { duration: 650, easing: "linear" });
      }, 0);
    });
    api.able = able;
    api.scan = scan;
    api.play = play;
    api.text = text;
    api.bleed = bleed;
    api.snap = snap;
    api.roll = roll;
    api.spring = spring;
    return api;
  })();

  window.BG = {
    data: D, CAT: CAT, MAT_CAT: MAT_CAT, EXP: EXP, MAT: MAT,
    esc: esc, won: won, man: man, photo: photo, icon: icon, Session: Session,
    router: router, parseHash: parseHash, toast: toast, reduced: reduced, initial: initial,
    swipe: swipe, slide: slide, onScrollDir: onScrollDir, spy: spy, mo: mo,
    credit: (window.BGPhotosCredit || "") + " · 입체 아이콘: Microsoft Fluent Emoji (MIT 라이선스)"
  };
})();
