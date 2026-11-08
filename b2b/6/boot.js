(function () {
  var A = window.APP;
  BG.router(A.views, function (r) {
    A.sync(r);
    BG.mo.scan(A.app, A.motion);
    A.after.forEach(function (f) { f(r); });
  });
})();
