(function () {
  var SIDO = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  var GROUP = { "서울": "서울", "경기": "경기", "인천": "인천", "강원": "강원", "대전": "충청", "세종": "충청", "충북": "충청", "충남": "충청", "부산": "영남", "대구": "영남", "울산": "영남", "경북": "영남", "경남": "영남", "광주": "호남", "전북": "호남", "전남": "호남", "제주": "제주" };
  var TOWN = {
    "서울": ["강동구", "송파구", "마포구", "성북구", "노원구", "은평구", "관악구", "영등포구"],
    "부산": ["해운대구", "수영구", "사하구", "동래구", "부산진구", "연제구"],
    "대구": ["달서구", "수성구", "북구", "동구", "중구"],
    "인천": ["남동구", "서구", "미추홀구", "부평구", "연수구", "계양구"],
    "광주": ["광산구", "북구", "서구", "남구"],
    "대전": ["유성구", "서구", "중구", "대덕구"],
    "울산": ["남구", "중구", "북구", "울주군"],
    "세종": ["나성동", "조치원읍", "보람동", "소담동"],
    "경기": ["성남시", "수원시", "고양시", "용인시", "화성시", "평택시", "김포시", "파주시"],
    "강원": ["춘천시", "원주시", "강릉시", "속초시", "홍천군"],
    "충북": ["청주시", "충주시", "제천시", "진천군"],
    "충남": ["천안시", "아산시", "당진시", "서산시", "공주시"],
    "전북": ["전주시", "익산시", "군산시", "완주군"],
    "전남": ["순천시", "여수시", "목포시", "광양시", "나주시"],
    "경북": ["포항시", "구미시", "경주시", "안동시", "경산시"],
    "경남": ["창원시", "김해시", "진주시", "양산시", "거제시"],
    "제주": ["제주시", "서귀포시"]
  };
  var STEM = {
    "서울": ["한강", "남산", "북악", "인왕", "청계", "낙산", "우면", "관악"],
    "부산": ["해운", "동백", "금정", "낙동", "오륙", "영도", "황령", "다대"],
    "대구": ["달구벌", "팔공", "금호", "앞산", "비슬", "신천", "와룡", "동촌", "두류"],
    "인천": ["송도", "월미", "소래", "계양", "마니", "청라", "문학", "영종"],
    "광주": ["무등", "영산", "서석", "운암", "첨단", "상무", "양림", "풍암"],
    "대전": ["한밭", "계룡", "보문", "갑천", "대청", "둔산", "식장", "유등"],
    "울산": ["문수", "처용", "무룡", "선암", "장생", "솔마루", "신불", "대왕", "간월"],
    "세종": ["금강", "한솔", "원수", "전월", "새롬", "다정", "고운", "도담"],
    "경기": ["광교", "수리", "소요", "칠보", "한탄", "용문", "검단", "명지"],
    "강원": ["설악", "소양", "치악", "삼악", "오대", "경포", "봉의", "의암"],
    "충북": ["속리", "청풍", "미호", "월악", "명암", "상당", "우암", "탄금", "초정"],
    "충남": ["온양", "칠갑", "덕숭", "백제", "삽교", "서령", "광덕", "태조"],
    "전북": ["모악", "덕유", "만경", "새만금", "변산", "완산", "기린", "운장", "대둔"],
    "전남": ["월출", "다도", "섬진", "백운", "천관", "금성", "유달", "조계"],
    "경북": ["금오", "토함", "주왕", "형산", "영일", "하회", "비학", "운문"],
    "경남": ["지리", "남강", "무학", "합포", "용지", "금관", "봉림", "정병", "황매"],
    "제주": ["한라", "성산", "용두", "삼다", "오름", "협재", "사려니", "새별"]
  };
  var SUR = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "전", "홍", "유", "고", "문", "양", "손", "배", "백", "허", "남", "심", "노", "하", "곽", "성", "차", "주", "우", "민", "진", "나"];
  var GIV = ["민준", "서연", "도윤", "지우", "하준", "서윤", "시우", "하은", "준서", "지민", "현우", "수아", "건우", "예린", "우진", "채원", "선우", "지안", "승현", "다은", "재원", "소윤", "태윤", "유진", "정훈", "수빈", "동현", "은지", "상훈", "미경", "영호", "성민", "경수", "혜진", "진우", "보람", "형석", "지훈", "명수", "은영", "재혁", "윤서", "주원", "하린", "준혁", "나연", "시현", "예준", "태민", "가은"];

  var CSLOT = {
    dv: { type: "dv", cat: "dev", works: ["devp", "lh"], suf: ["디앤씨", "도시개발", "주택개발", "프로퍼티", "디벨롭먼트"], lic: ["부동산개발업 등록"], since: [2009, 12], count: [3, 9],
      intro: ["{S} 지역 LH 매입약정 공동주택을 부지 검토부터 준공 후 매입까지 시행합니다.", "토지주와 함께 사업성 검토부터 LH 매입약정 신청, 준공까지 {S}에서 진행합니다.", "{S} 지역 매입약정 다세대·도시형 생활주택을 시행하고 PF 구조를 함께 검토합니다."],
      pj: [["{T1} 매입약정 다세대 시행 ({N}세대)", ["n_aerial", "hero_kr", "n_dusk", "n_night"]], ["{T2} 토지주 공동 사업 시행", ["site_aerial", "n_wide", "hero_rise", "n_crane"]], ["{T3} 매입약정 도시형 생활주택 시행", ["hero_night", "n_crew", "hero_cranes", "n_plan"]]] },
    gc: { type: "gc", works: ["rc", "civil", "steel"], suf: ["종합건설", "건설", "토건", "건설산업"], lic: ["건축공사업"], since: [1995, 20], count: [25, 40],
      intro: ["{S} 지역 공동주택과 근린생활시설 신축을 맡습니다.", "{S}에서 다세대·오피스텔 신축을 착공부터 준공까지 맡습니다.", "{S} 지역 LH 매입약정 다세대 신축을 시공합니다."],
      pj: [["{T1} 공동주택 신축 (지상 {F}층)", ["n_aptv", "hero_dusk", "hero_rise"]], ["{T2} 근린생활시설 신축", ["frame_work", "n_crane", "n_crew"]], ["{T3} 오피스텔 골조 공사", ["n_slab", "n_slab2", "concrete2"]]] },
    de: { type: "de", works: ["design"], suf: ["건축사사무소"], lic: ["건축사사무소 개설"], since: [2003, 17], count: [15, 30],
      intro: ["{S} 지역 다세대·근린생활시설 설계와 인허가, 공사 감리를 합니다.", "매입약정 다세대 설계와 인허가를 {S} 현장 중심으로 맡습니다."],
      pj: [["{T1} 다세대 설계", ["w_blueprint", "w_model"]], ["{T2} 근린생활시설 인허가", ["n_plan", "w_draft"]], ["{T3} 상가 감리", ["w_review", "n_draft"]]] },
    fin: { type: "sc", works: ["interior", "window", "stone", "water"], suf: ["실내건축", "인테리어", "마감건설"], lic: ["실내건축공사업", "도장·습식·방수·석공사업", "금속창호·지붕건축물조립공사업"], since: [2000, 20], count: [30, 40],
      intro: ["{S} 지역 실내 마감과 창호, 방수·타일 공사를 한 팀으로 시공합니다.", "상가·숙박시설 리모델링과 공동주택 실내 마감을 {S}에서 시공합니다."],
      pj: [["{T1} 상가 리모델링", ["pf_interior", "pf_drywall", "pf_wood"]], ["{T2} 공동주택 시스템창호", ["hero_glass", "n_glassbox", "facade"]], ["{T3} 근린생활시설 방수·타일 공사", ["mt_tile", "pf_water", "pf_bath"]]] },
    mep: { type: "sc", works: ["mech", "elec"], suf: ["설비", "기전", "설비전기"], lic: ["기계설비·가스공사업", "전기공사업"], since: [2000, 20], count: [30, 40],
      intro: ["{S} 지역 냉난방·급배수 설비와 전기·통신 공사를 함께 맡습니다.", "공장·업무시설 기계설비와 수변전 설비를 {S}에서 시공합니다."],
      pj: [["{T1} 업무시설 기계설비", ["pf_pipework", "mt_pipes"]], ["{T2} 공동주택 수변전 설비", ["pf_mep", "w_measure"]], ["{T3} 상가 냉난방 교체", ["mt_tube", "n_hall"]]] },
    land: { type: "sc", works: ["land"], suf: ["조경", "조경건설", "그린"], lic: ["조경식재·시설물공사업"], since: [2002, 18], count: [20, 35],
      intro: ["{S} 지역 공동주택 조경 식재와 외부 시설물 공사를 합니다.", "단지 조경과 옥상 정원, 산책로 시설물을 {S}에서 시공합니다."],
      pj: [["{T1} 공동주택 조경 식재", ["pf_garden"]], ["{T2} 근린생활시설 외부 조경", ["pf_house"]], ["{T3} 단지 산책로 시설물", ["pf_villa"]]] },
    ma: { type: "su", works: ["rc", "steel"], suf: ["건자재", "철강유통", "자재유통"], lic: ["건설자재 도소매"], since: [1997, 22], count: [180, 400], mat: true,
      intro: ["철근·형강·시멘트와 거푸집 합판을 {S} 현장에 바로 보냅니다.", "골조 자재(철근·형강·레미콘·합판)를 {S} 현장 일정에 맞춰 납품합니다."],
      pj: [["철근·형강 현장 직송", ["mt_rebar", "n_steel", "mt_hbeam"]], ["시멘트·벽돌·블록 재고", ["mt_cement", "mt_brick"]], ["{T1} 자재 야적장", ["mt_warehouse", "n_hall"]]] },
    mb: { type: "su", works: ["stone", "interior", "mech", "water"], suf: ["마감자재", "건재", "자재"], lic: ["건설자재 도소매"], since: [1997, 22], count: [180, 400], mat: true,
      intro: ["타일·석재·석고보드·단열재와 배관 자재를 {S} 현장에 공급합니다.", "마감 자재(타일·석재·보드·도료·방수재)를 견본 확인 후 {S} 현장으로 납품합니다."],
      pj: [["포세린 타일·화강석 재고", ["mt_tile", "mt_marble"]], ["석고보드·단열재 현장 직송", ["pf_drywall", "mt_warehouse"]], ["배관·방수재·도료 납품", ["mt_pipes", "mt_pipe", "mt_tube"]]] }
  };
  var XSLOT = {
    design: { works: ["design"], title: ["건축사", "건축사 · 감리", "건축사 · PM"],
      intro: ["{S} 지역 다세대·근린생활시설 설계와 인허가를 맡습니다.", "매입약정 다세대 설계부터 착공 신고까지 인허가를 맡습니다.", "공동주택·오피스텔 설계와 공사 감리를 합니다."],
      pj: ["{T1} 다세대 설계", "{T2} 근린생활시설 인허가", "{T3} 오피스텔 감리"] },
    build: { works: ["rc", "civil", "steel"], title: ["건축시공기술사", "건축시공기술사 · PM"],
      intro: ["공동주택 골조 공정과 품질 관리를 맡아 왔습니다.", "{S} 지역 신축 현장의 공정·원가 관리를 맡습니다."],
      pj: ["{T1} 공동주택 공정 관리", "{T2} 오피스텔 시공 계획", "{T3} 근린생활시설 품질 관리"] },
    mep: { works: ["mech", "elec"], title: ["건축설비기사 · 전기기사"],
      intro: ["냉난방·급배수와 수변전 설비 시공 관리를 맡습니다.", "{S} 지역 업무시설·공동주택 설비와 전기 공사를 관리합니다."],
      pj: ["{T1} 업무시설 설비 감리", "{T2} 공동주택 수변전 설비", "{T3} 상가 냉난방 교체"] },
    fin: { works: ["interior", "window"], title: ["실내건축기사"],
      intro: ["실내 마감과 창호 공사를 실측부터 준공까지 관리합니다.", "{S} 지역 상가·숙박시설 실내 공사를 관리합니다."],
      pj: ["{T1} 숙박시설 실내 공사", "{T2} 공동주택 시스템창호", "{T3} 근린생활시설 실내 마감"] },
    wet: { works: ["water", "stone"], title: ["방수기능장 · 타일기능사"],
      intro: ["옥상·지하 방수와 외장 석재·타일 공사를 관리합니다.", "{S} 지역 공동주택 방수와 석공·타일 공사를 관리합니다."],
      pj: ["{T1} 공동주택 옥상 방수", "{T2} 업무시설 외장 석재", "{T3} 상가 바닥 타일"] },
    land: { works: ["land"], title: ["조경기사"],
      intro: ["공동주택 조경 식재와 외부 시설물 공사를 관리합니다.", "{S} 지역 단지 조경과 옥상 정원 공사를 관리합니다."],
      pj: ["{T1} 공동주택 조경 식재", "{T2} 근린생활시설 외부 조경", "{T3} 단지 산책로 시설물"] }
  };

  var ALIAS = {
    "시공사": ["시공"], "시공업체": ["시공"], "건설사": ["시공", "종합건설"], "건설회사": ["시공", "종합건설"], "건설업체": ["시공", "종합건설"], "종합건설사": ["종합건설"],
    "시행사": ["시행", "개발"], "시행업체": ["시행", "개발"], "디벨로퍼": ["개발", "시행"], "개발사": ["개발", "시행"],
    "설계사무소": ["건축사사무소", "설계"], "설계사": ["설계", "건축사"], "건축가": ["건축사"], "건축설계": ["설계"],
    "인테리어": ["실내"], "리모델링": ["리모델링", "실내"], "도배": ["실내"], "마감": ["마감", "실내"],
    "엘리베이터": ["승강기", "설비"], "승강기": ["설비"], "보일러": ["냉난방", "설비"], "에어컨": ["냉난방", "설비"], "냉난방": ["냉난방", "설비"],
    "배관": ["배관", "설비"], "소방": ["소방", "설비"], "가스": ["가스", "설비"], "수도": ["급배수", "설비"],
    "cctv": ["통신", "전기"], "통신": ["통신", "전기"], "조명": ["조명", "전기"],
    "페인트": ["도장", "도료"], "도색": ["도장", "도료"], "레미콘": ["레미콘", "콘크리트", "시멘트"], "콘크리트": ["콘크리트", "골조"],
    "골조": ["골조", "철근"], "목수": ["목재", "합판", "거푸집"], "목재": ["목재", "합판"], "용접": ["철골", "철강"], "철물": ["철강", "철골"], "철강": ["철강", "형강", "철근"],
    "아파트": ["공동주택"], "빌라": ["다세대"], "원룸": ["도시형", "다세대"], "다가구": ["다세대"], "집": ["주택"],
    "상가": ["상가", "근린생활"], "건물": ["신축"], "창고": ["창고", "물류"],
    "토지": ["토지", "부지"], "땅": ["토지", "부지"], "부지": ["부지", "토지"],
    "대출": ["pf", "자금"], "자금": ["pf", "자금"], "투자": ["pf", "자금"], "금융": ["pf", "자금"], "분양": ["분양", "매입"],
    "pm": ["pm", "관리", "공정"], "사업관리": ["관리", "pm"],
    "lh": ["lh", "매입약정"], "매입": ["매입약정"], "임대": ["매입약정"],
    "전문가": ["기술사", "건축사", "기사", "기능장"], "기술자": ["기술사", "기사"], "현장소장": ["현장소장", "기사"],
    "건자재": ["자재"], "단열재": ["단열"], "석고보드": ["보드"], "석재": ["석재", "석공"], "유리": ["유리", "창호"], "샷시": ["창호"], "샤시": ["창호"], "새시": ["창호"]
  };
  var PROV = { "강원도": "강원", "강원특별자치도": "강원", "경기도": "경기", "충청북도": "충북", "충청남도": "충남", "전라북도": "전북", "전북특별자치도": "전북", "전라남도": "전남", "경상북도": "경북", "경상남도": "경남", "제주도": "제주", "제주특별자치도": "제주", "서울시": "서울", "서울특별시": "서울", "부산시": "부산", "부산광역시": "부산", "대구시": "대구", "대구광역시": "대구", "인천시": "인천", "인천광역시": "인천", "광주광역시": "광주", "대전시": "대전", "대전광역시": "대전", "울산시": "울산", "울산광역시": "울산", "세종시": "세종", "세종특별자치시": "세종" };
  var STRIP = ["업체", "회사", "전문가", "찾기", "구매", "견적", "공사", "시공", "자재", "사무소", "사", "업"];
  var SPARE = 3;

  function hsh(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 10007; return h; }
  function at(list, n) { return list[n % list.length]; }
  function towns(sd, h) { var t = TOWN[sd]; return [at(t, h), at(t, h + 1), at(t, h + 2)]; }
  function put(tpl, sd, tw, h) { return tpl.replace(/\{S\}/g, sd).replace(/\{T1\}/g, tw[0]).replace(/\{T2\}/g, tw[1]).replace(/\{T3\}/g, tw[2]).replace(/\{N\}/g, 24 + h % 30).replace(/\{F\}/g, 7 + h % 12); }

  function grow(D, city) {
    var CO = window.BG.CO, EX = window.BG.EX, used = {}, stems = {}, nc = 0, nx = 0;
    D.companies.forEach(function (c) { used[c.name] = 1; nc = Math.max(nc, parseInt(String(c.id).slice(1), 10) || 0); });
    D.experts.forEach(function (x) { used[x.name] = 1; nx = Math.max(nx, parseInt(String(x.id).slice(1), 10) || 0); });
    function sidoOf(o) { return o.sido || (city && city[o.city]) || o.region; }
    function catOf(c) { return c.cat || (c.type === "su" ? "mat" : c.type === "dv" ? "dev" : "build"); }
    function coName(sd, h, suf) {
      var st = STEM[sd], use = stems[sd] || (stems[sd] = {});
      for (var r = 0; r < 4; r++) {
        for (var i = 0; i < st.length; i++) {
          var stem = at(st, h + i);
          if ((use[stem] || 0) !== r) continue;
          for (var j = 0; j < suf.length; j++) {
            var n = stem + at(suf, h + j);
            if (!used[n]) { used[n] = 1; use[stem] = r + 1; return n; }
          }
        }
      }
      var k = 2;
      while (used[st[0] + suf[0] + k]) k++;
      used[st[0] + suf[0] + k] = 1;
      return st[0] + suf[0] + k;
    }
    function person(h) {
      for (var i = 0; i < SUR.length * GIV.length; i++) {
        var n = at(SUR, h + i * 7) + at(GIV, h * 3 + i * 13);
        if (!used[n]) { used[n] = 1; return n; }
      }
      return at(SUR, h) + at(GIV, h);
    }
    function makeCo(s, sd, k) {
      var T = CSLOT[s], h = hsh(sd + s + k), tw = towns(sd, h);
      nc++;
      var c = {
        id: "c" + nc, name: coName(sd, h, T.suf), type: T.type, region: GROUP[sd], sido: sd, city: tw[0],
        since: T.since[0] + h % T.since[1], count: T.count[0] + h % T.count[1], licenses: T.lic.slice(), works: T.works.slice(),
        intro: put(at(T.intro, h), sd, tw, h),
        projects: T.pj.map(function (p, i) { return { t: put(p[0], sd, tw, h), y: T.mat ? 2025 : 2025 - i, ph: at(p[1], h + i), d: "" }; }),
        checks: T.type === "su" ? ["사업자"] : h % 4 === 0 ? ["면허", "사업자"] : ["면허", "사업자", "보험"]
      };
      if (T.cat) c.cat = T.cat;
      if (T.type === "dv") { var n = 2 + h % 5, j = 1 + h % (n - 1); c.lh = "LH 매입약정 체결 " + n + "건 · 그중 " + j + "건 준공 후 매입 완료"; }
      return c;
    }
    function makeEx(s, sd) {
      var T = XSLOT[s], h = hsh(sd + s), tw = towns(sd, h);
      var co = h % 3 === 0 ? D.companies.filter(function (c) { return sidoOf(c) === sd && catOf(c) === "build" && c.works.some(function (w) { return T.works.indexOf(w) >= 0; }); })[0] : null;
      nx++;
      return {
        id: "x" + nx, name: person(h), title: at(T.title, h), years: 7 + h % 9, region: GROUP[sd], sido: sd, works: T.works.slice(),
        affil: co ? co.name : "개인", intro: put(at(T.intro, h), sd, tw, h), projects: T.pj.map(function (p) { return put(p, sd, tw, h); })
      };
    }
    SIDO.forEach(function (sd) {
      var here = D.companies.filter(function (c) { return sidoOf(c) === sd; }), types = {}, has = {}, mat = {}, mats = 0, plan = [];
      here.forEach(function (c) {
        types[c.type] = (types[c.type] || 0) + 1;
        if (catOf(c) === "build") c.works.forEach(function (w) { has[w] = 1; });
        if (catOf(c) === "mat") { mats++; c.works.forEach(function (w) { mat[w] = 1; }); }
      });
      for (var k = types.dv || 0; k < 2; k++) plan.push("dv");
      if (!types.gc) plan.push("gc");
      if (!types.de) plan.push("de");
      ["fin", "mep", "land"].forEach(function (s) { if (CSLOT[s].works.some(function (w) { return !has[w]; })) plan.push(s); });
      var needA = !(mat.rc || mat.steel), needB = !(mat.stone || mat.interior || mat.mech || mat.water);
      if (mats + (needA ? 1 : 0) + (needB ? 1 : 0) < 2) { if (!needB) needB = true; else needA = true; }
      if (needA) plan.push("ma");
      if (needB) plan.push("mb");
      plan.forEach(function (s, i) { var c = makeCo(s, sd, i); D.companies.push(c); CO[c.id] = c; });
    });
    SIDO.forEach(function (sd) {
      var here = D.experts.filter(function (x) { return sidoOf(x) === sd; }), has = {};
      here.forEach(function (x) { x.works.forEach(function (w) { has[w] = 1; }); });
      var arch = here.some(function (x) { return /건축사/.test(x.title); }), pm = here.some(function (x) { return /PM|시공기술사|도시계획/.test(x.title); });
      Object.keys(XSLOT).forEach(function (s) {
        var need = XSLOT[s].works.some(function (w) { return !has[w]; }) || (s === "design" && !arch) || (s === "build" && !pm);
        if (!need) return;
        var x = makeEx(s, sd);
        D.experts.push(x);
        EX[x.id] = x;
      });
    });
  }

  function words(q) { return String(q || "").trim().toLowerCase().split(/\s+/).filter(Boolean); }
  function forms(w) {
    var out = (ALIAS[w] || []).slice();
    if (PROV[w]) out.push(PROV[w]);
    STRIP.forEach(function (s) { if (w.length > s.length + 1 && w.slice(-s.length) === s) out.push(w.slice(0, -s.length)); });
    return out.filter(function (f) { return f && f !== w; });
  }
  function probe(t) { if (!/^[a-z0-9]+$/.test(t)) return function (h) { return h.indexOf(t) >= 0; }; var re = new RegExp("(^|[^a-z0-9])" + t + "([^a-z0-9]|$)"); return function (h) { return re.test(h); }; }
  function prep(q) { return words(q).map(function (w) { return { w: probe(w), f: forms(w).map(probe) }; }); }
  function score(hay, ps) {
    var h = String(hay).toLowerCase(), s = 0;
    ps.forEach(function (p) {
      if (p.w(h)) s += 2;
      else if (p.f.some(function (f) { return f(h); })) s += 1;
    });
    return s;
  }
  function rank(list, q, hay) {
    var ps = prep(q), top = {}, spare = {};
    if (!ps.length) { list.forEach(function (x) { x.rel = 0; }); return list; }
    list.forEach(function (x) { var k = x.sido || ""; x.rel = score(hay(x), ps); if (x.rel > (top[k] || 0)) top[k] = x.rel; });
    return list.filter(function (x) {
      var k = x.sido || "", t = top[k];
      if (t) return x.rel === t;
      spare[k] = (spare[k] || 0) + 1;
      return spare[k] <= SPARE;
    });
  }

  window.BGFILL = { grow: grow, rank: rank };
})();
