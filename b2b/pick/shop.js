(function () {
  var A = window.APP, D = A.D, S = A.S, esc = A.esc, won = A.won, photo = A.photo, I = A.I, app = A.app;
  var MT = BG.MT, MC = BG.MC, CO = BG.CO, EX = BG.EX;
  var SI = {
    star: '<svg viewBox="0 0 24 24"><path d="m12 3.8 2.45 5.1 5.6.75-4.1 3.9 1.03 5.55L12 16.4l-4.98 2.7 1.03-5.55-4.1-3.9 5.6-.75z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M3.5 8h3.2l1.8-2.6h7l1.8 2.6h3.2v11h-17z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    erase: '<svg viewBox="0 0 24 24"><path d="M4 20h16M8 16.5 4.5 13 13 4.5l6 6-6.5 6z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v10.5H10l-6 4.5z"/><path d="M8.5 10.8h7"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4.2l2.8 3.2v2.8h-7"/><circle cx="6.5" cy="17.4" r="1.8"/><circle cx="16.8" cy="17.4" r="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h3.2l1.6 4.4-2.1 1.3a10.6 10.6 0 0 0 6.1 6.1l1.3-2.1 4.4 1.6v3.2c0 .9-.7 1.6-1.6 1.6A16 16 0 0 1 4.4 5.1c0-.9.7-1.6 1.6-1.6z"/></svg>'
  };
  function mi(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  var MI = {
    all: mi('<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>'),
    steel: mi('<path d="M3.5 15.5 15.5 3.5M6 18 18 6M8.5 20.5l12-12"/><path d="m6.5 10.5 1.6 1.6M9.5 7.5l1.6 1.6M10 15l1.6 1.6M13 12l1.6 1.6"/>'),
    wood: mi('<circle cx="8" cy="12" r="4.5"/><circle cx="8" cy="12" r="1.6"/><path d="M8 7.5h12v9H8"/>'),
    cement: mi('<path d="M6.5 4h11l2 3.5V20h-15V7.5z"/><path d="M4.5 7.5h15M9 13h6M9 16h4"/>'),
    board: mi('<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 10c2.7 0 2.7 2.4 5.3 2.4s2.7-2.4 5.4-2.4 2.6 2.4 5.3 2.4"/>'),
    stone: mi('<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M3.5 12h17M12 3.5V12M8 12v8.5M16 12v8.5"/>'),
    pipe: mi('<path d="M3.5 6.5H13a5.5 5.5 0 0 1 5.5 5.5v8.5M3.5 11.5H13a.5.5 0 0 1 .5.5v8.5"/><path d="M3.5 4.5v9M16 20.5h5"/>'),
    finish: mi('<rect x="4" y="3.5" width="13" height="5" rx="1"/><path d="M17 6h2.5v5H11v3"/><rect x="9.5" y="14" width="3" height="6.5" rx=".8"/>')
  };
  var SIDO = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  var KW = { "서울": "sd", "경기": "sd", "인천": "sd", "강원": "gw", "대전": "cc", "세종": "cc", "충북": "cc", "충남": "cc", "충청": "cc", "광주": "hn", "전북": "hn", "전남": "hn", "호남": "hn", "부산": "yn", "대구": "yn", "울산": "yn", "경북": "yn", "경남": "yn", "영남": "yn", "제주": "jj" };
  var NEAR = { sd: ["gw", "cc"], gw: ["sd", "cc", "yn"], cc: ["sd", "gw", "hn", "yn"], hn: ["cc", "yn"], yn: ["gw", "cc", "hn"], jj: [] };
  var ST = { "new": "매니저 확인 중", talk: "채팅 상담 중", call: "전화 상담 예정", rec: "업체 추천 완료", done: "진행 완료" };
  var STEP = { "new": 0, talk: 1, call: 1, rec: 2, done: 3 };
  var CATN = { dev: "시행", build: "시공", mat: "자재" };
  var WEEK = ["일", "월", "화", "수", "목", "금", "토"];
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
    { t: "업체 찾기", d: "시행·시공·자재 분류를 누르면 바로 채팅 상담이 시작되고, 담당 매니저가 맞는 업체를 추천합니다.", href: "#/companies", ph: "hero_rise" },
    { t: "전문가 찾기", d: "설계·인허가부터 설비·조경까지 분야를 고르면 바로 상담이 시작됩니다. 연결은 담당 매니저가 맡습니다.", href: "#/experts", ph: "w_measure" },
    { t: "자재몰", d: "자재 분류를 누르면 견적 상담이 시작됩니다. 직접 담아 계약서에 서명하면 견적서가 바로 나옵니다.", href: "#/mall", ph: "mt_rebar" }
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
  var SIG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 90"><path d="M14 62c10-26 22-40 30-36 9 5-6 40 4 41 9 1 14-30 24-29 8 1 2 24 10 25 10 1 16-22 27-21 9 1 3 18 12 18 12 0 22-14 36-15 14-1 24 6 40 3" fill="none" stroke="#1e1e1c" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  var SAMPLE_CART = [["m1", 3, "D13 · 8m"], ["m7", 56, "25kg"], ["m9", 20, "50T · 450×1200 (10장)"]];
  function seedPicks() {
    var me = D.demoUser.company;
    function sc(c) { var s = c.sido || c.region; return (s === "경기" ? 4 : s === "서울" || s === "인천" ? 2 : 0) + ((c.works || []).indexOf("rc") >= 0 ? 5 : 0) + (c.type === "gc" ? 3 : 0); }
    return D.companies.filter(function (c) { return c.name !== me && c.type !== "de" && catsOf(c).indexOf("build") >= 0; })
      .map(function (c, i) { return { c: c, s: sc(c), i: i }; })
      .sort(function (a, b) { return (b.s - a.s) || (b.c.count - a.c.count) || (a.i - b.i); })
      .slice(0, 3).map(function (x) { return x.c.id; });
  }
  function seedRq() {
    try {
      if (localStorage.getItem("b2bpick-rq-seeded")) return;
      var now = A.keep("requests");
      if (Array.isArray(now) && now.length) return;
      var who = D.demoUser.name + " · 010-****-1234", rc = seedPicks(), mg = "도아 담당 매니저";
      A.keep("requests", [
        { id: "rq-ex3", to: "m1", cat: "", work: "", mcat: "", kind: "material", title: "철근 SD400 견적 상담", label: "자재몰 · 철근", answers: {},
          rows: [["자재", "철근 SD400 · D13 · 8m"], ["수량", "20톤"], ["납품 현장", "경기 평택시"], ["납품 희망일", "11월 넷째 주"], ["연락처", who]],
          at: "2026-11-09T09:40:00+09:00", status: "new", mgr: mg, recommend: [],
          messages: [{ from: "me", t: "철근 SD400 D13 · 8m 20톤 견적 부탁드립니다. 경기 평택시 현장이고, 11월 넷째 주에 받고 싶습니다.", at: "2026-11-09T09:40:00+09:00" }] },
        { id: "rq-ex2", to: "", cat: "", work: "design", mcat: "", kind: "work", title: "설계·인허가 상담", label: "전문가 찾기 · 설계·인허가", answers: {},
          rows: [["맡기실 일", "다세대 신축 설계·인허가"], ["현장 지역", "경기 용인시"], ["대지 면적", "330~990㎡"], ["진행 단계", "토지 보유 · 설계 전"], ["연락처", who]],
          at: "2026-11-08T11:15:00+09:00", status: "call", mgr: mg, recommend: [], call: { at: "2026-11-10T14:00:00+09:00", memo: "" },
          messages: [
            { from: "me", t: "설계·인허가 상담 신청합니다. 경기 용인시에 토지가 있고 다세대 신축을 생각하고 있습니다. 아직 설계 전입니다.", at: "2026-11-08T11:15:00+09:00" },
            { from: "mgr", t: "인허가 일정은 확인할 것이 많아 전화로 상담드리겠습니다. 11월 10일 오후 2시에 남기신 번호로 연락드릴게요.", at: "2026-11-08T13:05:00+09:00" }
          ] },
        { id: "rq-ex1", to: "", cat: "build", work: "", mcat: "", kind: "cat", title: "시공 업체 상담", label: "업체 찾기 · 시공", answers: {},
          rows: [["맡기실 일", "신축 시공·철근콘크리트"], ["현장 지역", "경기 화성시"], ["규모", "990~3,300㎡"], ["LH 매입약정 단계", "조건부 통과"], ["착공 희망 시기", "3개월 안"], ["연락처", who]],
          at: "2026-11-06T10:20:00+09:00", status: "rec", mgr: mg, recommend: rc, call: { at: "2026-11-06T14:00:00+09:00", memo: "" },
          messages: [
            { from: "me", t: "시공 업체 상담 신청합니다. 경기 화성시 신축(철근콘크리트), 990~3,300㎡이고 LH 매입약정은 조건부 통과했습니다. 3개월 안에 착공하고 싶습니다.", at: "2026-11-06T10:20:00+09:00" },
            { from: "mgr", t: "남겨 주신 내용 확인했습니다. 골조 물량과 일정은 전화로 한 번 여쭙겠습니다.", at: "2026-11-06T10:52:00+09:00" },
            { from: "mgr", t: "통화 감사합니다. 말씀하신 조건(경기 화성시 · 300~1,000평 · 3개월 안 착공)에 맞는 시공 업체 3곳을 추천드립니다.", at: "2026-11-06T15:30:00+09:00", rec: rc }
          ] }
      ]);
      localStorage.setItem("b2bpick-rq-seeded", "1");
    } catch (e) {}
  }
  seedRq();
  function reqsShown() { return reqs().slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); }); }
  function stOf(x) { return x && ST[x.status] ? x.status : "new"; }
  function msgsOf(x) { return x && Array.isArray(x.messages) ? x.messages : []; }
  function md(t) { var d = new Date(t); return (d.getMonth() + 1) + "월 " + d.getDate() + "일"; }
  function hm(t) { var d = new Date(t), h = d.getHours(), m = d.getMinutes(); return (h < 12 ? "오전 " : "오후 ") + (h % 12 || 12) + "시" + (m ? " " + m + "분" : ""); }
  function wk(t) { return md(t) + " (" + WEEK[new Date(t).getDay()] + ") " + hm(t); }
  function ro(w) { var c = w.charCodeAt(w.length - 1) - 44032; return c >= 0 && c < 11172 && c % 28 && c % 28 !== 8 ? "으로" : "로"; }
  function sdNow() { var v = A.keep("mall-sido"); return SIDO.indexOf(v) >= 0 ? v : ""; }
  function sdOf(c) { return c ? c.sido || c.region || "" : ""; }
  function dist(a, b) { var x = KW[a], y = KW[b]; if (!x || !y) return 2; if (x === y) return 0; if (x === "jj" || y === "jj") return 3; return NEAR[x].indexOf(y) >= 0 ? 1 : 2; }
  function lead(m) { if (/주문/.test(m.ship)) return -1; if (/당일/.test(m.ship)) return 0; var n = /(\d+)일/.exec(m.ship); return n ? Math.max(0, +n[1] - 1) : 1; }
  function shipOf(m, sd) {
    var co = CO[m.seller], from = sdOf(co), l = lead(m);
    if (!sd) return { t: m.ship, d: 0, from: from };
    var d = dist(sd, from), t;
    if (l < 0) t = "주문 제작 7일 뒤 출고";
    else if (d === 3) t = "배편 운송 · 4~6일";
    else { var n = d + l; t = n === 0 ? "당일 출고" : n === 1 ? "익일 출고" : n <= 3 ? "2~3일 안 출고" : "4~5일 안 출고"; }
    return { t: t, d: d, from: from };
  }
  function shipLine(m, sd, cls, tag) {
    var s = shipOf(m, sd), co = CO[m.seller], tg = tag || "p";
    return "<" + tg + ' class="' + (cls || "s-ship") + '">' + SI.truck + "<b>" + esc(sd ? sd + " 배송" : "전국 배송") + "</b><span>" + esc(s.t) + "</span>" + (co ? "<em>" + esc(s.from + " " + co.city) + " 공급사</em>" : "") + "</" + tg + ">";
  }
  function sdOpts(sd) { return '<option value=""' + (sd ? "" : " selected") + ">전국</option>" + SIDO.map(function (s) { return '<option value="' + s + '"' + (s === sd ? " selected" : "") + ">" + s + "</option>"; }).join(""); }
  function sampleQuote() {
    var items = [["m2", 10, "200×200×8×12 · 10m"], ["m6", 40, "40kg"], ["m13", 20, "15A · 6m"]].filter(function (r) { return MT[r[0]]; }).map(function (r) { var m = MT[r[0]], c = CO[m.seller]; return { id: m.id, name: m.name, seller: c ? c.name : "도아", sellerId: m.seller, spec: r[2], qty: r[1], unitName: m.unit, unit: m.price, list: m.price * r[1], amt: m.price * r[1] }; });
    var sum = items.reduce(function (s, x) { return s + x.amt; }, 0);
    return { no: "DOA-261029-001", at: new Date("2026-10-29T14:00:00+09:00").getTime(), buyer: D.demoUser.company, signer: D.demoUser.name, phone: "", site: "경기 화성시 신축 현장", items: items, list: sum, pay: sum, member: false, sig: SIG };
  }
  function quotesShown() { return myQuotes().concat([sampleQuote()]); }
  function seedCart() {
    var k = S.prefix + "-seed";
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch (e) { return; }
    if (S.cart.length) return;
    SAMPLE_CART.forEach(function (r) { if (MT[r[0]]) S.cart.push({ id: r[0], qty: r[1], spec: r[2] }); });
    S.save();
    changed();
  }
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
  function head(title, sub, crumbs, extra) {
    crumbs = crumbs && crumbs.length ? crumbs : [[title]];
    return '<section class="s-head"><p class="s-crumb"><a href="#/">홈</a>' + crumbs.map(function (c) { return '<span aria-hidden="true">›</span>' + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : "<em>" + esc(c[0]) + "</em>"); }).join("") + "</p><h1>" + esc(title) + "</h1>" + (sub ? '<p class="s-sub">' + esc(sub) + "</p>" : "") + (extra || "") + "</section>";
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

  var MALL = null;
  function mcard(m) {
    var co = CO[m.seller], st = stat(reviewsOf(m)), sd = MALL ? MALL.sd : sdNow();
    return '<article class="s-card"><a class="s-card-im" href="#/item/' + m.id + '"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></a><div class="s-card-b">' +
      '<p class="s-seller"><span>판매</span>' + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + "</a> · " + esc(sdOf(co) + " " + co.city) : "도아") + "</p>" +
      '<h3><a href="#/item/' + m.id + '">' + esc(m.name) + "</a></h3>" +
      '<p class="s-spec">' + esc(m.spec) + (m.specs.length > 1 ? " 외 " + (m.specs.length - 1) + "개 규격" : "") + " · 최소 " + esc(m.moq) + "</p>" + priceBlock(m) +
      shipLine(m, sd) +
      '<p class="s-meta">평점 ' + avg(st) + " · 리뷰 " + st.n + "</p>" +
      '<div class="s-card-a"><a class="btn s-chatb" href="#/match?to=' + m.id + '">' + SI.chat + "<span>채팅 견적 상담</span></a>" +
      '<button type="button" class="btn line-l s-add" data-act="s-add" data-id="' + m.id + '"><span>목록에 담기</span></button></div></div></article>';
  }
  function mbigs(kw) {
    var cats = [{ id: "all", name: "전체", n: D.materials.length, d: "자재 종류부터 함께 고릅니다" }].concat(D.matCats.map(function (x) {
      var ms = D.materials.filter(function (m) { return m.cat === x.id; });
      return { id: x.id, name: x.name, n: ms.length, d: ms.map(function (m) { return SHORT[m.id] || m.name; }).join(" · ") };
    }));
    return '<nav class="f-bigs" aria-label="자재 분류 바로 상담"><div class="f-bigs-in"><p class="f-bigs-h"><b>자재 분류를 누르면 바로 채팅 견적 상담이 시작됩니다</b><span>공급사 단가·재고는 도아 담당 매니저가 대신 확인해 드립니다</span></p><div class="f-bigs-row">' +
      cats.map(function (x) { return '<a class="f-big" href="#/match?mcat=' + x.id + (kw ? "&q=" + encodeURIComponent(kw) : "") + '">' + (MI[x.id] || MI.all) + '<span class="f-big-t"><b>' + esc(x.name) + "</b><em>" + x.n + '</em></span><span class="f-big-d">' + esc(x.d) + '</span><span class="f-big-go">바로 상담</span></a>'; }).join("") +
      "</div></div></nav>";
  }
  function sdChips(sd) {
    return '<div class="s-sido" role="group" aria-label="배송 지역 고르기"><p class="s-sido-k"><b>배송 지역</b><span>고르시면 가까운 공급사 자재가 먼저 나오고 출고일이 바뀝니다</span></p><div class="s-sido-l">' +
      [""].concat(SIDO).map(function (s) { return '<button type="button" class="s-sd' + (s === sd ? " on" : "") + '" data-act="s-sido" data-v="' + s + '" aria-pressed="' + (s === sd) + '">' + (s || "전국") + "</button>"; }).join("") + "</div></div>";
  }
  function hasKw(m, kw) {
    var co = CO[m.seller], hay = [m.name, m.spec, m.specs.join(" "), MC[m.cat] ? MC[m.cat].name : "", SHORT[m.id] || "", co ? co.name : ""].join(" ").toLowerCase().replace(/\s+/g, "");
    return kw.toLowerCase().split(/\s+/).filter(Boolean).some(function (w) { return hay.indexOf(w) >= 0; });
  }
  function moreBtn() {
    var left = MALL ? MALL.items.length - MALL.shown : 0;
    return left > 0 ? '<div class="s-more-w" id="s-more-w"><button type="button" class="btn line-l s-morebtn" data-act="s-more">더 보기 (남은 ' + left + "개)</button></div>" : "";
  }
  function mall(r) {
    var q = r.query, cq = q.cat || q.c, c = MC[cq] ? cq : "", sort = q.sort || "", kw = (q.q || "").trim(), sd = sdNow();
    var byC = D.materials.filter(function (m) { return !c || m.cat === c; }), hit = kw ? byC.filter(function (m) { return hasKw(m, kw); }) : byC, miss = kw && !hit.length;
    var items = (miss ? byC : hit).slice();
    if (sd && !sort) items = items.map(function (m, i) { return { m: m, d: shipOf(m, sd).d, i: i }; }).sort(function (a, b) { return (a.d - b.d) || (a.i - b.i); }).map(function (x) { return x.m; });
    if (sort === "low") items.sort(function (a, b) { return a.price - b.price; });
    if (sort === "review") items.sort(function (a, b) { return reviewsOf(b).length - reviewsOf(a).length; });
    var tiles = [{ id: "", name: "전체", n: (kw && !miss ? D.materials.filter(function (m) { return hasKw(m, kw); }) : D.materials).length }].concat(D.matCats.map(function (x) { return { id: x.id, name: x.name, n: D.materials.filter(function (m) { return m.cat === x.id && (!kw || miss || hasKw(m, kw)); }).length }; }));
    var u = user();
    var mem = S.member ? '<p class="s-mem">' + esc((u && (u.company || u.name)) || "회원") + "님 · 회원가로 보고 있습니다</p>" : '<p class="s-mem">정가로 보고 있습니다 · <a href="#/join">회원가입</a>하면 회원가로 견적을 받습니다</p>';
    var per = window.matchMedia && matchMedia("(max-width: 600px)").matches ? 6 : 12;
    MALL = { items: items, per: per, shown: Math.min(per, items.length), sd: sd, r: r };
    var cards = items.slice(0, MALL.shown).map(mcard).join("");
    var sf = '<form class="s-sbar" id="s-sf" role="search"><label><span class="s-sr">자재 검색</span><input type="search" name="q" value="' + esc(kw) + '" placeholder="자재 이름·규격 찾기 (예: 철근)" enterkeyhint="search"></label><button type="submit" aria-label="찾기">' + I.search + "</button></form>";
    var note = miss ? '<p class="s-miss">‘' + esc(kw) + '’와 딱 맞는 자재가 없어 ' + esc(c ? MC[c].name : "전체") + ' 자재를 모두 보여 드립니다. <a href="#/match?mcat=' + (c || "all") + "&q=" + encodeURIComponent(kw) + '">채팅으로 물어보시면 매니저가 찾아 드립니다</a></p>' : "";
    app.innerHTML = '<div class="s-mallw"><div class="s-pg s-mall s-mall-t">' + head("자재몰", "필요한 자재를 고르시면 도아 담당 매니저가 공급사 단가·재고를 확인해 견적을 드립니다.", [["자재몰"]], sf + sdChips(sd)) + "</div>" +
      mbigs(kw) +
      '<div class="s-pg s-mall s-mall-b"><div class="s-brw-h"><h2>자재 직접 둘러보기</h2><p>직접 담아 계약서에 서명하면 견적서가 바로 나옵니다.</p></div>' +
      '<nav class="s-mchips" aria-label="자재 분류로 둘러보기">' + tiles.map(function (t) { return '<a class="s-mchip' + (c === t.id ? " on" : "") + '" href="#/mall' + BG.qs({ cat: t.id, sort: sort, q: kw }) + '"' + (c === t.id ? ' aria-current="page"' : "") + ">" + esc(t.name) + " <b>" + t.n + "</b></a>"; }).join("") + "</nav>" + note +
      '<div class="s-bar"><p class="s-cnt">' + esc(kw && !miss ? "‘" + kw + "’ 찾은 자재" : c ? MC[c].name : "전체 자재") + " <b>" + items.length + "</b>종" + (sd ? '<span class="s-cnt-sd">' + esc(sd) + " 배송 기준 · 가까운 공급사 먼저</span>" : "") + "</p>" + mem +
      '<p class="s-sort">' + [["", sd ? "가까운 순" : "기본순"], ["low", "낮은 가격순"], ["review", "리뷰 많은 순"]].map(function (o) { return '<a href="#/mall' + BG.qs({ cat: c, sort: o[0], q: kw }) + '" class="' + (sort === o[0] ? "on" : "") + '">' + o[1] + "</a>"; }).join("") + "</p></div>" +
      '<div class="s-grid" id="s-grid">' + cards + "</div>" + moreBtn() + cbar() + "</div></div>";
    var f = document.getElementById("s-sf");
    f.addEventListener("submit", function (ev) { ev.preventDefault(); var v = f.q.value.trim(); location.hash = "#/mall" + BG.qs({ cat: c, sort: sort, q: v }); });
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
    ].map(function (x) { x.by = "도아 담당 매니저"; return x; });
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
    var m = cur.m, co = CO[m.seller], list = reviewsOf(m), st = stat(list), qa = qaOf(m), th = thumbs(m), u = S.priceOf(m), sd = sdNow();
    var phs = []; list.forEach(function (x) { (x.photos || []).slice(0, 1).forEach(function (p) { phs.push(p); }); });
    var bars = [5, 4, 3, 2, 1].map(function (k) { var n = st.c[k] || 0, w = st.n ? Math.round(n / st.n * 100) : 0; return '<li><span class="s-bk">' + k + '점</span><span class="s-bb"><i style="width:' + w + '%"></i></span><span class="s-bn">' + n + "</span></li>"; }).join("");
    var specs = m.specs.map(function (s) { return '<button type="button" class="s-sp' + (s === cur.spec ? " on" : "") + '" data-act="s-spec" data-v="' + esc(s) + '" aria-pressed="' + (s === cur.spec) + '">' + esc(s) + "</button>"; }).join("");
    app.innerHTML = '<div class="s-pg s-item">' +
      '<p class="s-crumb s-crumb-it"><a href="#/">홈</a><span aria-hidden="true">›</span><a href="#/mall">자재몰</a><span aria-hidden="true">›</span><a href="#/mall?c=' + m.cat + '">' + esc(MC[m.cat].name) + "</a></p>" +
      '<div class="s-it"><div class="s-gal"><div class="s-gal-main" id="s-gm">' + timg(th[0]) + '</div><div class="s-gal-th" role="group" aria-label="사진 고르기">' + th.map(function (t, i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-act="s-th" data-i="' + i + '" aria-label="' + esc(t.alt) + ' 보기">' + timg(t) + "</button>"; }).join("") + "</div></div>" +
      '<div class="s-info"><div class="s-vend"><p class="s-vend-k">판매 입점 업체</p><p class="s-vend-n">' + (co ? '<a href="#/company/' + co.id + '">' + esc(co.name) + SI.chev + "</a>" : "도아") + '</p><p class="s-vend-m">' + esc(vendMeta(co)) + '</p><p class="s-vend-c">' + SI.check + esc(okLine(co)) + "</p></div>" +
      "<h1>" + esc(m.name) + '</h1><a class="s-rate" href="#s-t-rv">' + stars(st.avg, "sm") + "<b>" + avg(st) + "</b><span>리뷰 " + st.n + "</span></a>" + priceBlock(m) +
      '<div class="s-act0"><a class="btn s-act-main" href="#/match?to=' + m.id + '">' + SI.chat + '<span>채팅으로 견적 상담</span></a><p class="s-act-n">' + SI.check + '<span>도아 담당 매니저가 공급사 단가·재고를 대신 확인해 드립니다. 공급사와 따로 연락하실 필요가 없습니다.</span></p></div>' +
      '<div class="s-opt"><p class="s-lab">규격</p><div class="s-specs">' + specs + '</div><p class="s-lab">수량 <span>(' + esc(m.unit) + ")</span></p>" +
      '<div class="s-qrow"><div class="qty"><button type="button" data-act="s-q" data-d="-1" aria-label="수량 줄이기">' + I.minus + '</button><input id="s-qty" inputmode="numeric" value="' + cur.qty + '" aria-label="수량"><button type="button" data-act="s-q" data-d="1" aria-label="수량 늘리기">' + I.plus + '</button></div><p class="s-moq">최소 주문 ' + esc(m.moq) + "</p></div>" +
      '<p class="s-amt"><span>선택 금액</span><b id="s-amt">' + won(u * cur.qty) + "원</b></p></div>" +
      '<table class="s-tbl"><tr><th>배송 지역</th><td><span class="selbox s-sdsel"><select id="s-sdsel" aria-label="배송 지역 고르기">' + sdOpts(sd) + "</select>" + I.down + '</span><div id="s-shipv">' + shipLine(m, sd, "s-ship s-ship-it") + "</div></td></tr><tr><th>최소 주문</th><td>" + esc(m.moq) + "</td></tr><tr><th>배송</th><td>화물차 현장 납품 · 1층 하차 기준 (층 올림은 따로 견적)</td></tr><tr><th>대금</th><td>견적 확정 뒤 담당 매니저가 안내 · 온라인 결제 없음</td></tr></table>" +
      '<div class="s-act"><p class="s-act-k">고른 규격·수량으로 직접 담아 견적서 받기</p><div class="s-act2"><button type="button" class="btn line-l" data-act="s-add-it">견적 목록에 담기</button><button type="button" class="btn line-l" data-act="s-buy">바로 견적서 받기</button></div></div>' +
      '<p class="s-added" id="s-added" hidden>' + SI.check + '견적 목록에 담았습니다 <a href="#/cart">견적 목록 보기</a></p></div></div>' +
      '<nav class="s-tabs" id="s-tabs" aria-label="상품 정보"><a href="#s-t-info" class="on">상세정보</a><a href="#s-t-rv">리뷰 <b>' + st.n + '</b></a><a href="#s-t-qa">문의 <b>' + qa.length + '</b></a><a href="#s-t-ret">교환·반품 안내</a></nav>' +
      '<section class="s-sec" id="s-t-info"><h2>상세정보</h2><table class="s-tbl s-spec"><tr><th>품명</th><td>' + esc(m.name) + "</td></tr><tr><th>분류</th><td>" + esc(MC[m.cat].name) + "</td></tr><tr><th>규격</th><td>" + m.specs.map(esc).join("<br>") + "</td></tr><tr><th>단위</th><td>" + esc(m.unit) + "</td></tr><tr><th>최소 주문</th><td>" + esc(m.moq) + "</td></tr><tr><th>출고</th><td>" + esc(m.ship) + "</td></tr><tr><th>판매 업체</th><td>" + esc(co ? co.name + " · " + co.region + " " + co.city : "도아") + "</td></tr><tr><th>확인 항목</th><td>" + esc(okLine(co)) + "</td></tr><tr><th>견적 방식</th><td>채팅으로 상담하시거나, 견적 목록에 담고 계약서에 서명하면 견적서가 나옵니다. 대금과 납품 일정은 담당 매니저가 공급사와 맞춰 안내합니다.</td></tr></table>" +
      '<ul class="s-notes">' + (NOTE[m.cat] || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<figure class="s-big"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"><figcaption>' + esc(m.name + " · " + m.spec) + '</figcaption></figure><figure class="s-big"><img loading="lazy" src="' + photo((SITE[m.cat] || [m.ph])[0]) + '" alt="' + esc(MC[m.cat].name) + ' 현장"><figcaption>' + esc(MC[m.cat].name) + " 시공 현장</figcaption></figure></section>" +
      '<section class="s-sec" id="s-t-rv"><div class="s-sec-h"><h2>리뷰 <b>' + st.n + '</b></h2><button type="button" class="btn s-wr" data-act="s-rv-open">리뷰 쓰기</button></div>' +
      '<div class="s-rv-sum"><div class="s-rv-avg"><b>' + avg(st) + "</b>" + stars(st.avg) + "<p>리뷰 " + st.n + '개 평균</p></div><ul class="s-rv-bars">' + bars + "</ul></div>" +
      (phs.length ? '<div class="s-rv-phs"><p class="s-lab">사진 리뷰 <span>' + phs.length + '</span></p><div class="s-rv-strip">' + phs.slice(0, 8).map(function (p, i) { return '<button type="button" data-act="s-rv-photo" aria-label="사진 리뷰만 보기 ' + (i + 1) + '"><img loading="lazy" src="' + esc(src(p)) + '" alt=""></button>'; }).join("") + "</div></div>" : "") +
      '<p class="s-rv-sort" role="group" aria-label="리뷰 정렬">' + [["new", "최신순"], ["rate", "평점순"], ["photo", "사진 리뷰만"]].map(function (o) { return '<button type="button" data-act="s-rv-sort" data-v="' + o[0] + '" class="' + (cur.sort === o[0] ? "on" : "") + '" aria-pressed="' + (cur.sort === o[0]) + '">' + o[1] + "</button>"; }).join("") + '</p><ul class="s-rv-list" id="s-rvl">' + rvList() + "</ul></section>" +
      '<section class="s-sec" id="s-t-qa"><div class="s-sec-h"><h2>문의 <b>' + qa.length + '</b></h2><a class="btn line-l s-wr" href="#/match?to=' + m.id + '">채팅으로 문의하기</a></div><ul class="s-qa">' + qa.map(function (x) {
        return '<li><p class="s-qa-q"><span>질문</span>' + esc(x.q) + '</p><p class="s-qa-m">' + esc(x.who) + " · " + day(x.at) + " · 답변 완료</p>" + (x.secret ? '<p class="s-qa-a s-qa-s">비밀 답변입니다. 질문한 회원과 담당 매니저만 볼 수 있습니다.</p>' : '<p class="s-qa-a"><span>답변 · ' + esc(x.by) + "</span>" + esc(x.a) + "</p>") + "</li>";
      }).join("") + "</ul></section>" +
      '<section class="s-sec" id="s-t-ret"><h2>교환·반품 안내</h2><table class="s-tbl"><tr><th>신청 기간</th><td>받은 날부터 7일 안에 담당 매니저에게 알려 주세요.</td></tr><tr><th>비용</th><td>제품 하자나 다른 규격이 온 경우는 판매 업체가, 단순 변심은 구매자가 왕복 운송비를 냅니다.</td></tr><tr><th>교환·반품이 어려운 경우</th><td>절단·가공한 자재, 주문 제작 품목, 개봉해 사용한 자재, 현장 보관 중 젖거나 손상된 자재</td></tr><tr><th>문의</th><td>담당 매니저 · 대표번호 1588-9863</td></tr></table></section>' +
      '<div class="s-buy"><a class="btn" href="#/match?to=' + m.id + '">채팅으로 견적 상담</a><button type="button" class="btn line-l" data-act="s-add-it">목록에 담기</button></div></div>';
    var qi = document.getElementById("s-qty"), ss = document.getElementById("s-sdsel");
    ss.addEventListener("change", function () { A.keep("mall-sido", ss.value); document.getElementById("s-shipv").innerHTML = shipLine(m, sdNow(), "s-ship s-ship-it"); });
    qi.addEventListener("change", function () { cur.qty = fixQty(m, qi.value); qi.value = cur.qty; amt(); });
    var nav = document.getElementById("s-tabs");
    BG.spy(nav, function () { var h = document.getElementById("hd"); return (h ? h.offsetHeight : 64) + nav.offsetHeight; });
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
      '<p class="s-row-u">' + (S.member ? "회원가 " : "") + won(x.unit) + "원 / " + esc(m.unit) + " · 최소 " + esc(m.moq) + "</p>" + shipLine(m, sdNow(), "s-ship s-ship-row") + "</div>" +
      '<div class="s-row-q"><div class="qty"><button type="button" data-act="s-cq" data-i="' + x.i + '" data-d="-1" aria-label="수량 줄이기">' + I.minus + '</button><input data-s-qty="' + x.i + '" inputmode="numeric" value="' + x.qty + '" aria-label="' + esc(m.name) + ' 수량"><button type="button" data-act="s-cq" data-i="' + x.i + '" data-d="1" aria-label="수량 늘리기">' + I.plus + '</button></div><span>' + esc(m.unit) + "</span></div>" +
      '<p class="s-row-p">' + won(x.amt) + '원</p><button type="button" class="s-row-x" data-act="s-cdel" data-i="' + x.i + '" aria-label="' + esc(m.name) + ' 빼기">빼기</button></article>';
  }
  function sumBox() {
    var t = S.cartTotals();
    return '<aside class="s-sumb"><h2>견적 합계</h2><dl><div><dt>품목</dt><dd>' + t.count + "개</dd></div><div><dt>정가 합계</dt><dd>" + won(t.list) + "원</dd></div>" + (S.member ? "<div><dt>회원가 합계</dt><dd>" + won(t.pay) + "원</dd></div>" : "") + '<div class="t"><dt>견적 금액</dt><dd>' + won(t.pay) + "원</dd></div></dl>" +
      (S.member ? "" : '<p class="s-sumb-n"><a href="#/join">회원가입</a>하면 회원가로 다시 계산됩니다.</p>') + '<a class="btn s-wide" href="#/sign">계약서 쓰고 견적서 받기</a><a class="btn line-l s-wide s-sumb-chat" href="#/match?mcat=all">' + SI.chat + '<span>채팅으로 견적 상담</span></a><p class="s-sumb-n">대금은 견적 확정 뒤 담당 매니저가 안내합니다. 이 사이트에서는 결제하지 않습니다.</p></aside>';
  }
  function cart() {
    seedCart();
    var rows = cartRows();
    var sd = sdNow();
    app.innerHTML = '<div class="s-pg s-cartp">' + head("자재 견적 목록", "담은 자재를 입점 업체별로 모았습니다. 계약서에 서명하면 견적서가 나옵니다.", [["자재몰", "#/mall"], ["자재 견적 목록"]]) +
      (rows.length ? '<div class="s-cart"><div class="s-cl"><div class="s-csd"><p><b>배송 지역</b><span>' + esc(sd ? sd + " 현장 기준으로 품목별 출고일을 안내합니다" : "전국 기준 출고일입니다. 지역을 고르시면 맞춰 안내합니다") + '</span></p><span class="selbox s-sdsel"><select id="s-csd" aria-label="배송 지역 고르기">' + sdOpts(sd) + "</select>" + I.down + "</span></div>" + bySeller(rows).map(function (g) {
        return '<section class="s-grp"><header class="s-grp-h"><p class="s-grp-n"><span>판매</span>' + (g.c ? '<a href="#/company/' + g.c.id + '">' + esc(g.c.name) + "</a>" : "도아") + '</p><p class="s-grp-m">' + esc(vendMeta(g.c)) + " · " + esc(okLine(g.c)) + "</p></header>" + g.rows.map(cartRow).join("") + "</section>";
      }).join("") + "</div>" + sumBox() + "</div>" : '<div class="s-empty"><p>담은 자재가 없습니다.</p><a class="btn" href="#/mall">자재몰로 가기</a></div>') + "</div>";
    var cs = document.getElementById("s-csd");
    if (cs) cs.addEventListener("change", function () { A.keep("mall-sido", cs.value); redrawCart(); });
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
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1e1e1c"; ctx.lineWidth = 2.6 * d;
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
    seedCart();
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
      "<li><b>제5조 (중개)</b> 도아는 거래를 중개하며, 담당 매니저가 견적 확정과 납품 일정 조율을 맡습니다. 공급자와 구매자의 연락은 담당 매니저를 거칩니다.</li></ol>" +
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
    var list = quotesShown(), qd = r.query.no ? list.filter(function (x) { return x.no === r.query.no; })[0] : list[0];
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
      '<ol class="s-flow"><li><b>담당 매니저 확인</b><span>견적서와 서명한 계약서를 확인합니다.</span></li><li><b>매니저가 공급사와 견적 확정</b><span>담당 매니저가 재고와 출고일을 공급사와 맞춥니다.</span></li><li><b>대금 · 납품 일정 안내</b><span>확정된 견적으로 대금과 납품일을 매니저가 안내합니다.</span></li></ol></aside></div></div>';
  }

  function reqName(x) {
    var c = CO[x.to], e = EX[x.to], m = MT[x.to];
    var k = c || x.kind === "company" || x.kind === "cat" ? "업체 상담" : e || x.kind === "expert" || x.kind === "work" ? "전문가 상담" : m || x.kind === "material" || x.kind === "mcat" ? "자재 견적 상담" : x.to === "pm" || x.kind === "pm" ? "PM 상담" : x.to === "finance" || x.kind === "finance" ? "금융 상담" : "상담";
    var n = x.title || (c ? c.name + " 상담" : e ? e.name + " " + e.title + " 상담" : m ? m.name + " 견적 상담" : k);
    var sub = x.label || (c ? A.typeName(c.type) + " · " + sdOf(c) + " " + c.city : e ? e.region + " · 경력 " + e.years + "년" : m ? "자재몰 · " + (MC[m.cat] ? MC[m.cat].name : "") : "");
    return { n: n, s: sub, k: k };
  }
  function recCard(x, c) {
    var picked = msgsOf(x).some(function (g) { return g.from === "me" && g.pick === c.id; });
    var lic = (c.licenses || []).join(" · ");
    return '<li class="s-rc"><p class="s-rc-k">' + esc((CATN[c.cat] || CATN[catsOf(c)[0]] || "업체") + " · " + A.typeName(c.type)) + '</p><h4><a href="#/company/' + c.id + '">' + esc(c.name) + "</a></h4>" +
      '<dl class="s-rc-f"><div><dt>지역</dt><dd>' + esc(sdOf(c) + " " + c.city) + "</dd></div><div><dt>설립</dt><dd>" + esc(c.since + "년") + "</dd></div><div><dt>실적</dt><dd>" + esc(won(c.count) + "건") + "</dd></div>" + (lic ? "<div><dt>면허</dt><dd>" + esc(lic) + "</dd></div>" : "") + "</dl>" +
      '<p class="s-rc-ok">' + SI.check + "<span>도아 확인 · " + esc((c.checks || []).map(function (k) { return { "면허": "면허", "사업자": "사업자등록", "보험": "보험 가입" }[k] || k; }).join(" · ")) + "</span></p>" +
      (picked ? '<p class="s-rc-done">' + SI.check + "<span>진행 요청을 보냈습니다</span></p>" : '<button type="button" class="btn s-rc-go" data-act="s-pick" data-rq="' + esc(x.id) + '" data-c="' + c.id + '">이 업체로 진행 요청</button>') + "</li>";
  }
  function rqItem(x, full) {
    var nm = reqName(x), st = stOf(x), ms = msgsOf(x), last = null, step = STEP[st];
    for (var i = ms.length - 1; i >= 0; i--) if (ms[i] && ms[i].from === "mgr") { last = ms[i]; break; }
    var recs = (Array.isArray(x.recommend) ? x.recommend : []).map(function (id) { return CO[id]; }).filter(Boolean);
    var href = "#/match?rq=" + encodeURIComponent(x.id);
    var h = '<li class="s-rq s-rqst-' + st + '"><div class="s-rq-top"><p class="s-rq-k">' + esc(nm.k) + (x.at ? " · " + day(x.at) : "") + '</p><p class="s-st s-st-' + st + '">' + esc(ST[st]) + "</p></div>" +
      '<h3><a href="' + href + '">' + esc(nm.n) + "</a></h3>" + (nm.s ? '<p class="s-rq-s">' + esc(nm.s) + "</p>" : "") +
      '<ol class="s-stp" aria-label="진행 단계">' + ["매니저 확인", "채팅·전화 상담", "업체 추천", "진행"].map(function (t, k) { return '<li class="' + (k < step ? "ok" : k === step ? "on" : "") + '"' + (k === step ? ' aria-current="step"' : "") + "><span>" + t + "</span></li>"; }).join("") + "</ol>";
    if (full) h += answers(x.answers, x.rows);
    if (st === "call" && x.call && x.call.at) h += '<p class="s-rq-call">' + SI.phone + "<span><b>" + esc(wk(x.call.at)) + "</b> 남기신 번호로 담당 매니저가 전화드립니다</span></p>";
    if (st === "new") h += '<p class="s-rq-wait">담당 매니저가 남기신 내용을 확인하고 있습니다. 채팅이나 전화로 곧 연락드립니다.</p>';
    if (last) h += '<div class="s-mmsg"><p class="s-mmsg-k">' + esc(x.mgr || "도아 담당 매니저") + (last.at ? " · " + esc(md(last.at) + " " + hm(last.at)) : "") + "</p><p>" + esc(last.t || "") + "</p></div>";
    if (recs.length && full) h += '<div class="s-recb"><p class="s-recb-h"><b>매니저가 추천한 업체 ' + recs.length + '곳</b><span>업체에 전하는 말과 일정 조율은 담당 매니저가 대신 합니다</span></p><ul class="s-rcs">' + recs.map(function (c) { return recCard(x, c); }).join("") + "</ul></div>";
    h += '<div class="s-rq-a"><a class="btn line-l" href="' + href + '">' + SI.chat + "<span>대화 보기</span></a>" + (recs.length && !full ? '<a class="s-more" href="#/quote">추천 업체 ' + recs.length + "곳 보기 " + I.arrow + "</a>" : "") + "</div></li>";
    return h;
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
    seedCart();
    var rows = cartRows(), rq = reqsShown(), qs = quotesShown(), t = S.cartTotals(), emptyAll = !rows.length && !rq.length && !qs.length;
    var cta = '<div class="s-head-a"><a class="btn s-cta" href="#/match">' + SI.chat + '<span>채팅으로 새 상담 시작</span></a><a class="s-call" href="tel:1588-9863">' + SI.phone + "<span>전화 상담 1588-9863</span></a></div>";
    var html = '<div class="s-pg s-hub">' + head("견적서 받기", emptyAll ? "업체 찾기·전문가 찾기·자재몰 상담을 한곳에서 받습니다. 먼저 찾으실 것을 골라 주세요." : "상담 요청과 자재 견적을 한곳에서 확인합니다. 업체 연결은 도아 담당 매니저가 가운데에서 맡습니다.", [["견적서 받기"]], cta);
    if (emptyAll) {
      html += doorsHtml(true) + '<p class="s-hub-n">분야를 골라 상담을 시작하거나 자재를 담으면 이 화면에 모입니다. 담당 매니저가 확인한 뒤 연락드립니다.</p>';
    } else {
      html += '<dl class="s-hub-sum"><div><dt>상담 요청</dt><dd>' + rq.length + '건</dd></div><div><dt>자재 견적 목록</dt><dd>' + rows.length + "품목</dd></div><div><dt>받은 견적서</dt><dd>" + qs.length + "건</dd></div></dl>";
      html += '<section class="s-hs" id="s-rqsec"><div class="s-hs-h"><h2>내 상담 요청</h2><p class="s-hs-n">고객님과 업체 사이는 도아 담당 매니저가 이어 드립니다</p></div>' + (rq.length ? '<ul class="s-rqs">' + rq.map(function (x) { return rqItem(x, true); }).join("") + "</ul>" : '<p class="s-hs-e">아직 보낸 상담 요청이 없습니다. <a href="#/match">채팅 상담</a>을 시작하면 여기에 모입니다.</p>') + "</section>";
      html += '<section class="s-hs"><div class="s-hs-h"><h2>자재 견적 목록</h2>' + (rows.length ? '<a class="s-more" href="#/cart">목록 고치기 ' + I.arrow + "</a>" : "") + "</div>" +
        (rows.length ? '<ul class="s-mini">' + rows.map(function (x) { return '<li><img src="' + photo(x.m.ph) + '" alt=""><p><b>' + esc(x.m.name) + "</b><span>" + esc((CO[x.m.seller] ? CO[x.m.seller].name + " · " : "") + x.spec + " · " + won(x.qty) + x.m.unit) + "</span>" + shipLine(x.m, sdNow(), "s-ship s-ship-mini", "span") + "</p><strong>" + won(x.amt) + "원</strong></li>"; }).join("") + '</ul><div class="s-hs-f"><p>견적 금액 <b>' + won(t.pay) + '원</b></p><a class="btn" href="#/sign">계약서 쓰고 견적서 받기</a></div>' : '<p class="s-hs-e">담은 자재가 없습니다. <a href="#/mall">자재몰</a>에서 담으면 여기에 모입니다.</p>') + "</section>";
      if (qs.length) html += '<section class="s-hs"><div class="s-hs-h"><h2>받은 견적서</h2></div><ul class="s-qs">' + qs.map(function (x) { return '<li><a href="#/quote/done?no=' + encodeURIComponent(x.no) + '"><b>' + esc(x.no) + "</b><span>" + day(x.at) + " · " + esc(x.items[0] ? x.items[0].name : "") + (x.items.length > 1 ? " 외 " + (x.items.length - 1) + "품목" : "") + "</span><strong>" + won(x.pay) + "원</strong>" + I.arrow + "</a></li>"; }).join("") + "</ul></section>";
      html += '<section class="s-hs"><div class="s-hs-h"><h2>새 상담 시작하기</h2></div>' + doorsHtml(false) + "</section>";
    }
    app.innerHTML = html + "</div>";
  }
  function redraw() { var y = window.scrollY, r = BG.parseHash(); if (A.views[r.name]) A.views[r.name](r); window.scrollTo(0, y); changed(); }

  var J = null;
  function join(r) {
    var k = r.query.kind === "biz" || r.query.kind === "person" ? r.query.kind : "";
    J = { step: k ? 2 : 1, kind: k, f: {}, p: [], ref: "", refOk: false };
    drawJoin(false);
  }
  function fv(n) { return esc(J.f[n] || ""); }
  function joinBody() {
    if (J.step === 1) {
      return '<div class="s-kinds"><button type="button" class="s-kind" data-act="s-kind" data-k="biz"><span class="s-kind-im"><img src="' + photo("hero_rise") + '" alt=""></span><span class="s-kind-b"><b>업체 입점 (사업자)</b><span>시행·시공·자재·설계·PM·금융 업체로 입점하면 담당 매니저가 맞는 상담과 견적 요청을 전해 드립니다.</span><em>사업자등록번호로 가입 ' + I.arrow + "</em></span></button>" +
        '<button type="button" class="s-kind" data-act="s-kind" data-k="person"><span class="s-kind-im"><img src="' + photo("site_aerial") + '" alt=""></span><span class="s-kind-b"><b>일반회원 (개인)</b><span>토지·기술·자본을 가지고 계신 분, 자재를 사려는 분이 가입합니다.</span><em>휴대폰 번호로 가입 ' + I.arrow + "</em></span></button></div>" + refAsk(true);
    }
    if (J.step === 2) {
      var biz = J.kind === "biz";
      return '<form class="s-jf" id="s-jf" novalidate><p class="s-jk">' + (biz ? "업체 입점 (사업자)" : "일반회원 (개인)") + ' <button type="button" class="s-link" data-act="s-jprev">회원 종류 바꾸기</button></p>' + refBox(biz) + '<div class="s-jg">' +
        (biz ? '<label class="s-fl"><span>회사명</span><input class="inp" name="company" value="' + fv("company") + '" autocomplete="organization"></label><label class="s-fl"><span>사업자등록번호</span><input class="inp" name="bizNo" value="' + fv("bizNo") + '" inputmode="numeric" placeholder="000-00-00000"></label><label class="s-fl"><span>담당자 이름</span><input class="inp" name="name" value="' + fv("name") + '" autocomplete="name"></label>' : '<label class="s-fl"><span>이름</span><input class="inp" name="name" value="' + fv("name") + '" autocomplete="name"></label>') +
        '<label class="s-fl"><span>휴대폰</span><input class="inp" name="phone" value="' + fv("phone") + '" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000"></label>' +
        '<label class="s-fl"><span>아이디</span><input class="inp" name="id" value="' + fv("id") + '" autocomplete="username" placeholder="영문·숫자 4자 이상"></label><label class="s-fl"><span>비밀번호</span><input class="inp" type="password" name="pw" autocomplete="new-password" placeholder="8자 이상"></label></div>' +
        (biz ? '<fieldset class="s-fs"><legend>업종</legend><div class="s-chips">' + FIELDS.map(function (x) { return '<label class="s-chip"><input type="radio" name="field" value="' + x[0] + '"' + (J.f.field === x[0] ? " checked" : "") + "><span>" + x[1] + "</span></label>"; }).join("") + "</div></fieldset>" : "") +
        '<p class="s-err" id="s-jerr" role="alert"></p><div class="s-jact"><button type="button" class="btn line-l" data-act="s-jprev">이전</button><button type="submit" class="btn">다음</button></div></form>';
    }
    return '<form class="s-jf" id="s-jf" novalidate><fieldset class="s-fs"><legend>가입 목적 <em>여러 개 고를 수 있습니다</em></legend><div class="s-pur">' + PURPOSES.map(function (x) { return '<label class="s-cb s-pur-i"><input type="checkbox" name="pur" value="' + x[0] + '"' + (J.p.indexOf(x[0]) >= 0 ? " checked" : "") + '><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>" + x[1] + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<p class="s-refd">' + SI.check + "<span>추천인 <b>" + esc(mask(J.ref)) + "</b>님 확인 완료 · 가입하면 추천인에게 포인트가 적립됩니다</span></p>" +
      '<label class="s-cb"><input type="checkbox" name="agree"><span class="s-box" aria-hidden="true">' + SI.check + "</span><span>[필수] 이용약관과 개인정보 수집·이용에 동의합니다</span></label>" +
      '<p class="s-err" id="s-jerr" role="alert"></p><div class="s-jact"><button type="button" class="btn line-l" data-act="s-jprev">이전</button><button type="submit" class="btn">가입하기</button></div></form>';
  }
  function mask(v) { v = String(v || ""); return v.slice(0, 2) + "***"; }
  function refAsk(top) {
    return '<div class="s-refask' + (top ? " s-refask-top" : "") + '"><p class="s-refask-t"><b>' + (top ? "회원가입에는 추천인 아이디가 꼭 필요합니다" : "추천인 아이디가 없으신가요?") + "</b><span>" + (top ? "추천인 아이디가 없으시면 " : "") + "문의게시판에 ‘추천인 아이디 요청’을 남겨 주시면 검토 후 알려 드립니다.</span></p>" +
      '<a class="btn s-refask-b" href="#/qna/write?cat=' + encodeURIComponent("회원") + "&title=" + encodeURIComponent("추천인 아이디 요청") + '">문의게시판에 추천인 아이디 요청하기 ' + I.arrow + "</a></div>";
  }
  function refBox(biz) {
    var v = J.ref, ok = J.refOk && v.length >= 4;
    return '<div class="s-refw"><label class="s-fl s-ref" for="s-refi"><span>추천인 아이디 <em class="s-req">필수</em></span></label><div class="s-refrow"><input class="inp" id="s-refi" name="ref" value="' + esc(v) + '" autocomplete="off" placeholder="추천해 준 회원의 아이디" aria-describedby="s-refm"><button type="button" class="btn s-refchk" data-act="s-refchk">확인</button></div>' +
      '<p class="s-refm' + (ok ? " ok" : J.refMsg ? " no" : "") + '" id="s-refm" role="status">' + (ok ? SI.check + "<span>확인됐습니다 — " + esc(mask(v)) + "님</span>" : esc(J.refMsg || "가입하면 추천인에게 포인트가 적립됩니다. 포인트는 가입 추천 적립과 관리자 지급으로만 쌓입니다.")) + "</p>" +
      refAsk(false) + "</div>";
  }
  function refCheck(f) {
    var v = (f && f.ref ? f.ref.value : J.ref).trim();
    J.ref = v;
    if (!v) { J.refOk = false; J.refMsg = "추천인 아이디를 넣어 주세요"; }
    else if (v.length < 4) { J.refOk = false; J.refMsg = "찾을 수 없는 아이디입니다. 다시 확인해 주세요"; }
    else { J.refOk = true; J.refMsg = ""; }
    var m = document.getElementById("s-refm");
    if (m) { m.className = "s-refm " + (J.refOk ? "ok" : "no"); m.innerHTML = J.refOk ? SI.check + "<span>확인됐습니다 — " + esc(mask(v)) + "님</span>" : esc(J.refMsg); }
    return J.refOk;
  }
  function drawJoin(anim) {
    var had = user();
    app.innerHTML = '<div class="s-pg s-joinp">' + head("회원가입", "가입 목적을 알려 주시면 자주 찾으실 업체·전문가·자재를 골라 첫 화면에 보여 드립니다.", [["회원가입"]]) +
      '<div class="s-join"><ol class="s-steps">' + ["회원 종류", "정보 입력", "가입 목적"].map(function (t, i) { var n = i + 1; return '<li class="' + (J.step === n ? "on" : J.step > n ? "ok" : "") + '"' + (J.step === n ? ' aria-current="step"' : "") + "><span>" + t + "</span></li>"; }).join("") + "</ol>" +
      (had && J.step === 1 ? '<p class="s-had">이미 가입한 정보가 있습니다. 다시 가입하면 새 정보로 바뀝니다. <a href="#/my">내 정보 보기</a></p>' : "") +
      '<div class="s-jb" id="s-jb">' + joinBody() + "</div></div></div>";
    var f = document.getElementById("s-jf"), ri = document.getElementById("s-refi");
    if (f) f.addEventListener("submit", function (ev) { ev.preventDefault(); J.step === 2 ? step2(f) : step3(f); });
    if (ri) ri.addEventListener("input", function () { J.ref = ri.value.trim(); J.refOk = false; J.refMsg = ""; var m = document.getElementById("s-refm"); if (m) { m.className = "s-refm"; m.textContent = "아이디를 넣고 ‘확인’을 눌러 주세요"; } });
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
    if (!refCheck(f)) { document.getElementById("s-jerr").textContent = J.refMsg; f.ref.focus(); f.ref.scrollIntoView({ block: "center", behavior: BG.reduced() ? "auto" : "smooth" }); return; }
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
      '<p class="s-err" id="s-lerr" role="alert"></p><button type="submit" class="btn s-wide" data-act="s-login">로그인</button><div class="s-lj"><p>아직 회원이 아니신가요? 가입에는 추천인 아이디가 필요합니다.</p><div><a class="btn line-l" href="#/join?kind=biz">업체 입점 (사업자)</a><a class="btn line-l" href="#/join?kind=person">일반회원 (개인)</a></div></div></form></div>';
    document.getElementById("s-lf").addEventListener("submit", function (ev) { ev.preventDefault(); doLogin(r); });
  }
  function doLogin(r) {
    var f = document.getElementById("s-lf"); if (!f) return;
    var u = user(), err = document.getElementById("s-lerr"), id = f.id.value.trim();
    if (!id || !f.pw.value) { err.textContent = "아이디와 비밀번호를 적어 주세요."; return; }
    if (!u) A.keep("user", { kind: "biz", name: D.demoUser.name, company: D.demoUser.company, purposes: ["build", "mat"], referrer: "", points: [{ at: "2026-09-18T10:00:00+09:00", t: "park*** 님이 추천인으로 가입", kind: "ref", amt: 3000 }, { at: "2026-10-02T15:00:00+09:00", t: "입점 감사 포인트", kind: "admin", amt: 5000 }], id: id, phone: "010-2481-3579", field: "build", bizNo: "", at: new Date("2026-09-01T09:00:00+09:00").getTime() });
    S.member = true; S.save(); A.sync && A.sync(); changed();
    location.hash = (r && r.query.back) || "#/my";
  }
  function my() {
    var u = user();
    if (!S.member || !u) {
      app.innerHTML = '<div class="s-pg">' + head("내 정보", "", [["내 정보"]]) + '<div class="s-empty"><p>' + (u ? "로그인하면 내 정보와 포인트를 볼 수 있습니다." : "가입하면 내 정보와 포인트, 견적·상담 요청을 한곳에서 봅니다.") + '</p><div class="s-btns">' + (u ? '<a class="btn" href="#/login">로그인</a>' : '<a class="btn" href="#/join">회원가입</a><a class="btn line-l" href="#/login">로그인</a>') + "</div></div></div>";
      return;
    }
    var pts = Array.isArray(u.points) && u.points.length ? u.points : [{ at: u.at || Date.now(), t: "신규 가입 환영 포인트", kind: "admin", amt: 5000 }], total = pts.reduce(function (s, x) { return s + (+x.amt || 0); }, 0), rq = reqsShown(), qs = quotesShown();
    var names = PURPOSES.filter(function (x) { return (u.purposes || []).indexOf(x[0]) >= 0; }).map(function (x) { return x[1]; });
    var fname = (FIELDS.filter(function (x) { return x[0] === u.field; })[0] || [])[1];
    var phone = String(u.phone || "").replace(/\D/g, ""), ph = phone.length >= 10 ? phone.slice(0, 3) + "-****-" + phone.slice(-4) : u.phone || "";
    app.innerHTML = '<div class="s-pg s-myp">' + head("내 정보", (u.company ? u.company + " " : "") + u.name + "님", [["내 정보"]]) +
      '<div class="s-my"><section class="s-hs"><div class="s-hs-h"><h2>가입 정보</h2></div><table class="s-tbl"><tr><th>회원 종류</th><td>' + (u.kind === "biz" ? "업체 입점 (사업자)" : "일반회원 (개인)") + "</td></tr>" + (u.company ? "<tr><th>회사명</th><td>" + esc(u.company) + "</td></tr>" : "") + "<tr><th>" + (u.kind === "biz" ? "담당자" : "이름") + "</th><td>" + esc(u.name) + "</td></tr>" + (fname ? "<tr><th>업종</th><td>" + esc(fname) + "</td></tr>" : "") + "<tr><th>휴대폰</th><td>" + esc(ph) + "</td></tr><tr><th>아이디</th><td>" + esc(u.id || "") + "</td></tr><tr><th>가입 목적</th><td>" + esc(names.join(", ") || "—") + "</td></tr>" + (u.referrer ? "<tr><th>추천인</th><td>" + esc(u.referrer) + "</td></tr>" : "") + "</table></section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>포인트</h2><p class="s-pt"><b>' + won(total) + "</b>P</p></div>" +
      '<p class="s-pt-n">포인트는 가입 추천 적립과 관리자 지급으로만 쌓입니다. 내 아이디 <b>' + esc(u.id || "") + "</b>를 추천인으로 적고 가입한 회원이 생기면 적립됩니다.</p>" +
      '<table class="s-tbl s-ptt"><thead><tr><th>일자</th><th>내용</th><th>구분</th><th class="n">포인트</th></tr></thead><tbody>' + (pts.length ? pts.slice().sort(function (a, b) { return new Date(b.at) - new Date(a.at); }).map(function (x) { return "<tr><td>" + day(x.at) + "</td><td>" + esc(x.t || "") + "</td><td>" + esc(x.kind === "admin" || /관리자/.test(x.t || "") ? "관리자 지급" : "추천 가입 적립") + '</td><td class="n">' + (x.amt > 0 ? "+" : "") + won(x.amt || 0) + "</td></tr>"; }).join("") : '<tr><td colspan="4" class="s-none">아직 쌓인 포인트가 없습니다.</td></tr>') + "</tbody></table></section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>내 견적서</h2><a class="s-more" href="#/quote">견적서 받기 ' + I.arrow + "</a></div>" + (qs.length ? '<ul class="s-qs">' + qs.map(function (x) { return '<li><a href="#/quote/done?no=' + encodeURIComponent(x.no) + '"><b>' + esc(x.no) + "</b><span>" + day(x.at) + " · " + esc(x.items[0] ? x.items[0].name : "") + (x.items.length > 1 ? " 외 " + (x.items.length - 1) + "품목" : "") + "</span><strong>" + won(x.pay) + "원</strong>" + I.arrow + "</a></li>"; }).join("") + "</ul>" : '<p class="s-hs-e">아직 받은 견적서가 없습니다.</p>') + "</section>" +
      '<section class="s-hs"><div class="s-hs-h"><h2>상담 요청</h2><a class="s-more" href="#/quote">견적서 받기에서 자세히 ' + I.arrow + "</a></div>" + (rq.length ? '<ul class="s-rqs s-rqs-c">' + rq.map(function (x) { return rqItem(x, false); }).join("") + "</ul>" : '<p class="s-hs-e">아직 보낸 상담 요청이 없습니다.</p>') + "</section>" +
      '<div class="s-btns"><button type="button" class="btn line-l" data-act="s-logout">로그아웃</button></div></div></div>';
  }

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
      BG.toast("견적 목록에 담았습니다");
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
    "s-refchk": function () { var f = document.getElementById("s-jf"); refCheck(f); var e = document.getElementById("s-jerr"); if (e) e.textContent = ""; },
    "s-sido": function (b) { A.keep("mall-sido", b.dataset.v || ""); if (MALL && MALL.r && BG.parseHash().name === "mall") { var y = window.scrollY; mall(BG.parseHash()); window.scrollTo(0, y); document.body.classList.toggle("s-barred", S.cart.length > 0); var on = document.querySelector('.s-sd.on'); if (on && on.scrollIntoView && on.parentNode.scrollWidth > on.parentNode.clientWidth) on.parentNode.scrollLeft = on.offsetLeft - on.parentNode.clientWidth / 2 + on.offsetWidth / 2; } },
    "s-pick": function (b) {
      var list = reqs(), x = list.filter(function (r) { return r.id === b.dataset.rq; })[0], c = CO[b.dataset.c]; if (!x || !c) return;
      x.messages = msgsOf(x).slice();
      x.messages.push({ from: "me", t: "추천해 주신 업체 중 " + c.name + ro(c.name) + " 진행하고 싶습니다. 다음 절차를 안내해 주세요.", at: new Date().toISOString(), pick: c.id });
      A.keep("requests", list);
      redraw();
      BG.toast("진행 요청을 보냈습니다. 담당 매니저가 업체에 전하고 연락드립니다.");
    },
    "s-jprev": function () {
      var f = document.getElementById("s-jf");
      if (J.step === 3 && f) J.p = [].map.call(f.querySelectorAll('input[name="pur"]:checked'), function (x) { return x.value; });
      if (J.step === 2 && f) { ["company", "bizNo", "name", "phone", "id"].forEach(function (n) { if (f[n]) J.f[n] = f[n].value.trim(); }); if (f.ref) J.ref = f.ref.value.trim(); }
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
