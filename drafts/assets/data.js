window.BUILDGO = {
  notice: "시안입니다 — 화면 속 업체·가격·후기·포인트는 모두 예시입니다",
  brand: { name: "BUILDGO", company: "더원파트너스", blue: "#2337D9", orange: "#FF6B1A" },
  categories: [
    { id: "design", name: "설계·인허가", desc: "평면·입면 설계, 건축 인허가 대행", icon: "plan", photo: "cat_design" },
    { id: "frame", name: "골조·철거", desc: "철근콘크리트·목조·철골, 철거", icon: "beam", photo: "cat_frame" },
    { id: "interior", name: "인테리어", desc: "주거·상가 실내 리모델링", icon: "sofa", photo: "cat_interior" },
    { id: "mep", name: "설비", desc: "전기·배관·냉난방", icon: "pipe", photo: "cat_mep" },
    { id: "waterproof", name: "방수·단열", desc: "옥상·욕실 방수, 외단열", icon: "drop", photo: "cat_waterproof" },
    { id: "exterior", name: "외장·창호", desc: "외벽 마감, 창호·도어 교체", icon: "window", photo: "cat_exterior" }
  ],
  regions: ["서울", "경기", "인천", "강원", "충청", "부산·경남"],
  experts: [
    {
      id: "e1", name: "모노설계 스튜디오", category: "design", region: "서울 성동구", years: 12,
      verified: { license: "건축사", business: true, insurance: true },
      rating: 4.9, reviews: 128, responseHours: 2, startPrice: 1800000, seed: 11,
      tagline: "단독·다가구 주택 설계부터 인허가까지 한 번에",
      packages: [
        { tier: "기본", price: 1800000, days: 14, items: ["평면도 2안", "수정 2회", "면적표"] },
        { tier: "표준", price: 3900000, days: 21, items: ["평면도 3안", "입면·단면도", "3D 외관 2컷", "수정 3회"] },
        { tier: "프리미엄", price: 7500000, days: 35, items: ["실시설계 도면 일체", "인허가 대행", "3D 내외관 6컷", "현장 감리 2회"] }
      ],
      portfolio: [
        { title: "양평 단독주택 2층", type: "house", seed: 3, photo: "pf_e1_1" },
        { title: "성수동 다가구 리모델링 설계", type: "plan", seed: 7, photo: "pf_e1_2" },
        { title: "춘천 근린생활시설", type: "house", seed: 19, photo: "pf_e1_3" }
      ],
      reviewsSample: [
        { author: "김○○", rating: 5, text: "인허가까지 맡겨서 직접 관청 갈 일이 없었어요." },
        { author: "박○○", rating: 5, text: "3안을 보고 고를 수 있어서 결정이 쉬웠습니다." }
      ]
    },
    {
      id: "e2", name: "단정건축", category: "frame", region: "경기 성남시", years: 18,
      verified: { license: "종합건설업", business: true, insurance: true },
      rating: 4.8, reviews: 86, responseHours: 4, startPrice: 0, seed: 23,
      tagline: "철근콘크리트·경량목구조 신축 전문",
      packages: [
        { tier: "현장 실측", price: 0, days: 3, items: ["무료 현장 방문", "개략 견적서"] },
        { tier: "기본 시공", price: null, days: null, items: ["평당 단가 견적", "공정표 제공"] },
        { tier: "설계+시공", price: null, days: null, items: ["설계사 연계", "인허가~준공 일괄"] }
      ],
      portfolio: [
        { title: "용인 2층 주택 신축", type: "house", seed: 31, photo: "pf_e2_1" },
        { title: "판교 상가주택 골조", type: "house", seed: 37, photo: "pf_e2_2" },
        { title: "분당 철거 후 신축", type: "plan", seed: 41, photo: "pf_e2_3" }
      ],
      reviewsSample: [
        { author: "이○○", rating: 5, text: "공정표대로 진행돼서 일정 걱정이 없었습니다." },
        { author: "최○○", rating: 4, text: "현장 사진을 매일 보내줘서 좋았어요." }
      ]
    },
    {
      id: "e3", name: "한결인테리어", category: "interior", region: "서울 마포구", years: 9,
      verified: { license: "실내건축공사업", business: true, insurance: true },
      rating: 4.9, reviews: 241, responseHours: 1, startPrice: 2500000, seed: 47,
      tagline: "아파트·오피스텔 전체 리모델링",
      packages: [
        { tier: "부분 시공", price: 2500000, days: 7, items: ["욕실 또는 주방 1곳", "자재 포함"] },
        { tier: "전체 리모델링", price: 32000000, days: 30, items: ["30평 기준", "도배·바닥·조명·욕실 2"] },
        { tier: "디자인+시공", price: 45000000, days: 40, items: ["3D 디자인", "가구 제작", "준공 청소"] }
      ],
      portfolio: [
        { title: "마포 34평 아파트", type: "room", seed: 53, photo: "pf_e3_1" },
        { title: "연남동 카페", type: "room", seed: 59, photo: "pf_e3_2" },
        { title: "합정 오피스텔", type: "plan", seed: 61, photo: "pf_e3_3" }
      ],
      reviewsSample: [
        { author: "정○○", rating: 5, text: "자재를 BUILDGO 회원가로 바꿔 넣으니 견적이 내려갔어요." },
        { author: "한○○", rating: 5, text: "매일 작업 내용을 사진으로 받아 안심됐습니다." }
      ]
    },
    {
      id: "e4", name: "바른설비", category: "mep", region: "인천 연수구", years: 15,
      verified: { license: "기계설비공사업", business: true, insurance: true },
      rating: 4.7, reviews: 64, responseHours: 3, startPrice: 350000, seed: 67,
      tagline: "배관·보일러·전기 증설",
      packages: [
        { tier: "점검", price: 50000, days: 1, items: ["누수·전기 점검", "점검 리포트"] },
        { tier: "부분 교체", price: 350000, days: 1, items: ["보일러 또는 배관 1구간"] },
        { tier: "전체 교체", price: 4200000, days: 5, items: ["30평 기준 배관 전체", "전기 분전반"] }
      ],
      portfolio: [
        { title: "송도 아파트 배관 교체", type: "plan", seed: 71, photo: "pf_e4_1" },
        { title: "부평 상가 전기 증설", type: "house", seed: 73, photo: "pf_e4_2" }
      ],
      reviewsSample: [ { author: "윤○○", rating: 5, text: "점검 리포트가 사진과 함께 와서 이해가 쉬웠어요." } ]
    },
    {
      id: "e5", name: "튼튼방수", category: "waterproof", region: "강원 춘천시", years: 20,
      verified: { license: "방수공사업", business: true, insurance: false },
      rating: 4.8, reviews: 52, responseHours: 5, startPrice: 900000, seed: 79,
      tagline: "옥상·외벽 방수, 외단열",
      packages: [
        { tier: "부분 방수", price: 900000, days: 2, items: ["욕실 1곳 또는 옥상 일부"] },
        { tier: "옥상 전체", price: 3800000, days: 4, items: ["우레탄 방수 2회", "하자보증 3년"] },
        { tier: "외단열", price: null, days: null, items: ["면적별 견적", "자재 회원가 적용"] }
      ],
      portfolio: [
        { title: "춘천 상가 옥상 방수", type: "house", seed: 83, photo: "pf_e5_1" },
        { title: "원주 주택 외단열", type: "house", seed: 89, photo: "pf_e5_2" }
      ],
      reviewsSample: [ { author: "강○○", rating: 5, text: "장마 지나고도 새는 곳이 없습니다." } ]
    },
    {
      id: "e6", name: "빛창호", category: "exterior", region: "경기 고양시", years: 11,
      verified: { license: "금속창호공사업", business: true, insurance: true },
      rating: 4.6, reviews: 97, responseHours: 2, startPrice: 1200000, seed: 97,
      tagline: "시스템창호·중문 교체",
      packages: [
        { tier: "중문", price: 1200000, days: 1, items: ["3연동 중문", "철거 포함"] },
        { tier: "거실 창", price: 3400000, days: 2, items: ["시스템창 1세트", "실측·철거·설치"] },
        { tier: "전체 창호", price: 9800000, days: 4, items: ["30평 기준", "에너지 등급 1등급"] }
      ],
      portfolio: [
        { title: "일산 아파트 창호", type: "room", seed: 101, photo: "pf_e6_1" },
        { title: "파주 주택 외장", type: "house", seed: 103, photo: "pf_e6_2" }
      ],
      reviewsSample: [ { author: "오○○", rating: 4, text: "실측 당일 견적이 나와서 빨랐어요." } ]
    }
  ],
  materialCategories: [
    { id: "struct", name: "구조재·철물" },
    { id: "board", name: "보드·합판" },
    { id: "finish", name: "타일·바닥재" },
    { id: "insul", name: "단열·지붕" },
    { id: "window", name: "창호·도어" },
    { id: "tool", name: "공구·소모품" }
  ],
  materials: [
    { id: "m1", name: "석고보드 일반", spec: "9.5T × 900 × 1800", unit: "장", price: 6800, category: "board", texture: "gypsum", stock: "당일 출고", moq: 10, photo: "mat_m1" },
    { id: "m2", name: "구조용 합판", spec: "12T × 1220 × 2440", unit: "장", price: 32000, category: "board", texture: "plywood", stock: "당일 출고", moq: 5, photo: "mat_m2" },
    { id: "m3", name: "각재 (구조목 SPF)", spec: "38 × 89 × 3600", unit: "개", price: 9800, category: "struct", texture: "wood", stock: "당일 출고", moq: 20, photo: "mat_m3" },
    { id: "m4", name: "아연도 강관", spec: "50A × 2.3T × 6m", unit: "본", price: 41000, category: "struct", texture: "steel", stock: "1~2일", moq: 5, photo: "mat_m4" },
    { id: "m5", name: "포세린 타일 무광", spec: "600 × 600", unit: "박스(4장)", price: 38000, category: "finish", texture: "tile", stock: "1~2일", moq: 10, photo: "mat_m5" },
    { id: "m6", name: "대리석 패턴 포세린 타일", spec: "600 × 1200", unit: "박스(2장)", price: 52000, category: "finish", texture: "marble", stock: "3~5일", moq: 5, photo: "mat_m6" },
    { id: "m7", name: "강마루 오크", spec: "8T × 195 × 1200", unit: "박스(1평)", price: 58000, category: "finish", texture: "oak", stock: "1~2일", moq: 5, photo: "mat_m7" },
    { id: "m8", name: "유리섬유 단열재", spec: "50T × 450 × 1200", unit: "묶음(10장)", price: 14500, category: "insul", texture: "insulation", stock: "당일 출고", moq: 20, photo: "mat_m8" },
    { id: "m9", name: "컬러강판 지붕재", spec: "0.5T × 1000 × 3000", unit: "장", price: 36000, category: "insul", texture: "membrane", stock: "1~2일", moq: 2, photo: "mat_m9" },
    { id: "m10", name: "시스템창호 PVC", spec: "2,400 × 2,100 이중창", unit: "세트", price: 1380000, category: "window", texture: "glass", stock: "주문 제작 7일", moq: 1, photo: "mat_m10" },
    { id: "m11", name: "적벽돌", spec: "190 × 90 × 57", unit: "팔레트(500장)", price: 310000, category: "struct", texture: "brick", stock: "3~5일", moq: 1, photo: "mat_m11" },
    { id: "m12", name: "노출 콘크리트 패널", spec: "8T × 600 × 1200", unit: "장", price: 47000, category: "finish", texture: "concrete", stock: "3~5일", moq: 10, photo: "mat_m12" }
  ],
  tiers: [
    { id: "basic", name: "일반", discount: 0, pointRate: 0.5, rule: "가입하면 바로" },
    { id: "silver", name: "실버", discount: 3, pointRate: 1, rule: "최근 3개월 구매 100만원 이상" },
    { id: "gold", name: "골드", discount: 6, pointRate: 1.5, rule: "사업자 회원 또는 300만원 이상" },
    { id: "vip", name: "VIP", discount: 10, pointRate: 2, rule: "최근 3개월 1,000만원 이상" }
  ],
  points: {
    referral: 5000,
    referralRule: "내가 추천한 회원이 첫 구매를 하면 1번만 적립 (추천의 추천에는 적립하지 않음)",
    use: "자재 결제 시 1포인트 = 1원, 시공 계약금에도 사용"
  },
  demoUser: { name: "김건축", tier: "gold", points: 48200, company: "한빛건설(예시)" }
};
