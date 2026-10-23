(function () {
  var BG = window.BG;
  function doaMark(cls) {
    return '<svg class="dm ' + (cls || "") + '" viewBox="0 0 104 55" aria-hidden="true"><rect class="fr" x="1.4" y="1.4" width="101.2" height="52.2" rx="5" pathLength="1"/><path class="an" d="' + window.DOA.ant + '" pathLength="1"/><path class="tx" d="' + window.DOA.text + '" pathLength="1"/></svg>';
  }
  function forced() { return /[?&]intro\b/.test(location.search); }
  function fontsThen(fn) {
    var called = false, once = function () { if (!called) { called = true; fn(); } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(once);
    setTimeout(once, 1400);
    if (!document.fonts || !document.fonts.ready) once();
  }
  function opening(o) {
    var root = document.documentElement, seen = false;
    try { seen = sessionStorage.getItem(o.key) === "1"; } catch (e) {}
    root.classList.remove("intro-pending");
    if ((seen && !o.force && !forced()) || BG.reduced()) return false;
    try { sessionStorage.setItem(o.key, "1"); } catch (e) {}
    var el = document.createElement("div");
    el.className = "op " + (o.cls || "");
    el.id = "op";
    el.innerHTML = o.html + '<button type="button" class="op-skip" data-op="skip">건너뛰기</button><div class="op-bar" aria-hidden="true"><b></b></div>';
    document.body.appendChild(el);
    document.body.classList.add("lock", "op-on");
    var T = [], A = [], done = false;
    function at(ms, fn) { T.push(setTimeout(fn, ms)); }
    function anim(node, frames, opt) { if (!node || !node.animate) return null; var a = node.animate(frames, opt); A.push(a); return a; }
    function key(ev) { if (ev.key === "Escape") finish(true); }
    function finish(skipped) {
      if (done) return;
      done = true;
      T.forEach(clearTimeout);
      document.removeEventListener("keydown", key);
      if (skipped) A.forEach(function (a) { try { a.finish(); } catch (e) {} });
      var wait = o.exit ? o.exit(el, skipped, anim) : 0;
      setTimeout(function () { document.body.classList.remove("lock"); }, Math.min(wait, 300));
      setTimeout(function () {
        el.remove();
        document.body.classList.remove("op-on");
        if (o.after) o.after(skipped);
      }, wait || 0);
    }
    document.addEventListener("keydown", key);
    el.querySelector(".op-skip").addEventListener("click", function () { finish(true); });
    fontsThen(function () {
      if (done) return;
      el.classList.add("go");
      var bar = el.querySelector(".op-bar b");
      anim(bar, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: o.total, easing: "linear", fill: "forwards" });
      if (o.start) o.start(el, at, anim);
      at(o.total, function () { finish(false); });
    });
    return true;
  }
  BG.doaMark = doaMark;
  BG.opening = opening;
})();
