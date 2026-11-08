(function () {
  var A = window.APP, D = A.D, S = A.S, esc = A.esc, won = A.won, photo = A.photo, I = A.I;

  var SIDO = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  var SKEY = { seoul: "서울", busan: "부산", daegu: "대구", incheon: "인천", gwangju: "광주", daejeon: "대전", ulsan: "울산", sejong: "세종", gyeonggi: "경기", gangwon: "강원", chungbuk: "충북", chungnam: "충남", jeonbuk: "전북", jeonnam: "전남", gyeongbuk: "경북", gyeongnam: "경남", jeju: "제주" };
  var SMALL = { seoul: 1, incheon: 1, daejeon: 1, sejong: 1, gwangju: 1, daegu: 1, ulsan: 1, busan: 1 };
  var CAT = {
    dev: { name: "시행", d: "부동산 개발 · LH 매입약정 시행" },
    build: { name: "시공", d: "종합·전문건설 · 설계·감리" },
    mat: { name: "자재", d: "철근·형강·목재 · 마감재 공급" }
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  var FI = {
    all: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>'),
    dev: svg('<path d="M3 20l4.5-4h13.5l-4.5 4z"/><path d="M11 16V4.5l6.5 2.7L11 9.9"/>'),
    build: svg('<path d="M6 21V4M3 21h7M6 5h14l-3.5 3.5M6 5l4.5 4.5M16.5 8.5V13"/><path d="M15 13h3v2.6h-3z"/>'),
    mat: svg('<path d="M3 8.5 12 4.5l9 4-9 4z"/><path d="m3 12.5 9 4 9-4M3 16.5l9 4 9-4"/>'),
    expert: svg('<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5c.6-4 3.4-6.3 7.2-6.3s6.6 2.3 7.2 6.3"/>'),
    mall: svg('<path d="M5 8.5h14L18 21H6z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>'),
    pm: svg('<rect x="5" y="4.5" width="14" height="16.5" rx="1.5"/><path d="M9 4.5V3h6v1.5M8.8 12.3l2.2 2.2 4.3-4.4M9 17.5h6"/>'),
    finance: svg('<circle cx="12" cy="12" r="8.5"/><path d="m7.8 8.8 1.8 6.4L12 10l2.4 5.2 1.8-6.4M7.3 12h9.4"/>'),
    shield: svg('<path d="M12 3.2 19 6v5.8c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V6z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/>'),
    chat: svg('<path d="M4 5.5h16v10.5H10l-6 4.5z"/><path d="M8.5 10.8h7"/>'),
    person: svg('<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c.8-3.8 3.6-6 7.5-6s6.7 2.2 7.5 6"/>'),
    phone: svg('<path d="M6 3.5h3.2l1.6 4.4-2.1 1.3a10.6 10.6 0 0 0 6.1 6.1l1.3-2.1 4.4 1.6v3.2c0 .9-.7 1.6-1.6 1.6A16 16 0 0 1 4.4 5.1c0-.9.7-1.6 1.6-1.6z"/>'),
    back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>')
  };

  BG.TYPE.dv = { id: "dv", name: "부동산 개발" };
  BG.WORK.devp = { id: "devp", name: "부동산 개발·시행" };
  BG.WORK.lh = { id: "lh", name: "LH 매입약정" };

  function P(t, y, ph, d) { return { t: t, y: y, ph: ph, d: d || "" }; }
  var MORE = [
    { id: "c17", name: "부경종합건설", type: "gc", region: "영남", sido: "부산", city: "해운대구", since: 2006, count: 74, licenses: ["건축공사업"], works: ["rc", "civil"], intro: "부산·경남 공동주택과 근린생활시설 신축을 맡습니다.", projects: [P("해운대구 공동주택 신축 (지상 15층)", 2025, "n_aptv"), P("김해시 근린생활시설 신축", 2024, "frame_work"), P("양산시 오피스텔 골조 공사", 2023, "n_slab")], checks: ["면허", "사업자", "보험"] },
    { id: "c18", name: "새길골조산업", type: "sc", region: "영남", sido: "대구", city: "달서구", since: 2011, count: 96, licenses: ["철근·콘크리트공사업"], works: ["rc"], intro: "공동주택·오피스텔 골조를 직영 인력으로 시공합니다.", projects: [P("달서구 공동주택 골조 공사", 2025, "n_rebarman"), P("경산시 근린생활시설 골조", 2024, "n_slab2"), P("수성구 오피스텔 골조", 2023, "concrete1")], checks: ["면허", "사업자", "보험"] },
    { id: "c19", name: "태화설비", type: "sc", region: "영남", sido: "울산", city: "남구", since: 2008, count: 83, licenses: ["기계설비·가스공사업"], works: ["mech"], intro: "공장·업무시설 냉난방과 급배수 설비를 시공합니다.", projects: [P("남구 업무시설 기계설비", 2025, "pf_pipework"), P("양산시 공장 급배수 설비", 2024, "mt_pipes"), P("중구 상가 냉난방 교체", 2023, "mt_tube")], checks: ["면허", "사업자"] },
    { id: "c20", name: "가온건축사사무소", type: "de", region: "충청", sido: "세종", city: "나성동", since: 2013, count: 61, licenses: ["건축사사무소 개설"], works: ["design"], intro: "다세대·근린생활시설 설계와 인허가, 공사 감리를 합니다.", projects: [P("세종시 공동주택 설계", 2025, "w_blueprint"), P("공주시 근린생활시설 인허가", 2024, "n_plan"), P("세종시 상가 감리", 2023, "w_review")], checks: ["면허", "사업자", "보험"] },
    { id: "c21", name: "무심천창호유리", type: "sc", region: "충청", sido: "충북", city: "청주시", since: 2009, count: 112, licenses: ["금속창호·지붕건축물조립공사업"], works: ["window"], intro: "시스템창호와 유리 공사를 실측부터 설치까지 합니다.", projects: [P("청주시 공동주택 시스템창호", 2025, "n_glassbox"), P("충주시 업무시설 커튼월", 2024, "hero_glass"), P("청주시 상가 유리 교체", 2023, "pf_glass")], checks: ["면허", "사업자", "보험"] },
    { id: "c22", name: "빛고을건자재", type: "su", region: "호남", sido: "광주", city: "광산구", since: 2004, count: 640, licenses: ["건설자재 도소매"], works: ["rc", "stone"], intro: "시멘트·벽돌·철근을 호남권 현장으로 바로 보냅니다.", projects: [P("시멘트·미장재 현장 직송", 2025, "mt_cement"), P("벽돌·블록 재고", 2025, "mt_brick"), P("광산구 물류창고", 2025, "mt_warehouse")], checks: ["사업자"] },
    { id: "c23", name: "익산석재산업", type: "sc", region: "호남", sido: "전북", city: "익산시", since: 2002, count: 131, licenses: ["도장·습식·방수·석공사업"], works: ["stone"], intro: "화강석 외장과 로비 석공사, 바닥 타일을 시공합니다.", projects: [P("전주시 공동주택 외장 석재", 2025, "mt_marble"), P("군산시 업무시설 로비 석공사", 2024, "mt_tile"), P("익산시 상가 바닥 타일", 2023, "pf_white")], checks: ["면허", "사업자"] },
    { id: "c24", name: "남도토건", type: "gc", region: "호남", sido: "전남", city: "순천시", since: 1998, count: 167, licenses: ["토목건축공사업"], works: ["civil", "rc"], intro: "전남 동부권 공동주택 신축과 도로·택지 토목을 합니다.", projects: [P("순천시 공동주택 신축", 2025, "hero_dusk"), P("여수시 근린생활시설 신축", 2024, "n_crane"), P("광양시 도로 토목 공사", 2023, "site_aerial2")], checks: ["면허", "사업자", "보험"] },
    { id: "c25", name: "동해형강유통", type: "su", region: "영남", sido: "경북", city: "포항시", since: 2003, count: 920, licenses: ["건설자재 도소매"], works: ["steel"], intro: "H형강·각관·철근을 규격대로 절단해 납품합니다.", projects: [P("H형강·각관 재고", 2025, "mt_hbeam"), P("철근 현장 직송", 2025, "mt_rebar"), P("포항 자재 야적장", 2025, "n_hall")], checks: ["사업자"] },
    { id: "c26", name: "가야전기", type: "sc", region: "영남", sido: "경남", city: "김해시", since: 2010, count: 104, licenses: ["전기공사업"], works: ["elec"], intro: "수변전·조명·동력 설비를 한 팀이 시공합니다.", projects: [P("김해시 지식산업센터 전기 공사", 2025, "pf_mep"), P("창원시 공장 수변전 설비", 2024, "steel_hall"), P("양산시 업무시설 통신 배선", 2023, "w_measure")], checks: ["면허", "사업자", "보험"] },
    { id: "c27", name: "탐라종합건설", type: "gc", region: "제주", sido: "제주", city: "제주시", since: 2007, count: 58, licenses: ["건축공사업"], works: ["rc", "interior"], intro: "제주 지역 단독주택 단지와 근린생활시설을 짓습니다.", projects: [P("제주시 단독주택 단지 신축", 2025, "pf_house"), P("서귀포시 근린생활시설 신축", 2024, "pf_white"), P("제주시 숙박시설 리모델링", 2023, "pf_interior")], checks: ["면허", "사업자", "보험"] },
    { id: "c28", name: "서해철강유통", type: "su", region: "충청", sido: "충남", city: "당진시", since: 2006, count: 780, licenses: ["건설자재 도소매"], works: ["steel", "rc"], intro: "철근·형강·강관을 충청권 현장에 당일 배차합니다.", projects: [P("철근·형강 현장 직송", 2025, "n_steel"), P("강관 규격 재고", 2025, "mt_pipe"), P("당진 자재 야적장", 2025, "mt_warehouse")], checks: ["사업자"] },
    { id: "c29", name: "새봄도시개발", type: "dv", cat: "dev", region: "서울", sido: "서울", city: "강서구", since: 2015, count: 23, licenses: ["부동산개발업 등록"], works: ["devp", "lh"], intro: "LH 매입약정 공동주택을 부지 검토부터 약정 체결, 준공 후 매입까지 시행합니다.", lh: "LH 매입약정 체결 6건 · 그중 4건 준공 후 매입 완료", projects: [P("화성시 매입약정 다세대 신축 시행 (48세대)", 2025, "n_aerial", "약정 체결 2023 · 준공 후 매입 2025"), P("미추홀구 매입약정 도시형 생활주택 시행", 2024, "hero_kr", "약정 체결 2022 · 준공 후 매입 2024"), P("수원시 매입약정 오피스텔 시행", 2023, "n_wide", "약정 체결 2021 · 준공 후 매입 2023")], checks: ["면허", "사업자", "보험"] },
    { id: "c30", name: "가람디앤씨", type: "dv", cat: "dev", region: "경기", sido: "경기", city: "고양시", since: 2012, count: 31, licenses: ["부동산개발업 등록"], works: ["devp", "lh"], intro: "토지주와 함께 사업성 검토부터 LH 매입약정 신청, 준공까지 진행합니다.", lh: "LH 매입약정 체결 8건 · 토지주 공동 사업 5건", projects: [P("고양시 매입약정 다세대 시행 (36세대)", 2025, "n_dusk", "토지주 공동 사업 · 준공 2025"), P("파주시 토지주 공동 사업 시행", 2024, "site_aerial", "약정 체결 2023 · 공사 중"), P("김포시 매입약정 도시형 생활주택 시행", 2023, "n_crane", "약정 체결 2021 · 준공 후 매입 2023")], checks: ["면허", "사업자", "보험"] },
    { id: "c31", name: "다온주택개발", type: "dv", cat: "dev", region: "충청", sido: "대전", city: "유성구", since: 2018, count: 14, licenses: ["부동산개발업 등록"], works: ["devp", "lh"], intro: "충청권 LH 매입약정 다세대·도시형 생활주택을 시행합니다.", lh: "LH 매입약정 체결 3건 · 조건부 통과 2건 진행 중", projects: [P("유성구 매입약정 다세대 시행 (32세대)", 2025, "n_night", "약정 체결 2024 · 준공 2025"), P("세종시 도시형 생활주택 시행", 2024, "hero_rise", "준공 2024"), P("청주시 토지 사업성 검토", 2023, "n_plan", "사업성 검토 · 매입약정 신청 준비")], checks: ["면허", "사업자"] },
    { id: "c32", name: "늘품프로퍼티", type: "dv", cat: "dev", region: "영남", sido: "부산", city: "수영구", since: 2016, count: 19, licenses: ["부동산개발업 등록"], works: ["devp", "lh"], intro: "부산·경남에서 매입약정 공동주택 시행과 분양을 맡습니다.", lh: "LH 매입약정 체결 4건 · 그중 2건 준공 후 매입 완료", projects: [P("수영구 매입약정 오피스텔 시행 (54실)", 2025, "hero_night", "약정 체결 2023 · 준공 후 매입 2025"), P("김해시 매입약정 다세대 시행", 2024, "n_crew", "약정 체결 2023 · 공사 중"), P("양산시 토지주 공동 시행", 2023, "hero_cranes", "토지주 공동 사업 · 준공 2023")], checks: ["면허", "사업자", "보험"] }
  ];
  var MOREX = [
    { id: "x14", name: "배수현", title: "건축사", years: 16, region: "영남", sido: "부산", works: ["design"], affil: "개인", intro: "부산·경남 공동주택과 매입약정 다세대 설계를 맡습니다.", projects: ["수영구 오피스텔 설계", "김해시 다세대 인허가", "양산시 근린생활시설 감리"] },
    { id: "x15", name: "구민혁", title: "건축시공기술사", years: 21, region: "영남", sido: "대구", works: ["rc", "civil"], affil: "개인", intro: "공동주택 골조 공정과 품질 관리를 맡아 왔습니다.", projects: ["달서구 공동주택 공정 관리", "경산시 오피스텔 시공 계획", "구미시 공장동 품질 점검"] },
    { id: "x16", name: "임채원", title: "토질및기초기술사", years: 19, region: "영남", sido: "경남", works: ["civil"], affil: "개인", intro: "지반 조사 검토와 기초·흙막이 설계를 합니다.", projects: ["창원시 공동주택 흙막이 검토", "김해시 물류센터 기초 설계", "진주시 업무시설 지반 조사"] },
    { id: "x17", name: "노은서", title: "건축사", years: 14, region: "호남", sido: "광주", works: ["design"], affil: "개인", intro: "근린생활시설·다세대 설계와 인허가를 맡습니다.", projects: ["북구 다세대 설계", "나주시 근린생활시설 인허가", "서구 상가 감리"] },
    { id: "x18", name: "진하늘", title: "건설안전기술사", years: 17, region: "충청", sido: "대전", works: ["rc"], affil: "개인", intro: "현장 안전관리계획과 위험성 평가를 맡습니다.", projects: ["유성구 공동주택 안전관리계획", "세종시 업무시설 위험성 평가", "청주시 공장 안전 점검"] },
    { id: "x19", name: "양태준", title: "건축사 · PM", years: 22, region: "호남", sido: "전북", works: ["design"], affil: "개인", intro: "설계부터 공정·비용 관리까지 사업 전체를 관리합니다.", projects: ["전주시 공동주택 PM", "군산시 근린생활시설 설계", "익산시 매입약정 다세대 인허가"] },
    { id: "x20", name: "류지안", title: "전기기사", years: 13, region: "충청", sido: "충북", works: ["elec"], affil: "개인", intro: "수변전·조명 설비 시공 관리를 맡습니다.", projects: ["청주시 지식산업센터 전기", "충주시 공장 수변전", "진천군 업무시설 조명"] },
    { id: "x21", name: "고은비", title: "실내건축기사", years: 11, region: "제주", sido: "제주", works: ["interior"], affil: "탐라종합건설", intro: "숙박·근린생활시설 실내 공사를 관리합니다.", projects: ["제주시 숙박시설 실내 공사", "서귀포시 근린생활시설 실내 마감", "제주시 사무실 리모델링"] },
    { id: "x22", name: "하준서", title: "건축기계설비기술사", years: 18, region: "영남", sido: "울산", works: ["mech"], affil: "태화설비", intro: "공장·업무시설 설비 설계 검토와 시운전 감리를 합니다.", projects: ["남구 업무시설 설비 감리", "양산시 공장 급배수 검토", "북구 병원 냉난방 진단"] },
    { id: "x23", name: "엄태윤", title: "토목기사", years: 15, region: "호남", sido: "전남", works: ["civil"], affil: "남도토건", intro: "택지 조성과 도로 토목 공사 관리를 합니다.", projects: ["순천시 택지 조성", "여수시 도로 확장", "광양시 하천 정비"] },
    { id: "x24", name: "추상민", title: "건축구조기술사", years: 20, region: "영남", sido: "경북", works: ["design", "steel"], affil: "개인", intro: "철골·철근콘크리트 구조 설계와 내진 검토를 합니다.", projects: ["포항시 공동주택 내진 검토", "구미시 공장 철골 구조 설계", "경주시 업무시설 구조 보강"] },
    { id: "x25", name: "봉지훈", title: "도시계획기술사", years: 17, region: "충청", sido: "세종", works: ["design"], affil: "개인", intro: "지구단위계획 검토와 개발 사업 인허가 협의를 돕습니다.", projects: ["세종시 공동주택 지구단위계획 검토", "공주시 개발행위 허가", "유성구 사업 인허가 협의"] }
  ];
  var DAYS = ["2026.10.14", "2026.09.22", "2026.10.02", "2026.08.27", "2026.10.21", "2026.09.08", "2026.10.07", "2026.09.15"];
  var CITY = { "천안시": "충남" };
  var WPH = { design: ["w_model", "w_blueprint", "n_plan", "w_review", "w_draft", "n_draft"], rc: ["n_slab", "n_rebarman", "concrete2", "n_slab2", "w_rebar"], civil: ["site_aerial", "site_aerial2", "pf_site", "n_aerial"], steel: ["n_truss", "steel_hall", "mt_hbeam", "crane_top"], mech: ["pf_pipework", "mt_pipes", "mt_tube"], elec: ["pf_mep", "w_measure", "n_hall"], interior: ["pf_drywall", "pf_interior", "pf_bath", "pf_wood"], water: ["pf_water", "concrete1", "pf_glass"], window: ["hero_glass", "n_glassbox", "facade"], stone: ["mt_marble", "mt_tile", "mt_brick"], land: ["pf_garden", "pf_house", "pf_villa"] };

  if (!D.__find) {
    D.__find = true;
    MORE.forEach(function (c) { D.companies.push(c); BG.CO[c.id] = c; });
    MOREX.forEach(function (x) { D.experts.push(x); BG.EX[x.id] = x; });
    D.companies.forEach(function (c, i) {
      c.cat = c.cat || (c.type === "su" ? "mat" : c.type === "dv" ? "dev" : "build");
      c.sido = c.sido || CITY[c.city] || c.region;
      c.tags = c.type === "de" ? ["설계"] : [];
      c.at = DAYS[i % DAYS.length];
      c.projects.forEach(function (p) { if (!p.d) p.d = c.cat === "mat" ? "납품 · " + A.workNames(c.works).join("·") : "공사 범위 · " + A.workNames(c.works).join("·"); });
    });
    D.experts.forEach(function (x, i) {
      x.sido = x.sido || x.region;
      x.at = DAYS[(i + 3) % DAYS.length];
      x.phs = x.projects.map(function (p, k) { var w = WPH[x.works[k % x.works.length]] || WPH.design; return w[(i + k) % w.length]; });
    });
    D.sido = SIDO;
  }

  FI.play = svg('<path d="M8 5.5v13l10.5-6.5z"/>');
  FI.pause = svg('<path d="M8.5 5.5v13M15.5 5.5v13"/>');
  FI.doc = svg('<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M13.5 3.5V8h4.5M9.5 12.5h5M9.5 16h5"/>');

  var CUR = null, rgOpen = false, keepY = null, chat = null;

  var WDESC = { design: "설계 도면, 인허가 서류, 공사 감리", civil: "토공·흙막이·기초, 도로·택지 토목", rc: "철근 배근, 거푸집, 콘크리트 타설", steel: "철골 제작·설치, 데크플레이트", water: "옥상·지하 방수, 외벽 도장", window: "시스템창호, 커튼월, 유리 교체", mech: "냉난방·급배수·환기 설비", elec: "수변전, 조명·동력, 통신 배선", interior: "경량벽·천장·바닥 실내 마감", stone: "외장 석재, 로비 석공사, 타일", land: "조경 식재, 외부 포장", devp: "부지 검토, 사업성 분석, 시행", lh: "매입약정 신청, LH 협의, 준공 후 매입" };
  var RV = {
    build: [["ki***", "시행사 담당 · 경기 화성시", "2026.09", 5, "공정표를 주 단위로 보내 줘서 일정 확인이 편했습니다. 골조가 끝날 때 하자 점검 목록도 같이 받았습니다."], ["pa***", "토지주 · 인천 미추홀구", "2026.08", 5, "견적서 항목이 공종별로 나뉘어 있어 다른 견적과 비교하기 쉬웠습니다. 추가 공사비는 착공 전에 미리 협의했습니다."], ["yo***", "현장소장 · 충남 천안시", "2026.06", 4, "현장 방문 상담 때 도면을 보고 공사 범위를 바로 정리해 줬습니다. 준공까지 담당자가 바뀌지 않았습니다."]],
    dev: [["le***", "토지주 · 경기 용인시", "2026.09", 5, "사업성 검토 보고서를 받아 보고 매입약정 신청 여부를 정할 수 있었습니다. 숫자 근거를 하나씩 설명해 줬습니다."], ["ch***", "토지주 · 부산 수영구", "2026.07", 5, "LH 협의 일정과 서류 목록을 단계별로 정리해 줘서 처음 하는 사업인데도 진행이 수월했습니다."], ["so***", "시행 담당 · 대전 유성구", "2026.05", 4, "조건부 통과 뒤 보완 서류를 같이 준비해 주셨습니다. 회신이 늦은 날은 전화로 먼저 알려 줬습니다."]],
    mat: [["ha***", "현장소장 · 경기 평택시", "2026.10", 5, "규격별 단가표를 미리 받아 발주가 빨랐습니다. 시험성적서도 납품 때 함께 왔습니다."], ["jo***", "공무 담당 · 충북 청주시", "2026.08", 5, "현장 하차 시간을 맞춰 줘서 타설 일정에 차질이 없었습니다."], ["ka***", "구매 담당 · 서울 강서구", "2026.06", 4, "세금계산서 발행이 정확했고, 규격이 다르게 온 한 묶음은 다음 날 바로 바꿔 줬습니다."]],
    ex: [["mi***", "시행사 담당 · 경기 고양시", "2026.09", 5, "검토 의견서를 약속한 날짜에 받아 인허가 보완에 바로 썼습니다."], ["se***", "현장소장 · 대전 서구", "2026.07", 5, "현장 점검 때 지적 사항을 사진과 함께 정리해 줘서 공사팀에 전달하기 좋았습니다."], ["ju***", "토지주 · 전북 전주시", "2026.05", 4, "설계 변경 범위와 비용 영향을 미리 설명해 줘서 결정이 빨랐습니다."]]
  };
  var QA = {
    build: [["견적은 어떤 기준으로 나오나요?", "도면과 현장 조건을 받은 뒤 공종별 물량으로 산출합니다. 현장 방문 상담을 거쳐 확정 견적을 드립니다."], ["LH 매입약정 공사도 맡나요?", "매입약정 기준에 맞춘 품질 서류와 준공 서류를 함께 준비합니다. 진행 중인 단계를 상담 때 알려 주세요."], ["하자 보수는 어떻게 하나요?", "하자보수 기간 동안 접수되면 현장을 확인하고 보수합니다. 하자보수 보증서는 계약 때 드립니다."]],
    dev: [["토지만 있어도 상담할 수 있나요?", "네. 지번과 면적을 알려 주시면 매입약정 가능 여부와 사업성을 먼저 검토합니다."], ["신청부터 준공까지 얼마나 걸리나요?", "규모와 인허가에 따라 다릅니다. 상담 때 단계별 예상 일정을 표로 정리해 드립니다."], ["사업비는 어떻게 마련하나요?", "자기자본과 PF 구성을 함께 검토하고, 필요하면 도아 금융 상담으로 연결합니다."]],
    mat: [["최소 주문 수량이 있나요?", "품목마다 다릅니다. 규격과 수량을 남기시면 단가표와 함께 알려 드립니다."], ["현장 직송이 되나요?", "현장 주소와 하차 조건(장비·시간)을 확인한 뒤 일정에 맞춰 보냅니다."], ["시험성적서를 받을 수 있나요?", "KS 인증 품목은 납품 때 시험성적서를 함께 드립니다."]],
    ex: [["현장 방문 상담이 되나요?", "활동 지역 안에서는 현장 방문이 됩니다. 일정은 도아 담당 매니저가 맞춰 드립니다."], ["결과는 어떤 형태로 받나요?", "검토 의견서나 점검 보고서로 정리해 드립니다."], ["비용은 어떻게 정하나요?", "업무 범위와 기간을 확인한 뒤 견적을 드립니다. 견적서 받기에서 다른 견적과 함께 비교할 수 있습니다."]]
  };

  function words(s) { return String(s || "").trim().split(/\s+/).filter(Boolean); }
  function hit(hay, kw) { var ws = words(kw); return ws.every(function (w) { return hay.indexOf(w) >= 0; }); }
  function coHay(c) { return c.name + " " + c.intro + " " + c.city + " " + c.sido + " " + c.licenses.join(" ") + " " + A.workNames(c.works).join(" ") + " " + CAT[c.cat].name + " " + A.typeName(c.type) + " " + c.tags.join(" ") + " " + c.projects.map(function (p) { return p.t; }).join(" "); }
  function exHay(x) { return x.name + " " + x.title + " " + x.intro + " " + x.affil + " " + x.sido + " " + A.workNames(x.works).join(" ") + " " + x.projects.join(" "); }
  function mtHay(m) { return m.name + " " + m.spec + " " + (BG.MC[m.cat] ? BG.MC[m.cat].name : "") + " " + (BG.CO[m.seller] ? BG.CO[m.seller].name : ""); }
  function coFind(o) {
    return D.companies.filter(function (c) {
      if (o.cat && c.cat !== o.cat) return false;
      if (o.type && c.type !== o.type) return false;
      if (o.work && c.works.indexOf(o.work) < 0) return false;
      if (o.region && !o.sido && c.region !== o.region) return false;
      if (o.sido && c.sido !== o.sido) return false;
      if (o.q && !hit(coHay(c), o.q)) return false;
      return true;
    });
  }
  function exFind(o) {
    return D.experts.filter(function (x) {
      if (o.work && x.works.indexOf(o.work) < 0) return false;
      if (o.region && !o.sido && x.region !== o.region) return false;
      if (o.sido && x.sido !== o.sido) return false;
      if (o.q && !hit(exHay(x), o.q)) return false;
      return true;
    });
  }
  function mtFind(q) { return D.materials.filter(function (m) { return !q || hit(mtHay(m), q); }); }
  function coSort(list, s) {
    return list.sort(function (a, b) { return s === "count" ? b.count - a.count : s === "since" ? a.since - b.since : (b.checks.length - a.checks.length) || (b.count - a.count); });
  }
  function tally(cos, exs) {
    var t = {};
    SIDO.forEach(function (n) { t[n] = { co: 0, ex: 0 }; });
    cos.forEach(function (c) { if (t[c.sido]) t[c.sido].co++; });
    exs.forEach(function (x) { if (t[x.sido]) t[x.sido].ex++; });
    return t;
  }
  function month(d) { return d.slice(0, 7); }
  function hsh(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 10007; return h; }
  function stat(o) {
    var h = hsh(o.id), n = 5 + h % 22;
    return { hires: n, rv: Math.max(3, Math.round(n * 0.6)), sc: (4.6 + (h % 4) / 10).toFixed(1), yrs: o.years || 2026 - o.since };
  }
  function licName(c) { return c.cat === "dev" ? "부동산개발업 등록" : c.type === "de" ? "건축사사무소 등록" : "건설업 면허"; }
  function okList(c) {
    var out = [];
    if (c.checks.indexOf("사업자") >= 0) out.push("사업자등록");
    if (c.checks.indexOf("면허") >= 0) out.push(licName(c));
    if (c.checks.indexOf("보험") >= 0) out.push("보험");
    return out;
  }
  function okLine(c) {
    var miss = c.cat !== "mat" && c.checks.indexOf("보험") < 0;
    return '<p class="f-ok">' + FI.shield + "<span>" + esc(okList(c).join(" · ")) + " 확인 <em>· " + month(c.at).replace("-", ".") + " 도아 확인</em>" + (miss ? '<em class="f-ok-m">보험 서류는 확인 중</em>' : "") + "</span></p>";
  }
  function exOk(x) {
    var a = [/건축사/.test(x.title) ? "건축사 자격" : /기술사/.test(x.title) ? "기술사 자격" : /기능장/.test(x.title) ? "기능장 자격" : "국가기술자격", "경력증명서"];
    if (x.affil !== "개인") a.push("재직");
    return a;
  }
  function exOkLine(x) { return '<p class="f-ok">' + FI.shield + "<span>" + esc(exOk(x).join(" · ")) + " 확인 <em>· " + month(x.at).replace("-", ".") + " 도아 확인</em></span></p>"; }
  function kindLine(c) { return CAT[c.cat].name + " · " + A.typeName(c.type); }
  function stRow(o, isEx, big) {
    var s = stat(o), cells = [["리뷰", s.sc + "<small> / 5 · " + s.rv + "건</small>"], [isEx ? "경력" : "업력", s.yrs + "년"]];
    cells.push(isEx ? ["대표 실적", o.projects.length + "건"] : [o.cat === "mat" ? "납품" : "실적", won(o.count) + "건"]);
    cells.push(["도아 연결", s.hires + "회"]);
    return '<dl class="f-st' + (big ? " f-stb" : "") + '">' + cells.map(function (c) { return "<div><dt>" + c[0] + "</dt><dd>" + c[1] + "</dd></div>"; }).join("") + "</dl>";
  }
  function phSwap(href, label, a, b) {
    return '<a class="f-ph" href="' + href + '" aria-label="' + esc(label) + '"><img loading="lazy" src="' + photo(a.ph) + '" alt="' + esc(a.t) + '"><img class="f-ph2" loading="lazy" src="' + photo(b.ph) + '" alt=""></a>' +
      '<p class="f-cap"><span class="f-cap1">' + esc(a.t) + (a.y ? " · " + a.y : "") + '</span><span class="f-cap2">' + esc(b.t) + (b.y ? " · " + b.y : "") + "</span></p>";
  }
  function coRow(c) {
    var p = c.projects;
    return '<article class="f-row"><div class="f-phw">' + phSwap("#/company/" + c.id, c.name + " 대표 실적 사진", p[0], p[1] || p[0]) + "</div>" +
      '<div class="f-in"><p class="f-kind">' + esc(kindLine(c) + " · " + c.sido + " " + c.city) + '</p><h3><a href="#/company/' + c.id + '">' + esc(c.name) + '</a><span class="f-doc">서류 확인 완료</span></h3><p class="f-intro">' + esc(c.intro) + "</p>" +
      stRow(c) + (c.lh ? '<p class="f-lh">' + esc(c.lh) + "</p>" : "") + okLine(c) + "</div>" +
      '<div class="f-act"><a class="f-btn" href="#/match?to=' + c.id + '">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line" href="#/company/' + c.id + '">프로필 보기</a></div></article>';
  }
  function exRow(x) {
    var ps = x.projects.map(function (t, k) { return { t: t, ph: x.phs[k], y: 2025 - k }; });
    return '<article class="f-row ex"><div class="f-phw">' + phSwap("#/expert/" + x.id, x.name + " 대표 실적 사진", ps[0], ps[1] || ps[0]) + "</div>" +
      '<div class="f-in"><p class="f-kind">' + esc("전문가 · " + A.workNames(x.works).join("·") + " · " + x.sido) + '</p><h3><a href="#/expert/' + x.id + '">' + esc(x.name) + "</a> <small>" + esc(x.title) + '</small><span class="f-doc">서류 확인 완료</span></h3><p class="f-intro">' + esc(x.intro) + "</p>" +
      stRow(x, true) + exOkLine(x) + "</div>" +
      '<div class="f-act"><a class="f-btn" href="#/match?to=' + x.id + '">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line" href="#/expert/' + x.id + '">프로필 보기</a></div></article>';
  }
  function mtCard(m) {
    var co = BG.CO[m.seller];
    return '<a class="f-mt" href="#/item/' + m.id + '"><span class="f-mt-i"><img loading="lazy" src="' + photo(m.ph) + '" alt="' + esc(m.name) + '"></span><span class="f-mt-b"><span class="f-mt-s">' + esc(co ? co.name : "BUILDGO") + "</span><b>" + esc(m.name) + '</b><span class="f-mt-p">' + esc(m.spec) + '</span><span class="f-mt-w"><strong>' + won(S.priceOf(m)) + "원</strong> / " + esc(m.unit) + (S.member ? " · 회원가" : "") + "</span></span></a>";
  }

  function mapSvg(t, cur) {
    var M = window.FMAP;
    if (!M) return '<p class="f-map-w">지도를 불러오고 있습니다.</p>';
    var mx = 1;
    SIDO.forEach(function (n) { mx = Math.max(mx, t[n].co + t[n].ex); });
    var ps = M.p.map(function (p) {
      var n = SKEY[p.id], c = t[n].co + t[n].ex, lv = c ? Math.max(1, Math.ceil(c / mx * 4)) : 0;
      return '<path d="' + p.d + '" class="lv' + lv + (cur === n ? " on" : "") + '" data-sd="' + n + '"/>';
    }).join("");
    var lb = M.p.map(function (p) { var n = SKEY[p.id]; return '<text x="' + p.x + '" y="' + p.y + '" class="' + (SMALL[p.id] ? "s" : "") + (cur === n ? " on" : "") + '">' + n + "</text>"; }).join("");
    return '<svg class="f-svg" viewBox="0 0 ' + M.w + " " + M.h + '" role="img" aria-label="대한민국 시·도 지도">' + ps + '<g class="f-lb" aria-hidden="true">' + lb + "</g></svg>";
  }
  function rgPanel(t, cur) {
    var all = 0;
    SIDO.forEach(function (n) { all += t[n].co + t[n].ex; });
    var items = '<button type="button" class="f-sd' + (cur ? "" : " on") + '" data-act="f-sd" data-v=""><span>전국</span><b>' + all + "</b></button>" + SIDO.map(function (n) {
      var c = t[n].co + t[n].ex;
      return '<button type="button" class="f-sd' + (cur === n ? " on" : "") + (c ? "" : " zero") + '" data-act="f-sd" data-v="' + n + '"><span>' + n + "</span><b>" + c + "</b></button>";
    }).join("");
    return '<div class="f-rg' + (rgOpen && wide() ? " open" : "") + '" id="fRg"><div class="f-rg-bg" data-act="f-rg-x"></div><div class="f-rg-in" role="dialog" aria-labelledby="fRgT">' +
      '<div class="f-rg-h"><div><h2 id="fRgT">지역 설정</h2><p>현장이 있는 시·도를 지도에서 누르세요. 숫자는 그 지역에서 확인을 마친 업체와 전문가 수입니다.</p></div><button type="button" class="f-rg-x" data-act="f-rg-x" aria-label="지역 설정 닫기">' + I.close + "</button></div>" +
      '<div class="f-rg-b"><div class="f-map" id="fMap">' + mapSvg(t, cur) + '<div class="f-tip" id="fTip" hidden></div></div><div class="f-sdw"><p class="f-sdt">시·도 목록</p><div class="f-sdl">' + items + "</div></div></div>" +
      '<p class="f-src">지도 경계: 통계청(southkorea-maps)</p></div></div>';
  }
  function filt(t, cur, unit) {
    var all = 0;
    SIDO.forEach(function (n) { all += t[n].co + t[n].ex; });
    return '<aside class="f-filt" aria-label="지역 설정"><div class="f-filt-in"><div class="f-filt-h"><b>지역 설정</b><span>' + (cur || "전국") + '</span></div>' +
      '<div class="f-map f-map2">' + mapSvg(t, cur) + '<div class="f-tip" hidden></div></div><div class="f-filt-l"><button type="button" class="f-sd' + (cur ? "" : " on") + '" data-act="f-sd" data-v=""><span>전국</span><b>' + all + "</b></button>" +
      SIDO.map(function (n) { var c = t[n].co + t[n].ex; return '<button type="button" class="f-sd' + (cur === n ? " on" : "") + (c ? "" : " zero") + '" data-act="f-sd" data-v="' + n + '"><span>' + n + "</span><b>" + c + "</b></button>"; }).join("") +
      '</div><p class="f-filt-n">지도나 목록에서 현장 시·도를 누르세요. 숫자는 도아 확인을 마친 ' + unit + " 수입니다.</p></div></aside>";
  }
  function rgBtn(cur) {
    return '<button type="button" class="f-rgb" data-act="f-rg" aria-expanded="' + (rgOpen && wide() ? "true" : "false") + '" aria-controls="fRg">' + I.pin + "<span>지역</span><b>" + (cur || "전국") + "</b>" + I.down + "</button>" +
      (cur ? '<button type="button" class="f-chip" data-act="f-sd" data-v="" aria-label="' + cur + ' 지역 선택 풀기"><span>' + cur + "</span>" + I.close + "</button>" : "");
  }
  function sbar(kind, q, ph, hidden) {
    var hs = "";
    for (var k in hidden) if (hidden[k]) hs += '<input type="hidden" name="' + k + '" value="' + esc(hidden[k]) + '">';
    return '<form class="f-sbar" data-f="' + kind + '" role="search"><label><span class="f-sr">검색어</span><input name="q" type="search" value="' + esc(q || "") + '" placeholder="' + esc(ph) + '" autocomplete="off"></label>' + hs + '<button type="submit" aria-label="찾기">' + I.search + "</button></form>";
  }
  function link(name, q) { return "#/" + name + BG.qs(q); }
  function crumb(list) { return '<p class="f-crumb">' + list.map(function (x, i) { return x[1] ? '<a href="' + x[1] + '">' + esc(x[0]) + "</a>" : "<span>" + esc(x[0]) + "</span>"; }).join('<i aria-hidden="true">/</i>') + "</p>"; }
  function head(cr, title, sub, bar) {
    return '<section class="f-hd"><div class="f-hd-in">' + crumb(cr) + '<h1 class="f-h1">' + title + "</h1>" + (sub ? '<p class="f-sub">' + sub + "</p>" : "") + bar + "</div></section>";
  }

  var PG = {};
  function paged(k, items, fn, unit, cls) {
    var n = cls ? (wide() ? 8 : 6) : (wide() ? 8 : 5);
    PG[k] = { items: items, fn: fn, shown: Math.min(n, items.length), n: n, unit: unit };
    return '<div class="' + (cls || "f-pgl") + '" id="fPg-' + k + '">' + items.slice(0, n).map(fn).join("") + "</div>" + pgBtn(k);
  }
  function pgBtn(k) {
    var p = PG[k], left = p.items.length - p.shown;
    return left > 0 ? '<div class="f-pgr" id="fPgb-' + k + '"><button type="button" class="f-btn line xl" data-act="f-page" data-k="' + k + '">더 보기<span class="f-pgn">남은 ' + left + p.unit + "</span></button></div>" : "";
  }
  function pageMore(k) {
    var p = PG[k], box = document.getElementById("fPg-" + k), btn = document.getElementById("fPgb-" + k);
    if (!p || !box) return;
    var next = p.items.slice(p.shown, p.shown + p.n), tmp = document.createElement("div");
    p.shown += next.length;
    tmp.innerHTML = next.map(p.fn).join("");
    var added = [].slice.call(tmp.children);
    added.forEach(function (el) { box.appendChild(el); });
    if (btn) btn.outerHTML = pgBtn(k);
    BG.mo.play(added, "up", { y: 16, stagger: 60 });
    var first = added[0] && added[0].querySelector("a");
    if (first) first.focus({ preventScroll: true });
  }

  var TABS = [["all", "전체"], ["dev", "업체 · 시행"], ["build", "업체 · 시공"], ["mat", "업체 · 자재"], ["expert", "전문가"], ["mall", "자재몰"], ["pm", "PM"], ["finance", "금융"]];
  function search(r) {
    fresh("search");
    var q = r.query, kw = (q.q || "").trim(), tab = q.tab || "all", sd = SIDO.indexOf(q.sido) >= 0 ? q.sido : "";
    if (!TABS.some(function (x) { return x[0] === tab; })) tab = "all";
    var useCo = ["all", "dev", "build", "mat"].indexOf(tab) >= 0, useEx = tab === "all" || tab === "expert" || tab === "pm";
    var coAll = coFind({ q: kw }), exAll = exFind({ q: kw }), mts = mtFind(kw);
    var cnt = { all: 0, dev: 0, build: 0, mat: 0, expert: exAll.length, mall: mts.length };
    coAll.forEach(function (c) { cnt[c.cat]++; });
    cnt.all = coAll.length + exAll.length + mts.length;
    var coT = useCo ? coFind({ q: kw, cat: tab === "all" ? "" : tab }) : [], exT = useEx && tab !== "pm" ? exAll : tab === "pm" ? exFind({}).filter(function (x) { return /PM|시공기술사|도시계획/.test(x.title); }) : [];
    var t = tally(coT, exT);
    var cos = coSort(coT.filter(function (c) { return !sd || c.sido === sd; }), "trust"), exs = exT.filter(function (x) { return !sd || x.sido === sd; }).sort(function (a, b) { return b.years - a.years; });
    CUR = { name: "search", query: q, t: t };
    var tabs = TABS.map(function (x) {
      var n = cnt[x[0]];
      return '<a class="f-tab' + (tab === x[0] ? " on" : "") + '" href="' + link("search", { q: kw, tab: x[0] === "all" ? "" : x[0], sido: sd }) + '"' + (tab === x[0] ? ' aria-current="page"' : "") + ">" + FI[x[0]] + "<span>" + x[1] + (n != null ? "<b>" + n + "</b>" : "") + "</span></a>";
    }).join("");
    var title = kw ? "‘" + esc(kw) + "’ 검색 결과" : "업체 · 전문가 · 자재 찾기";
    var body = "";
    var more = function (n, label, href) { return n ? '<a class="f-more" href="' + href + '">' + label + " " + I.arrow + "</a>" : ""; };
    var grp = function (ttl, n, unit, inner, moreHtml) { return '<section class="f-grp"><div class="f-grp-h"><h2>' + ttl + " <b>" + n + "</b>" + unit + "</h2>" + moreHtml + "</div>" + inner + "</section>"; };
    var none = '<p class="f-none">맞는 결과가 없습니다. 다른 말로 찾거나 지역을 ‘전국’으로 넓혀 보세요.</p>';
    if (tab === "all") {
      body += grp("업체", cos.length, "곳", cos.length ? cos.slice(0, 3).map(coRow).join("") : none, more(cos.length, "업체 " + cos.length + "곳 모두 보기", link("companies", { q: kw, sido: sd })));
      body += grp("전문가", exs.length, "명", exs.length ? exs.slice(0, 3).map(exRow).join("") : none, more(exs.length, "전문가 " + exs.length + "명 모두 보기", link("experts", { q: kw, sido: sd })));
      body += grp("자재", mts.length, "종", mts.length ? '<div class="f-mts">' + mts.slice(0, 4).map(mtCard).join("") + "</div>" : none, more(mts.length, "자재 " + mts.length + "종 모두 보기", link("search", { q: kw, tab: "mall" })));
      body += svcBand();
    } else if (tab === "expert") {
      body += grp("전문가", exs.length, "명", exs.length ? paged("sx", exs, exRow, "명") : none, "");
    } else if (tab === "mall") {
      body += grp("자재", mts.length, "종", mts.length ? paged("sm", mts, mtCard, "종", "f-mts") : none, '<a class="f-more" href="#/mall">자재몰 전체 ' + I.arrow + "</a>");
    } else if (tab === "pm" || tab === "finance") {
      body += svcBlock(tab) + (tab === "pm" ? grp("PM을 함께 맡는 전문가", exs.length, "명", exs.length ? paged("sp", exs, exRow, "명") : none, "") : "");
    } else {
      body += grp("업체 · " + CAT[tab].name, cos.length, "곳", cos.length ? paged("sc", cos, coRow, "곳") : none, more(cos.length, "업체 찾기에서 정렬해 보기", link("companies", { cat: tab, q: kw, sido: sd })));
    }
    var noRegion = tab === "mall" || tab === "finance";
    A.app.innerHTML = '<div class="f-pg">' + head([["홈", "#/"], ["검색"]], title, kw ? "업체 " + coAll.length + "곳 · 전문가 " + exAll.length + "명 · 자재 " + mts.length + "종을 찾았습니다." : "", sbar("search", kw, "업체, 공종, 자격, 자재 이름으로 찾기", { tab: tab === "all" ? "" : tab, sido: sd })) +
      '<nav class="f-cats" aria-label="분류"><div class="f-cats-in">' + tabs + "</div></nav>" +
      '<div class="f-wrap"><div class="f-tool"><p class="f-sum">' + (kw ? "업체 <b>" + coAll.length + "</b> · 전문가 <b>" + exAll.length + "</b> · 자재 <b>" + mts.length + "</b>" : "찾을 말을 넣거나 분류를 고르세요") + "</p>" + (noRegion ? '<p class="f-nor">' + (tab === "mall" ? "자재는 전국으로 배송해 지역 구분이 없습니다." : "금융 상담은 지역과 관계없이 도아가 직접 받습니다.") + "</p>" : '<div class="f-rgw">' + rgBtn(sd) + "</div>") + "</div>" +
      (noRegion ? "" : rgPanel(t, sd)) + body + "</div></div>";
    afterRender();
  }
  function svcBand() {
    return '<section class="f-grp"><div class="f-grp-h"><h2>도아 직접 상담</h2></div><div class="f-svs">' +
      '<div class="f-sv"><p class="f-kind">PM</p><b>사업 전체 관리</b><p>부지 검토부터 설계·인허가·시공·준공까지 일정과 비용을 도아가 직접 관리합니다.</p><div class="f-sv-a"><a class="f-btn" href="#/match?to=pm">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line" href="#/pm">PM 안내</a></div></div>' +
      '<div class="f-sv"><p class="f-kind">금융</p><b>사업 자금 검토</b><p>LH 매입약정 사업에 필요한 PF 등 사업 자금을 함께 검토하고 상담을 연결합니다.</p><div class="f-sv-a"><a class="f-btn" href="#/match?to=finance">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line" href="#/finance">금융 안내</a></div></div></div></section>';
  }
  function svcBlock(k) {
    var pm = k === "pm";
    return '<section class="f-svc"><div class="f-svc-t"><p class="f-kind">도아 직접 상담 · ' + (pm ? "PM" : "금융") + "</p><h2>" + (pm ? "사업의 처음부터 끝까지,<br>일정과 비용을 관리합니다." : "LH 매입약정 사업 자금을<br>함께 검토합니다.") + "</h2><p>" +
      (pm ? "부지 매입 검토, 설계, 인허가, 시공, 준공 후 매입까지 도아 PM 담당이 사업 전체를 맡아 관리합니다." : "토지 매입부터 공사비까지, 사업에 필요한 PF 등 자금을 도아 금융 담당이 검토하고 상담을 연결합니다.") +
      '</p><div class="f-sv-a"><a class="f-btn xl" href="#/match?to=' + k + '">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line xl" href="#/' + k + '">' + (pm ? "PM" : "금융") + " 안내 보기</a></div></div>" +
      '<div class="f-svc-p"><img src="' + photo(pm ? "w_measure" : "w_women") + '" alt="' + (pm ? "도면을 보며 이야기하는 담당자" : "도면을 보는 담당자") + '"></div></section>';
  }

  function companies(r) {
    fresh("companies");
    var q = r.query, kw = (q.q || "").trim(), cat = CAT[q.cat] ? q.cat : "", sd = SIDO.indexOf(q.sido) >= 0 ? q.sido : "", sort = q.sort || "trust";
    var base = { q: kw, type: q.type, work: q.work, region: q.region };
    var all = coFind(base), t = tally(coFind({ q: kw, cat: cat, type: q.type, work: q.work }), []);
    var res = coSort(coFind({ q: kw, cat: cat, type: q.type, work: q.work, region: q.region, sido: sd }), sort);
    CUR = { name: "companies", query: q, t: t };
    var n = { "": all.length, dev: 0, build: 0, mat: 0 };
    all.forEach(function (c) { n[c.cat]++; });
    var big = [["", "전체", "확인을 마친 업체 모두"], ["dev", "시행", CAT.dev.d], ["build", "시공", CAT.build.d], ["mat", "자재", CAT.mat.d]].map(function (x) {
      return '<a class="f-big' + (cat === x[0] ? " on" : "") + '" href="' + link("companies", { cat: x[0], q: kw, sido: sd }) + '"' + (cat === x[0] ? ' aria-current="page"' : "") + ">" + FI[x[0] || "all"] + '<span class="f-big-t"><b>' + x[1] + "</b><em>" + n[x[0]] + '</em></span><span class="f-big-d">' + x[2] + "</span></a>";
    }).join("");
    var sorts = [["trust", "확인 많은 순"], ["count", "실적 많은 순"], ["since", "업력 순"]].map(function (o) { return '<a href="' + link("companies", { cat: cat, q: kw, sido: sd, sort: o[0] === "trust" ? "" : o[0] }) + '" class="' + (sort === o[0] ? "on" : "") + '">' + o[1] + "</a>"; }).join("");
    A.app.innerHTML = '<div class="f-pg f-hasf">' + head([["홈", "#/"], ["업체 찾기"]], "업체 찾기", "사업자등록 · 면허 · 보험 서류를 도아 담당 매니저가 직접 확인한 업체만 올립니다.", sbar("companies", kw, "업체명, 공종, 면허로 찾기", { cat: cat, sido: sd })) +
      '<nav class="f-bigs" aria-label="업체 분류"><div class="f-bigs-in">' + big + "</div></nav>" +
      '<div class="f-wrap"><div class="f-tool"><p class="f-sum">' + (cat ? CAT[cat].name + " " : "") + "업체 <b>" + res.length + '</b>곳</p><div class="f-rgw">' + rgBtn(sd) + '</div><p class="f-sort" aria-label="정렬">' + sorts + "</p></div>" + rgPanel(t, sd) +
      '<div class="f-split">' + filt(t, sd, "업체") + '<section class="f-list">' + (res.length ? paged("co", res, coRow, "곳") : '<p class="f-none">조건에 맞는 업체가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</section></div>" + helpBand("업체") + "</div></div>";
    afterRender();
  }
  function experts(r) {
    fresh("experts");
    var q = r.query, kw = (q.q || "").trim(), work = BG.WORK[q.work] ? q.work : "", sd = SIDO.indexOf(q.sido) >= 0 ? q.sido : "";
    var t = tally([], exFind({ q: kw, work: work }));
    var res = exFind({ q: kw, work: work, region: q.region, sido: sd }).sort(function (a, b) { return b.years - a.years; });
    CUR = { name: "experts", query: q, t: t };
    var ws = [{ id: "", name: "전체" }].concat(D.works).map(function (w) { var c = exFind({ q: kw, work: w.id, sido: sd }).length; return '<a class="f-wk' + (work === w.id ? " on" : "") + '" href="' + link("experts", { work: w.id, q: kw, sido: sd }) + '"' + (work === w.id ? ' aria-current="page"' : "") + "><span>" + esc(w.name) + "</span><b>" + c + "</b></a>"; }).join("");
    A.app.innerHTML = '<div class="f-pg f-hasf">' + head([["홈", "#/"], ["전문가 찾기"]], "전문가 찾기", "건축사 · 기술사 · 현장소장급 기술자의 자격증과 경력증명서를 도아가 확인했습니다.", sbar("experts", kw, "이름, 자격, 분야로 찾기", { work: work, sido: sd })) +
      '<nav class="f-wks" aria-label="전문 분야"><div class="f-wks-in">' + ws + "</div></nav>" +
      '<div class="f-wrap"><div class="f-tool"><p class="f-sum">' + (work ? esc(BG.WORK[work].name) + " " : "") + "전문가 <b>" + res.length + '</b>명</p><div class="f-rgw">' + rgBtn(sd) + '</div><p class="f-sort"><a class="on">경력 많은 순</a></p></div>' + rgPanel(t, sd) +
      '<div class="f-split">' + filt(t, sd, "전문가") + '<section class="f-list">' + (res.length ? paged("ex", res, exRow, "명") : '<p class="f-none">조건에 맞는 전문가가 없습니다. 지역을 ‘전국’으로 넓혀 보세요.</p>') + "</section></div>" + helpBand("전문가") + "</div></div>";
    afterRender();
  }
  function helpBand(k) {
    return '<section class="f-help"><div><p class="f-kind">담당 매니저 연결</p><h2>찾는 ' + k + "가 없으신가요?</h2><p>현장 조건만 남기시면 담당 매니저가 맞는 " + k + '를 직접 골라 연결합니다.</p></div><div class="f-sv-a"><a class="f-btn xl" href="#/quote">견적서 받기</a><a class="f-btn line xl" href="#/match?to=pm">도아에 직접 상담</a></div></section>';
  }

  function coverOf(o, used) {
    var pool = [];
    o.works.forEach(function (w) { (WPH[w] || []).forEach(function (p) { if (pool.indexOf(p) < 0) pool.push(p); }); });
    if (!pool.length) pool = ["n_aerial", "site_aerial", "hero_rise", "n_dusk", "hero_kr", "n_wide"];
    var free = pool.filter(function (p) { return used.indexOf(p) < 0; }), list = free.length ? free : pool;
    return list[hsh(o.id) % list.length];
  }
  function vidOf(c, x) {
    if (x) return x.works.indexOf("design") >= 0 ? ["v1439", "도면 검토"] : ["v1459", "현장 점검"];
    if (c.cat === "mat") return ["v1457", "현장 자재 반입"];
    if (c.cat === "dev" || c.type === "de") return ["v1439", "사업 도면 검토"];
    return ["v1459", "내부 골조 공사"];
  }
  function reqBox(P) {
    return '<aside class="f-req" aria-label="상담 요청"><div class="f-req-in"><p class="f-kind">상담 요청</p><p class="f-req-t">' + esc(P.who) + "<br>상담을 요청하세요</p>" +
      '<p class="f-req-d">채팅으로 질문 ' + P.n + "개에 답하시면, 도아 담당 매니저가 내용을 확인한 뒤 연결해 드립니다.</p>" +
      '<a class="f-btn f-wide" href="#/match?to=' + P.id + '">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line f-wide" href="#/quote?to=' + P.id + '">' + FI.doc + "<span>견적서 받기로 요청</span></a>" + A.saveBtn(P.id) +
      '<div class="f-req-m">' + FI.person + "<p><b>도아 파트너 연결팀</b><span>신청서를 사람이 직접 읽고 연결합니다 · 평일 09:00–18:00</span></p></div>" +
      '<button type="button" class="f-tel" data-act="f-tel">' + FI.phone + "<span>대표번호 <b>1588-9863</b></span></button></div></aside>";
  }
  function galHtml(list, vid) {
    var fig = function (p, k) { return '<figure class="f-g' + (k ? 2 : 1) + '"><div class="f-gi"><img src="' + photo(p.ph) + '" alt="' + esc(p.t) + '"></div><figcaption><b>' + esc(p.t) + "</b><span>" + p.y + (p.d ? " · " + esc(p.d) : "") + "</span></figcaption></figure>"; };
    return '<div class="f-gal">' + list.slice(0, 3).map(fig).join("") + "</div>" +
      '<figure class="f-vid"><div class="f-vid-b"><video muted loop playsinline preload="none" poster="media/' + vid[0] + '.jpg" src="media/' + vid[0] + '.mp4" aria-label="' + esc(vid[1]) + ' 현장 영상"></video><button type="button" class="f-vid-p" data-act="f-vid" aria-label="현장 영상 재생">' + FI.play + '</button></div><figcaption><b>현장 영상 · ' + esc(vid[1]) + "</b><span>입점 때 받은 작업 영상입니다. 소리 없이 재생됩니다.</span></figcaption></figure>";
  }
  function rvHtml(key, s) {
    var rs = RV[key];
    return '<div class="f-rvs"><div class="f-rvs-n"><b>' + s.sc + "</b><span>/ 5</span></div><p>리뷰 <b>" + s.rv + "건</b> · 도아로 연결돼 계약을 마친 고객만 리뷰를 쓸 수 있습니다.</p></div>" +
      '<ul class="f-rvl">' + rs.map(function (v) { return '<li><div class="f-rv-h"><b>' + v[0] + "</b><span>" + esc(v[1]) + "</span><span>" + v[2] + '</span><em>평가 ' + v[3] + ' / 5</em></div><p>' + esc(v[4]) + '</p><p class="f-rv-t">' + FI.check + "<span>도아 연결 계약 확인</span></p></li>"; }).join("") + "</ul>" +
      (s.rv > rs.length ? '<button type="button" class="f-btn line f-rvm" data-act="f-rvm">리뷰 ' + (s.rv - rs.length) + "건 더 보기</button>" : "");
  }
  function qaHtml(key) {
    return '<div class="f-qas">' + QA[key].map(function (q, i) { return "<details" + (i ? "" : " open") + ' class="f-qa"><summary><span>Q</span>' + esc(q[0]) + I.down + '</summary><p><span>A</span>' + esc(q[1]) + "</p></details>"; }).join("") + "</div>";
  }
  function ckTable(rows) {
    return '<table class="f-tb f-ck"><tr><th scope="col">항목</th><th scope="col">받은 서류</th><th scope="col">확인</th></tr>' + rows.map(function (x) { return "<tr><td><b>" + x[0] + "</b></td><td>" + esc(x[1]) + "</td><td>" + (x[2] ? '<span class="f-yes">' + FI.check + x[2].replace(/-/g, ".") + "</span>" : '<span class="f-wait">서류 받는 중</span>') + "</td></tr>"; }).join("") + '</table><p class="f-note">도아 담당 매니저가 서류 원본을 받아 직접 확인한 날짜입니다.</p>';
  }
  function pfPage(P) {
    var tabs = [["fs-info", P.infoT], ["fs-svc", "서비스 상세"], ["fs-ph", "사진·동영상"], ["fs-rv", "리뷰 " + P.st.rv], ["fs-qa", "질문답변"]];
    A.app.innerHTML = '<div class="f-pg f-pf"><div class="f-pf-w">' + crumb(P.crumb) + '<div class="f-pf-g">' +
      '<section class="f-pf-hd"><figure class="f-cover"><img src="' + photo(P.cover) + '" alt="' + esc(P.coverAlt) + '"></figure><p class="f-kind">' + esc(P.kind) + '</p><h1 class="f-h1">' + P.title + '</h1><p class="f-lead">' + esc(P.intro) + "</p>" + P.stats + P.ok + "</section>" +
      reqBox(P) +
      '<div class="f-pf-b"><nav class="f-ptab" aria-label="프로필 목차"><div class="f-ptab-in">' + tabs.map(function (t, i) { return '<button type="button" data-act="f-jump" data-v="' + t[0] + '"' + (i ? "" : ' class="on"') + ">" + t[1] + "</button>"; }).join("") + "</div></nav>" +
      '<section class="f-ps" id="fs-info"><h2>' + P.infoT + '</h2><table class="f-tb">' + P.rows.map(function (x) { return "<tr><th>" + x[0] + "</th><td>" + x[1] + "</td></tr>"; }).join("") + "</table></section>" +
      '<section class="f-ps" id="fs-svc"><h2>서비스 상세</h2><ul class="f-svl">' + P.svc.map(function (x) { return "<li><b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></li>"; }).join("") + '</ul><p class="f-ps-s">상담할 수 있는 일</p><p class="f-tags">' + P.opts.map(function (o) { return "<span>" + esc(o) + "</span>"; }).join("") + '</p><p class="f-ps-s">확인 내역</p>' + ckTable(P.ck) + "</section>" +
      '<section class="f-ps" id="fs-ph"><h2>사진·동영상 <b>' + (P.gal.length + 1) + "</b></h2>" + galHtml(P.gal, P.vid) + "</section>" +
      '<section class="f-ps" id="fs-rv"><h2>리뷰 <b>' + P.st.rv + "</b></h2>" + rvHtml(P.rk, P.st) + "</section>" +
      '<section class="f-ps" id="fs-qa"><h2>질문답변</h2>' + qaHtml(P.rk) + "</section>" +
      "</div></div></div>" + askBand(P.who, "#/match?to=" + P.id, "#/quote?to=" + P.id) + "</div>";
    afterRender();
  }
  function company(r) {
    var c = BG.CO[r.id] || D.companies[0], pj = c.projects, T = target(c.id);
    CUR = { name: "company", query: r.query };
    var ck = [["사업자등록", "사업자등록증 · 휴업·폐업 여부", c.checks.indexOf("사업자") >= 0 ? c.at : ""]];
    if (c.cat !== "mat") ck.push([licName(c), c.cat === "dev" ? "부동산개발업 등록증" : c.type === "de" ? "건축사사무소 개설 신고 확인증" : "건설업 등록증 · 등록수첩", c.checks.indexOf("면허") >= 0 ? c.at : ""]);
    if (c.cat !== "mat") ck.push(["보험", "공제조합 보증서 · 배상책임 보험증권", c.checks.indexOf("보험") >= 0 ? c.at : ""]);
    var rows = [["업체명", esc(c.name)], ["분류", esc(kindLine(c)) + (c.tags.length ? " · " + esc(c.tags.join(" ")) : "")], [c.cat === "dev" ? "사업 분야" : c.cat === "mat" ? "공급 품목" : "주요 공종", esc(A.workNames(c.works).join(", "))], ["면허·등록", esc(c.licenses.join(", "))], ["소재지", esc(c.sido + " " + c.city)], ["설립", c.since + "년 (업력 " + (2026 - c.since) + "년)"], [c.cat === "mat" ? "납품 실적" : "실적", won(c.count) + "건"]];
    if (c.lh) rows.push(["LH 매입약정", esc(c.lh)]);
    pfPage({
      id: c.id, who: c.name + "에", n: steps(T).length, crumb: [["업체 찾기", "#/companies"], [CAT[c.cat].name, "#/companies?cat=" + c.cat], [c.name]],
      cover: coverOf(c, pj.map(function (p) { return p.ph; })), coverAlt: c.name + " 현장 사진", kind: kindLine(c) + " · " + c.sido + " " + c.city, title: esc(c.name), intro: c.intro,
      st: stat(c), stats: stRow(c, false, true), ok: okLine(c), infoT: "업체 정보", rows: rows,
      svc: c.works.map(function (w) { return [BG.WORK[w].name, WDESC[w] || ""]; }), opts: workOpts(T), ck: ck,
      gal: pj, vid: vidOf(c), rk: c.cat === "dev" ? "dev" : c.cat === "mat" ? "mat" : "build"
    });
  }
  function expert(r) {
    var x = BG.EX[r.id] || D.experts[0], T = target(x.id), role = x.title.split(" · ")[0];
    CUR = { name: "expert", query: r.query };
    var docs = { "건축사 자격": "건축사 자격증 · 등록증", "기술사 자격": "기술사 자격증", "기능장 자격": "기능장 자격증", "국가기술자격": "국가기술자격증", "경력증명서": "건설기술인 경력증명서", "재직": "재직증명서 (" + x.affil + ")" };
    var rows = [["이름", esc(x.name)], ["자격", esc(x.title)], ["분야", esc(A.workNames(x.works).join(", "))], ["경력", x.years + "년"], ["활동 지역", esc(x.sido)], ["소속", esc(x.affil)]];
    pfPage({
      id: x.id, who: x.name + " " + role + "에게", n: steps(T).length, crumb: [["전문가 찾기", "#/experts"], [BG.WORK[x.works[0]].name, "#/experts?work=" + x.works[0]], [x.name]],
      cover: coverOf(x, x.phs), coverAlt: x.name + " " + role + " 작업 사진", kind: "전문가 · " + x.title + " · " + x.sido, title: esc(x.name) + " <small>" + esc(x.title) + "</small>", intro: x.intro,
      st: stat(x), stats: stRow(x, true, true), ok: exOkLine(x), infoT: "전문가 정보", rows: rows,
      svc: x.works.map(function (w) { return [BG.WORK[w].name, WDESC[w] || ""]; }).concat(x.projects.map(function (p, k) { return ["대표 실적 " + (2025 - k), p]; })), opts: workOpts(T),
      ck: exOk(x).map(function (k) { return [k, docs[k], x.at]; }),
      gal: x.projects.map(function (p, k) { return { t: p, y: 2025 - k, ph: x.phs[k], d: role }; }), vid: vidOf(null, x), rk: "ex"
    });
  }
  function askBand(who, chatHref, quoteHref) {
    return '<section class="f-ask"><div><p class="f-kind">상담 요청</p><h2>' + esc(who) + "<br>상담을 요청하세요.</h2><p>채팅으로 몇 가지만 고르시면, 담당 매니저가 내용을 확인한 뒤 연결해 드립니다.</p></div>" +
      '<div class="f-sv-a"><a class="f-btn xl" href="' + chatHref + '">' + FI.chat + '<span>채팅으로 상담 요청</span></a><a class="f-btn line xl" href="' + quoteHref + '">견적서 받기</a></div></section>';
  }

  function target(to) {
    var c = BG.CO[to], x = BG.EX[to];
    if (c) return { kind: "company", id: c.id, name: c.name, label: kindLine(c), nav: "companies", back: "#/company/" + c.id, ph: c.projects[0].ph, sub: c.sido + " " + c.city, ok: okList(c).join(" · ") + " 확인", c: c };
    if (x) return { kind: "expert", id: x.id, name: x.name + " " + x.title.split(" · ")[0], label: "전문가 · " + x.title, nav: "experts", back: "#/expert/" + x.id, ph: x.phs[0], sub: x.sido + " · 경력 " + x.years + "년", ok: exOk(x).join(" · ") + " 확인", x: x };
    if (to === "finance") return { kind: "finance", id: "finance", name: "도아 금융 상담", label: "도아 직접 상담 · 금융", nav: "finance", back: "#/finance", ph: "w_women", sub: "(주)더원파트너스", ok: "LH 민간신축매입약정사업 전문기업" };
    return { kind: "pm", id: "pm", name: "도아 PM 상담", label: "도아 직접 상담 · PM", nav: "pm", back: "#/pm", ph: "w_measure", sub: "(주)더원파트너스", ok: "LH 민간신축매입약정사업 전문기업" };
  }
  function workOpts(T) {
    if (T.kind === "pm") return ["토지 검토", "사업성 분석", "설계·인허가 관리", "시공 관리", "준공·매입 대응"];
    if (T.kind === "finance") return ["토지 매입 자금", "PF 대출", "공사비", "중도금·잔금", "아직 모르겠어요"];
    var c = T.c, x = T.x, ws = (c || x).works;
    if (c && c.cat === "dev") return ["사업성 검토", "부지 매입 검토", "LH 매입약정 신청", "시행 위탁", "토지주 공동 사업"];
    if (c && c.cat === "mat") return ["자재 납품", "단가 견적", "정기 납품", "현장 직송"];
    if (ws.indexOf("design") >= 0) return ["설계", "인허가", "구조 검토", "공사 감리", "사업성 검토"];
    var a = ["신축 시공", "리모델링"];
    ws.forEach(function (w) { var n = BG.WORK[w].name + " 공사"; if (a.indexOf(n) < 0) a.push(n); });
    a.push(x ? "기술 자문·현장 점검" : "하자 보수");
    return a.slice(0, 6);
  }
  function steps(T) {
    var fin = T.kind === "finance", pm = T.kind === "pm", mat = T.c && T.c.cat === "mat";
    return [
      { id: "work", type: fin ? "multi" : pm ? "one" : "multi", label: fin ? "필요한 자금" : pm ? "사업 단계" : "맡기실 일", q: fin ? "필요한 자금은 어떤 종류인가요? 여러 개 고르셔도 됩니다." : pm ? "사업이 지금 어느 단계인가요?" : "어떤 일을 맡기실 건가요? 여러 개 고르셔도 됩니다.", opts: workOpts(T) },
      { id: "sido", type: "sido", label: "현장 지역", q: "현장은 어느 지역인가요? 시·도를 고르고, 시·군·구도 알려 주세요." },
      { id: "size", type: "one", label: "규모", q: "규모는 어느 정도인가요? 연면적으로 골라 주세요.", opts: ["330㎡ 미만 (100평 미만)", "330~990㎡ (100~300평)", "990~3,300㎡ (300~1,000평)", "3,300㎡ 이상 (1,000평 이상)", "아직 모르겠어요"] },
      { id: "lh", type: "one", label: "LH 매입약정 단계", q: "LH 매입약정은 어디까지 진행되셨나요?", opts: ["검토 중", "공모 준비", "조건부 통과", "약정 체결", "착공", "해당 없음"] },
      { id: "when", type: "one", label: fin ? "자금 필요 시기" : pm ? "PM 시작 시기" : mat ? "납품 희망 시기" : "착공 희망 시기", q: fin ? "자금은 언제 필요하세요?" : pm ? "PM은 언제부터 필요하세요?" : mat ? "자재는 언제 받으셔야 하나요?" : "착공은 언제쯤 생각하세요?", opts: fin ? ["1개월 안", "3개월 안", "6개월 안", "아직 정하지 않았어요"] : ["3개월 안", "6개월 안", "1년 안", "아직 정하지 않았어요"] },
      { id: "budget", type: "one", label: fin ? "필요 금액" : pm ? "총사업비" : "예산 범위", q: fin ? "필요한 금액은 어느 정도인가요?" : pm ? "총사업비는 어느 정도인가요?" : "예산 범위를 알려 주시면 맞는 곳을 고르기 쉬워요.", opts: fin || pm ? ["10억 원 미만", "10억~50억 원", "50억~100억 원", "100억 원 이상"] : mat ? ["1천만 원 미만", "1천만~5천만 원", "5천만~2억 원", "2억 원 이상"] : ["5억 원 미만", "5억~20억 원", "20억~50억 원", "50억 원 이상"], skip: "선택 안 함" },
      { id: "check", type: "multi", label: "꼭 확인할 것", q: "꼭 확인하고 싶은 것을 모두 골라 주세요.", opts: fin ? ["금리 조건", "대출 한도", "실행까지 걸리는 기간", "보증 조건", "자기자본 비율"] : pm ? ["사업성 검토 보고서", "공정 관리", "비용 관리", "LH 협의 지원", "금융 연계"] : mat ? ["단가 비교", "납품 일정", "규격·시험성적서", "현장 하차 가능 여부", "세금계산서 발행"] : T.c && T.c.cat === "dev" ? ["부동산개발업 등록", "매입약정 실적", "토지 계약 조건", "사업비 조달 계획", "준공 후 매입 일정"] : ["건설업 면허", "비슷한 실적", "보증·보험 가입", "하자보수 이행", "직접 시공 여부", "현장 방문 상담"] },
      { id: "contact", type: "contact", label: "연락처", q: "마지막이에요. 연락받으실 이름과 휴대폰 번호를 남겨 주세요." }
    ];
  }
  function nw(t) { return esc(t).replace(/\(([^)]*)\)/g, '<span class="f-nw">($1)</span>').replace(/(시·군·구|시·도)/g, '<span class="f-nw">$1</span>'); }
  function ansText(st, v) {
    if (v == null) return "";
    if (st.type === "multi") return v.join(", ");
    if (st.type === "sido") return v.sido + (v.gu ? " " + v.gu : "");
    if (st.type === "contact") return v.name + " · " + v.phone;
    return v;
  }
  function mBub(html, who) { return '<div class="f-m l">' + (who ? '<p class="f-who"><i class="f-av">' + FI.person + "</i><span>" + who + "</span></p>" : "") + '<div class="f-bub">' + html + "</div></div>"; }
  function myBub(st, k, v) { return '<div class="f-m r"><button type="button" class="f-bub" data-act="f-redo" data-k="' + k + '" title="누르면 이 질문부터 다시 고를 수 있어요"><span>' + esc(ansText(st, v)) + "</span><i>다시 고르기</i></button></div>"; }
  function intro(T) {
    if (T.kind === "pm") return "안녕하세요, 도아 PM 상담입니다. 사업 단계와 규모를 알려 주시면 PM 담당이 확인한 뒤 연락드립니다.";
    if (T.kind === "finance") return "안녕하세요, 도아 금융 상담입니다. 필요한 자금과 일정을 알려 주시면 금융 담당이 검토한 뒤 연락드립니다.";
    return "안녕하세요, 도아 담당 매니저입니다. " + T.name + (T.kind === "expert" ? "에게" : "에") + " 상담을 연결해 드릴게요. 몇 가지만 고르시면 미리 내용을 전하고 연락드립니다.";
  }
  function match(r) {
    var to = r.query.to || "pm", T = target(to), ST = steps(T);
    CUR = { name: "match", query: r.query };
    chat = { to: to, T: T, ST: ST, k: 0, ans: {}, prev: {}, tok: {}, done: false, sent: false };
    var u = A.keep("user");
    if (u && u.name) chat.prev.contact = { name: u.name, phone: "" };
    var o = T.c || T.x, st = o ? stat(o) : null;
    A.app.innerHTML = '<div class="f-cw"><div class="f-chat"><header class="f-ch-h"><a class="f-back" href="' + T.back + '" aria-label="이전 화면으로">' + FI.back + '</a><div class="f-ch-t"><p class="f-kind">' + esc(T.label) + "</p><h1>" + esc(T.name) + '</h1><p class="f-ch-s">담당 매니저가 확인 후 연락드려요</p></div><p class="f-prog" id="fProg"></p><i class="f-bar"><b id="fBar"></b></i></header>' +
      '<div class="f-log" id="fLog" aria-live="polite"></div><div class="f-ans" id="fAns"></div></div>' +
      '<aside class="f-side"><div class="f-side-p"><img src="' + photo(T.ph) + '" alt=""></div><p class="f-kind">' + esc(T.label) + "</p><b>" + esc(T.name) + "</b><p>" + esc(T.sub) + "</p>" +
      (st ? '<dl class="f-st f-sts"><div><dt>리뷰</dt><dd>' + st.sc + "<small> / 5</small></dd></div><div><dt>도아 연결</dt><dd>" + st.hires + "회</dd></div></dl>" : "") +
      '<p class="f-ok">' + FI.shield + "<span>" + esc(T.ok) + "</span></p>" +
      '<div class="f-side-m">' + FI.person + "<p><b>도아 담당 매니저</b>상담 신청서를 먼저 읽고, 확인이 끝나면 남기신 번호로 연락드립니다.</p></div>" +
      '<ol class="f-flow"><li class="on"><b>채팅으로 확인</b><span>질문 ' + ST.length + "개</span></li><li><b>담당 매니저 확인</b><span>빠진 내용은 전화로 여쭙니다</span></li><li><b>" + (T.kind === "pm" || T.kind === "finance" ? "도아 담당 연결" : "업체·전문가 연결") + "</b><span>상담 일정을 잡아 드립니다</span></li></ol></aside></div>";
    var log = document.getElementById("fLog");
    log.innerHTML = mBub(esc(intro(T)), "도아 담당 매니저");
    ask(true);
  }
  function prog() {
    var n = chat.ST.length, k = Math.min(chat.k + 1, n), p = document.getElementById("fProg"), b = document.getElementById("fBar");
    if (!p) return;
    p.innerHTML = chat.sent ? "요청 완료" : chat.done ? "확인" : "질문 <b>" + k + "</b> / " + n;
    b.style.width = (chat.sent || chat.done ? 100 : Math.round(chat.k / n * 100)) + "%";
    var fl = document.querySelectorAll(".f-flow li");
    if (fl.length) fl.forEach(function (li, i) { li.classList.toggle("on", chat.sent ? i <= 1 : i === 0); });
  }
  function typing(cb) {
    var log = document.getElementById("fLog"), tok = chat.tok = {};
    log.insertAdjacentHTML("beforeend", '<div class="f-m l f-typing" aria-label="입력 중"><div class="f-bub"><i></i><i></i><i></i></div></div>');
    scrollEnd();
    setTimeout(function () {
      if (chat.tok !== tok || !document.body.contains(log)) return;
      var t = log.querySelector(".f-typing");
      if (t) t.remove();
      cb();
    }, BG.reduced() ? 0 : 560);
  }
  function ask() {
    var ans = document.getElementById("fAns");
    ans.innerHTML = "";
    prog();
    if (chat.k >= chat.ST.length) { summary(); return; }
    var st = chat.ST[chat.k];
    typing(function () {
      var log = document.getElementById("fLog");
      log.insertAdjacentHTML("beforeend", mBub(nw(st.q) + (st.type === "multi" ? '<span class="f-hint">여러 개 고를 수 있어요</span>' : "")));
      pop(log.lastElementChild);
      ansUi(st);
      scrollEnd();
    });
  }
  function chips(st, cur, multi) {
    return '<div class="f-chips' + (st.opts.length > 5 ? " c3" : "") + '">' + st.opts.map(function (o) {
      var on = multi ? (cur || []).indexOf(o) >= 0 : cur === o;
      return '<button type="button" class="f-cp' + (on ? " on" : "") + '" data-act="' + (multi ? "f-tg" : "f-one") + '" data-v="' + esc(o) + '" aria-pressed="' + on + '">' + (multi ? '<i aria-hidden="true">' + FI.check + "</i>" : "") + "<span>" + nw(o) + "</span></button>";
    }).join("") + (st.skip ? '<button type="button" class="f-cp skip" data-act="f-one" data-v="' + st.skip + '"><span>' + st.skip + "</span></button>" : "") + "</div>";
  }
  function ansUi(st) {
    var ans = document.getElementById("fAns"), pv = chat.prev[st.id], h = "";
    if (st.type === "one") h = chips(st, pv, false);
    if (st.type === "multi") h = chips(st, pv, true) + '<button type="button" class="f-btn f-next" data-act="f-multi"' + (pv && pv.length ? "" : " disabled") + ">다음" + (pv && pv.length ? " (" + pv.length + "개)" : "") + "</button>";
    if (st.type === "sido") h = '<div class="f-chips c4 f-sdc">' + SIDO.map(function (n) { return '<button type="button" class="f-cp' + (pv && pv.sido === n ? " on" : "") + '" data-act="f-sdo" data-v="' + n + '" aria-pressed="' + !!(pv && pv.sido === n) + '"><span>' + n + "</span></button>"; }).join("") + "</div>" +
      '<div class="f-in2"><label><span>시·군·구 (선택)</span><input id="fGu" class="f-inp" placeholder="예: 용인시 처인구" value="' + esc(pv ? pv.gu : "") + '" autocomplete="off"></label><button type="button" class="f-btn" data-act="f-sdgo"' + (pv && pv.sido ? "" : " disabled") + ">다음</button></div>";
    if (st.type === "contact") h = '<form class="f-in2 f-ct" id="fCt" novalidate><label><span>이름</span><input name="nm" class="f-inp" autocomplete="name" value="' + esc(pv ? pv.name : "") + '"></label><label><span>휴대폰</span><input name="ph" class="f-inp" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000" value="' + esc(pv ? pv.phone : "") + '"></label><button type="submit" class="f-btn">보내기</button><p class="f-err" id="fErr" role="alert"></p></form>';
    ans.innerHTML = '<div class="f-ans-in"><p class="f-ans-l">' + esc(st.label) + (st.type === "multi" ? " · 여러 개 선택" : "") + "</p>" + h + "</div>";
    pop(ans.firstElementChild, true);
    if (st.type === "sido" && pv && pv.sido) chat.sel = pv.sido; else chat.sel = null;
    if (st.type === "multi") chat.multi = (pv || []).slice();
  }
  function answer(v) {
    var st = chat.ST[chat.k], log = document.getElementById("fLog");
    chat.ans[st.id] = v;
    chat.prev[st.id] = v;
    log.insertAdjacentHTML("beforeend", myBub(st, chat.k, v));
    pop(log.lastElementChild, false, true);
    chat.k++;
    ask(false);
  }
  function rebuild() {
    var log = document.getElementById("fLog"), h = mBub(esc(intro(chat.T)), "도아 담당 매니저");
    for (var k = 0; k < chat.k; k++) { var st = chat.ST[k]; h += mBub(esc(st.q)) + myBub(st, k, chat.ans[st.id]); }
    log.innerHTML = h;
  }
  function summary() {
    chat.done = true;
    prog();
    typing(function () {
      var log = document.getElementById("fLog");
      var rows = chat.ST.map(function (st) { return "<tr><th>" + esc(st.label) + "</th><td>" + esc(ansText(st, chat.ans[st.id])) + "</td></tr>"; }).join("");
      log.insertAdjacentHTML("beforeend", mBub("고르신 내용을 정리했어요. 맞으면 연결 요청을 보내 주세요. 고칠 것은 위의 내 답을 누르면 다시 고를 수 있습니다."));
      log.insertAdjacentHTML("beforeend", '<div class="f-sumc"><p class="f-kind">상담 신청서</p><b>' + esc(chat.T.name) + '</b><table class="f-tb">' + rows + "</table></div>");
      pop(log.children[log.children.length - 2]);
      pop(log.lastElementChild);
      document.getElementById("fAns").innerHTML = '<div class="f-ans-in f-fin"><button type="button" class="f-btn xl" data-act="f-send">이대로 연결 요청</button><button type="button" class="f-btn line xl" data-act="f-reset">처음부터 다시</button></div>';
      scrollEnd();
    });
  }
  function send() {
    var rows = chat.ST.map(function (st) { return [st.label, ansText(st, chat.ans[st.id])]; });
    var a = {};
    chat.ST.forEach(function (st) { a[st.id] = chat.ans[st.id]; });
    var list = A.keep("requests") || [];
    var req = { id: "rq" + Date.now(), to: chat.to, kind: chat.T.kind, title: chat.T.name, label: chat.T.label, answers: a, rows: rows, at: new Date().toISOString() };
    list.unshift(req);
    A.keep("requests", list);
    chat.sent = true;
    prog();
    document.getElementById("fAns").innerHTML = "";
    var no = "D-" + req.id.slice(-6), ct = chat.ans.contact || {};
    typing(function () {
      var log = document.getElementById("fLog");
      log.insertAdjacentHTML("beforeend", mBub("<b>연결 요청을 받았습니다.</b> 담당 매니저가 신청서를 확인한 뒤 " + esc(ct.phone || "남기신 번호") + "로 연락드립니다.", "도아 담당 매니저"));
      log.insertAdjacentHTML("beforeend", '<div class="f-done"><p class="f-kind">연결 요청 완료</p><b>' + esc(chat.T.name) + '</b><table class="f-tb"><tr><th>접수 번호</th><td>' + no + "</td></tr><tr><th>지금 단계</th><td>담당 매니저 확인 중</td></tr><tr><th>다음 단계</th><td>담당 매니저 전화 → " + (chat.T.kind === "pm" || chat.T.kind === "finance" ? "도아 담당 상담" : "업체·전문가 상담 일정") + "</td></tr><tr><th>진행 보기</th><td>견적서 받기 화면에 이 요청이 올라갑니다</td></tr></table></div>");
      pop(log.children[log.children.length - 2]);
      pop(log.lastElementChild);
      log.querySelectorAll('[data-act="f-redo"]').forEach(function (b) { b.disabled = true; });
      document.getElementById("fAns").innerHTML = '<div class="f-ans-in f-fin"><a class="f-btn xl" href="#/quote">견적서 받기에서 보기</a><a class="f-btn line xl" href="' + (chat.T.kind === "expert" ? "#/experts" : "#/companies") + '">다른 ' + (chat.T.kind === "expert" ? "전문가" : "업체") + " 더 보기</a></div>";
      pop(document.getElementById("fAns").firstElementChild, true);
      scrollEnd();
    });
  }
  function pop(el, up, mine) {
    if (!el || !BG.mo.able()) return;
    el.animate([{ opacity: 0, transform: "translate(" + (mine ? 12 : 0) + "px," + (up ? 14 : mine ? 0 : 10) + "px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
  }
  function scrollEnd() {
    var log = document.getElementById("fLog"), ans = document.getElementById("fAns");
    if (!log || !log.lastElementChild) return;
    requestAnimationFrame(function () {
      var last = log.lastElementChild.getBoundingClientRect(), room = window.innerHeight - (ans ? ans.offsetHeight : 0) - 20;
      if (last.bottom > room) window.scrollTo({ top: window.scrollY + last.bottom - room, behavior: BG.reduced() ? "auto" : "smooth" });
    });
  }

  function afterRender() {
    document.querySelectorAll(".f-map").forEach(bindMap);
    var tb = document.querySelector(".f-ptab");
    if (tb && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          tb.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === e.target.id); });
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      document.querySelectorAll(".f-ps").forEach(function (s) { io.observe(s); });
    }
  }
  function bindMap(map) {
    var tip = map.querySelector(".f-tip");
    map.onmousemove = function (ev) {
      var p = ev.target.closest ? ev.target.closest("path[data-sd]") : null;
      if (!p || !CUR || !CUR.t) { tip.hidden = true; return; }
      var n = p.getAttribute("data-sd"), c = CUR.t[n], b = map.getBoundingClientRect();
      tip.innerHTML = "<b>" + n + "</b>" + (CUR.name === "companies" ? "업체 " + c.co + "곳" : CUR.name === "experts" ? "전문가 " + c.ex + "명" : "업체 " + c.co + " · 전문가 " + c.ex);
      tip.hidden = false;
      tip.style.left = Math.min(ev.clientX - b.left + 14, b.width - tip.offsetWidth) + "px";
      tip.style.top = Math.max(0, ev.clientY - b.top - 44) + "px";
    };
    map.onmouseleave = function () { tip.hidden = true; };
    map.onclick = function (ev) {
      var p = ev.target.closest ? ev.target.closest("path[data-sd]") : null;
      if (p) setSido(p.getAttribute("data-sd"));
    };
  }
  function wide() { return window.matchMedia("(min-width: 861px)").matches; }
  function fresh(name) { if (!CUR || CUR.name !== name) rgOpen = false; }
  function setSido(v) {
    if (!CUR) return;
    var q = {};
    for (var k in CUR.query) q[k] = CUR.query[k];
    q.sido = CUR.query.sido === v && v ? "" : v;
    rgOpen = wide();
    keepY = window.scrollY;
    document.body.classList.remove("lock", "f-sheet");
    location.hash = link(CUR.name, q);
  }
  function openRg(on) {
    var p = document.getElementById("fRg"), b = document.querySelector('[data-act="f-rg"]');
    if (!p) return;
    rgOpen = on;
    p.classList.toggle("open", on);
    if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
    var sheet = on && !wide();
    document.body.classList.toggle("lock", sheet);
    document.body.classList.toggle("f-sheet", sheet);
    if (on && BG.mo.able()) {
      var inn = p.querySelector(".f-rg-in");
      if (sheet) inn.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.1,1)" });
      else inn.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 520, easing: "cubic-bezier(.2,.7,.1,1)" });
    }
    if (on && !sheet) {
      var rb = p.getBoundingClientRect().bottom;
      if (rb > window.innerHeight) window.scrollTo({ top: window.scrollY + Math.min(rb - window.innerHeight + 24, p.getBoundingClientRect().top - 200), behavior: BG.reduced() ? "auto" : "smooth" });
    }
  }
  function notice(name) {
    if (A.notice) A.notice(name); else BG.toast("대표번호 1588-9863");
  }
  function jump(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var tb = document.querySelector(".f-ptab"), off = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hdh"), 10) || 80) + (tb ? tb.offsetHeight : 0) + 8;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: BG.reduced() ? "auto" : "smooth" });
  }
  function vid(btn) {
    var v = btn.parentNode.querySelector("video");
    if (!v) return;
    if (v.paused) { v.play().catch(function () {}); btn.innerHTML = FI.pause; btn.setAttribute("aria-label", "현장 영상 멈춤"); btn.classList.add("on"); }
    else { v.pause(); btn.innerHTML = FI.play; btn.setAttribute("aria-label", "현장 영상 재생"); btn.classList.remove("on"); }
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (!a) return;
    var act = a.dataset.act;
    if (act.indexOf("f-") !== 0) return;
    if (act === "f-rg") openRg(!rgOpen);
    if (act === "f-rg-x") openRg(false);
    if (act === "f-sd") setSido(a.dataset.v);
    if (act === "f-tel") notice("전화 걸기");
    if (act === "f-page") pageMore(a.dataset.k);
    if (act === "f-jump") jump(a.dataset.v);
    if (act === "f-vid") vid(a);
    if (act === "f-rvm") notice("리뷰 전체 보기");
    if (!chat) return;
    if (act === "f-one") answer(a.dataset.v);
    if (act === "f-tg") {
      var v = a.dataset.v, i = chat.multi.indexOf(v);
      if (i >= 0) chat.multi.splice(i, 1); else chat.multi.push(v);
      a.classList.toggle("on", i < 0);
      a.setAttribute("aria-pressed", i < 0);
      var nb = document.querySelector('[data-act="f-multi"]');
      nb.disabled = !chat.multi.length;
      nb.textContent = "다음" + (chat.multi.length ? " (" + chat.multi.length + "개)" : "");
    }
    if (act === "f-multi" && chat.multi.length) answer(chat.ST[chat.k].opts.filter(function (o) { return chat.multi.indexOf(o) >= 0; }));
    if (act === "f-sdo") {
      chat.sel = a.dataset.v;
      document.querySelectorAll('[data-act="f-sdo"]').forEach(function (b) { var on = b === a; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      document.querySelector('[data-act="f-sdgo"]').disabled = false;
    }
    if (act === "f-sdgo" && chat.sel) answer({ sido: chat.sel, gu: (document.getElementById("fGu").value || "").trim() });
    if (act === "f-redo" && !chat.sent) {
      chat.tok = {};
      chat.k = +a.dataset.k;
      chat.done = false;
      chat.ST.slice(chat.k).forEach(function (st) { delete chat.ans[st.id]; });
      rebuild();
      prog();
      var st = chat.ST[chat.k], log = document.getElementById("fLog");
      log.insertAdjacentHTML("beforeend", mBub(nw(st.q) + (st.type === "multi" ? '<span class="f-hint">여러 개 고를 수 있어요</span>' : "")));
      ansUi(st);
      scrollEnd();
    }
    if (act === "f-send" && !chat.sent) send();
    if (act === "f-reset") { chat.k = 0; chat.ans = {}; chat.done = false; chat.tok = {}; rebuild(); ask(false); }
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target;
    if (f.id === "fCt") {
      ev.preventDefault();
      var nm = f.nm.value.trim(), ph = f.ph.value.replace(/\D/g, ""), miss = [];
      if (!nm) miss.push("이름");
      if (!/^01\d{8,9}$/.test(ph)) miss.push("휴대폰 번호");
      if (miss.length) { document.getElementById("fErr").textContent = "확인해 주세요 — " + miss.join(", "); return; }
      answer({ name: nm, phone: ph.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3") });
      return;
    }
    if (!f.classList || !f.classList.contains("f-sbar")) return;
    ev.preventDefault();
    var o = {};
    [].forEach.call(f.elements, function (el) { if (el.name && el.value.trim()) o[el.name] = el.value.trim(); });
    location.hash = link(f.dataset.f, o);
  });
  document.addEventListener("focusin", function (ev) {
    var t = ev.target;
    if (!t.closest || !t.closest("#fAns") || t.tagName !== "INPUT") return;
    setTimeout(function () { if (document.activeElement === t) t.scrollIntoView({ block: "center", behavior: "smooth" }); }, 320);
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && rgOpen) openRg(false);
    if (ev.key === "Enter" && ev.target.id === "fGu" && chat && chat.sel) { ev.preventDefault(); answer({ sido: chat.sel, gu: ev.target.value.trim() }); }
  });

  if (!window.FMAP) {
    var sc = document.createElement("script");
    sc.src = "find-map.js?v=1";
    sc.onload = function () {
      if (!CUR || !CUR.t) return;
      document.querySelectorAll(".f-map").forEach(function (m) { m.innerHTML = mapSvg(CUR.t, CUR.query.sido || "") + '<div class="f-tip" hidden></div>'; bindMap(m); });
    };
    document.head.appendChild(sc);
  }

  A.views.search = search;
  A.views.companies = companies;
  A.views.company = company;
  A.views.experts = experts;
  A.views.expert = expert;
  A.views.match = match;
  A.findData = { sido: SIDO, cat: CAT, coFind: coFind, exFind: exFind };

  A.motion.push(
    [".f-hd .f-h1", "up", { y: 16, dur: 700 }],
    [".f-hd .f-sub, .f-hd .f-sbar", "up", { y: 12, stagger: 80, delay: 120 }],
    [".f-row", "up", { y: 18, stagger: 60, max: 6 }],
    [".f-mt", "up", { y: 14, stagger: 50, max: 8 }],
    [".f-cover", "wipe", { dur: 1100 }],
    [".f-pf-hd .f-h1, .f-pf-hd .f-lead, .f-pf-hd .f-st", "up", { y: 14, stagger: 80, delay: 200 }],
    [".f-req-in", "up", { y: 18, delay: 260 }],
    [".f-ps h2", "up", { y: 12 }],
    [".f-gal figure", "wipe", { stagger: 110, dur: 1000 }],
    [".f-rvl li", "up", { y: 14, stagger: 70 }],
    [".f-svl li", "up", { y: 12, stagger: 50 }],
    [".f-svc-p", "wipe", { dur: 1100 }]
  );
  A.after.push(function (r) {
    document.body.classList.toggle("f-chat-on", r.name === "match");
    document.body.classList.toggle("f-on", ["search", "companies", "company", "experts", "expert", "match"].indexOf(r.name) >= 0);
    if (document.body.classList.contains("f-sheet")) document.body.classList.remove("f-sheet", "lock");
    if (["search", "companies", "experts"].indexOf(r.name) < 0) rgOpen = false;
    if (r.name !== "match") chat = null;
    if (r.name === "match" && chat) document.querySelectorAll("[data-nav]").forEach(function (n) { n.classList.toggle("on", n.dataset.nav === chat.T.nav); });
    if (r.name === "search") document.querySelectorAll("[data-nav]").forEach(function (n) { n.classList.remove("on"); });
    if (keepY != null) { var y = keepY; keepY = null; setTimeout(function () { window.scrollTo(0, y); }, 0); }
  });
})();
