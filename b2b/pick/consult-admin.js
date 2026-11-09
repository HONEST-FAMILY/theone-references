(function () {
  var A = window.APP;
  if (!A) return;
  var esc = A.esc;
  var TABS = [["", "전체"], ["new", "확인 중"], ["talk", "채팅 상담"], ["call", "전화 상담"], ["rec", "추천 완료"], ["done", "진행 완료"]];
  var STN = { "new": "매니저 확인 중", talk: "채팅 상담 중", call: "전화 상담 예정", rec: "업체 추천 완료", done: "진행 완료" };
  var MGR = "도아 담당 매니저";
  var V = { st: "", id: "", panel: "", pick: [], el: null };

  function norm(q) {
    if (!q.status || !STN[q.status]) q.status = "new";
    if (!Array.isArray(q.messages)) q.messages = [];
    if (!Array.isArray(q.recommend)) q.recommend = [];
    if (!Array.isArray(q.rows)) q.rows = [];
    q.mgr = q.mgr || MGR;
    return q;
  }
  function all() { var l = A.keep("requests"); return Array.isArray(l) ? l.filter(function (q) { return q && q.id; }).map(norm) : []; }
  function one(id) { var l = all(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function save(q) {
    var l = A.keep("requests");
    l = Array.isArray(l) ? l : [];
    var hit = false;
    for (var i = 0; i < l.length; i++) if (l[i] && l[i].id === q.id) { l[i] = q; hit = true; }
    if (!hit) l.unshift(q);
    A.keep("requests", l);
  }
  function rowVal(q, re) { for (var i = 0; i < q.rows.length; i++) if (re.test(q.rows[i][0])) return q.rows[i][1]; return ""; }
  function who(q) {
    var c = q.answers && q.answers.contact;
    if (c && c.name) return { name: c.name, phone: c.phone || "" };
    var v = rowVal(q, /연락처/), p = v.split(" · ");
    return { name: p[0] || "이름 미기재", phone: p[1] || "" };
  }
  function place(q) {
    var s = q.answers && q.answers.sido;
    if (s && s.sido) return { sido: s.sido, text: s.sido + (s.gu ? " " + s.gu : "") };
    var v = rowVal(q, /지역/);
    return { sido: (A.findData && A.findData.sido.filter(function (n) { return v.indexOf(n) === 0; })[0]) || "", text: v || "-" };
  }
  function day(iso) { var d = new Date(iso); if (isNaN(d)) return "-"; var p = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()); }
  function hm(iso) { return A.findData ? A.findData.hm(iso) : day(iso); }
  function kindOf(q) {
    if (q.kind === "work" || q.kind === "expert" || (q.work && q.kind !== "company")) return "ex";
    if (q.kind === "mcat" || q.kind === "material" || q.cat === "mat" || q.mcat) return "mat";
    if (q.kind === "pm" || q.kind === "finance" || q.cat === "dev") return "dev";
    return "build";
  }
  function cands(q) {
    var F = A.findData, sd = place(q).sido, k = kindOf(q), seen = {}, out = [];
    var add = function (list) { list.forEach(function (o) { if (!seen[o.id]) { seen[o.id] = 1; out.push(o); } }); };
    var sortCo = function (l) { return l.sort(function (a, b) { return (b.checks.length - a.checks.length) || (b.count - a.count); }); };
    if (BG.CO[q.to]) add([BG.CO[q.to]]);
    if (BG.EX[q.to]) add([BG.EX[q.to]]);
    if (k === "ex") {
      var w = q.work && q.work !== "all" ? q.work : "";
      add(F.exFind({ work: w, sido: sd }).sort(function (a, b) { return b.years - a.years; }));
      add(F.exFind({ work: w }).sort(function (a, b) { return b.years - a.years; }));
    } else {
      var cat = k === "mat" ? "mat" : k === "dev" ? "dev" : "build";
      add(sortCo(F.coFind({ cat: cat, sido: sd })));
      add(sortCo(F.coFind({ cat: cat })));
    }
    return out.slice(0, 8);
  }
  function candRow(o) {
    var F = A.findData, c = BG.CO[o.id], on = V.pick.indexOf(o.id) >= 0;
    var name = c ? c.name : o.name + " " + o.title.split(" · ")[0], kind = c ? F.kindLine(c) : "전문가 · " + A.workNames(o.works).join(" · ");
    return '<label class="ca-cand' + (on ? " on" : "") + '"><input type="checkbox" data-ca="pick" value="' + o.id + '"' + (on ? " checked" : "") + '><span class="ca-cand-b"><span class="ca-cand-t"><b>' + esc(name) + "</b><em>" + esc(kind) + "</em></span>" + (c ? F.coFacts(c) : F.exFacts(o)) + "</span></label>";
  }
  function msg(m) {
    var me = m.from === "me", rec = Array.isArray(m.rec) && m.rec.length ? '<p class="ca-recl">추천: ' + m.rec.map(function (id) { return esc(A.findData.recName(id)); }).join(", ") + "</p>" : "";
    return '<div class="ca-m ' + (me ? "me" : "mg") + '"><p class="ca-who">' + (me ? "고객" : esc(MGR)) + " · " + hm(m.at) + '</p><div class="ca-bub">' + esc(m.t).replace(/\n/g, "<br>") + "</div>" + rec + "</div>";
  }
  function list(el) {
    var l = all(), n = {};
    TABS.forEach(function (t) { n[t[0]] = 0; });
    l.forEach(function (q) { n[""]++; n[q.status]++; });
    var rows = l.filter(function (q) { return !V.st || q.status === V.st; });
    el.innerHTML = '<div class="ca"><p class="ca-rule">' + '<b>원칙</b> 고객 연락처는 관리자만 봅니다. 업체에는 매니저가 필요한 내용만 전합니다.</p>' +
      '<div class="ca-tabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" class="ca-tab' + (V.st === t[0] ? " on" : "") + '" data-ca="st" data-v="' + t[0] + '" role="tab" aria-selected="' + (V.st === t[0]) + '">' + t[1] + "<b>" + n[t[0]] + "</b></button>"; }).join("") + "</div>" +
      (rows.length ? '<div class="ca-tbl" role="table"><div class="ca-tr ca-th" role="row"><span>접수일</span><span>고객 이름</span><span>연락처</span><span>상담 분야</span><span>현장 지역</span><span>상태</span><span></span></div>' +
        rows.map(function (q) {
          var c = who(q);
          return '<button type="button" class="ca-tr" data-ca="open" data-id="' + esc(q.id) + '" role="row"><span class="ca-d">' + day(q.at) + '</span><span class="ca-nm">' + esc(c.name) + '</span><span class="ca-ph">' + esc(c.phone || "-") + '</span><span class="ca-f"><b>' + esc(q.title || "상담") + "</b><em>" + esc(q.label || "") + '</em></span><span class="ca-rg">' + esc(place(q).text) + '</span><span><i class="ca-st st-' + q.status + '">' + STN[q.status] + '</i></span><span class="ca-go">열기 ›</span></button>';
        }).join("") + "</div>" : '<p class="ca-empty">이 상태의 상담은 아직 없습니다. 위에서 ‘전체’를 눌러 보세요.</p>') + "</div>";
  }
  function detail(el, q) {
    var c = who(q), pl = place(q), F = A.findData;
    var panel = "";
    if (V.panel === "reply") panel = '<form class="ca-pan" data-ca-form="reply"><h3>매니저로 답장</h3><label><span class="f-sr">답장 내용</span><textarea name="t" rows="3" class="ca-inp" placeholder="고객에게 보낼 말을 적으세요"></textarea></label><div class="ca-pa"><button type="submit" class="f-btn">보내기</button><button type="button" class="f-btn line" data-ca="panel" data-v="">닫기</button></div></form>';
    if (V.panel === "call") panel = '<form class="ca-pan" data-ca-form="call"><h3>전화 상담 잡기</h3><div class="ca-row3"><label><span>날짜</span><input type="date" name="d" class="ca-inp" value="' + tomorrow() + '"></label><label><span>시간</span><select name="h" class="ca-inp">' + [9, 10, 11, 13, 14, 15, 16, 17].map(function (h) { return '<option value="' + h + '"' + (h === 14 ? " selected" : "") + ">" + (h < 12 ? "오전 " + h : "오후 " + (h === 12 ? 12 : h - 12)) + "시</option>"; }).join("") + '</select></label><label class="w"><span>메모 (고객에게도 보임)</span><input name="m" class="ca-inp" placeholder="예: 현장 도면을 보며 이야기 나눠요"></label></div><div class="ca-pa"><button type="submit" class="f-btn">전화 일정 보내기</button><button type="button" class="f-btn line" data-ca="panel" data-v="">닫기</button></div></form>';
    if (V.panel === "rec") panel = '<form class="ca-pan" data-ca-form="rec"><h3>업체 추천 <em>1~3곳 고르세요 · 고른 수 <b id="caN">' + V.pick.length + '</b></em></h3><p class="ca-hint">' + esc(pl.sido ? pl.sido + " 지역을 먼저, 모자라면 다른 지역을 이어서 보여 줍니다." : "전국에서 골라 보여 줍니다.") + '</p><div class="ca-cands">' + cands(q).map(candRow).join("") + '</div><label><span class="f-sr">추천 메시지</span><textarea name="t" rows="2" class="ca-inp">상담 내용을 바탕으로 맞는 곳을 골랐습니다. 업체 정보를 보시고 진행을 원하시면 ‘진행 요청’을 눌러 주세요. 업체와의 연락은 제가 가운데서 맡습니다.</textarea></label><div class="ca-pa"><button type="submit" class="f-btn">추천 보내기</button><button type="button" class="f-btn line" data-ca="panel" data-v="">닫기</button></div></form>';
    el.innerHTML = '<div class="ca"><p class="ca-rule"><b>원칙</b> 고객 연락처는 관리자만 봅니다. 업체에는 매니저가 필요한 내용만 전합니다.</p>' +
      '<div class="ca-dh"><button type="button" class="ca-back" data-ca="back">‹ 상담 목록</button><div class="ca-dt"><p class="f-kind">' + esc(q.label || "") + " · 접수 " + hm(q.at) + "</p><h2>" + esc(q.title || "상담") + '</h2></div><i class="ca-st st-' + q.status + '">' + STN[q.status] + "</i></div>" +
      '<div class="ca-acts"><button type="button" class="f-btn' + (V.panel === "reply" ? " on" : "") + '" data-ca="panel" data-v="reply">매니저로 답장</button><button type="button" class="f-btn' + (V.panel === "call" ? " on" : "") + '" data-ca="panel" data-v="call">전화 상담으로 진행</button><button type="button" class="f-btn or' + (V.panel === "rec" ? " on" : "") + '" data-ca="panel" data-v="rec">업체 추천</button><button type="button" class="f-btn line" data-ca="done"' + (q.status === "done" ? " disabled" : "") + '>진행 완료</button><a class="ca-view" href="#/match?rq=' + esc(q.id) + '">고객 화면에서 보기 ›</a></div>' + panel +
      '<div class="ca-two"><section class="ca-box"><h3>고객 정보 <em>관리자만 봄</em></h3><table class="f-tb ca-tb"><tr><th>이름</th><td>' + esc(c.name) + "</td></tr><tr><th>연락처</th><td><b>" + esc(c.phone || "-") + "</b></td></tr><tr><th>현장 지역</th><td>" + esc(pl.text) + "</td></tr>" + (q.call && q.call.at ? "<tr><th>전화 일정</th><td>" + esc(callText(q.call.at)) + (q.call.memo ? " · " + esc(q.call.memo) : "") + "</td></tr>" : "") + (q.recommend.length ? "<tr><th>추천한 곳</th><td>" + q.recommend.map(function (id) { return esc(F.recName(id)); }).join(", ") + "</td></tr>" : "") + '</table><h3 class="ca-h3">고객 답</h3><table class="f-tb ca-tb">' + q.rows.filter(function (r) { return !/연락처/.test(r[0]); }).map(function (r) { return "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</table></section>" +
      '<section class="ca-box"><h3>대화 <em>고객 화면과 같은 내용</em></h3><div class="ca-log">' + (q.messages.length ? q.messages.map(msg).join("") : '<p class="ca-empty">아직 대화가 없습니다. ‘매니저로 답장’을 눌러 첫 인사를 보내세요.</p>') + "</div></section></div></div>";
    var lg = el.querySelector(".ca-log");
    if (lg) lg.scrollTop = lg.scrollHeight;
  }
  function tomorrow() { var d = new Date(Date.now() + 864e5), p = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); }
  function callText(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var h = d.getHours(); return (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + (h < 12 ? "오전 " + h : "오후 " + (h === 12 ? 12 : h - 12)) + "시"; }
  function draw() {
    var el = V.el;
    if (!el) return;
    var q = V.id ? one(V.id) : null;
    if (q) detail(el, q); else { V.id = ""; list(el); }
  }
  function push(q, t, extra) {
    var m = { from: "mgr", t: t, at: new Date().toISOString() };
    for (var k in extra) m[k] = extra[k];
    q.messages.push(m);
  }
  function onClick(ev) {
    var b = ev.target.closest ? ev.target.closest("[data-ca]") : null;
    if (!b || !V.el.contains(b)) return;
    var a = b.getAttribute("data-ca");
    if (a === "pick") {
      var v = b.value, i = V.pick.indexOf(v);
      if (b.checked && i < 0) { if (V.pick.length >= 3) { b.checked = false; BG.toast("추천은 3곳까지 고를 수 있습니다"); return; } V.pick.push(v); }
      if (!b.checked && i >= 0) V.pick.splice(i, 1);
      b.closest(".ca-cand").classList.toggle("on", b.checked);
      var n = document.getElementById("caN");
      if (n) n.textContent = V.pick.length;
      return;
    }
    if (a === "st") { V.st = b.getAttribute("data-v"); draw(); }
    if (a === "open") { V.id = b.getAttribute("data-id"); V.panel = ""; V.pick = []; draw(); window.scrollTo(0, Math.min(window.scrollY, V.el.getBoundingClientRect().top + window.scrollY - 90)); }
    if (a === "back") { V.id = ""; V.panel = ""; V.pick = []; draw(); }
    if (a === "panel") { V.panel = V.panel === b.getAttribute("data-v") ? "" : b.getAttribute("data-v"); V.pick = []; draw(); var f = V.el.querySelector(".ca-pan textarea, .ca-pan input"); if (f && V.panel !== "rec") f.focus(); }
    if (a === "done") {
      var q = one(V.id);
      if (!q) return;
      q.status = "done";
      push(q, "업체와 진행을 시작했습니다. 이후 일정도 도아 담당 매니저가 가운데서 챙기겠습니다.");
      save(q);
      V.panel = "";
      draw();
      BG.toast("진행 완료로 바꿨습니다");
    }
  }
  function onSubmit(ev) {
    var f = ev.target;
    if (!f.getAttribute || !f.getAttribute("data-ca-form") || !V.el.contains(f)) return;
    ev.preventDefault();
    var kind = f.getAttribute("data-ca-form"), q = one(V.id);
    if (!q) return;
    if (kind === "reply") {
      var t = (f.t.value || "").trim();
      if (!t) { f.t.focus(); return; }
      push(q, t);
      if (q.status === "new") q.status = "talk";
      BG.toast("고객 대화창에 보냈습니다");
    }
    if (kind === "call") {
      var d = f.d.value || tomorrow(), h = +f.h.value || 14, at = new Date(d + "T" + (h < 10 ? "0" : "") + h + ":00:00"), memo = (f.m.value || "").trim();
      q.call = { at: at.toISOString(), memo: memo };
      q.status = "call";
      push(q, callText(at.toISOString()) + "에 남기신 번호로 전화드리겠습니다." + (memo ? " " + memo : ""));
      BG.toast("전화 일정을 고객에게 알렸습니다");
    }
    if (kind === "rec") {
      if (!V.pick.length) { BG.toast("추천할 곳을 1곳 이상 고르세요"); return; }
      q.recommend = V.pick.slice();
      q.status = "rec";
      push(q, (f.t.value || "").trim() || "상담 내용을 바탕으로 맞는 곳을 골랐습니다.", { rec: V.pick.slice() });
      BG.toast("추천 " + V.pick.length + "곳을 고객 대화창에 보냈습니다");
    }
    save(q);
    V.panel = "";
    V.pick = [];
    draw();
  }
  A.adminConsult = function (el, query) {
    if (!el) return;
    var qy = query || (BG.parseHash ? BG.parseHash().query : {}) || {};
    if (V.el !== el) {
      V.el = el;
      V.st = TABS.some(function (t) { return t[0] === qy.st; }) ? qy.st : "";
      V.id = qy.id || qy.rq || "";
      V.panel = "";
      V.pick = [];
      el.addEventListener("click", onClick);
      el.addEventListener("submit", onSubmit);
    } else if (qy.id || qy.rq) V.id = qy.id || qy.rq;
    draw();
  };
})();
