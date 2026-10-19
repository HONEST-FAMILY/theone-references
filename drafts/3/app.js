/* BUILDGO 시안 3 — 현장 단위 플랫폼 (외부 라이브러리 없음) */
(() => {
  'use strict';
  const D = window.BUILDGO, A = window.BGArt;
  const view = document.getElementById('view');
  if (!D || !A) {
    view.innerHTML = '<p style="padding:40px 0">시안 데이터를 불러오지 못했어요. assets 폴더 위치를 확인해 주세요.</p>';
    return;
  }

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => motionMQ.matches;
  const railMQ = window.matchMedia('(min-width: 1100px)');
  const num = n => Math.round(n).toLocaleString('ko-KR');
  const won = n => num(n) + '원';
  const man = n => (n >= 10000 && n % 10000 === 0) ? num(n / 10000) + '만원' : won(n);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const by = arr => Object.fromEntries(arr.map(x => [x.id, x]));
  const CAT = by(D.categories), MCAT = by(D.materialCategories), EXP = by(D.experts), MAT = by(D.materials), TIER = by(D.tiers);
  const CASES = D.experts.flatMap(e => e.portfolio.map((p, i) => Object.assign({}, p, { expert: e, key: e.id + '-' + i })));
  const unitShort = m => m.unit.replace(/\s*\(.*\)\s*$/, '');
  const josa = (w, a, b) => {
    const c = String(w).charCodeAt(String(w).length - 1);
    if (c < 0xAC00 || c > 0xD7A3) return a + '(' + b + ')';
    return (c - 0xAC00) % 28 ? a : b;
  };

  const P = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    star: '<path class="fill" d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    shieldx: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="M9.5 10.5l5 5M14.5 10.5l-5 5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    board: '<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 4V2.8h6V4"/><path d="M8 10h8M8 14h5"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    send: '<path d="M4 12 20 4l-4 16-4-7z"/><path d="m12 13 8-9"/>',
    plan: '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M3.5 11h7v9.5M10.5 15h10M14.5 3.5V11"/>',
    beam: '<path d="M5 4h14v3h-5v10h5v3H5v-3h5V7H5z"/>',
    sofa: '<path d="M6 11V8.5A2.5 2.5 0 0 1 8.5 6h7A2.5 2.5 0 0 1 18 8.5V11"/><path d="M4 11.5a1.5 1.5 0 0 1 3 0V14h10v-2.5a1.5 1.5 0 0 1 3 0V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M6.5 18v2M17.5 18v2"/>',
    pipe: '<path d="M3 6.5h8.5a5.5 5.5 0 0 1 5.5 5.5v9"/><path d="M3 10.5h7.5A2.5 2.5 0 0 1 13 13v8"/><path d="M3 4.5v8M11 21h8"/>',
    drop: '<path d="M12 3.5s6 6.4 6 10.7a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z"/><path d="M9.2 14.5a2.8 2.8 0 0 0 2.8 2.8"/>',
    window: '<rect x="4.5" y="3.5" width="15" height="17" rx="1"/><path d="M12 3.5v17M4.5 12h15"/>'
  };
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n] || ''}</svg>`;

  /* ---------- art (BGArt, 캐시) ---------- */
  const cache = new Map();
  const memo = (k, f) => { let v = cache.get(k); if (!v) { v = A.uri(f()); cache.set(k, v); } return v; };
  const caseImg = (type, seed, w = 480, h = 320) => memo(`c|${type}|${seed}|${w}|${h}`, () => A.forItem(type, seed, { w, h, accent: '#2337D9', bg: '#FBFAF6', sky: '#EDF0F7' }));
  const expImg = (e, w, h) => caseImg(e.portfolio[0].type, e.portfolio[0].seed, w, h);
  const matSeed = m => D.materials.indexOf(m) * 13 + 5;
  const matImg = (m, w = 480, h = 360, k = 0) => memo(`m|${m.id}|${w}|${h}|${k}`, () => A.texture(m.texture, { seed: matSeed(m) + k * 31, w, h }));
  const planImg = (seed, w = 480, h = 320) => memo(`p|${seed}|${w}|${h}`, () => A.floorplan(seed, { w, h, bg: '#FBFAF6', stroke: '#1B2A6B', accent: '#2337D9' }));
  const lineImg = (seed, w = 480, h = 320) => memo(`l|${seed}|${w}|${h}`, () => A.facade(seed, { w, h, mode: 'line', bg: '#13205A', stroke: '#B9C6FF' }));
  const siteSeed = st => (parseInt(String(st.id).replace(/\D/g, ''), 10) || 1) * 17 + 4;

  /* ---------- state (localStorage) ---------- */
  const KEY = 'buildgo-draft3-v1';
  const fresh = () => ({
    v: 1, user: false, usePoints: false, current: 's1', seq: 3, lastRequest: null,
    sites: [
      { id: 's1', name: '마포 34평 리모델링', experts: [{ id: 'e3', pkg: 1 }], materials: [{ id: 'm7', qty: 34 }] },
      { id: 's2', name: '일산 주택 옥상 방수', experts: [{ id: 'e5', pkg: 1 }], materials: [{ id: 'm9', qty: 4 }] }
    ]
  });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.v === 1 && Array.isArray(s.sites) && s.sites.length) {
        s.sites.forEach(st => {
          st.experts = (st.experts || []).filter(x => EXP[x.id] && EXP[x.id].packages[x.pkg]);
          st.materials = (st.materials || []).filter(x => MAT[x.id]).map(x => ({ id: x.id, qty: Math.max(1, x.qty | 0) }));
          st.name = String(st.name || '이름 없는 현장').slice(0, 30);
        });
        if (!s.sites.some(st => st.id === s.current)) s.current = s.sites[0].id;
        s.seq = Math.max(s.seq | 0, s.sites.length + 1);
        return s;
      }
    } catch (err) { /* 저장값이 깨졌으면 처음 상태로 */ }
    return fresh();
  }
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (err) { /* 저장 불가 환경 */ } };
  const ui = { pkg: {}, qty: {}, join: { cat: 'interior', regions: ['서울'], count: 3, price: null } };

  const site = () => S.sites.find(s => s.id === S.current) || S.sites[0];
  const tier = () => (S.user ? TIER[D.demoUser.tier] : null);
  const memberPrice = (p, t = tier()) => (t ? Math.round(p * (100 - t.discount) / 100) : p);
  function totals(st = site()) {
    const t = tier();
    let svc = 0, quoteOnly = 0, matList = 0, matMember = 0;
    st.experts.forEach(x => { const p = EXP[x.id].packages[x.pkg]; if (p.price == null) quoteOnly++; else svc += p.price; });
    st.materials.forEach(x => { const m = MAT[x.id]; matList += m.price * x.qty; matMember += memberPrice(m.price, t) * x.qty; });
    const list = svc + matList, discount = matList - matMember;
    const pointsUse = t && S.usePoints ? Math.min(D.demoUser.points, list - discount) : 0;
    const pay = list - discount - pointsUse;
    const earn = t ? Math.floor(matMember * t.pointRate / 100) : 0;
    return { svc, quoteOnly, matList, matMember, list, discount, pointsUse, pay, earn, count: st.experts.length + st.materials.length, t };
  }
  const priceLabel = p => (p.price == null ? '현장 견적' : p.price === 0 ? '무료' : won(p.price));
  const daysLabel = p => (p.days == null ? '현장 협의' : p.days + '일');
  const startLabel = e => (e.startPrice > 0 ? man(e.startPrice) + '부터' : '실측 무료 · 현장 견적');
  const defaultPkg = e => Math.min(1, e.packages.length - 1);
  const clampQty = (m, v) => Math.max(m.moq, Math.min(9999, Math.round(+v) || m.moq));

  /* ---------- search ---------- */
  const TEXKO = { gypsum: '석고 벽 천장', plywood: '합판 목재 나무', wood: '목재 나무 각재', steel: '철물 금속 철골', tile: '타일 바닥 욕실 벽', marble: '대리석 타일 욕실', oak: '마루 바닥 원목 나무', insulation: '단열', membrane: '방수 옥상 욕실', glass: '유리 창호 창문', brick: '벽돌 외벽 외장', concrete: '콘크리트 외벽 벽' };
  const SYN = { 욕실: ['방수', '타일'], 화장실: ['욕실', '방수', '타일'], 창문: ['창호'], 보일러: ['배관', '설비'], 전기: ['설비'], 배관: ['설비'], 바닥: ['마루', '타일', '바닥재'], 리모델링: ['인테리어'], 신축: ['골조', '설계'], 아파트: ['30평'], 나무: ['목재', '각재', '합판'], 철골: ['골조', '각관'], 외벽: ['외장', '외단열', '벽돌'], 옥상: ['방수'], 집: ['주택'] };
  const HAY = {
    expert: e => [e.name, e.tagline, CAT[e.category].name, CAT[e.category].desc, e.region, e.verified.license].concat(e.packages.map(p => p.tier + ' ' + p.items.join(' ')), e.portfolio.map(p => p.title)).join(' '),
    material: m => [m.name, m.spec, m.unit, MCAT[m.category].name, TEXKO[m.texture] || ''].join(' '),
    case: c => [c.title, c.expert.name, CAT[c.expert.category].name, c.expert.region].join(' ')
  };
  function tokens(q) {
    const base = q.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const out = new Set(base);
    base.forEach(t => Object.keys(SYN).forEach(k => { if (t.includes(k)) SYN[k].forEach(s => out.add(s)); }));
    return Array.from(out);
  }
  const scoreOf = (hay, toks) => { if (!toks.length) return 1; const h = hay.toLowerCase(); return toks.reduce((s, t) => s + (h.includes(t) ? 1 : 0), 0); };
  const inRegion = (e, reg) => !reg || reg.split('·').some(p => e.region.indexOf(p) === 0);

  /* ---------- small components ---------- */
  const stars = r => `<span class="stars" aria-label="별점 ${r}점">${[1, 2, 3, 4, 5].map(i => ic('star', i <= Math.round(r) ? '' : 'off')).join('')}</span>`;
  function verifyChips(e) {
    const v = e.verified;
    return `<ul class="vchips" aria-label="검증 정보">
      <li>${ic('check')}${esc(v.license)}</li>
      <li class="${v.business ? '' : 'no'}">${ic(v.business ? 'check' : 'x')}사업자</li>
      <li class="${v.insurance ? '' : 'no'}">${ic(v.insurance ? 'check' : 'x')}보험</li></ul>`;
  }
  function expertBtn(e, pkg, cls = 'sm') {
    const x = site().experts.find(y => y.id === e.id);
    return x
      ? `<button class="btn added ${cls}" type="button" data-act="expert" data-mode="remove" data-id="${e.id}" data-fk="ex-${e.id}" aria-pressed="true" title="다시 누르면 현장에서 빠집니다">${ic('check')}현장에 담김</button>`
      : `<button class="btn act ${cls}" type="button" data-act="expert" data-mode="add" data-id="${e.id}" data-pkg="${pkg}" data-fk="ex-${e.id}" aria-pressed="false">${ic('plus')}현장에 담기</button>`;
  }
  function expertCard(e) {
    const c = CAT[e.category];
    return `<article class="ecard" data-card>
      <a class="ecard-img" href="#/expert/${e.id}" tabindex="-1" aria-hidden="true"><img src="${expImg(e)}" alt="" loading="lazy"><span class="pin-tag">${esc(c.name)}</span></a>
      <div class="ecard-b">
        <h3><a href="#/expert/${e.id}">${esc(e.name)}</a></h3>
        <p class="meta"><span class="rate">${ic('star')}${e.rating}</span><span>후기 ${num(e.reviews)}</span><span>${esc(e.region)}</span></p>
        <p class="tagline">${esc(e.tagline)}</p>
        ${verifyChips(e)}
        <p class="from">${startLabel(e)}</p>
      </div>
      <div class="ecard-f">${expertBtn(e, 0)}<a class="btn ghost sm" href="#/expert/${e.id}">상세</a></div>
    </article>`;
  }
  function priceMini(m) {
    const t = tier();
    if (!t) return `<span class="list">정가 ${won(m.price)}</span><span class="lockline">${ic('lock')}회원 전용 가격</span>`;
    return `<span class="list strike">${won(m.price)}</span><span class="member">${esc(t.name)} ${won(memberPrice(m.price))}</span><span class="off">−${t.discount}%</span>`;
  }
  function matBtn(m, cls = 'sm') {
    const x = site().materials.find(y => y.id === m.id);
    return x
      ? `<button class="btn added ${cls}" type="button" data-act="mat" data-mode="remove" data-id="${m.id}" data-fk="mt-${m.id}" aria-pressed="true" title="다시 누르면 현장에서 빠집니다">${ic('check')}담김 · ${num(x.qty)}${esc(unitShort(m))}</button>`
      : `<button class="btn act ${cls}" type="button" data-act="mat" data-mode="add" data-id="${m.id}" data-fk="mt-${m.id}" aria-pressed="false">${ic('plus')}현장에 담기</button>`;
  }
  function materialCard(m) {
    return `<article class="mcard" data-card>
      <a class="mcard-img" href="#/material/${m.id}" tabindex="-1" aria-hidden="true"><img src="${matImg(m)}" alt="" loading="lazy"><span class="pin-tag">${esc(MCAT[m.category].name)}</span></a>
      <div class="mcard-b">
        <h3><a href="#/material/${m.id}">${esc(m.name)}</a></h3>
        <p class="spec">${esc(m.spec)} · ${esc(m.unit)}</p>
        <div class="mprice">${priceMini(m)}</div>
      </div>
      <div class="mcard-f">${matBtn(m)}</div>
    </article>`;
  }
  const caseCard = c => `<a class="ccard" href="#/expert/${c.expert.id}"><img src="${caseImg(c.type, c.seed)}" alt="" loading="lazy"><div><h3>${esc(c.title)}</h3><p>${esc(c.expert.name)} · ${esc(CAT[c.expert.category].name)} · ${esc(c.expert.region)}</p></div></a>`;
  const loginBanner = () => `<div class="banner"><p>${ic('lock')}회원 전용 가격 — 로그인하면 내 등급 가격으로 보여요.</p><button class="btn blue sm" type="button" data-act="demo-login">데모 로그인 (김건축 · 골드)</button></div>`;
  const secH = (idx, title, more) => `<div class="sec-h"><div><p class="idx">${idx}</p><h2>${title}</h2></div>${more || ''}</div>`;
  const reqBtn = (st, cls = '') => st.experts.length
    ? `<button class="btn act ${cls}" type="button" data-act="request-all">${ic('send')}담긴 전문가 모두에게 견적 요청</button>`
    : `<button class="btn act ${cls}" type="button" disabled>전문가를 담으면 견적 요청 가능</button>`;

  /* ---------- 내 현장 요약 (rail · sheet · card) ---------- */
  function totalsHTML(t, big) {
    const tr = t.t;
    return `<div class="tot ${big ? 'big' : ''}">
      <div class="tot-r"><span>정가 합계</span><span class="v" data-num="list">${won(t.list)}</span></div>
      <div class="tot-r"><span>등급 할인${tr ? ` <em>${esc(tr.name)} ${tr.discount}% · 자재</em>` : ''}</span>${tr ? `<span class="v minus" data-num="discount" data-prefix="−">−${won(t.discount)}</span>` : '<button class="linkbtn" type="button" data-act="login">로그인하면 반영</button>'}</div>
      <div class="tot-r"><span>포인트 사용${tr ? ` <button class="switch" type="button" role="switch" aria-checked="${S.usePoints}" data-act="points"><span class="sr">포인트 사용</span></button><em>${num(D.demoUser.points)}P 보유</em>` : ''}</span>${tr ? `<span class="v minus" data-num="pointsUse" data-prefix="−">−${won(t.pointsUse)}</span>` : '<span class="v muted">회원 전용</span>'}</div>
      <div class="tot-r pay"><span>결제 예정</span><span class="v" data-num="pay">${won(t.pay)}</span></div>
      <div class="tot-r earn"><span>적립 예정${tr ? ` <em>자재 결제액 × ${tr.pointRate}%</em>` : ''}</span>${tr ? `<span class="v" data-num="earn" data-prefix="+" data-suffix="P">+${num(t.earn)}P</span>` : '<span class="v muted">로그인 후</span>'}</div>
      ${t.quoteOnly ? `<p class="tot-note">‘현장 견적’ ${t.quoteOnly}건은 전문가가 현장을 본 뒤 금액이 정해져 합계에 넣지 않았어요.</p>` : ''}
    </div>`;
  }
  const siteSelect = st => `<label class="sum-sel"><span class="sr">현장 바꾸기</span><select data-change="site">${S.sites.map(s => `<option value="${s.id}"${s.id === st.id ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}<option value="__new">+ 새 현장 만들기</option></select>${ic('down')}</label>`;
  function summaryHTML(v, st, t) {
    if (v === 'card') {
      return `<div class="hs-in">
        <figure class="pinned nocap hs-plan"><img src="${planImg(siteSeed(st), 300, 230)}" alt=""></figure>
        <div class="hs-t"><p class="sum-k">${ic('board')}내 현장 <span class="cnt">${t.count}</span></p><p class="sum-name">${esc(st.name)}</p>
          <p class="hs-m">전문가 ${st.experts.length} · 자재 ${st.materials.length} · 결제 예정 <b data-num="pay">${won(t.pay)}</b></p></div>
        <div class="hs-cta"><button class="btn act" type="button" data-act="sheet-open">요약 열기</button><a class="btn ghost" href="#/site">현장 보기</a></div>
      </div>`;
    }
    const ex = st.experts.map(x => {
      const e = EXP[x.id], p = e.packages[x.pkg];
      return `<li class="srow" data-row="e-${e.id}"><img src="${expImg(e, 120, 120)}" alt=""><a class="srow-t" href="#/expert/${e.id}"><b>${esc(e.name)}</b><span>${esc(CAT[e.category].name)} · ${esc(p.tier)}</span></a><span class="srow-p">${priceLabel(p)}</span></li>`;
    }).join('');
    const mt = st.materials.map(x => {
      const m = MAT[x.id];
      return `<li class="srow" data-row="m-${m.id}"><img src="${matImg(m, 120, 120)}" alt=""><a class="srow-t" href="#/material/${m.id}"><b>${esc(m.name)}</b><span>${num(x.qty)}${esc(unitShort(m))} × ${won(memberPrice(m.price))}</span></a><span class="srow-p">${won(memberPrice(m.price) * x.qty)}</span></li>`;
    }).join('');
    return `<div class="sum-top">
        <div class="sum-id"><p class="sum-k">${ic('board')}내 현장 <span class="cnt">${t.count}</span></p>${siteSelect(st)}</div>
        <figure class="pinned nocap sum-plan" data-fly-target="${v}"><img src="${planImg(siteSeed(st), 240, 180)}" alt=""></figure>
      </div>
      <div class="sum-sec"><h4><span>맡길 전문가 ${st.experts.length}</span><a href="#/search?tab=expert">전문가 찾기</a></h4>${ex ? `<ul class="slist">${ex}</ul>` : '<p class="sum-empty">아직 담긴 전문가가 없어요.</p>'}</div>
      <div class="sum-sec"><h4><span>자재 ${st.materials.length}</span><a href="#/search?tab=material">자재 보기</a></h4>${mt ? `<ul class="slist">${mt}</ul>` : '<p class="sum-empty">아직 담긴 자재가 없어요.</p>'}</div>
      ${totalsHTML(t)}
      <div class="sum-cta">${reqBtn(st, 'block')}<a class="btn ghost block" href="#/site">현장 자세히 보기</a></div>`;
  }
  const barHTML = (st, t) => `<span class="bar-ico" data-fly-target="bar">${ic('board')}<b>${t.count}</b></span><span class="bar-t"><small>내 현장 · ${t.count}개 담김</small><strong>${esc(st.name)}</strong></span><span class="bar-p"><small>결제 예정</small><strong data-num="pay">${won(t.pay)}</strong></span>${ic('up', 'bar-chev')}`;

  /* ---------- views ---------- */
  function vHome() {
    const ex = D.experts.slice(0, 4);
    const ms = ['m7', 'm6', 'm5', 'm2', 'm11', 'm12'].map(id => MAT[id]);
    const sugg = ['욕실 방수', '아파트 리모델링', '석고보드', '창호 교체', '강마루'];
    return `
    <section class="hero">
      <p class="eyebrow">건설 설계부터 시공까지, 현장 단위로</p>
      <h1>현장 하나에 <em>맡길 사람</em>과<br><em>쓸 자재</em>를 함께 담으세요.</h1>
      <p class="lead">검증된 전문가의 패키지를 비교해 한 번에 견적을 받고, 회원 전용 가격으로 자재를 삽니다. 담을 때마다 이 현장의 예상 총비용이 다시 계산돼요.</p>
      <form class="bigsearch" data-search role="search">${ic('search')}<label class="sr" for="q-home">통합 검색 — 전문가, 자재, 시공 사례</label><input id="q-home" name="q" type="search" placeholder="필요한 시공 분야를 입력해 보세요" autocomplete="off" enterkeyhint="search"><button type="submit" aria-label="검색">${ic('arrow')}</button></form>
      <div class="sugg"><span>자주 찾는</span>${sugg.map(s => `<a href="#/search?q=${encodeURIComponent(s)}">${esc(s)}</a>`).join('')}</div>
      <div class="doors">
        <a class="door door-svc" href="#/search?tab=expert">
          <div class="door-txt"><span class="door-k">입구 1</span><h2>시공 맡기기</h2><p class="door-p">설계·골조·인테리어·설비·방수·창호. 전문가 패키지를 비교하고 무료 견적을 받습니다.</p><p class="door-s">패키지 비교 · 무료 견적</p><span class="door-go">전문가 찾기${ic('arrow')}</span></div>
          <div class="door-board board-bg" aria-hidden="true">
            <figure class="pinned b1"><img src="${lineImg(23, 420, 300)}" alt=""><figcaption>입면</figcaption></figure>
            <figure class="pinned b2"><img src="${planImg(7, 420, 290)}" alt=""><figcaption>평면도</figcaption></figure>
          </div>
        </a>
        <a class="door door-mat" href="#/search?tab=material">
          <div class="door-txt"><span class="door-k">입구 2</span><h2>자재 사기</h2><p class="door-p">회원만 사는 건설 자재 도매몰. 등급이 오를수록 단가가 내려가고 포인트가 쌓입니다.</p><p class="door-s">회원가 · 등급 할인 · 적립</p><span class="door-go">자재 보기${ic('arrow')}</span></div>
          <div class="door-board board-bg" aria-hidden="true">
            <figure class="pinned s1"><img src="${matImg(MAT.m7, 240, 300)}" alt=""><figcaption>강마루 오크</figcaption></figure>
            <figure class="pinned s2"><img src="${matImg(MAT.m6, 240, 300)}" alt=""><figcaption>대리석 패턴</figcaption></figure>
            <figure class="pinned s3"><img src="${matImg(MAT.m12, 240, 300)}" alt=""><figcaption>노출 콘크리트</figcaption></figure>
          </div>
        </a>
      </div>
    </section>
    <section class="home-site" data-summary="card" aria-label="내 현장"></section>
    <section class="sec">
      ${secH('01 · 이렇게 진행돼요', 'BUILDGO는 ‘현장’ 단위로 움직입니다')}
      <ol class="how">
        <li><b>1</b><h3>현장 만들기</h3><p>‘마포 34평 리모델링’처럼 공사 한 건을 하나의 현장으로 만듭니다.</p></li>
        <li><b>2</b><h3>전문가와 자재 담기</h3><p>맡길 전문가의 패키지와 필요한 자재를 같은 현장에 담습니다. 등급 할인과 포인트가 바로 반영돼요.</p></li>
        <li><b>3</b><h3>한 번에 견적 요청</h3><p>담긴 전문가 모두에게 같은 현장 정보로 무료 견적을 요청합니다.</p></li>
      </ol>
    </section>
    <section class="sec">
      ${secH('02 · 시공 분야', '어떤 공사를 맡기시나요?', `<a class="more" href="#/search?tab=expert">전체 전문가${ic('arrow')}</a>`)}
      <div class="cats">${D.categories.map(c => `<a class="cat" href="#/search?tab=expert&cat=${c.id}">${ic(c.icon)}<b>${esc(c.name)}</b><span>${esc(c.desc)}</span></a>`).join('')}</div>
    </section>
    <section class="sec">
      ${secH('03 · 추천 전문가', '면허·사업자·보험부터 보여드려요', `<a class="more" href="#/search?tab=expert">더 보기${ic('arrow')}</a>`)}
      <div class="grid g4">${ex.map(expertCard).join('')}</div>
    </section>
    <section class="sec">
      ${secH('04 · 회원 전용 자재', '내 등급 가격으로 바로 담기', `<a class="more" href="#/search?tab=material">자재 도매몰${ic('arrow')}</a>`)}
      ${S.user ? '' : loginBanner()}
      <div class="grid g3">${ms.map(materialCard).join('')}</div>
    </section>`;
  }

  function vSearch(r) {
    const q = (r.q.get('q') || '').trim();
    const cat = r.q.get('cat') || '', reg = r.q.get('region') || '', mcat = r.q.get('mcat') || '';
    const toks = tokens(q);
    const rank = (arr, hay, sub) => arr.map(x => [x, scoreOf(hay(x), toks)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1] || sub(b[0]) - sub(a[0])).map(x => x[0]);
    const ex = rank(D.experts, HAY.expert, e => e.rating).filter(e => (!cat || e.category === cat) && inRegion(e, reg));
    const ms = rank(D.materials, HAY.material, () => 0).filter(m => !mcat || m.category === mcat);
    const cs = rank(CASES, HAY.case, c => c.expert.rating).filter(c => (!cat || c.expert.category === cat) && inRegion(c.expert, reg));
    let tab = r.q.get('tab');
    if (['expert', 'material', 'case'].indexOf(tab) < 0) tab = ex.length ? 'expert' : ms.length ? 'material' : cs.length ? 'case' : 'expert';
    const title = q ? `‘${esc(q)}’ 검색 결과` : tab === 'material' ? '회원전용 자재 도매몰' : tab === 'case' ? '시공 사례' : '시공 맡기기';
    const tabBtn = (id, label, n) => `<button class="tab" type="button" role="tab" aria-selected="${tab === id}" data-act="set" data-k="tab" data-v="${id}">${label} <b>${n}</b></button>`;
    const chipRow = (label, k, cur, items) => `<div class="frow"><span class="flabel">${label}</span><div class="chips">${[{ id: '', name: '전체' }].concat(items).map(it => `<button class="chip ${cur === it.id ? 'on' : ''}" type="button" data-act="set" data-k="${k}" data-v="${esc(it.id)}" aria-pressed="${cur === it.id}">${esc(it.name)}</button>`).join('')}</div></div>`;
    const filters = tab === 'material'
      ? chipRow('분류', 'mcat', mcat, D.materialCategories)
      : chipRow('분야', 'cat', cat, D.categories) + chipRow('지역', 'region', reg, D.regions.map(x => ({ id: x, name: x })));
    const list = tab === 'expert' ? ex : tab === 'material' ? ms : cs;
    const body = !list.length
      ? `<div class="empty"><p>조건에 맞는 결과가 없어요.</p><p class="note">${cat || reg || mcat ? '필터를 풀거나 다른 지역을 골라 보세요.' : '다른 검색어로 찾아보세요. 예: 욕실 방수, 석고보드'}</p>${cat || reg || mcat ? '<button class="btn ghost" type="button" data-act="clear-filters">필터 지우기</button>' : '<a class="btn ghost" href="#/search?tab=expert">전체 전문가 보기</a>'}</div>`
      : `<div class="grid g3">${tab === 'expert' ? ex.map(expertCard).join('') : tab === 'material' ? ms.map(materialCard).join('') : cs.map(caseCard).join('')}</div>`;
    return `
    <section class="page-hero">
      <p class="eyebrow">통합 검색 · 전문가 · 자재 · 시공 사례</p>
      <h1>${title}</h1>
      <form class="bigsearch slim" data-search role="search">${ic('search')}<label class="sr" for="q-s">통합 검색</label><input id="q-s" name="q" type="search" value="${esc(q)}" placeholder="필요한 시공 분야를 입력해 보세요" autocomplete="off" enterkeyhint="search"><button type="submit" aria-label="검색">${ic('arrow')}</button></form>
    </section>
    <div class="tabs" role="tablist" aria-label="검색 결과 종류">${tabBtn('expert', '전문가', ex.length)}${tabBtn('material', '자재', ms.length)}${tabBtn('case', '시공 사례', cs.length)}</div>
    <div class="filters">${filters}</div>
    ${tab === 'material' && !S.user ? loginBanner() : ''}
    ${body}`;
  }

  function vExpert(r) {
    const e = EXP[r.parts[1]];
    if (!e) return notFound();
    const c = CAT[e.category], st = site(), x = st.experts.find(y => y.id === e.id);
    const sel = ui.pkg[e.id] != null ? ui.pkg[e.id] : (x ? x.pkg : defaultPkg(e));
    const p = e.packages[sel];
    let cta;
    if (!x) cta = `<button class="btn act lg" type="button" data-act="expert" data-mode="add" data-id="${e.id}" data-pkg="${sel}" data-fk="ex-d">${ic('plus')}현장에 담기 · ${esc(p.tier)}</button>`;
    else if (x.pkg !== sel) cta = `<button class="btn act lg" type="button" data-act="expert" data-mode="swap" data-id="${e.id}" data-pkg="${sel}" data-fk="ex-d">현장 패키지를 ‘${esc(p.tier)}’${josa(p.tier, '으로', '로')} 바꾸기</button>`;
    else cta = `<button class="btn added lg" type="button" data-act="expert" data-mode="remove" data-id="${e.id}" data-fk="ex-d" title="다시 누르면 현장에서 빠집니다">${ic('check')}현장에 담김 · ${esc(p.tier)}</button>`;
    const v = e.verified;
    const vItem = (ok, label, okText, noText) => `<li class="${ok ? '' : 'no'}">${ic(ok ? 'shield' : 'shieldx')}<div><b>${label}</b><span>${ok ? okText : noText}</span></div></li>`;
    const p0 = e.portfolio[0], p1 = e.portfolio[1] || e.portfolio[0];
    return `
    <nav class="crumb" aria-label="위치"><a href="#/">홈</a><span>/</span><a href="#/search?tab=expert">시공 맡기기</a><span>/</span><a href="#/search?tab=expert&cat=${c.id}">${esc(c.name)}</a></nav>
    <div data-card>
    <section class="ex-hero">
      <div>
        <p class="eyebrow">${esc(c.name)} · ${esc(e.region)} · 경력 ${e.years}년</p>
        <h1>${esc(e.name)}</h1>
        <p class="lead">${esc(e.tagline)}</p>
        <p class="ex-stats"><span><b>${ic('star')}${e.rating}</b>후기 ${num(e.reviews)}개</span><span>평균 응답 <b>${e.responseHours}시간</b></span><span>시작가 <b>${startLabel(e)}</b></span></p>
      </div>
      <div class="ex-cover board-bg" aria-hidden="true">
        <figure class="pinned c1"><img src="${caseImg(p0.type, p0.seed, 720, 480)}" alt=""><figcaption>${esc(p0.title)}</figcaption></figure>
        <figure class="pinned c2"><img src="${planImg(p1.seed + 2, 400, 280)}" alt=""><figcaption>평면 검토</figcaption></figure>
      </div>
    </section>
    <section class="sec">
      ${secH('검증 정보', '입점할 때 서류로 확인한 항목')}
      <ul class="verify">
        ${vItem(true, '면허 · ' + esc(v.license), '면허 확인됨', '')}
        ${vItem(v.business, '사업자 등록', '사업자 확인됨', '확인 정보 없음')}
        ${vItem(v.insurance, '배상 보험', '보험 가입 확인됨', '가입 정보 없음')}
      </ul>
    </section>
    <section class="sec" id="pkgs">
      ${secH('패키지 비교', '가격 · 기간 · 포함 항목을 나란히')}
      <div class="pkgs">${e.packages.map((pk, i) => `
        <div class="pkg ${i === sel ? 'on' : ''}" data-act="pick-pkg" data-id="${e.id}" data-i="${i}">
          <p class="pkg-tier">${esc(pk.tier)}</p>
          <p class="pkg-price ${pk.price == null ? 'q' : ''}">${priceLabel(pk)}</p>
          <p class="pkg-days">작업 기간 ${daysLabel(pk)}</p>
          <ul class="pkg-items">${pk.items.map(t => `<li>${ic('check')}<span>${esc(t)}</span></li>`).join('')}</ul>
          <button class="btn ${i === sel ? 'sel' : 'ghost'} sm" type="button" data-act="pick-pkg" data-id="${e.id}" data-i="${i}" data-fk="pk-${i}" aria-pressed="${i === sel}">${i === sel ? ic('check') + '선택됨' : '이 패키지 선택'}</button>
        </div>`).join('')}
      </div>
      <p class="note">가격이 ‘현장 견적’인 항목은 전문가가 현장을 본 뒤 금액을 알려 드립니다.</p>
      <div class="ex-cta">${cta}<button class="btn line lg" type="button" data-act="quote-one" data-id="${e.id}">무료 견적 요청</button></div>
      <p class="note">‘현장에 담기’를 누르면 지금 현장(${esc(st.name)})에 이 패키지가 들어갑니다. 여러 전문가를 담은 뒤 한 번에 견적을 요청할 수 있어요.</p>
    </section>
    </div>
    <section class="sec">
      ${secH('시공 사례', `포트폴리오 ${e.portfolio.length}건`)}
      <div class="pf">${e.portfolio.map(pf => `<figure><img src="${caseImg(pf.type, pf.seed)}" alt="${esc(pf.title)} 그림" loading="lazy"><figcaption>${esc(pf.title)}</figcaption></figure>`).join('')}</div>
    </section>
    <section class="sec">
      ${secH('후기', `후기 ${num(e.reviews)}개`)}
      <div class="rev-sum"><b>${e.rating}</b>${stars(e.rating)}<span>평균 별점</span></div>
      <div class="revs">${e.reviewsSample.map(rv => `<article class="rev">${stars(rv.rating)}<p>${esc(rv.text)}</p><span>${esc(rv.author)} · 별점 ${rv.rating}</span></article>`).join('')}</div>
    </section>`;
  }

  function mPriceHTML(m, qty) {
    const t = tier(), u = unitShort(m), list = m.price * qty;
    if (!t) {
      return `<div class="mp-r"><span>정가 (1${esc(u)})</span><span class="v">${won(m.price)}</span></div>
        <div class="mp-r big"><span>정가 합계 · ${num(qty)}${esc(u)}</span><span class="v" data-num="mlist">${won(list)}</span></div>
        <div class="lockbox"><b>${ic('lock')}회원 전용 가격 — 로그인</b><p>로그인하면 내 등급 가격과 적립 예정 포인트가 바로 보여요.</p><button class="btn blue block" type="button" data-act="demo-login">데모 로그인 (김건축 · 골드 회원)</button></div>`;
    }
    const mp = memberPrice(m.price, t), mem = mp * qty;
    return `<div class="mp-r"><span>정가 (1${esc(u)})</span><span class="v strike">${won(m.price)}</span></div>
      <div class="mp-r blue"><span>내 등급가 · ${esc(t.name)} −${t.discount}%</span><span class="v">${won(mp)}</span></div>
      <div class="mp-r"><span>정가 합계 · ${num(qty)}${esc(u)}</span><span class="v strike">${won(list)}</span></div>
      <div class="mp-r big"><span>내 등급가 합계</span><span class="v">${won(mem)}</span></div>
      <div class="mp-r blue"><span>할인 금액</span><span class="v">−${won(list - mem)}</span></div>
      <div class="mp-r blue"><span>적립 예정 · ${t.pointRate}%</span><span class="v">+${num(Math.floor(mem * t.pointRate / 100))}P</span></div>`;
  }
  function mCtaHTML(m, qty) {
    const x = site().materials.find(y => y.id === m.id), u = esc(unitShort(m));
    if (!x) return `<button class="btn act lg" type="button" data-act="mat" data-mode="add" data-id="${m.id}" data-fk="mt-d">${ic('plus')}현장에 담기 · ${num(qty)}${u}</button><p class="hint">지금 현장: ${esc(site().name)}</p>`;
    if (x.qty !== qty) return `<button class="btn act lg" type="button" data-act="mat" data-mode="set" data-id="${m.id}" data-fk="mt-d">현장 수량을 ${num(qty)}${u}${josa(u, '으로', '로')} 바꾸기</button><p class="hint">지금 현장에는 ${num(x.qty)}${u} 담겨 있어요.</p>`;
    return `<button class="btn added lg" type="button" data-act="mat" data-mode="remove" data-id="${m.id}" data-fk="mt-d">${ic('check')}현장에 담김 · ${num(x.qty)}${u}</button><p class="hint">다시 누르면 현장에서 빠져요.</p>`;
  }
  function tierTable(m) {
    const t = tier();
    return `<div class="tablewrap"><table class="ttable"><thead><tr><th>등급</th><th class="r">자재 할인</th><th class="r">1${esc(unitShort(m))} 단가</th><th class="r">적립</th></tr></thead><tbody>
      ${D.tiers.map(tr => `<tr class="${t && t.id === tr.id ? 'me' : ''}"><td>${esc(tr.name)}${t && t.id === tr.id ? '<span class="me-tag">내 등급</span>' : ''}</td><td class="r">${tr.discount ? '−' + tr.discount + '%' : '없음'}</td><td class="r">${t ? won(memberPrice(m.price, tr)) : (tr.discount ? '로그인 후 공개' : won(m.price))}</td><td class="r">${tr.pointRate}%</td></tr>`).join('')}
    </tbody></table></div>`;
  }
  function vMaterial(r) {
    const m = MAT[r.parts[1]];
    if (!m) return notFound();
    const x = site().materials.find(y => y.id === m.id);
    const qty = ui.qty[m.id] != null ? ui.qty[m.id] : (x ? x.qty : m.moq);
    const u = esc(unitShort(m));
    const others = D.materials.filter(o => o.category === m.category && o.id !== m.id).slice(0, 3);
    return `
    <nav class="crumb" aria-label="위치"><a href="#/">홈</a><span>/</span><a href="#/search?tab=material">자재 도매몰</a><span>/</span><a href="#/search?tab=material&mcat=${m.category}">${esc(MCAT[m.category].name)}</a></nav>
    <section class="m-hero" data-card>
      <div class="m-board board-bg">
        <figure class="pinned w1"><img src="${matImg(m, 760, 620)}" alt="${esc(m.name)} 질감 견본"><figcaption>견본 · ${esc(m.name)}</figcaption></figure>
        <figure class="pinned w3 nocap" aria-hidden="true"><img src="${matImg(m, 300, 240, 1)}" alt=""></figure>
        <figure class="pinned w2" aria-hidden="true"><img src="${planImg(matSeed(m) + 3, 360, 260)}" alt=""><figcaption>${esc(m.spec)}</figcaption></figure>
      </div>
      <div class="m-info">
        <p class="eyebrow">${esc(MCAT[m.category].name)} · 회원 전용</p>
        <h1>${esc(m.name)}</h1>
        <dl class="spec-tbl"><div><dt>규격</dt><dd>${esc(m.spec)}</dd></div><div><dt>단위</dt><dd>${esc(m.unit)}</dd></div><div><dt>출고</dt><dd>${esc(m.stock)}</dd></div><div><dt>최소 주문</dt><dd>${m.moq}${u}</dd></div></dl>
        <div class="qty"><span>수량</span>
          <span class="stepper"><button type="button" data-act="mqty" data-id="${m.id}" data-d="-1" data-fk="mq-" aria-label="수량 줄이기"${qty <= m.moq ? ' disabled' : ''}>${ic('minus')}</button><input id="mQty" type="number" inputmode="numeric" min="${m.moq}" max="9999" value="${qty}" data-id="${m.id}" aria-label="수량 (${u})"><button type="button" data-act="mqty" data-id="${m.id}" data-d="1" data-fk="mq+" aria-label="수량 늘리기">${ic('plus')}</button></span>
          <span class="qty-hint">${u} · 최소 ${m.moq}${u}</span></div>
        <div class="m-price" id="mPrice">${mPriceHTML(m, qty)}</div>
        <div class="m-cta" id="mCta">${mCtaHTML(m, qty)}</div>
      </div>
    </section>
    <section class="sec">
      ${secH('등급별 단가', '같은 자재, 등급마다 다른 가격', '<a class="more" href="#/tiers">등급 안내' + ic('arrow') + '</a>')}
      ${tierTable(m)}
      <p class="note">포인트: ${esc(D.points.use)}</p>
    </section>
    ${others.length ? `<section class="sec">${secH('같은 분류 자재', esc(MCAT[m.category].name))}<div class="grid g3">${others.map(materialCard).join('')}</div></section>` : ''}`;
  }

  function vSite() {
    const st = site(), t = totals(st);
    const pins = [`<figure class="pinned bp"><img src="${planImg(siteSeed(st), 460, 320)}" alt=""><figcaption>현장 평면</figcaption></figure>`]
      .concat(st.experts.map(x => { const e = EXP[x.id]; return `<figure class="pinned bx"><img src="${expImg(e, 300, 220)}" alt=""><figcaption>${esc(e.name)}</figcaption></figure>`; }))
      .concat(st.materials.map(x => { const m = MAT[x.id]; return `<figure class="pinned bm"><img src="${matImg(m, 200, 200)}" alt=""><figcaption>${esc(m.name)}</figcaption></figure>`; }));
    const exRows = st.experts.map(x => {
      const e = EXP[x.id], p = e.packages[x.pkg];
      return `<li class="irow" data-row="e-${e.id}">
        <img class="irow-img" src="${expImg(e, 160, 160)}" alt="">
        <div><a class="irow-name" href="#/expert/${e.id}">${esc(e.name)}</a><p class="irow-sub">${esc(CAT[e.category].name)} · ${esc(e.region)} · 평균 응답 ${e.responseHours}시간</p>
          <div class="irow-ctl"><label><span class="sr">${esc(e.name)} 패키지</span><select data-change="pkg" data-id="${e.id}" data-fk="pkg-${e.id}">${e.packages.map((pk, i) => `<option value="${i}"${i === x.pkg ? ' selected' : ''}>${esc(pk.tier)} · ${priceLabel(pk)}</option>`).join('')}</select></label></div></div>
        <div class="irow-end"><b>${priceLabel(p)}</b><button class="iconbtn" type="button" data-act="srm" data-kind="e" data-id="${e.id}" aria-label="${esc(e.name)} 현장에서 빼기">${ic('x')}</button></div>
      </li>`;
    }).join('');
    const mtRows = st.materials.map(x => {
      const m = MAT[x.id], u = esc(unitShort(m)), mp = memberPrice(m.price);
      return `<li class="irow" data-row="m-${m.id}">
        <img class="irow-img" src="${matImg(m, 160, 160)}" alt="">
        <div><a class="irow-name" href="#/material/${m.id}">${esc(m.name)}</a><p class="irow-sub">${esc(m.spec)} · ${esc(m.stock)}</p>
          <div class="irow-ctl"><span class="stepper sm"><button type="button" data-act="sqty" data-id="${m.id}" data-d="-1" data-fk="sq-${m.id}-" aria-label="${esc(m.name)} 수량 줄이기"${x.qty <= m.moq ? ' disabled' : ''}>${ic('minus')}</button><output aria-live="polite">${num(x.qty)}${u}</output><button type="button" data-act="sqty" data-id="${m.id}" data-d="1" data-fk="sq-${m.id}+" aria-label="${esc(m.name)} 수량 늘리기">${ic('plus')}</button></span></div></div>
        <div class="irow-end">${t.t ? `<s>${won(m.price * x.qty)}</s>` : ''}<b>${won(mp * x.qty)}</b><button class="iconbtn" type="button" data-act="srm" data-kind="m" data-id="${m.id}" aria-label="${esc(m.name)} 현장에서 빼기">${ic('x')}</button></div>
      </li>`;
    }).join('');
    return `
    <div class="site-sw" role="group" aria-label="내 현장 목록">${S.sites.map(s => `<button class="chip ${s.id === st.id ? 'on' : ''}" type="button" data-act="switch-site" data-id="${s.id}" aria-pressed="${s.id === st.id}">${esc(s.name)}</button>`).join('')}<button class="chip" type="button" data-act="new-site">${ic('plus')}새 현장</button></div>
    <section class="site-head">
      <p class="eyebrow">내 현장 · 공사 한 건</p>
      <label class="site-name"><span class="sr">현장 이름</span><input id="siteName" value="${esc(st.name)}" maxlength="30" data-fk="sitename" autocomplete="off"><small>이름을 눌러 바꿀 수 있어요.</small></label>
      <div class="board board-bg" aria-label="현장 보드">${pins.join('')}${pins.length < 2 ? '<p class="board-empty">전문가와 자재를 담으면 이 보드에 꽂힙니다.</p>' : ''}</div>
    </section>
    <div class="site-grid">
      <div>
        <section class="site-block">${secH('맡길 전문가', `${st.experts.length}곳`, `<a class="more" href="#/search?tab=expert">${ic('plus')}전문가 찾기</a>`)}
          ${exRows ? `<ul class="ilist">${exRows}</ul>` : '<p class="note">아직 담긴 전문가가 없어요. 전문가 페이지에서 ‘현장에 담기’를 눌러 보세요.</p>'}</section>
        <section class="site-block">${secH('필요한 자재', `${st.materials.length}종`, `<a class="more" href="#/search?tab=material">${ic('plus')}자재 담기</a>`)}
          ${mtRows ? `<ul class="ilist">${mtRows}</ul>` : '<p class="note">아직 담긴 자재가 없어요.</p>'}
          ${t.t ? '' : `<div class="banner" style="margin-top:16px"><p>${ic('lock')}로그인하면 자재가 내 등급 가격으로 다시 계산돼요.</p><button class="btn blue sm" type="button" data-act="demo-login">데모 로그인</button></div>`}</section>
      </div>
      <aside class="site-total" aria-label="예상 총비용">
        <h2>예상 총비용</h2>
        ${totalsHTML(t, true)}
        <div class="sum-cta">${reqBtn(st, 'block')}</div>
        <p class="note">견적 요청에는 이 현장의 패키지·자재 목록·예상 총비용이 함께 갑니다.</p>
        <p class="site-reset"><button class="linkbtn" type="button" data-act="reset">처음 시안 상태로 되돌리기</button></p>
      </aside>
    </div>`;
  }

  function vDone() {
    const rq = S.lastRequest;
    const exps = rq ? rq.experts.map(id => EXP[id]).filter(Boolean) : [];
    if (!exps.length) return `<section class="done"><p class="eyebrow">견적 요청</p><h1>아직 보낸 견적 요청이 없어요.</h1><div class="row"><a class="btn act lg" href="#/site">내 현장으로</a></div></section>`;
    return `
    <section class="done">
      <p class="eyebrow">견적 요청 완료</p>
      <h1>${exps.length}곳에 무료 견적을<br>요청했어요.</h1>
      <p class="flag">${ic('lock')}시안이라 실제로 전송되지는 않았습니다.</p>
      <p class="lead">현장 <b>${esc(rq.siteName)}</b>의 패키지·자재 목록·예상 총비용을 함께 보냈습니다.</p>
      <ul class="recips">${exps.map(e => `<li><img src="${expImg(e, 120, 120)}" alt=""><div><b>${esc(e.name)}</b><span>${esc(CAT[e.category].name)} · 평균 응답 ${e.responseHours}시간</span></div><em>요청됨</em></li>`).join('')}</ul>
      <section class="sec" style="padding-top:44px">
        <h2 style="font-size:24px">다음 순서</h2>
        <ol class="steps">
          <li>전문가가 현장 정보를 보고 견적을 보냅니다. 업체별 평균 응답 시간은 위에 적혀 있어요.</li>
          <li>받은 견적을 이 현장 안에서 나란히 비교합니다.</li>
          <li>한 곳을 골라 계약합니다. ${esc(D.points.use)}.</li>
        </ol>
      </section>
      <div class="row"><a class="btn act lg" href="#/site">내 현장으로 돌아가기</a><a class="btn line lg" href="#/">홈으로</a></div>
    </section>`;
  }

  function vTiers() {
    const t = tier(), u = D.demoUser;
    const ex = [MAT.m1, MAT.m7, MAT.m10];
    const my = t
      ? `<div class="mycard"><div><p class="k">${esc(u.company)}</p><p class="n">${esc(u.name)} 님 · ${esc(t.name)} 회원</p></div><div><p class="k">보유 포인트</p><p class="pt">${num(u.points)}P</p></div><button class="btn ghost sm" type="button" data-act="logout">로그아웃</button><p class="use">쓰는 곳: ${esc(D.points.use)}</p></div>`
      : `<div class="banner"><p>${ic('lock')}로그인하면 내 등급과 보유 포인트가 여기에 보여요.</p><button class="btn blue sm" type="button" data-act="demo-login">데모 로그인 (김건축 · 골드)</button></div>`;
    return `
    <section class="page-hero">
      <p class="eyebrow">회원 등급 · 포인트</p>
      <h1>등급이 오를수록<br>자재 단가가 내려갑니다.</h1>
      <p class="lead">BUILDGO 자재 도매몰은 회원만 이용합니다. 등급에 따라 자재 할인율과 포인트 적립률이 달라져요.</p>
    </section>
    <section class="sec">${secH('내 등급', t ? esc(t.name) + ' 회원' : '로그인 전')}${my}</section>
    <section class="sec">${secH('등급표', '4단계')}
      <div class="tiers">${D.tiers.map(tr => `<article class="tier ${t && t.id === tr.id ? 'me' : ''}">${t && t.id === tr.id ? '<span class="me-tag">내 등급</span>' : ''}<h3>${esc(tr.name)}</h3><p class="d">${tr.discount ? '−' + tr.discount + '%' : '0%'}<small>자재 할인</small></p><p class="p">포인트 ${tr.pointRate}% 적립</p><p class="r">${esc(tr.rule)}</p></article>`).join('')}</div>
    </section>
    <section class="sec">${secH('같은 자재, 등급별 가격', '예시 3종')}
      <div class="tablewrap"><table class="ttable"><thead><tr><th>자재</th>${D.tiers.map(tr => `<th class="r">${esc(tr.name)}</th>`).join('')}</tr></thead><tbody>
        ${ex.map(m => `<tr><td><a href="#/material/${m.id}"><b>${esc(m.name)}</b></a><br><span style="font-size:12.5px;color:var(--mute)">1${esc(unitShort(m))}</span></td>${D.tiers.map(tr => `<td class="r${t && t.id === tr.id ? ' mecell' : ''}">${won(memberPrice(m.price, tr))}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div>
    </section>
    <section class="sec">${secH('추천 적립 · 1단계', `추천한 회원이 첫 구매하면 ${num(D.points.referral)}P`)}
      <div class="ref">
        <div><p class="who-k">나</p><p class="who-n">추천 링크를 보냄</p><p class="gain">+${num(D.points.referral)}P 적립</p></div>
        <div><p class="who-k">내가 추천한 회원</p><p class="who-n">가입 후 첫 구매</p><p class="gain">이때 1번만 적립</p></div>
        <div><p class="who-k">그 회원이 추천한 회원</p><p class="who-n">추천의 추천</p><p class="gain no">나에게 적립 없음</p></div>
      </div>
      <p class="ref-rule">${esc(D.points.referralRule)}</p>
      <div class="row" style="margin-top:16px"><button class="btn line" type="button" data-act="copy-ref">추천 링크 복사 (예시)</button></div>
    </section>`;
  }

  function avgPrice(cat) {
    const ps = D.experts.filter(e => e.category === cat).flatMap(e => e.packages).map(p => p.price).filter(p => p > 0);
    return ps.length ? Math.round(ps.reduce((a, b) => a + b, 0) / ps.length / 100000) * 100000 : null;
  }
  function joinVals() {
    const j = ui.join, avg = avgPrice(j.cat);
    const price = j.price != null ? j.price : (avg || 3000000);
    return { j, avg, price, count: j.count, total: j.count * price };
  }
  function vJoin() {
    const { j, avg, price, count, total } = joinVals();
    return `
    <section class="page-hero">
      <p class="eyebrow">전문가 입점</p>
      <h1>가진 기술을 패키지로 올리고,<br>현장 단위로 견적 요청을 받으세요.</h1>
      <p class="lead">설계부터 시공까지, 공종별 전문가가 패키지(가격·기간·포함 항목)를 올리면 고객은 자기 현장에 담아 견적을 요청합니다.</p>
    </section>
    <section class="calc">
      <div class="calc-in">
        <fieldset><legend>공종</legend><div class="chips">${D.categories.map(c => `<button class="chip ${j.cat === c.id ? 'on' : ''}" type="button" data-act="join-cat" data-id="${c.id}" aria-pressed="${j.cat === c.id}">${ic(c.icon)}${esc(c.name)}</button>`).join('')}</div></fieldset>
        <fieldset><legend>활동 지역 <span style="font-weight:600;color:var(--mute)">(여러 곳 선택)</span></legend><div class="chips">${D.regions.map(rg => `<button class="chip ${j.regions.indexOf(rg) >= 0 ? 'on' : ''}" type="button" data-act="join-region" data-id="${esc(rg)}" aria-pressed="${j.regions.indexOf(rg) >= 0}">${esc(rg)}</button>`).join('')}</div></fieldset>
        <label class="range"><span>한 달 처리 건수 <output id="jCountOut">${count}건</output></span><input id="jCount" type="range" min="1" max="40" step="1" value="${count}"><span class="ends"><span>1건</span><span>40건</span></span></label>
        <label class="range"><span>평균 단가 <output id="jPriceOut">${won(price)}</output></span><input id="jPrice" type="range" min="100000" max="50000000" step="100000" value="${price}"><span class="ends"><span>10만원</span><span>5,000만원</span></span></label>
      </div>
      <div class="calc-out" aria-live="polite">
        <p class="k">예상 월 매출 · ${esc(CAT[j.cat].name)} · ${j.regions.length ? esc(j.regions.join('·')) : '지역 미선택'}</p>
        <p class="big" id="jOut">${won(total)}</p>
        <p class="formula" id="jFormula">${count}건 × ${won(price)}</p>
        <p class="note">계산식은 단순 곱셈입니다(한 달 처리 건수 × 평균 단가). 수수료·자재비·인건비는 빼지 않은 금액이에요.</p>
        <p class="note">${avg ? '평균 단가 시작값은 이 분야 예시 패키지 가격의 평균입니다.' : '이 분야는 예시 가격이 모두 ‘현장 견적’이라 300만원에서 시작합니다.'}</p>
        <button class="btn act lg" type="button" data-act="join-start">전문가로 시작하기</button>
      </div>
    </section>
    <section class="sec">${secH('입점 순서', '3단계')}
      <ol class="steps3">
        <li><b>1</b><h3>서류 확인</h3><p>면허·사업자·보험을 확인합니다. 확인된 항목은 전문가 페이지에 표시돼요.</p></li>
        <li><b>2</b><h3>패키지 3단계 등록</h3><p>가격·기간·포함 항목을 적습니다. 가격을 정하기 어려우면 ‘현장 견적’으로 둡니다.</p></li>
        <li><b>3</b><h3>현장 단위로 요청 받기</h3><p>고객이 담은 현장 정보(패키지·자재·예상 비용)와 함께 견적 요청이 옵니다.</p></li>
      </ol>
    </section>`;
  }
  const notFound = () => `<section class="page-hero"><p class="eyebrow">없는 화면</p><h1>찾는 화면이 없어요.</h1><div class="row"><a class="btn act lg" href="#/">홈으로</a></div></section>`;

  /* ---------- router ---------- */
  const ROUTES = { home: vHome, search: vSearch, expert: vExpert, material: vMaterial, site: vSite, done: vDone, tiers: vTiers, join: vJoin };
  const NO_RAIL = { site: 1, join: 1, done: 1 };
  const TITLES = { home: '홈', search: '검색', expert: '전문가', material: '자재', site: '내 현장', done: '견적 요청 완료', tiers: '회원 등급·포인트', join: '전문가 입점' };
  function parse() {
    const h = location.hash.slice(1) || '/';
    const i = h.indexOf('?');
    const path = i < 0 ? h : h.slice(0, i);
    const parts = path.split('/').filter(Boolean);
    return { path, parts, q: new URLSearchParams(i < 0 ? '' : h.slice(i + 1)), name: parts[0] || 'home' };
  }
  let lastPath = null, curKey = null;
  const scrollMem = {};
  window.addEventListener('scroll', () => { if (curKey) scrollMem[curKey] = window.scrollY; }, { passive: true });
  function render() {
    const r = parse();
    const fn = ROUTES[r.name] || vHome;
    const navigated = r.path !== lastPath;
    lastPath = r.path;
    let restore = null;
    const hs = history.state;
    if (hs && hs.k) { curKey = hs.k; restore = scrollMem[hs.k]; }
    else { curKey = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); history.replaceState({ k: curKey }, ''); }
    closeSheet(true); closeModal(true); closeMenu();
    document.body.classList.toggle('norail', !!NO_RAIL[r.name]);
    document.body.classList.toggle('nobar', !!NO_RAIL[r.name]);
    view.innerHTML = fn(r);
    document.title = `${TITLES[r.name] || '홈'} — BUILDGO 시안 3`;
    const navKey = r.name === 'expert' || r.name === 'material' ? 'search' : r.name;
    $$('[data-nav]').forEach(a => { if (a.dataset.nav === navKey) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (navigated) {
      ui.qty = {};
      window.scrollTo(0, restore != null ? restore : 0);
      view.focus({ preventScroll: true });
      if (!reduce()) view.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    renderChrome();
  }
  function renderView() {
    const r = parse();
    const fn = ROUTES[r.name] || vHome;
    const a = document.activeElement;
    const fk = a && a.dataset ? a.dataset.fk : null;
    view.innerHTML = fn(r);
    const st = site(), t = totals(st);
    $$('[data-summary]', view).forEach(el => { el.innerHTML = summaryHTML(el.dataset.summary, st, t); });
    if (fk) { const el = view.querySelector(`[data-fk="${fk}"]`); if (el && !el.disabled) el.focus({ preventScroll: true }); }
  }

  /* ---------- chrome (header · rail · bar · sheet) ---------- */
  let shown = null;
  function renderChrome(o = {}) {
    const st = site(), t = totals(st);
    $$('[data-who]').forEach(b => {
      b.innerHTML = S.user ? `${ic('user')}<span class="who-n">${esc(D.demoUser.name)}</span><span class="tier-b">${esc(TIER[D.demoUser.tier].name)}</span>` : `${ic('user')}<span>로그인</span>`;
      b.dataset.act = S.user ? 'go-tiers' : 'login';
      b.setAttribute('aria-label', S.user ? `${D.demoUser.name} 님 · ${TIER[D.demoUser.tier].name} 회원 — 등급·포인트 보기` : '로그인');
    });
    $$('[data-count-badge]').forEach(b => { b.textContent = t.count; });
    $$('[data-summary]').forEach(el => { el.innerHTML = summaryHTML(el.dataset.summary, st, t); });
    $('#bar').innerHTML = barHTML(st, t);
    $('#bar').setAttribute('aria-label', `내 현장 ${st.name} — ${t.count}개 담김, 결제 예정 ${won(t.pay)}. 요약 열기`);
    if (o.pulse && shown && !reduce()) {
      $$('[data-num]').forEach(el => { const k = el.dataset.num; if (shown[k] != null && shown[k] !== t[k]) countUp(el, shown[k], t[k]); });
      $$('#rail .tot, #view .tot, [data-summary="card"] .hs-in').forEach(flash);
      if (o.newKey) $$(`#rail [data-row="${o.newKey}"]`).forEach(flash);
      const bi = $('#bar .bar-ico');
      if (bi) bi.animate([{ backgroundColor: 'rgba(35,55,217,1)' }, { backgroundColor: 'rgba(255,255,255,.1)' }], { duration: 900, easing: 'ease-out' });
    }
    shown = t;
  }
  function countUp(el, from, to) {
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '원', d = 480, t0 = performance.now();
    const fmt = v => pre + num(v) + suf;
    el.textContent = fmt(from);
    const step = now => {
      const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(() => { el.textContent = fmt(to); }, d + 120);
  }
  const flash = el => {
    if (reduce() || !el || !el.animate) return;
    el.animate([{ backgroundColor: 'rgba(35,55,217,.13)' }, { backgroundColor: 'rgba(35,55,217,0)' }], { duration: 1000, easing: 'ease-out' });
  };

  /* ---------- 담기 연출 (WAAPI) ---------- */
  function flyTarget() {
    const sels = ['#rail [data-fly-target]', '#bar [data-fly-target]', '.nav [data-fly-target]'];
    for (const s of sels) {
      const el = $(s);
      if (el) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return el; }
    }
    return null;
  }
  function srcRect(btn) {
    const card = btn.closest('[data-card]');
    const img = card && card.querySelector('img');
    const vis = r => r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
    if (img) { const r = img.getBoundingClientRect(); if (vis(r)) return r; }
    return btn.getBoundingClientRect();
  }
  function fly(rect, img) {
    const target = flyTarget();
    if (reduce() || !rect || !target || !img) return Promise.resolve();
    const b = target.getBoundingClientRect(), size = 64;
    const x0 = rect.left + rect.width / 2 - size / 2, y0 = rect.top + rect.height / 2 - size / 2;
    const dx = b.left + b.width / 2 - size / 2 - x0, dy = b.top + b.height / 2 - size / 2 - y0;
    const el = document.createElement('div');
    el.className = 'fly';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `left:${x0}px;top:${y0}px;width:${size}px;height:${size}px`;
    el.innerHTML = `<img src="${img}" alt="">`;
    document.body.appendChild(el);
    const anim = el.animate([
      { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: 0.3 }
    ], { duration: 640, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'forwards' });
    return anim.finished.catch(() => {}).then(() => el.remove());
  }
  function commit(o = {}) {
    save();
    renderView();
    const go = () => renderChrome({ pulse: true, newKey: o.newKey });
    if (o.rect && o.img && !reduce()) fly(o.rect, o.img).then(go); else go();
    if (o.msg) toast(o.msg, o.action);
  }
  const viewAction = () => (railMQ.matches ? null : { act: 'sheet-open', label: '보기' });

  /* ---------- sheet · modal · menu · toast ---------- */
  function openSheet() {
    const w = $('#sheet');
    if (!w.hidden) return;
    w.hidden = false;
    document.documentElement.classList.add('locked');
    renderChrome();
    if (!reduce()) {
      $('.sheet', w).animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
      $('.scrim', w).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    }
    $('.sheet-x', w).focus({ preventScroll: true });
  }
  function closeSheet(instant) {
    const w = $('#sheet');
    if (w.hidden) return;
    const done = () => { w.hidden = true; document.documentElement.classList.remove('locked'); w.getAnimations({ subtree: true }).forEach(a => a.cancel()); };
    if (instant || reduce()) { done(); return; }
    const a = $('.sheet', w).animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 220, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    $('.scrim', w).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    a.finished.then(done, done);
    const bar = $('#bar'); if (bar) bar.focus({ preventScroll: true });
  }
  function openModal() {
    const w = $('#login');
    const u = D.demoUser, t = TIER[u.tier];
    $('[data-demo-user]', w).innerHTML = `<span class="av">${esc(u.name.slice(0, 1))}</span><div><b>${esc(u.name)} · ${esc(t.name)} 회원</b><span>${esc(u.company)} · 자재 −${t.discount}% · 적립 ${t.pointRate}% · ${num(u.points)}P 보유</span></div>`;
    w.hidden = false;
    document.documentElement.classList.add('locked');
    if (!reduce()) $('.modal', w).animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
    $('[data-act="demo-login"]', w).focus({ preventScroll: true });
  }
  function closeModal() {
    const w = $('#login');
    if (w.hidden) return;
    w.hidden = true;
    if ($('#sheet').hidden) document.documentElement.classList.remove('locked');
  }
  function closeMenu() {
    const m = $('#mnav');
    if (!m.hidden) { m.hidden = true; $('.menu-btn').setAttribute('aria-expanded', 'false'); }
  }
  let toastTimer = 0;
  function toast(msg, action) {
    const el = $('#toast');
    el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button class="toast-a" type="button" data-act="${action.act}">${esc(action.label)}</button>` : ''}`;
    el.hidden = false;
    if (!reduce()) el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  /* ---------- actions ---------- */
  function login() {
    S.user = true; save(); closeModal();
    renderView(); renderChrome({ pulse: true });
    toast(`${D.demoUser.name} 님(${TIER[D.demoUser.tier].name} 회원)으로 로그인했어요 — 등급가가 적용됩니다`);
  }
  function newSite() {
    const id = 's' + (S.seq++);
    S.sites.push({ id, name: `새 현장 ${S.sites.length + 1}`, experts: [], materials: [] });
    S.current = id; save();
    if (parse().name !== 'site') location.hash = '#/site';
    else { renderView(); renderChrome({ pulse: true }); }
    setTimeout(() => { const i = $('#siteName'); if (i) { i.focus(); i.select(); } }, 60);
    toast('새 현장을 만들었어요 — 이름을 바꿔 보세요');
  }
  function switchSite(id) {
    if (!S.sites.some(s => s.id === id)) return;
    S.current = id; save(); renderView(); renderChrome({ pulse: true });
    toast(`‘${site().name}’ 현장으로 바꿨어요`);
  }
  function setParam(k, v) {
    const r = parse();
    if (v) r.q.set(k, v); else r.q.delete(k);
    if (k === 'tab') { r.q.delete('mcat'); }
    const qs = r.q.toString();
    history.replaceState(history.state, '', '#/search' + (qs ? '?' + qs : ''));
    render();
  }
  function updateMaterialBox(m) {
    const qty = ui.qty[m.id] != null ? ui.qty[m.id] : m.moq;
    const p = $('#mPrice'), c = $('#mCta');
    if (p) p.innerHTML = mPriceHTML(m, qty);
    if (c) c.innerHTML = mCtaHTML(m, qty);
    const minus = $('.stepper [data-d="-1"]');
    if (minus) minus.disabled = qty <= m.moq;
  }
  function updateJoin() {
    const { price, count, total } = joinVals();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('jCountOut', count + '건'); set('jPriceOut', won(price)); set('jOut', won(total)); set('jFormula', `${count}건 × ${won(price)}`);
  }

  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const act = el.dataset.act, id = el.dataset.id;
    const st = site();
    switch (act) {
      case 'expert': {
        const e = EXP[id]; if (!e) return;
        const i = st.experts.findIndex(x => x.id === id);
        const pkg = el.dataset.pkg != null ? +el.dataset.pkg : 0;
        if (el.dataset.mode === 'add' && i < 0) {
          const rect = srcRect(el);
          st.experts.push({ id, pkg });
          commit({ rect, img: expImg(e, 160, 160), newKey: 'e-' + id, msg: `‘${st.name}’에 ${e.name}${josa(e.name, '을', '를')} 담았어요`, action: viewAction() });
        } else if (el.dataset.mode === 'swap' && i >= 0) {
          st.experts[i].pkg = pkg;
          commit({ msg: `${e.name} 패키지를 ‘${e.packages[pkg].tier}’${josa(e.packages[pkg].tier, '으로', '로')} 바꿨어요` });
        } else if (i >= 0) {
          st.experts.splice(i, 1);
          commit({ msg: `${e.name}${josa(e.name, '을', '를')} 현장에서 뺐어요` });
        }
        break;
      }
      case 'mat': {
        const m = MAT[id]; if (!m) return;
        const i = st.materials.findIndex(x => x.id === id);
        const inp = $('#mQty');
        const qty = inp && inp.dataset.id === id ? clampQty(m, inp.value) : m.moq;
        if (el.dataset.mode === 'add' && i < 0) {
          const rect = srcRect(el);
          st.materials.push({ id, qty });
          ui.qty[id] = qty;
          commit({ rect, img: matImg(m, 160, 160), newKey: 'm-' + id, msg: `${m.name} ${num(qty)}${unitShort(m)}${josa(unitShort(m), '을', '를')} 담았어요${S.user ? '' : ' — 로그인하면 등급 할인이 반영돼요'}`, action: viewAction() });
        } else if (el.dataset.mode === 'set' && i >= 0) {
          st.materials[i].qty = qty; ui.qty[id] = qty;
          commit({ msg: `현장 수량을 ${num(qty)}${unitShort(m)}${josa(unitShort(m), '으로', '로')} 바꿨어요` });
        } else if (i >= 0) {
          st.materials.splice(i, 1);
          commit({ msg: `${m.name}${josa(m.name, '을', '를')} 현장에서 뺐어요` });
        }
        break;
      }
      case 'pick-pkg': {
        if (ev.target.closest('button') && ev.target.closest('button') !== el) return;
        ui.pkg[id] = +el.dataset.i; renderView();
        break;
      }
      case 'quote-one': {
        const e = EXP[id]; if (!e) return;
        const sel = ui.pkg[id] != null ? ui.pkg[id] : defaultPkg(e);
        if (!st.experts.some(x => x.id === id)) st.experts.push({ id, pkg: sel });
        S.lastRequest = { siteName: st.name, experts: [id], at: Date.now() };
        save(); location.hash = '#/done';
        break;
      }
      case 'request-all': {
        if (!st.experts.length) return;
        S.lastRequest = { siteName: st.name, experts: st.experts.map(x => x.id), at: Date.now() };
        save(); closeSheet(true); location.hash = '#/done';
        break;
      }
      case 'mqty': {
        const m = MAT[id]; if (!m) return;
        const inp = $('#mQty');
        const cur = clampQty(m, inp ? inp.value : m.moq);
        const next = clampQty(m, cur + (+el.dataset.d));
        ui.qty[id] = next; if (inp) inp.value = next;
        updateMaterialBox(m);
        break;
      }
      case 'sqty': {
        const m = MAT[id], x = st.materials.find(y => y.id === id); if (!m || !x) return;
        x.qty = clampQty(m, x.qty + (+el.dataset.d));
        commit();
        break;
      }
      case 'srm': {
        const list = el.dataset.kind === 'e' ? st.experts : st.materials;
        const i = list.findIndex(x => x.id === id);
        if (i >= 0) { list.splice(i, 1); commit({ msg: '현장에서 뺐어요' }); }
        break;
      }
      case 'points': S.usePoints = !S.usePoints; commit(); break;
      case 'login': openModal(); break;
      case 'demo-login': login(); break;
      case 'logout': S.user = false; S.usePoints = false; save(); renderView(); renderChrome({ pulse: true }); toast('로그아웃했어요 — 자재는 정가로 보입니다'); break;
      case 'go-tiers': location.hash = '#/tiers'; break;
      case 'modal-close': closeModal(); break;
      case 'sheet-open': $('#toast').hidden = true; openSheet(); break;
      case 'sheet-close': closeSheet(); break;
      case 'menu': {
        const m = $('#mnav'); m.hidden = !m.hidden;
        el.setAttribute('aria-expanded', String(!m.hidden));
        break;
      }
      case 'set': setParam(el.dataset.k, el.dataset.v); break;
      case 'clear-filters': { const r = parse(); ['cat', 'region', 'mcat'].forEach(k => r.q.delete(k)); history.replaceState(history.state, '', '#/search?' + r.q.toString()); render(); break; }
      case 'switch-site': switchSite(id); break;
      case 'new-site': newSite(); break;
      case 'reset':
        if (window.confirm('담긴 전문가·자재와 현장을 처음 시안 상태로 되돌릴까요?')) { const u = S.user; S = fresh(); S.user = u; save(); renderView(); renderChrome({ pulse: true }); toast('처음 시안 상태로 되돌렸어요'); }
        break;
      case 'join-cat': ui.join.cat = id; ui.join.price = null; renderView(); break;
      case 'join-region': { const rs = ui.join.regions, i = rs.indexOf(id); if (i >= 0) rs.splice(i, 1); else rs.push(id); renderView(); break; }
      case 'join-start': toast('시안이라 신청은 저장되지 않아요 — 실제로는 서류 확인 단계로 이어집니다'); break;
      case 'copy-ref': {
        const link = 'https://buildgo.example/r/KIMGEONCHUK';
        try { if (navigator.clipboard) navigator.clipboard.writeText(link).catch(() => {}); } catch (err) { /* 복사 불가 환경 */ }
        toast('추천 링크를 복사했어요 (시안 — 예시 주소)');
        break;
      }
      default: break;
    }
  });

  document.addEventListener('change', ev => {
    const el = ev.target;
    if (el.matches('[data-change="site"]')) { if (el.value === '__new') newSite(); else switchSite(el.value); }
    else if (el.matches('[data-change="pkg"]')) {
      const x = site().experts.find(y => y.id === el.dataset.id);
      if (x) { x.pkg = +el.value; commit({ msg: '패키지를 바꿨어요' }); }
    } else if (el.id === 'mQty') {
      const m = MAT[el.dataset.id]; if (!m) return;
      const q = clampQty(m, el.value); el.value = q; ui.qty[m.id] = q; updateMaterialBox(m);
    } else if (el.id === 'siteName') {
      const st = site(); if (!el.value.trim()) { st.name = '이름 없는 현장'; el.value = st.name; save(); renderChrome(); }
    }
  });
  document.addEventListener('input', ev => {
    const el = ev.target;
    if (el.id === 'siteName') { site().name = el.value.slice(0, 30) || '이름 없는 현장'; save(); renderChrome(); }
    else if (el.id === 'mQty') { const m = MAT[el.dataset.id]; if (!m) return; ui.qty[m.id] = clampQty(m, el.value); const p = $('#mPrice'), c = $('#mCta'); if (p) p.innerHTML = mPriceHTML(m, ui.qty[m.id]); if (c) c.innerHTML = mCtaHTML(m, ui.qty[m.id]); }
    else if (el.id === 'jCount') { ui.join.count = +el.value; updateJoin(); }
    else if (el.id === 'jPrice') { ui.join.price = +el.value; updateJoin(); }
  });
  document.addEventListener('submit', ev => {
    const f = ev.target.closest('[data-search]');
    if (!f) return;
    ev.preventDefault();
    const q = (f.querySelector('input[name="q"]').value || '').trim();
    closeMenu();
    const next = '#/search' + (q ? '?q=' + encodeURIComponent(q) : '');
    if (location.hash === next) render(); else location.hash = next;
    const inp = f.querySelector('input'); if (inp) inp.blur();
  });
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!$('#login').hidden) closeModal();
    else if (!$('#sheet').hidden) closeSheet();
    else closeMenu();
  });
  railMQ.addEventListener('change', () => { if (railMQ.matches) closeSheet(true); });

  /* ---------- boot ---------- */
  $$('[data-notice]').forEach(el => { el.textContent = D.notice; });
  $$('[data-company]').forEach(el => { el.textContent = '운영 ' + D.brand.company; });
  const top = $('#top');
  const setTop = () => document.documentElement.style.setProperty('--top-h', top.offsetHeight + 'px');
  setTop();
  if (window.ResizeObserver) new ResizeObserver(setTop).observe(top);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', ev => { if (ev.key === KEY) { S = load(); renderView(); renderChrome(); } });
  render();
})();
