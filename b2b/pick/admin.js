(function () {
  var A = window.APP, D = A.D, esc = A.esc, I = A.I, photo = A.photo, app = A.app, BG = window.BG;
  var TABS = [["consult", "상담 관리"], ["partner", "입점 문의"], ["popup", "팝업 관리"], ["portfolio", "포트폴리오 관리"]];
  var PDEMO = [
    { id: "d3", at: "2026.11.10", company: "한결종합건설", name: "김도윤", phone: "010-2934-5521", fields: ["build"], sido: "경기", memo: "철근콘크리트 골조, 공동주택 12건", status: "서류 확인 중" },
    { id: "d2", at: "2026.11.07", company: "대성스틸", name: "박서진", phone: "010-7712-0384", fields: ["mat"], sido: "충남", memo: "H형강·철근 현장 직납", status: "입점 완료" },
    { id: "d1", at: "2026.11.05", company: "이음건축사사무소", name: "최하은", phone: "010-4410-9272", fields: ["design"], sido: "서울", memo: "LH 매입약정 설계 8건", status: "접수" }
  ];
  var PST = ["접수", "서류 확인 중", "입점 완료", "보류"];
  var PFN = { dev: "시행", build: "시공", mat: "자재", design: "설계·인허가", pm: "PM", finance: "금융" };
  var PICS = [["hero_kr", "공동주택"], ["site_aerial", "현장 전경"], ["n_plan", "도면 검토"], ["w_measure", "현장 실측"], ["n_crew", "현장 인력"]];
  var LINKS = [["#/join", "회원가입"], ["#/join?kind=biz", "사업자회원 가입"], ["#/join?kind=person", "일반회원 가입"], ["#/partner", "입점 문의"], ["#/match", "상담 신청"], ["#/companies", "업체 찾기"], ["#/experts", "전문가 찾기"], ["#/mall", "자재몰"], ["#/pm", "PM"], ["#/finance", "금융"], ["#/about", "회사 소개"], ["#/faq", "FAQ"], ["#/qna", "문의게시판"], ["#/quote", "견적서 받기"]];
  var VIDS = [["v1459", "실내 마감 영상"], ["v4010", "타워크레인 영상"], ["v1457", "외벽 조적 영상"], ["v1439", "도면 검토 영상"]];
  var FPICS = [["steel_hall", "철골 공사"], ["pf_water", "옥상 방수"], ["frame_work", "골조 공사"], ["site_aerial", "현장 전경"], ["pf_mep", "전기 공사"], ["n_crew", "현장 인력"]];
  var UP = '<svg viewBox="0 0 24 24"><path d="m6 14.5 6-6 6 6"/></svg>', DOWN = '<svg viewBox="0 0 24 24"><path d="m6 9.5 6 6 6-6"/></svg>';

  function put(k, v) { try { localStorage.setItem("b2bpick-" + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function shrink(file, done) {
    if (!file || !/^image\//.test(file.type)) { BG.toast("사진 파일을 골라 주세요"); return; }
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1200 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
        var x = c.getContext("2d");
        x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        done(c.toDataURL("image/jpeg", 0.82));
      };
      im.onerror = function () { BG.toast("사진을 읽지 못했습니다"); };
      im.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  function pick(name, v, label, src, on, vid) {
    return '<label class="ad-pick"><input type="radio" name="' + name + '" value="' + esc(v) + '"' + (on ? " checked" : "") + '><span class="ad-pick-m">' + (src ? '<img src="' + esc(src) + '" alt="">' : "<i>" + I.close + "</i>") + (vid ? "<em>영상</em>" : "") + '</span><span class="ad-pick-t">' + esc(label) + "</span></label>";
  }
  function fld(label, html, id) { return '<div class="ad-fld"><label' + (id ? ' for="' + id + '"' : "") + ">" + esc(label) + "</label>" + html + "</div>"; }
  function upPick(box, name, src, label) {
    var old = box.querySelector('input[value="__up"]');
    if (old) old.closest(".ad-pick").remove();
    box.insertAdjacentHTML("afterbegin", pick(name, "__up", label, src, true));
    box.querySelector('input[value="__up"]').checked = true;
  }

  function view(r) {
    var q = r.query || {}, tab = TABS.some(function (t) { return t[0] === q.tab; }) ? q.tab : "consult";
    app.innerHTML = '<div class="lp ad"><section class="ad-hd"><h1>BUILDGO 관리자</h1><p>상담 요청, 입점 문의, 첫 화면 팝업, 입점 업체 포트폴리오를 관리합니다.</p>' +
      '<nav class="ad-tabs" aria-label="관리 메뉴">' + TABS.map(function (t) { return '<a href="#/admin?tab=' + t[0] + '"' + (t[0] === tab ? ' class="on" aria-current="page"' : "") + ">" + esc(t[1]) + "</a>"; }).join("") + "</nav></section>" +
      '<div class="ad-body" id="adBody"></div></div>';
    var el = document.getElementById("adBody");
    if (tab === "popup") popupTab(el);
    else if (tab === "partner") partnerTab(el);
    else if (tab === "portfolio") folioTab(el);
    else if (typeof A.adminConsult === "function") A.adminConsult(el, q);
    else el.innerHTML = '<p class="ad-wait">상담 관리를 불러오는 중입니다</p>';
  }

  function partnerTab(el) {
    var mine = A.keep("partner") || [], st = A.keep("partner-st") || {}, rows = mine.concat(PDEMO);
    el.innerHTML = '<div class="ad-pt"><p class="ad-pt-n">입점 문의 <b>' + rows.length + '</b>건 · 담당 매니저가 연락하고 서류(사업자등록증 · 면허 · 보험)를 확인한 뒤 상태를 바꿉니다.</p><ul class="ad-pt-l">' + rows.map(function (p) {
      var s = st[p.id] || p.status || "접수", isNew = mine.indexOf(p) >= 0;
      return '<li class="ad-pt-r"><div class="ad-pt-a"><p class="ad-pt-co"><b>' + esc(p.company) + "</b>" + (isNew ? "<em>새 문의</em>" : "") + (p.bizNo ? "<span>" + esc(p.bizNo) + "</span>" : "") + '</p><p class="ad-pt-m">' + esc(p.name) + " · " + esc(p.phone) + " · " + esc((p.fields || []).map(function (f) { return PFN[f] || f; }).join(", ")) + (p.sido ? " · " + esc(p.sido) : "") + "</p>" + (p.memo ? '<p class="ad-pt-memo">' + esc(p.memo) + "</p>" : "") +
        '</div><p class="ad-pt-at">' + esc(p.at || "") + '</p><span class="selbox ad-pt-s"><select data-pid="' + esc(String(p.id)) + '" data-co="' + esc(p.company) + '" aria-label="' + esc(p.company) + ' 처리 상태">' + PST.map(function (x) { return "<option" + (x === s ? " selected" : "") + ">" + x + "</option>"; }).join("") + "</select>" + I.down + "</span></li>";
    }).join("") + "</ul></div>";
    el.onchange = function (ev) {
      var t = ev.target;
      if (!t.dataset || !t.dataset.pid) return;
      var m = A.keep("partner-st") || {};
      m[t.dataset.pid] = t.value;
      A.keep("partner-st", m);
      BG.toast(t.dataset.co + " — " + t.value);
    };
  }
  function pvHtml(c) {
    var src = A.popup.src(c.img);
    return '<div class="h-pp' + (src ? "" : " no-im") + '"><div class="h-pp-card">' + (src ? '<div class="h-pp-im"><img src="' + esc(src) + '" alt=""></div>' : "") +
      '<div class="h-pp-b"><h2 class="h-pp-t">' + esc(c.title || "제목을 적어 주세요") + '</h2><p class="h-pp-d">' + esc(c.body || "").replace(/\n/g, "<br>") + "</p>" + (c.btn ? '<span class="h-pp-go">' + esc(c.btn) + " " + I.arrow + "</span>" : "") + "</div>" +
      '<div class="h-pp-f"><span>다시 보지 않기</span><span>닫기</span></div></div></div>';
  }
  function popupTab(el) {
    var c = A.popup.cfg(), upl = /^data:/.test(c.img || "") ? c.img : "";
    var known = !c.img || PICS.some(function (p) { return p[0] === c.img; });
    el.innerHTML = '<div class="ad-two"><form class="ad-form" id="adPop" novalidate>' +
      '<label class="ad-sw"><input type="checkbox" name="on"' + (c.on ? " checked" : "") + '><span class="ad-sw-ui" aria-hidden="true"></span><span class="ad-sw-t"><b>첫 화면에 팝업 띄우기</b><em id="adOnT">' + (c.on ? "지금 켜져 있습니다" : "지금 꺼져 있습니다") + "</em></span></label>" +
      '<fieldset class="ad-row"><legend>사진</legend><div class="ad-pics" id="adPics">' + (upl ? pick("img", "__up", "올린 사진", upl, true) : "") + PICS.map(function (p) { return pick("img", p[0], p[1], photo(p[0]), !upl && c.img === p[0]); }).join("") + pick("img", "", "사진 없이", "", !upl && !c.img) +
      (!upl && !known ? pick("img", c.img, "지금 사진", A.popup.src(c.img), true) : "") + "</div>" +
      '<label class="ad-file"><input type="file" accept="image/*" id="adPopFile"><span>' + I.plus + '내 컴퓨터에서 사진 올리기</span></label><p class="ad-help">올린 사진은 가로·세로 1200px 이하로 줄여서 저장합니다.</p></fieldset>' +
      fld("제목", '<input class="inp" id="adPt" name="title" maxlength="40" value="' + esc(c.title) + '">', "adPt") +
      fld("내용", '<textarea class="inp ad-ta" id="adPb" name="body" rows="5" maxlength="300">' + esc(c.body) + "</textarea>", "adPb") +
      '<div class="ad-2col">' + fld("버튼 글", '<input class="inp" id="adPbt" name="btn" maxlength="20" value="' + esc(c.btn) + '">', "adPbt") +
      fld("버튼을 누르면 갈 메뉴", '<span class="selbox"><select id="adPh" name="href">' + LINKS.map(function (l) { return '<option value="' + esc(l[0]) + '"' + (l[0] === c.href ? " selected" : "") + ">" + esc(l[1]) + "</option>"; }).join("") + "</select>" + I.down + "</span>", "adPh") + "</div>" +
      '<div class="ad-act"><button type="button" class="btn line-l" data-ad="pop-show">실제 화면처럼 보기</button><button type="submit" class="btn ad-save">저장하기</button></div></form>' +
      '<aside class="ad-prev"><p class="ad-prev-k">미리보기</p><div class="ad-pv" id="adPv"></div><p class="ad-help" id="adPvN"></p></aside></div>';
    var f = document.getElementById("adPop"), pv = document.getElementById("adPv"), note = document.getElementById("adPvN");
    function read() {
      var v = (f.querySelector('input[name="img"]:checked') || {}).value || "";
      return { on: f.on.checked, img: v === "__up" ? upl : v, title: f.title.value.trim(), body: f.body.value.trim(), btn: f.btn.value.trim(), href: f.href.value };
    }
    function draw() {
      var v = read();
      pv.innerHTML = pvHtml(v);
      pv.classList.toggle("off", !v.on);
      note.textContent = v.on ? "첫 화면에 들어오면 이렇게 뜹니다. 저장해야 반영됩니다." : "꺼져 있어 첫 화면에 뜨지 않습니다.";
    }
    f.addEventListener("input", draw);
    f.addEventListener("change", function (e) {
      if (e.target.name === "on") {
        var s = A.popup.cfg();
        s.on = e.target.checked;
        put("popup", s);
        document.getElementById("adOnT").textContent = s.on ? "지금 켜져 있습니다" : "지금 꺼져 있습니다";
        BG.toast(s.on ? "팝업을 켰습니다. 첫 화면에 뜹니다" : "팝업을 껐습니다. 첫 화면에 뜨지 않습니다");
      }
      draw();
    });
    document.getElementById("adPopFile").addEventListener("change", function () {
      var file = this.files && this.files[0], inp = this;
      shrink(file, function (d) { upl = d; upPick(document.getElementById("adPics"), "img", d, "올린 사진"); inp.value = ""; draw(); BG.toast("사진을 올렸습니다. 저장하면 반영됩니다"); });
    });
    f.onsubmit = function (e) {
      e.preventDefault();
      var v = read();
      if (!v.title) { BG.toast("제목을 적어 주세요"); f.title.focus(); return; }
      v.rev = Date.now();
      if (!put("popup", v)) { BG.toast("사진이 너무 커서 저장하지 못했습니다. 다른 사진을 골라 주세요"); return; }
      BG.toast(v.on ? "저장했습니다. 첫 화면에 바뀐 팝업이 다시 뜹니다" : "저장했습니다. 팝업은 꺼져 있습니다");
    };
    el.querySelector('[data-ad="pop-show"]').addEventListener("click", function () { var v = read(); v.rev = 0; A.popup.open(v, true); });
    draw();
  }

  function row(f, i, n) {
    var c = A.homeFeed.co(f.co), th = f.v ? "media/" + f.v + ".jpg" : A.popup.src(f.img || f.ph);
    return '<li class="ad-it' + (i < 7 ? " on" : "") + '"><span class="ad-it-n">' + (i + 1) + '</span><span class="ad-it-m"><img src="' + esc(th) + '" alt="">' + (f.v ? "<em>영상</em>" : "") + "</span>" +
      '<span class="ad-it-c"><b>' + esc(f.t || "") + "</b><span>" + esc(c.name) + " · " + esc(f.at || "") + (i < 7 ? " · 첫 화면에 보임" : "") + "</span></span>" +
      '<span class="ad-it-b"><button type="button" data-ad="pf-up" data-i="' + i + '"' + (i === 0 ? " disabled" : "") + ">" + UP + "위로</button>" +
      '<button type="button" data-ad="pf-down" data-i="' + i + '"' + (i === n - 1 ? " disabled" : "") + ">" + DOWN + "아래로</button>" +
      '<button type="button" class="ad-del" data-ad="pf-del" data-i="' + i + '">삭제</button></span></li>';
  }
  function folioTab(el) {
    var list = A.homeFeed.list(), upF = "";
    el.innerHTML = '<div class="ad-two ad-two-f"><section class="ad-lw"><div class="ad-sec-h"><h2>첫 화면 포트폴리오 <b>' + list.length + '</b>건</h2><button type="button" class="ad-reset" data-ad="pf-reset">처음 목록으로</button></div>' +
      '<p class="ad-help">위에서부터 7개가 첫 화면에 보이고, 맨 위 항목이 큰 칸에 나옵니다. 영상은 첫 화면에서 저절로 재생됩니다.</p><ol class="ad-list">' + list.map(function (f, i) { return row(f, i, list.length); }).join("") + "</ol></section>" +
      '<form class="ad-form ad-add" id="adAdd" novalidate><h2>새 포트폴리오 추가</h2><p class="ad-help">입점 업체에서 받은 사진·영상을 여기서 올립니다.</p>' +
      fld("입점 업체", '<span class="selbox"><select id="adAc" name="co">' + D.companies.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + "</option>"; }).join("") + "</select>" + I.down + "</span>", "adAc") +
      fld("제목", '<input class="inp" id="adAt" name="t" maxlength="40" placeholder="예: 화성시 공동주택 골조 공사">', "adAt") +
      fld("날짜", '<input class="inp" id="adAd" type="date" name="at" value="' + today() + '">', "adAd") +
      '<fieldset class="ad-row"><legend>사진 · 영상</legend><div class="ad-pics" id="adFp">' + VIDS.map(function (v, i) { return pick("m", "v:" + v[0], v[1], "media/" + v[0] + ".jpg", i === 0, true); }).join("") + FPICS.map(function (p) { return pick("m", "ph:" + p[0], p[1], photo(p[0]), false); }).join("") + "</div>" +
      '<label class="ad-file"><input type="file" accept="image/*" id="adAddFile"><span>' + I.plus + "업체에서 받은 사진 올리기</span></label></fieldset>" +
      '<div class="ad-act"><button type="submit" class="btn ad-save">추가하기</button></div></form></div>';
    var add = document.getElementById("adAdd");
    function save(l, msg) {
      if (!put("portfolio", l)) { BG.toast("저장 공간이 모자랍니다. 사진 몇 개를 지워 주세요"); return; }
      folioTab(el);
      BG.toast(msg);
    }
    document.getElementById("adAddFile").addEventListener("change", function () {
      var file = this.files && this.files[0], inp = this;
      shrink(file, function (d) { upF = d; upPick(document.getElementById("adFp"), "m", d, "올린 사진"); inp.value = ""; BG.toast("사진을 올렸습니다. 추가하기를 누르면 저장됩니다"); });
    });
    add.onsubmit = function (e) {
      e.preventDefault();
      var t = add.t.value.trim();
      if (!t) { BG.toast("제목을 적어 주세요"); add.t.focus(); return; }
      var m = (add.querySelector('input[name="m"]:checked') || {}).value || "", it = { co: add.co.value, t: t, at: (add.at.value || today()).replace(/-/g, ".") };
      if (m === "__up" && upF) it.img = upF; else if (m.indexOf("v:") === 0) it.v = m.slice(2); else if (m.indexOf("ph:") === 0) it.ph = m.slice(3); else it.v = VIDS[0][0];
      var l = A.homeFeed.list();
      l.unshift(it);
      save(l, "추가했습니다. 첫 화면 맨 앞 큰 칸에 보입니다");
    };
    el.querySelector(".ad-lw").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ad]");
      if (!b || b.disabled) return;
      var k = b.getAttribute("data-ad"), i = +b.getAttribute("data-i"), l = A.homeFeed.list(), x;
      if (k === "pf-reset") { try { localStorage.removeItem("b2bpick-portfolio"); } catch (er) {} folioTab(el); BG.toast("처음 목록으로 되돌렸습니다"); return; }
      if (k === "pf-del") { x = l.splice(i, 1)[0]; save(l, "‘" + (x.t || "") + "’ 항목을 지웠습니다"); return; }
      var j = k === "pf-up" ? i - 1 : i + 1;
      if (j < 0 || j >= l.length) return;
      x = l[i]; l[i] = l[j]; l[j] = x;
      save(l, k === "pf-up" ? "한 칸 위로 올렸습니다" : "한 칸 아래로 내렸습니다");
    });
  }

  A.views.admin = view;
})();
