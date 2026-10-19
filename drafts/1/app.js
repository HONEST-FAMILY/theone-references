/* BUILDGO 시안 1 — 간지·인터랙션 (블루프린트 밤)
   화면: # 주소 전환 / 움직임: element.animate(WAAPI) / 외부 라이브러리 없음 */
(() => {
'use strict';
const D = window.BUILDGO, A = window.BGArt;
const app = document.getElementById('app');
if (!D || !A) { app.innerHTML = '<p class="wrap" style="padding:40px 0">재료(data.js·art.js)를 불러오지 못했습니다.</p>'; return; }

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'cubic-bezier(.2,.7,.1,1)';
const EASE_IO = 'cubic-bezier(.65,0,.35,1)';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const fmt = n => Math.round(Number(n)).toLocaleString('ko-KR');
const won = n => fmt(n) + '원';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const anim = (el, kf, opt) => { if (!el || RM || typeof el.animate !== 'function') return null; try { return el.animate(kf, opt); } catch (e) { return null; } };
const josa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1); return (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28) ? a : b; };

/* ── 데이터 ── */
const CATS = D.categories.map((c, i) => ({ ...c, code: 'A-' + pad2(i + 1), idx: i }));
const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));
const EXPS = D.experts.map((e, i) => ({ ...e, code: 'E-' + pad2(i + 1) }));
const EXP = Object.fromEntries(EXPS.map(e => [e.id, e]));
const MCATS = D.materialCategories;
const MCAT = Object.fromEntries(MCATS.map(c => [c.id, c]));
const MATS = D.materials.map((m, i) => ({ ...m, code: 'M-' + pad2(i + 1), idx: i }));
const MAT = Object.fromEntries(MATS.map(m => [m.id, m]));
const TIERS = D.tiers.map((t, i) => ({ ...t, level: i + 1 }));
const USER = D.demoUser, MY = TIERS.find(t => t.id === USER.tier) || TIERS[0];
const memberUnit = p => Math.round(p * (100 - MY.discount) / 100);
const ptsOf = amt => Math.floor(amt * MY.pointRate / 100);
const unitShort = m => m.unit.replace(/\(.*\)/, '');
const TYPE_LABEL = { house: '외관', plan: '도면', room: '실내' };

const store = {
  get(k, d) { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } }
};
const newQuote = id => { const e = id && EXP[id]; return { expert: e ? e.id : null, cat: e ? e.category : null, pkg: null, size: null, budget: null, when: null, region: null, name: '', phone: '', memo: '', agree: false, done: false }; };
const state = { member: !!store.get('bg1_member', false), cart: store.get('bg1_cart', []), quote: store.get('bg1_quote', null) || newQuote(), heroCat: null };
const saveQ = () => store.set('bg1_quote', state.quote);

/* ── 그림 ── */
const artCache = new Map();
const artURI = (type, seed) => { const k = type + ':' + seed; if (!artCache.has(k)) artCache.set(k, A.uri(A.forItem(type, seed))); return artCache.get(k); };
const texURI = m => { const k = 'tex:' + m.id; if (!artCache.has(k)) artCache.set(k, A.uri(A.texture(m.texture, { seed: m.idx * 7 + 5, w: 480, h: 360 }))); return artCache.get(k); };
const IC = {
  plan: '<path d="M5 6h22v20H5z"/><path d="M5 15h10v11M15 6v5M20 15h7M20 15v4"/>',
  beam: '<path d="M7 6h18M7 26h18M16 6v20"/><path d="M11 6v2.5h10V6M11 26v-2.5h10V26"/>',
  sofa: '<path d="M8 14v-3a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"/><path d="M6 14a2 2 0 0 1 2 2v3h16v-3a2 2 0 1 1 4 0v6H4v-6a2 2 0 0 1 2-2z"/><path d="M8 22v3M24 22v3"/>',
  pipe: '<path d="M4 9h9a7 7 0 0 1 7 7v12"/><path d="M4 15h7a3 3 0 0 1 3 3v10"/><path d="M4 7v10M12 28h10"/>',
  drop: '<path d="M16 4c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z"/><path d="M12 19.5a4 4 0 0 0 4 4"/>',
  window: '<path d="M7 4h18v24H7z"/><path d="M16 4v24M7 16h18"/>',
  search: '<circle cx="14" cy="14" r="8"/><path d="M20 20l6 6"/>',
  check: '<path d="M7 16.5l6 6L25 10"/>',
  lock: '<rect x="8" y="14" width="16" height="12" rx="2"/><path d="M11 14v-3a5 5 0 0 1 10 0v3"/>',
  arrow: '<path d="M6 16h20M19 9l7 7-7 7"/>',
  shield: '<path d="M16 4l10 4v7c0 6-4 10.5-10 13-6-2.5-10-7-10-13V8z"/><path d="M11.5 16l3 3 6-6"/>',
  doc: '<path d="M8 4h12l5 5v19H8z"/><path d="M20 4v5h5M12 16h9M12 21h6"/>',
  card: '<rect x="4" y="8" width="24" height="17" rx="2"/><path d="M4 13h24M8 20h6"/>',
  x: '<path d="M9 9l14 14M23 9L9 23"/>'
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 32 32" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ── 공통 조각 ── */
const QUICK = ['인테리어', '옥상 방수', '창호 교체', '인허가'];
const searchForm = (v = '') => `<form class="search" role="search" data-search autocomplete="off">${icon('search')}<input type="search" name="q" value="${esc(v)}" placeholder="필요한 시공 분야를 입력해 보세요" aria-label="시공 분야 검색" enterkeyhint="search"><button class="btn btn-primary btn-go" type="submit">검색</button><div class="suggest" hidden></div></form>`;
const startPrice = e => e.startPrice > 0 ? `<span class="num">${fmt(e.startPrice)}원~</span><small>시작가</small>` : `현장 견적<small>방문 후 안내</small>`;
const startPriceTxt = e => e.startPrice > 0 ? `${fmt(e.startPrice)}원부터` : '현장 견적';
const pkgPrice = p => p.price == null ? '현장 견적' : p.price === 0 ? '무료' : won(p.price);
const hay = e => { const c = CAT[e.category]; return [e.name, e.tagline, e.region, c.name, c.desc, e.verified.license, ...e.packages.flatMap(p => [p.tier, ...p.items]), ...e.portfolio.map(p => p.title)].join(' '); };
const matchExpert = (e, q) => !q || q.split(/\s+/).filter(Boolean).every(t => hay(e).includes(t));
const qs = o => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => { if (v && v !== 'all') p.set(k, v); }); const s = p.toString(); return s ? '?' + s : ''; };

function expertCard(e) {
  const c = CAT[e.category], p = e.portfolio[0];
  return `<article class="ex-card" data-id="${e.id}">
  <a class="ex-link" href="#/expert/${e.id}" data-shared="${e.id}">
    <div class="ex-thumb"><img src="${artURI(p.type, p.seed)}" alt="${esc(p.title)}" width="480" height="320"><span class="ex-code code">${c.code} / ${c.name}</span></div>
    <div class="ex-body">
      <div class="ex-top"><h3 class="ex-name">${esc(e.name)}</h3>${e.verified.license && e.verified.business ? `<span class="vbadge">${icon('check')}검증</span>` : ''}</div>
      <p class="ex-tag">${esc(e.tagline)}</p>
      <ul class="ex-meta"><li>${esc(e.region)}</li><li>경력 ${e.years}년</li><li>평균 ${e.responseHours}시간 내 응답</li></ul>
      <div class="ex-row"><span class="rating"><span class="star">★</span> <b>${e.rating.toFixed(1)}</b> · 후기 ${fmt(e.reviews)}</span><span class="ex-price">${startPrice(e)}</span></div>
    </div>
  </a>
  <a class="btn btn-primary" href="#/quote?expert=${e.id}">무료 견적 신청하기</a>
</article>`;
}

function priceHTML(price, opt = {}) {
  const cls = 'price' + (opt.lg ? ' lg' : '');
  const attrs = `data-price="${price}" data-unit="${esc(opt.unit || '')}" data-lg="${opt.lg ? 1 : ''}"`;
  if (!state.member) return `<div class="${cls} is-locked" ${attrs}><button class="p-lock" type="button" data-action="login">${icon('lock')}회원 전용 가격 — 로그인</button></div>`;
  const m = memberUnit(price);
  const unit = opt.unit ? `<span class="p-unit">/ ${esc(opt.unit)}</span>` : '';
  return `<div class="${cls} is-member" ${attrs}><s class="p-list"><span class="sr">정가 </span><span class="num">${won(price)}</span><i class="strike" aria-hidden="true"></i></s><span class="p-mem"><em class="p-tier">${MY.name} −${MY.discount}%</em><b class="num" data-from="${price}" data-to="${m}" data-suf="원">${won(m)}</b>${unit}</span></div>`;
}
const swatchHTML = (m, style = '') => `<div class="swatch" style="${style}"><img src="${texURI(m)}" alt="" width="480" height="360"><span class="swatch-hole"></span><span class="swatch-label">${m.code} · ${esc(m.spec)}</span></div>`;
function matCard(m) {
  return `<article class="mat-card" data-id="${m.id}">
  <a class="stretch" href="#/item/${m.id}" aria-label="${esc(m.name)} 자세히 보기"></a>
  <div class="tilt">${swatchHTML(m)}</div>
  <div class="mat-body"><p class="code">${esc(MCAT[m.category].name)}</p><h3>${esc(m.name)}</h3><p class="spec">${esc(m.spec)}</p>${priceHTML(m.price, { unit: m.unit })}<p class="stock">${esc(m.stock)} · 최소 ${m.moq}${esc(unitShort(m))}</p></div>
</article>`;
}

/* 회원 상태에 따라 다시 그리는 구역 */
const MR = {
  tierline: () => state.member
    ? `<p class="tierline">${icon('check')}<span><b>${esc(USER.name)}</b>님은 <b>${MY.name}</b> 등급 — 모든 자재 <b>${MY.discount}%</b> 할인, 결제 금액의 <b>${MY.pointRate}%</b> 적립</span></p>`
    : `<p class="tierline">${icon('lock')}<span>가격은 회원에게만 보입니다. 위쪽 <b>회원가 보기</b>를 켜 보세요.</span><button class="btn btn-sm btn-blue" type="button" data-action="login">회원가 보기</button></p>`,
  doorlogin: () => state.member ? `<a class="btn" href="#/tiers">내 등급 혜택 보기</a>` : `<button class="btn" type="button" data-action="login">회원가 보기 (데모 로그인)</button>`,
  totals: el => totalsHTML(MAT[el.dataset.id]),
  abinfo: el => abInfo(MAT[el.dataset.id]),
  mycard: () => myCard(),
  tower: () => towerHTML(),
  ttable: () => tierTable(),
  calc: () => calcRows(+(($('#calcRange') || {}).value || 1000000)),
  cart: () => cartBody()
};

/* ── 회원가 연출: 줄 긋기 → 숫자 내려가기 ── */
function countTo(el, from, to, dur, delay, suf = '') {
  if (!el) return;
  if (RM || from === to) { el.textContent = fmt(to) + suf; return; }
  const t0 = performance.now() + delay; el.textContent = fmt(from) + suf;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const step = now => { const t = Math.min(1, Math.max(0, (now - t0) / dur)); el.textContent = fmt(from + (to - from) * ease(t)) + suf; if (t < 1 && el.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function memberIn(root) {
  if (RM) return;
  const vh = innerHeight; let k = 0;
  $$('.is-member', root).forEach(p => {
    const r = p.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh || !r.width) return;
    const d = Math.min(k++, 10) * 50;
    $$('.strike', p).forEach(s => anim(s, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 440, delay: d + 80, easing: EASE_IO, fill: 'backwards' }));
    $$('.p-list', p).forEach(l => anim(l, [{ color: '#EEF1FF' }, { color: '#EEF1FF', offset: .4 }, { color: '#8D96C2' }], { duration: 700, delay: d, fill: 'backwards' }));
    $$('.p-tier', p).forEach(t => anim(t, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: d + 300, easing: EASE, fill: 'backwards' }));
    $$('[data-to]', p).forEach(n => countTo(n, +n.dataset.from, +n.dataset.to, 760, d + 360, n.dataset.suf || ''));
  });
}
function refreshMember(animate) {
  renderHeader();
  $$('.price[data-price]').forEach(el => { el.outerHTML = priceHTML(+el.dataset.price, { unit: el.dataset.unit, lg: !!el.dataset.lg }); });
  $$('[data-mr]').forEach(el => { const f = MR[el.dataset.mr]; if (f) el.innerHTML = f(el); });
  if (cur.name === 'tiers') bindCalc();
  if (animate && state.member) memberIn(app);
}
function setMember(on) {
  state.member = on; store.set('bg1_member', on);
  refreshMember(true);
  toast(on ? `데모 로그인 — ${USER.name}님(${MY.name} 등급) 회원가로 보여 드립니다` : '회원가 보기를 껐습니다');
}
function renderHeader() {
  $('#mtoggle').setAttribute('aria-checked', state.member ? 'true' : 'false');
  const who = $('#who');
  if (state.member) { who.hidden = false; who.innerHTML = `<b>${esc(USER.name)}</b> · ${MY.name} · <span class="num">${fmt(USER.points)}P</span>`; } else who.hidden = true;
  const n = state.cart.length, cn = $('#cartN'); cn.hidden = !n; cn.textContent = n;
}

let toastT = 0;
function toast(msg) {
  const el = $('#toast'); el.getAnimations && el.getAnimations().forEach(a => a.cancel());
  el.textContent = msg; el.classList.add('show');
  anim(el, [{ opacity: 0, transform: 'translate(-50%, 10px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 280, easing: EASE });
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    const a = anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' });
    const fin = () => { el.classList.remove('show'); if (a) a.cancel(); };
    if (a) a.onfinish = fin; else fin();
  }, 2600);
}

/* ── 첫 화면: 도면이 건물이 된다 ── */
const Hero = (() => {
  const W = 960, H = 560;
  const SEEDS = []; for (let s = 2; SEEDS.length < 8 && s < 500; s++) { if (A.rng(s)() >= 0.34) SEEDS.push(s); }
  const KIND = { design: 'plan', interior: 'room' };
  const TITLE = { plan: '평면도', room: '실내 투시도', facade: '입면도' };
  let token = 0, timers = [], si = 0;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const parseSVG = s => new DOMParser().parseFromString(s, 'image/svg+xml').documentElement;
  const ser = el => new XMLSerializer().serializeToString(el);
  const isBg = el => el.tagName === 'rect' && el.getAttribute('width') === '100%';
  const isGrid = el => el.tagName === 'line' && parseFloat(el.getAttribute('stroke-opacity') || '1') < 0.2;
  function lineify(str, stroke) {
    const svg = parseSVG(str);
    svg.querySelectorAll('rect,polygon,line,path,circle,ellipse,polyline').forEach(el => {
      if (isBg(el)) { el.remove(); return; }
      el.setAttribute('fill', 'none'); el.removeAttribute('fill-opacity'); el.removeAttribute('stroke-opacity');
      el.setAttribute('stroke', stroke);
      if (!el.getAttribute('stroke-width')) el.setAttribute('stroke-width', '2');
    });
    return ser(svg);
  }
  function colorPlan(str) {
    const svg = parseSVG(str), pal = ['#1a2670', '#22318f', '#172061', '#2a3aa8', '#1d2b84', '#24358f'];
    let i = 0;
    svg.querySelectorAll('rect').forEach(el => { if (el.getAttribute('stroke-width') === '3') { el.setAttribute('fill', pal[i++ % pal.length]); el.setAttribute('fill-opacity', '.92'); } });
    return ser(svg);
  }
  function build(kind, seed) {
    if (kind === 'plan') { const line = A.floorplan(seed, { w: W, h: H, stroke: '#6C84FF', bg: 'none', accent: '#9DB0FF' }); return { line, fill: colorPlan(line) }; }
    if (kind === 'room') { const fill = A.room(seed, { w: W, h: H, wall: '#111a48', floor: '#1d2b78', sofa: '#2337D9', stroke: '#3D5BFF' }); return { line: lineify(fill, '#6C84FF'), fill }; }
    return {
      line: A.facade(seed, { w: W, h: H, mode: 'line', stroke: '#6C84FF', bg: 'none' }),
      fill: A.facade(seed, { w: W, h: H, sky: 'none', wall: '#121B52', roof: '#2337D9', glass: '#7F95F0', accent: '#3D5BFF', stroke: '#4F68FF' }).replace(/#9fc79a/gi, '#1b2f6c')
    };
  }
  function setMeta(code, name, title) {
    const set = (id, v) => { const el = document.getElementById(id); if (!el || el.textContent === v) return; el.textContent = v; anim(el, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: EASE }); };
    set('heroCode', code); set('heroName', name); set('tbCode', code); set('tbTitle', title);
  }
  function stage(n) { $$('.stage-ind [data-s]').forEach(el => el.classList.toggle('on', +el.dataset.s <= n)); }
  function play(kind, seed, meta) {
    const my = ++token; clear();
    const root = $('#heroArt'); if (!root) return;
    const L = $('.art-line', root), F = $('.art-fill', root), lv = $('.art-level', root), lab = $('span', lv);
    const { line, fill } = build(kind, seed);
    setMeta(meta.code, meta.name, TITLE[kind]);
    root.dataset.kind = kind;
    const go = () => {
      if (my !== token) return;
      [L, F, lv].forEach(el => el.getAnimations && el.getAnimations().forEach(a => a.cancel()));
      L.innerHTML = line; F.innerHTML = fill;
      if (RM) { stage(2); return; }
      stage(0);
      const svg = $('svg', L);
      const all = $$('rect,polygon,line,path,circle,ellipse,polyline', svg);
      let minY = H;
      const shapes = all.filter(el => !isBg(el) && !isGrid(el)).map(el => {
        let b = { x: 0, y: 0, width: 0, height: 0 }; try { b = el.getBBox(); } catch (e) { /* 측정 불가 */ }
        if (b.y < minY) minY = b.y;
        return { el, b, area: Math.max(b.width, 1) * Math.max(b.height, 1) };
      }).sort((a, b) => (b.area - a.area) || (a.b.x - b.b.x));
      const STAG = Math.max(16, Math.min(46, 1300 / Math.max(shapes.length, 1)));
      shapes.forEach((o, i) => {
        let len = 0; try { len = o.el.getTotalLength(); } catch (e) { /* 길이 없음 */ }
        if (!len) return;
        o.el.style.strokeDasharray = `${len} ${len}`;
        anim(o.el, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 950, delay: 150 + i * STAG, easing: EASE_IO, fill: 'backwards' });
      });
      $$('text', svg).forEach((t, i) => anim(t, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 900 + i * 60, fill: 'backwards' }));
      all.filter(isGrid).forEach(g => anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 900, fill: 'backwards' }));
      anim(L, [{ opacity: 1 }, { opacity: 1 }], { duration: 10, fill: 'backwards' });
      const tDraw = 150 + shapes.length * STAG + 950, FD = 1500, fStart = tDraw - 250;
      const topPct = Math.max(0, (minY / H) * 100 - 3);
      const a = anim(F, [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: `inset(${topPct.toFixed(1)}% 0 0 0)` }], { duration: FD, delay: fStart, easing: EASE_IO, fill: 'backwards' });
      anim(lv, [{ top: '100%' }, { top: topPct.toFixed(1) + '%' }], { duration: FD, delay: fStart, easing: EASE_IO, fill: 'both' });
      anim(lv, [{ opacity: 0 }, { opacity: 1, offset: .08 }, { opacity: 1, offset: .88 }, { opacity: 0 }], { duration: FD, delay: fStart, fill: 'both' });
      anim(L, [{ opacity: 1 }, { opacity: .45 }], { duration: 900, delay: fStart + FD - 300, easing: 'ease', fill: 'backwards' });
      if (a && lab) {
        const tick = () => {
          if (my !== token) return;
          const p = a.effect.getComputedTiming().progress;
          if (a.playState === 'finished') { lab.textContent = '완공'; return; }
          lab.textContent = '시공 ' + Math.round((p || 0) * 100) + '%';
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      later(() => stage(1), fStart);
      later(() => stage(2), fStart + FD);
      if (!state.heroCat) later(() => { si = (si + 1) % SEEDS.length; play('facade', SEEDS[si], DEF); }, fStart + FD + 5200);
    };
    if (L.firstChild && !RM) {
      const o1 = getComputedStyle(L).opacity, o2 = getComputedStyle(F).opacity;
      anim(L, [{ opacity: o1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
      anim(F, [{ opacity: o2 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
      later(go, 270);
    } else go();
  }
  const DEF = { code: 'A-00', name: '설계부터 시공까지' };
  function show(catId) {
    if (!catId) { play('facade', SEEDS[si], DEF); return; }
    const c = CAT[catId], kind = KIND[catId] || 'facade';
    const ex = EXPS.find(e => e.category === catId);
    const seed = kind === 'facade' ? SEEDS[(c.idx + 3) % SEEDS.length] : (ex ? ex.seed : 7);
    play(kind, seed, { code: c.code, name: c.name });
  }
  return { start: () => show(state.heroCat), show, stop: () => { token++; clear(); } };
})();

/* ── 라우터 ── */
const scrollMap = {};
let cur = { name: null, key: null, id: null };
let navClick = false, firstRoute = true, pendingShared = null, lastDetail = null, revealIO = null, listF = null, shopCat = 'all';
const go = h => { navClick = true; if (location.hash === h) route(); else location.hash = h; };
const parse = () => { const raw = location.hash.replace(/^#/, '') || '/'; const [path, q = ''] = raw.split('?'); return { raw, parts: path.split('/').filter(Boolean), q: new URLSearchParams(q) }; };
const NAVMAP = { home: 'home', experts: 'experts', expert: 'experts', quote: 'quote', shop: 'shop', item: 'shop', tiers: 'tiers', cart: 'cart' };
const TITLES = { home: '홈', experts: '전문가 찾기', expert: '전문가 상세', quote: '무료 견적 요청', shop: '회원전용 자재 도매몰', item: '자재 상세', tiers: '회원 등급·포인트', cart: '장바구니' };

function route() {
  const r = parse();
  if (cur.key != null) scrollMap[cur.key] = window.scrollY;
  lastDetail = null;
  if (cur.name === 'expert') { const m = $('#dtMedia'); if (m) lastDetail = { id: cur.id, rect: m.getBoundingClientRect(), src: $('img', m).getAttribute('src') }; }
  const prev = cur;
  const name = VIEWS[r.parts[0] || 'home'] ? (r.parts[0] || 'home') : 'notfound';
  Hero.stop();
  if (revealIO) revealIO.disconnect();
  $$('.ghost').forEach(g => g.remove());
  app.innerHTML = (VIEWS[name] || vNotFound)(r);
  cur = { name, key: r.raw, id: r.parts[1] || null };
  document.body.dataset.route = name;
  document.body.classList.toggle('has-action', !!$('.actionbar', app));
  const nv = NAVMAP[name];
  $$('[data-nav]').forEach(a => a.setAttribute('aria-current', a.dataset.nav === nv ? 'page' : 'false'));
  const wasClick = navClick; navClick = false;
  window.scrollTo(0, wasClick ? 0 : (scrollMap[r.raw] || 0));
  if (!wasClick && !firstRoute) $$('.rv', app).forEach(el => el.classList.add('in'));
  const ctx = { r, prev, wasClick };
  if (AFTER[name]) AFTER[name](ctx);
  observeReveals();
  document.title = (TITLES[name] || '화면 없음') + ' — BUILDGO 시안 1';
  firstRoute = false;
}

const ONREVEAL = {
  fan(el, d) { $$('.fan .swatch', el).forEach((s, i) => anim(s, [{ transform: 'rotate(0deg) translateY(18px)' }, { transform: `rotate(${FAN[i]}deg)` }], { duration: 1100, delay: d + 260 + i * 80, easing: EASE, fill: 'backwards' })); },
  tower(el, d) { $$('.floor', el).forEach((f, i) => anim(f, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: d + 200 + i * 120, easing: EASE, fill: 'backwards' })); }
};
function observeReveals() {
  const els = $$('.rv:not(.in)', app);
  if (RM || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  revealIO = new IntersectionObserver(entries => {
    let k = 0;
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; revealIO.unobserve(el); el.classList.add('in');
      const d = Math.min(k++, 6) * 80;
      anim(el, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 760, delay: d, easing: EASE, fill: 'backwards' });
      const hook = ONREVEAL[el.dataset.onreveal]; if (hook) hook(el, d);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
  els.forEach(el => revealIO.observe(el));
}
const stagger = (sel, base = 60) => $$(sel, app).forEach((el, i) => anim(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: base + i * 55, easing: EASE, fill: 'backwards' }));

/* ── 카드 → 상세: 공유 요소(WAAPI) ── */
function fly(src, from, to, r0, r1, onStart, onDone) {
  if (!from || from.width < 2 || to.width < 2) return false;
  const g = document.createElement('div'); g.className = 'ghost'; g.innerHTML = `<img src="${src}" alt="">`;
  const box = r => ({ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  Object.assign(g.style, box(from), { borderRadius: r0 + 'px' });
  document.body.appendChild(g); onStart();
  const a = g.animate([{ ...box(from), borderRadius: r0 + 'px' }, { ...box(to), borderRadius: r1 + 'px' }], { duration: 660, easing: 'cubic-bezier(.22,.8,.16,1)', fill: 'forwards' });
  let fin = false; const end = () => { if (fin) return; fin = true; onDone(); g.remove(); };
  a.onfinish = end; setTimeout(end, 1300);
  return true;
}
function sharedIn(id) {
  const ps = pendingShared; pendingShared = null;
  if (!ps || ps.id !== id || RM) return false;
  const m = $('#dtMedia'); if (!m) return false;
  return fly(ps.src, ps.rect, m.getBoundingClientRect(), 0, 16, () => { m.style.visibility = 'hidden'; }, () => { m.style.visibility = ''; });
}
function sharedBack() {
  const ld = lastDetail; lastDetail = null;
  if (!ld || RM || ld.rect.bottom < 0 || ld.rect.top > innerHeight) return;
  const t = $(`a[data-shared="${ld.id}"] .ex-thumb`); if (!t) return;
  const to = t.getBoundingClientRect(); if (to.bottom < 0 || to.top > innerHeight) return;
  fly(ld.src, ld.rect, to, 16, 0, () => { t.style.visibility = 'hidden'; }, () => { t.style.visibility = ''; });
}

/* 목록 다시 배치(FLIP, WAAPI) */
function flipGrid(grid, mutate) {
  const before = new Map($$('[data-id]', grid).map(el => [el.dataset.id, el.getBoundingClientRect()]));
  mutate();
  if (RM) return;
  let k = 0;
  $$('[data-id]', grid).forEach(el => {
    const b = before.get(el.dataset.id), a = el.getBoundingClientRect();
    if (b) { const dx = b.left - a.left, dy = b.top - a.top; if (Math.abs(dx) + Math.abs(dy) > 1) anim(el, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 560, easing: EASE }); }
    else anim(el, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 60 + Math.min(k++, 6) * 50, easing: EASE, fill: 'backwards' });
  });
  const empty = $('.empty', grid); if (empty) anim(empty, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
}

/* 자재 견본 기울기(데스크톱 마우스만) */
function bindTilt() {
  if (!FINE || RM) return;
  $$('.mat-card, [data-tiltcard]', app).forEach(card => {
    if (card._tilt) return; card._tilt = 1;
    const sw = $('.swatch', card); if (!sw) return;
    const MAX = card.hasAttribute('data-tiltcard') ? 9 : 7;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      sw.style.transform = `perspective(900px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      sw.style.setProperty('--sx', (-cx * 1.4).toFixed(1) + 'px'); sw.style.setProperty('--sy', (14 + cy * 1.4).toFixed(1) + 'px');
      if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02) raf = requestAnimationFrame(loop);
      else { raf = 0; if (!tx && !ty) { sw.style.transform = ''; sw.style.removeProperty('--sx'); sw.style.removeProperty('--sy'); } }
    };
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX; ty = -((e.clientY - r.top) / r.height - 0.5) * 1.6 * MAX;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    card.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  });
}

/* ── 화면 1: 홈 ── */
const FAN = [-26, -13, 0, 13, 26];
const catCta = id => {
  if (!id) return `<p>분야를 누르면 뒤쪽 도면이 그 분야에 맞게 바뀝니다.</p><a class="link" href="#/experts">모든 분야 전문가 보기 ${icon('arrow')}</a>`;
  const c = CAT[id];
  return `<p><b>${c.code} ${c.name}</b> — ${c.desc}</p><a class="btn btn-primary" href="#/experts?cat=${id}">${c.name} 전문가 보기</a>`;
};
function vHome() {
  const feat = [...EXPS].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4);
  const sel = state.heroCat;
  const fanMats = ['m7', 'm6', 'm2', 'm11', 'm12'].map(id => MAT[id]);
  const doorMats = ['m1', 'm7', 'm10'].map(id => MAT[id]);
  return `
<section class="hero">
  <div class="hero-stage">
    <div class="hero-bg" aria-hidden="true">
      <div class="hero-art" id="heroArt"><div class="art-layer art-fill"></div><div class="art-layer art-line"></div><div class="art-level"><span>시공 0%</span></div></div>
      <div class="hero-shade"></div>
    </div>
    <div class="hero-copy wrap">
      <p class="code hero-code"><i class="dot"></i><span id="heroCode">A-00</span><span>/</span><span id="heroName">설계부터 시공까지</span></p>
      <h1 class="hero-h1">설계부터 시공까지,<br><em>검증된 전문가</em>에게 맡기세요</h1>
      <p class="hero-sub">필요한 시공 분야를 고르면 면허·사업자·보험을 확인한 전문가에게 무료로 견적을 받을 수 있습니다.</p>
      ${searchForm('')}
      <div class="quick"><span>자주 찾는 분야</span>${QUICK.map(q => `<a href="#/experts?q=${encodeURIComponent(q)}">${q}</a>`).join('')}</div>
    </div>
    <div class="stage-ind" aria-hidden="true"><span data-s="0">01 도면</span><i></i><span data-s="1">02 시공</span><i></i><span data-s="2">03 완공</span></div>
    <div class="title-block" aria-hidden="true"><div><span>DWG NO.</span><b id="tbCode">A-00</b></div><div><span>TITLE</span><b id="tbTitle">입면도</b></div><div><span>SCALE</span><b>1 : 100</b></div><div><span>PROJECT</span><b>BUILDGO</b></div></div>
  </div>
  <div class="wrap">
    <div class="cats" role="group" aria-label="시공 분야 고르기">${CATS.map(c => `<button class="cat" type="button" data-action="cat" data-id="${c.id}" aria-pressed="${sel === c.id}">${icon(c.icon)}<span class="cat-code">${c.code}</span><span class="cat-name">${c.name}</span><span class="cat-desc">${c.desc}</span></button>`).join('')}</div>
    <div class="cat-cta" id="catCta">${catCta(sel)}</div>
  </div>
</section>

<section class="sec wrap">
  <div class="sec-hd rv"><div><p class="code">S-02 / 추천 전문가</p><h2>면허와 사업자를 확인한 전문가</h2><p class="sub">카드를 누르면 패키지·포트폴리오·후기를 볼 수 있습니다.</p></div><a class="link" href="#/experts">전체 전문가 보기 ${icon('arrow')}</a></div>
  <div class="ex-grid g4 rv">${feat.map(expertCard).join('')}</div>
</section>

<section class="sec wrap" style="padding-top:0">
  <div class="mall-door ticked rv" data-onreveal="fan">
    <div>
      <p class="code">S-03 / 회원전용 자재 도매몰</p>
      <h2>회원만 사는 건설 자재,<br>등급이 오를수록 내려가는 가격</h2>
      <p class="sub">석고보드부터 시스템창호까지 ${MATS.length}가지 자재를 회원 등급별 가격으로 살 수 있습니다.</p>
      <div class="door-prices">${doorMats.map(m => `<a class="dp" href="#/item/${m.id}"><span class="dp-n"><small>${m.code}</small>${esc(m.name)}</span>${priceHTML(m.price, { unit: m.unit })}</a>`).join('')}</div>
      <div class="door-actions"><a class="btn btn-primary" href="#/shop">자재몰 들어가기</a><div class="contents" data-mr="doorlogin">${MR.doorlogin()}</div></div>
    </div>
    <div class="fan" aria-hidden="true">${fanMats.map((m, i) => swatchHTML(m, `--r:${FAN[i]}deg`)).join('')}</div>
  </div>
</section>

<section class="sec wrap" style="padding-top:0">
  <div class="taste">
    <div class="rv">
      <p class="code">S-04 / 회원 등급·포인트</p>
      <h2 class="h2">많이 쓸수록 쌓이는 혜택</h2>
      <p class="sub" style="margin-top:10px;color:var(--ink2)">등급이 오르면 자재 할인율과 포인트 적립률이 함께 올라갑니다. 내가 추천한 회원이 첫 구매를 하면 ${fmt(D.points.referral)}P가 1번 적립됩니다.</p>
      <div class="door-actions"><a class="btn" href="#/tiers">등급·포인트 자세히</a></div>
    </div>
    <div class="tower rv" data-onreveal="tower" data-mr="tower">${towerHTML()}</div>
  </div>
</section>

<section class="sec wrap" style="padding-top:0">
  <div class="sec-hd rv"><div><p class="code">S-05 / 이용 방법</p><h2>맡기는 방법은 세 단계</h2></div></div>
  <div class="steps rv">
    <div class="step ticked"><p class="code">STEP 01</p><b>분야 고르기</b><p>설계부터 외장·창호까지 필요한 분야를 고릅니다.</p></div>
    <div class="step ticked"><p class="code">STEP 02</p><b>무료 견적 받기</b><p>규모·예산·일정을 남기면 전문가가 견적을 보냅니다.</p></div>
    <div class="step ticked"><p class="code">STEP 03</p><b>비교하고 맡기기</b><p>패키지·후기·검증 정보를 비교해 맡길 곳을 정합니다.</p></div>
  </div>
</section>`;
}

/* ── 화면 2: 전문가 목록 ── */
const chip = (key, val, label, curv, code) => `<button class="chip" type="button" data-action="filter" data-key="${key}" data-val="${esc(val)}" aria-pressed="${curv === val}">${code ? `<span class="code">${code}</span>` : ''}${esc(label)}</button>`;
const filterExperts = f => EXPS.filter(e => (f.cat === 'all' || e.category === f.cat) && (f.region === 'all' || e.region.startsWith(f.region)) && matchExpert(e, f.q));
const listCards = f => { const l = filterExperts(f); return l.length ? l.map(expertCard).join('') : `<div class="empty">조건에 맞는 전문가가 아직 없습니다.<br>지역이나 분야를 바꿔 보세요.<br><button class="btn btn-sm" type="button" data-action="filter" data-key="reset">조건 모두 지우기</button></div>`; };
const listMeta = f => `<span>전문가 <b class="num">${filterExperts(f).length}</b>곳</span>${f.q ? `<a class="qchip" href="#/experts${qs({ cat: f.cat, region: f.region })}">‘${esc(f.q)}’ 검색어 지우기 ✕</a>` : ''}`;
function vExperts(r) {
  const f = { cat: CAT[r.q.get('cat')] ? r.q.get('cat') : 'all', region: D.regions.includes(r.q.get('region')) ? r.q.get('region') : 'all', q: (r.q.get('q') || '').trim() };
  listF = f;
  return `<div class="wrap">
  <header class="page-hd rv"><p class="code">E-00 / 전문가 찾기</p><h1>${f.q ? `‘${esc(f.q)}’ 검색 결과` : '전문가 찾기'}</h1><p class="sub">분야와 지역을 고르면 맞는 전문가만 남습니다.</p></header>
  <div class="rv" style="margin-top:16px;max-width:720px">${searchForm(f.q)}</div>
  <div class="filters rv">
    <div class="f-row"><span class="f-label code">분야</span><div class="chips">${chip('cat', 'all', '전체', f.cat)}${CATS.map(c => chip('cat', c.id, c.name, f.cat, c.code)).join('')}</div></div>
    <div class="f-row"><span class="f-label code">지역</span><div class="chips">${chip('region', 'all', '전체', f.region)}${D.regions.map(g => chip('region', g, g, f.region)).join('')}</div></div>
  </div>
  <div class="list-meta" id="listMeta">${listMeta(f)}</div>
  <div class="ex-grid g3" id="exGrid">${listCards(f)}</div>
</div>`;
}
function applyFilter(key, val) {
  if (!listF) return;
  const f = { ...listF };
  if (key === 'reset') { f.cat = 'all'; f.region = 'all'; f.q = ''; } else f[key] = val;
  listF = f;
  const h = '#/experts' + qs(f);
  history.replaceState(null, '', h); cur.key = h.slice(1);
  $$('.chip[data-key]').forEach(b => b.setAttribute('aria-pressed', String(f[b.dataset.key] === b.dataset.val)));
  $('#listMeta').innerHTML = listMeta(f);
  if (key === 'reset') { const h1 = $('.page-hd h1', app); if (h1) h1.textContent = '전문가 찾기'; const inp = $('form[data-search] input', app); if (inp) inp.value = ''; }
  const grid = $('#exGrid'); flipGrid(grid, () => { grid.innerHTML = listCards(f); });
}

/* ── 화면 3: 전문가 상세 ── */
const vItemRow = (label, text, ok, ic) => `<div class="vitem${ok ? '' : ' off'}"><span class="vi">${icon(ok ? ic : 'x')}</span><div><b>${label}</b><span>${text}</span></div></div>`;
function vExpert(r) {
  const e = EXP[r.parts[1]]; if (!e) return vNotFound();
  const c = CAT[e.category], p0 = e.portfolio[0], v = e.verified;
  return `<div class="wrap">
  <nav class="crumbs code" aria-label="현재 위치"><a href="#/experts">전문가 찾기</a><span>/</span><a href="#/experts?cat=${c.id}">${c.name}</a><span>/</span><span>${esc(e.name)}</span></nav>
  <div class="dt-hero">
    <div class="dt-media" id="dtMedia"><img src="${artURI(p0.type, p0.seed)}" alt="${esc(p0.title)}" width="480" height="320"><span class="ex-code code">${c.code} / ${esc(p0.title)}</span></div>
    <div class="dt-info">
      <p class="code dt-in">${e.code} / ${c.name} · ${esc(e.region)}</p>
      <h1 class="dt-in">${esc(e.name)}</h1>
      <p class="dt-tag dt-in">${esc(e.tagline)}</p>
      <dl class="dt-stats dt-in">
        <div><dt>평점</dt><dd><span class="num">★ ${e.rating.toFixed(1)}</span></dd></div>
        <div><dt>후기</dt><dd><span class="num">${fmt(e.reviews)}</span>개</dd></div>
        <div><dt>경력</dt><dd><span class="num">${e.years}</span>년</dd></div>
        <div><dt>평균 응답</dt><dd><span class="num">${e.responseHours}</span>시간</dd></div>
      </dl>
      <div class="verify dt-in">
        ${vItemRow('면허', v.license ? `${esc(v.license)} 면허 확인` : '면허 정보 없음', !!v.license, 'doc')}
        ${vItemRow('사업자', v.business ? '사업자 등록 확인' : '사업자 정보 없음', !!v.business, 'card')}
        ${vItemRow('보험', v.insurance ? '보험 가입 확인' : '보험 가입 정보 없음', !!v.insurance, 'shield')}
      </div>
      <div class="dt-actions dt-in"><a class="btn btn-primary" href="#/quote?expert=${e.id}">무료 견적 신청</a><button class="btn" type="button" data-action="scrollto" data-target="pk">패키지 비교</button></div>
    </div>
  </div>

  <section class="sec" id="pk">
    <div class="sec-hd rv"><div><p class="code">PKG / 패키지 비교</p><h2>패키지 3단계</h2><p class="sub">가격이 정해지지 않은 항목은 현장을 본 뒤 견적을 드립니다.</p></div></div>
    <div class="pkgs rv">${e.packages.map((p, i) => `<div class="pkg ticked"><p class="code">PKG-0${i + 1}</p><h3>${esc(p.tier)}</h3><p class="pkg-price${p.price == null ? ' est' : ''}">${pkgPrice(p)}</p><p class="pkg-days">${p.days ? `작업 기간 약 ${p.days}일` : '작업 기간은 현장 확인 후 안내'}</p><ul>${p.items.map(t => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul><a class="btn" href="#/quote?expert=${e.id}&pkg=${i}">이 패키지로 견적 요청</a></div>`).join('')}</div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="sec-hd rv"><div><p class="code">PF / 포트폴리오</p><h2>작업 사례</h2></div></div>
    <div class="pf-grid rv">${e.portfolio.map((p, i) => `<figure class="pf"><div class="pf-img"><img src="${artURI(p.type, p.seed)}" alt="${esc(p.title)}" loading="lazy" width="480" height="320"></div><figcaption>${esc(p.title)}<span class="code">P-0${i + 1} · ${TYPE_LABEL[p.type] || ''}</span></figcaption></figure>`).join('')}</div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="sec-hd rv"><div><p class="code">RV / 후기</p><h2>후기 <span class="num">${fmt(e.reviews)}</span>개 · 평점 <span class="num">${e.rating.toFixed(1)}</span></h2><p class="rv-note">최근 후기 일부를 보여 드립니다.</p></div></div>
    <div class="rv-list rv">${e.reviewsSample.map(x => `<blockquote class="review"><span class="stars" aria-label="별점 ${x.rating}점">${'★'.repeat(x.rating)}${'☆'.repeat(5 - x.rating)}</span><p>${esc(x.text)}</p><p class="by">${esc(x.author)} 고객</p></blockquote>`).join('')}</div>
    <div class="rv" style="margin-top:24px"><a class="btn btn-primary" href="#/quote?expert=${e.id}">${esc(e.name)}에 무료 견적 신청</a></div>
  </section>
</div>
<div class="actionbar"><div class="ab-info">${esc(e.name)}<b>${startPriceTxt(e)}</b></div><a class="btn btn-primary" href="#/quote?expert=${e.id}">무료 견적 신청</a></div>`;
}

/* ── 화면 4: 견적 요청 3단계 ── */
const Q_SIZE = ['10평 미만', '10~20평', '20~30평', '30~50평', '50평 이상', '아직 모름'];
const Q_BUDGET = ['500만원 미만', '500만~2,000만원', '2,000만~5,000만원', '5,000만원 이상', '아직 정하지 않음'];
const Q_WHEN = ['1개월 안에', '1~3개월 안에', '3개월 이후', '일정 협의'];
const qFwd = {};
const opt = (field, val, inner) => `<button class="opt" type="button" data-action="q-pick" data-field="${field}" data-val="${esc(val)}" aria-pressed="${state.quote[field] === val}">${inner}</button>`;
const group = (field, label, list, note) => `<div class="qgroup"><p>${label}${note ? `<small>${note}</small>` : ''}</p><div class="opts" data-group="${field}">${list.map(v => opt(field, v, `<span>${esc(v)}</span>`)).join('')}</div></div>`;
const maskPhone = p => { const d = String(p).replace(/\D/g, ''); return d.length >= 10 ? `${d.slice(0, 3)}-****-${d.slice(-4)}` : p; };
function vQuote(r) {
  const exId = r.q.get('expert');
  if (exId && EXP[exId] && (state.quote.expert !== exId || state.quote.done)) state.quote = newQuote(exId);
  else if (!exId && state.quote.done && r.q.get('step') !== 'done') state.quote = newQuote();
  if (exId && r.q.has('pkg')) { const k = +r.q.get('pkg'); state.quote.pkg = EXP[exId] && EXP[exId].packages[k] ? k : null; }
  saveQ();
  const step = ['1', '2', '3', 'done'].includes(r.q.get('step')) ? r.q.get('step') : '1';
  const Q = state.quote, e = Q.expert && EXP[Q.expert];
  const n = step === 'done' ? 3 : +step;
  const forE = e ? `<div class="qfor"><img src="${artURI(e.portfolio[0].type, e.portfolio[0].seed)}" alt=""><div><b>${esc(e.name)}</b><span>${CAT[e.category].name} · 평균 ${e.responseHours}시간 내 응답${Q.pkg != null && e.packages[Q.pkg] ? ` · ${esc(e.packages[Q.pkg].tier)} 패키지` : ''}</span></div></div>` : '';
  let body = '';
  if (step === '1') body = `<h2>어떤 시공이 필요하세요?</h2><p class="hint">분야를 하나 골라 주세요.</p>${forE}<div class="qgroup"><div class="opts opts-cat" data-group="cat">${CATS.map(c => opt('cat', c.id, `${icon(c.icon)}<span>${c.name}</span><small>${c.code}</small>`)).join('')}</div></div>`;
  if (step === '2') body = `<h2>규모·예산·일정을 알려 주세요</h2><p class="hint">대략적으로 골라도 괜찮습니다.</p>${forE}${group('size', '규모', Q_SIZE)}${group('budget', '예산', Q_BUDGET)}${group('when', '희망 일정', Q_WHEN)}${group('region', '지역', D.regions, '선택')}`;
  if (step === '3') body = `<h2>견적을 받을 연락처</h2><p class="hint">전문가가 이 번호로 견적을 보내 드립니다.</p>${forE}
    <div class="field"><label for="qName">이름</label><input id="qName" data-q="name" autocomplete="name" value="${esc(Q.name)}" placeholder="홍길동"></div>
    <div class="field"><label for="qPhone">휴대폰 번호</label><input id="qPhone" data-q="phone" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(Q.phone)}" placeholder="010-0000-0000"></div>
    <div class="field"><label for="qMemo">요청 내용 <small style="color:var(--ink3);font-weight:500">(선택)</small></label><textarea id="qMemo" data-q="memo" placeholder="예) 30평 아파트 욕실 2곳 방수와 타일 교체">${esc(Q.memo)}</textarea></div>
    <label class="agree"><input type="checkbox" data-q="agree" ${Q.agree ? 'checked' : ''}><span>견적 안내를 위한 개인정보 수집·이용에 동의합니다. (시안이라 실제로 수집하지 않습니다)</span></label>`;
  if (step === 'done') body = doneHTML(Q, e);
  const nav = step === 'done' ? '' : `<p class="err" id="qErr" role="alert"></p><div class="qnav">${n > 1 ? `<button class="btn" type="button" data-action="q-prev">이전</button>` : ''}<button class="btn btn-primary" type="button" data-action="q-next">${n === 3 ? '견적 요청 보내기' : '다음'}</button></div>`;
  const prog = step === 'done' ? '' : `<div class="qstep-label code"><span>STEP ${pad2(n)} / 03</span><span>${['분야', '규모·예산·일정', '연락처'][n - 1]}</span></div><div class="qprog">${[1, 2, 3].map(i => `<span class="${i <= n ? 'on' : ''}"><i></i></span>`).join('')}</div>`;
  return `<div class="wrap"><div class="qwrap"><header class="page-hd"><p class="code">QT / 무료 견적 요청</p><h1>${step === 'done' ? '요청 완료' : '무료 견적 요청'}</h1></header>${prog}<div class="qcard" id="qcard">${body}${nav}</div></div></div>`;
}
function doneHTML(Q, e) {
  const c = Q.cat && CAT[Q.cat];
  const rows = [['분야', c ? c.name : '-'], e ? ['전문가', e.name] : null, (e && Q.pkg != null && e.packages[Q.pkg]) ? ['패키지', e.packages[Q.pkg].tier] : null, ['규모', Q.size || '-'], ['예산', Q.budget || '-'], ['일정', Q.when || '-'], Q.region ? ['지역', Q.region] : null, ['연락처', Q.name ? `${Q.name} · ${maskPhone(Q.phone)}` : '-']].filter(Boolean);
  return `<div class="done"><svg class="done-mark" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="38"/><path d="M26 43l11 11 21-23"/></svg>
  <h2>견적 요청이 접수되었습니다</h2>
  <p class="hint">${e ? `${esc(e.name)}의 평균 응답 시간은 ${e.responseHours}시간입니다.` : '고른 분야의 전문가가 견적을 보내 드립니다.'}<br>시안이라 실제로 전송되지는 않습니다.</p>
  <dl class="summary">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <div class="done-actions"><a class="btn btn-primary" href="#/experts${c ? '?cat=' + c.id : ''}">다른 전문가도 보기</a><a class="btn" href="#/">홈으로</a></div></div>`;
}
function quotePick(t) {
  const f = t.dataset.field, v = t.dataset.val;
  state.quote[f] = (f === 'region' && state.quote[f] === v) ? null : v;
  saveQ();
  $$(`.opt[data-field="${f}"]`).forEach(b => b.setAttribute('aria-pressed', String(state.quote[f] === b.dataset.val)));
  const err = $('#qErr'); if (err) err.textContent = '';
}
function qGo(s) { qFwd[s] = true; go('#/quote?step=' + s); }
function quoteNext() {
  const step = parse().q.get('step') || '1', Q = state.quote, err = $('#qErr');
  const fail = m => { err.textContent = m; anim(err, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: EASE }); };
  if (step === '1') { if (!Q.cat) return fail('분야를 하나 골라 주세요.'); return qGo(2); }
  if (step === '2') { const miss = [!Q.size && '규모', !Q.budget && '예산', !Q.when && '희망 일정'].filter(Boolean); if (miss.length) return fail(`${miss.join('·')} 항목을 골라 주세요.`); return qGo(3); }
  if (step === '3') {
    if (!String(Q.name).trim()) return fail('이름을 적어 주세요.');
    if (String(Q.phone).replace(/\D/g, '').length < 10) return fail('휴대폰 번호를 확인해 주세요.');
    if (!Q.agree) return fail('개인정보 수집·이용 동의에 체크해 주세요.');
    Q.done = true; saveQ(); return qGo('done');
  }
}
function quotePrev() {
  const s = parse().q.get('step') || '1';
  if (qFwd[s]) { qFwd[s] = false; history.back(); }
  else { navClick = true; location.replace('#/quote?step=' + Math.max(1, (+s || 2) - 1)); }
}

/* ── 화면 5: 자재몰 · 상품 상세 · 장바구니 ── */
const shopChip = (id, name, curv) => `<button class="chip" type="button" data-action="shopcat" data-val="${id}" aria-pressed="${curv === id}">${esc(name)}</button>`;
const shopList = c => MATS.filter(m => c === 'all' || m.category === c);
function vShop(r) {
  shopCat = MCAT[r.q.get('cat')] ? r.q.get('cat') : 'all';
  return `<div class="wrap">
  <header class="page-hd mall-hd rv"><div><p class="code">MALL / 회원전용 자재 도매몰</p><h1>회원만 사는 건설 자재</h1><p class="sub">견본을 눌러 규격·출고일·최소 주문 수량을 확인하세요.</p></div><div data-mr="tierline">${MR.tierline()}</div></header>
  <div class="chips rv" style="margin-top:18px">${shopChip('all', '전체', shopCat)}${MCATS.map(c => shopChip(c.id, c.name, shopCat)).join('')}</div>
  <div class="mat-grid" id="matGrid">${shopList(shopCat).map(matCard).join('')}</div>
</div>`;
}
function applyShopCat(c) {
  shopCat = c; const h = '#/shop' + (c === 'all' ? '' : '?cat=' + c);
  history.replaceState(null, '', h); cur.key = h.slice(1);
  $$('.chip[data-action="shopcat"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.val === c)));
  const grid = $('#matGrid'); flipGrid(grid, () => { grid.innerHTML = shopList(c).map(matCard).join(''); });
  bindTilt();
}
const itemQty = {};
const qtyOf = m => itemQty[m.id] || m.moq;
function totalsHTML(m) {
  const q = qtyOf(m);
  if (!state.member) return `<div class="totals locked"><p>합계·등급 할인·적립 포인트는 회원에게만 보입니다.</p><button class="p-lock" type="button" data-action="login">${icon('lock')}회원 전용 가격 — 로그인</button></div>`;
  const list = m.price * q, mem = memberUnit(m.price) * q;
  return `<div class="totals is-member">
    <div class="t-row"><span>정가 합계 (${q}${esc(unitShort(m))})</span><s class="p-list"><span class="sr">정가 </span><span class="num">${won(list)}</span><i class="strike" aria-hidden="true"></i></s></div>
    <div class="t-row"><span>${MY.name} 등급 할인 ${MY.discount}%</span><span class="t-save">−${won(list - mem)}</span></div>
    <div class="t-row t-total"><span>회원가 합계</span><b class="num" data-from="${list}" data-to="${mem}" data-suf="원">${won(mem)}</b></div>
    <div class="t-row t-pts"><span>적립 예정 포인트 (${MY.pointRate}%)</span><b class="num" data-from="0" data-to="${ptsOf(mem)}" data-suf="P">${fmt(ptsOf(mem))}P</b></div>
  </div>`;
}
const abInfo = m => state.member ? `${qtyOf(m)}${esc(unitShort(m))} 회원가 합계<b>${won(memberUnit(m.price) * qtyOf(m))}</b>` : `회원 전용 가격<b>로그인 필요</b>`;
function vItem(r) {
  const m = MAT[r.parts[1]]; if (!m) return vNotFound();
  const rel = MATS.filter(x => x.category === m.category && x.id !== m.id).slice(0, 4);
  const us = esc(unitShort(m));
  return `<div class="wrap">
  <nav class="crumbs code" aria-label="현재 위치"><a href="#/shop">자재몰</a><span>/</span><a href="#/shop?cat=${m.category}">${esc(MCAT[m.category].name)}</a><span>/</span><span>${esc(m.name)}</span></nav>
  <div class="item">
    <div class="item-swatch it-in"><div class="tilt" data-tiltcard>${swatchHTML(m)}</div><p class="sample-note">질감 견본 그림입니다 · 실물 색과 다를 수 있습니다</p></div>
    <div class="item-info">
      <p class="code it-in">${m.code} / ${esc(MCAT[m.category].name)}</p>
      <h1 class="it-in">${esc(m.name)}</h1>
      <div class="it-in">${priceHTML(m.price, { unit: m.unit, lg: true })}</div>
      <dl class="spec-tbl it-in"><div><dt>규격</dt><dd>${esc(m.spec)}</dd></div><div><dt>판매 단위</dt><dd>${esc(m.unit)}</dd></div><div><dt>출고</dt><dd>${esc(m.stock)}</dd></div><div><dt>최소 주문</dt><dd>${m.moq}${us}</dd></div></dl>
      <div class="qty it-in"><span>수량<small>최소 ${m.moq}${us}부터</small></span><div class="stepper"><button type="button" data-action="qty" data-id="${m.id}" data-d="-1" aria-label="수량 줄이기">−</button><input type="number" inputmode="numeric" min="${m.moq}" max="9999" value="${qtyOf(m)}" data-qty="${m.id}" aria-label="수량"><button type="button" data-action="qty" data-id="${m.id}" data-d="1" aria-label="수량 늘리기">+</button></div></div>
      <div class="it-in" data-mr="totals" data-id="${m.id}">${totalsHTML(m)}</div>
      <div class="item-actions it-in"><button class="btn btn-primary" type="button" data-action="add-cart" data-id="${m.id}">장바구니 담기</button><a class="btn" href="#/cart">장바구니 보기</a></div>
    </div>
  </div>
  ${rel.length ? `<section class="sec related"><div class="sec-hd rv"><div><p class="code">REL / 같은 분류</p><h2>함께 보는 자재</h2></div></div><div class="mat-grid rv">${rel.map(matCard).join('')}</div></section>` : ''}
</div>
<div class="actionbar"><div class="ab-info" data-mr="abinfo" data-id="${m.id}">${abInfo(m)}</div><button class="btn btn-primary" type="button" data-action="add-cart" data-id="${m.id}">장바구니 담기</button></div>`;
}
function setQty(m, q) {
  const q0 = qtyOf(m); q = Math.max(m.moq, Math.min(9999, Math.round(q) || m.moq));
  itemQty[m.id] = q;
  const inp = $(`input[data-qty="${m.id}"]`); if (inp && +inp.value !== q) inp.value = q;
  const reg = $(`[data-mr="totals"][data-id="${m.id}"]`);
  if (reg) {
    reg.innerHTML = totalsHTML(m);
    if (state.member && q0 !== q) {
      const u = memberUnit(m.price);
      countTo($('.t-total .num', reg), u * q0, u * q, 320, 0, '원');
      countTo($('.t-pts .num', reg), ptsOf(u * q0), ptsOf(u * q), 320, 0, 'P');
    }
  }
  const ab = $('[data-mr="abinfo"]'); if (ab) ab.innerHTML = abInfo(m);
}
function pulseToggle() { anim($('#mtoggle'), [{ boxShadow: '0 0 0 0 rgba(147,166,255,.0)' }, { boxShadow: '0 0 0 5px rgba(147,166,255,.55)' }, { boxShadow: '0 0 0 0 rgba(147,166,255,0)' }], { duration: 900, easing: 'ease-out' }); }
function addCart(id) {
  const m = MAT[id]; if (!m) return;
  if (!state.member) { toast('회원만 구매할 수 있습니다 — 위쪽 ‘회원가 보기’를 켜 주세요'); pulseToggle(); return; }
  const q = qtyOf(m), it = state.cart.find(x => x.id === id);
  if (it) it.qty = Math.min(9999, it.qty + q); else state.cart.push({ id, qty: q });
  store.set('bg1_cart', state.cart); renderHeader();
  toast(`${m.name} ${q}${unitShort(m)}${josa(unitShort(m), '을', '를')} 장바구니에 담았습니다`);
  anim($('#cartN'), [{ backgroundColor: '#ffffff', color: '#0B1233' }, { backgroundColor: '#3D5BFF', color: '#ffffff' }], { duration: 700, easing: 'ease-out' });
}
function cartBody() {
  const items = state.cart.map(c => ({ ...c, m: MAT[c.id] })).filter(c => c.m);
  if (!items.length) return `<div class="empty" style="margin-top:16px">장바구니가 비어 있습니다.<br><a class="btn btn-primary" href="#/shop">자재 둘러보기</a></div>`;
  if (!state.member) return `<div class="totals locked" style="margin-top:16px"><p>장바구니는 회원만 볼 수 있습니다.</p><button class="p-lock" type="button" data-action="login">${icon('lock')}회원 전용 가격 — 로그인</button></div>`;
  let list = 0, mem = 0;
  const rows = items.map(({ m, qty }) => {
    list += m.price * qty; mem += memberUnit(m.price) * qty;
    return `<div class="cart-row" data-id="${m.id}"><a href="#/item/${m.id}" aria-label="${esc(m.name)} 상세">${swatchHTML(m)}</a><div><h3>${esc(m.name)}</h3><p class="spec">${esc(m.spec)} · ${esc(m.unit)}</p><p class="spec">회원가 ${won(memberUnit(m.price))} / ${esc(unitShort(m))}</p></div>
    <div class="cr-bot"><div class="stepper"><button type="button" data-action="cart-qty" data-id="${m.id}" data-d="-1" aria-label="수량 줄이기">−</button><input type="number" value="${qty}" readonly aria-label="수량"><button type="button" data-action="cart-qty" data-id="${m.id}" data-d="1" aria-label="수량 늘리기">+</button></div><span class="cr-sum">${won(memberUnit(m.price) * qty)}</span><button class="cr-del" type="button" data-action="cart-del" data-id="${m.id}">빼기</button></div></div>`;
  }).join('');
  return `<div class="cart-list">${rows}</div>
  <div class="totals is-member" style="margin-top:14px">
    <div class="t-row"><span>정가 합계</span><s class="p-list"><span class="sr">정가 </span><span class="num">${won(list)}</span><i class="strike" aria-hidden="true"></i></s></div>
    <div class="t-row"><span>${MY.name} 등급 할인 ${MY.discount}%</span><span class="t-save">−${won(list - mem)}</span></div>
    <div class="t-row t-total"><span>회원가 합계</span><b class="num" data-from="${list}" data-to="${mem}" data-suf="원">${won(mem)}</b></div>
    <div class="t-row t-pts"><span>적립 예정 포인트 (${MY.pointRate}%)</span><b class="num" data-from="0" data-to="${ptsOf(mem)}" data-suf="P">${fmt(ptsOf(mem))}P</b></div>
    <div class="t-row"><span>보유 포인트</span><span class="t-save">${fmt(USER.points)}P</span></div>
  </div>
  <p class="p-use" style="margin-top:10px">${esc(D.points.use)}</p>
  <div class="item-actions"><button class="btn btn-primary" type="button" data-action="order">주문하기</button><a class="btn" href="#/shop">더 담기</a></div>`;
}
function vCart() {
  return `<div class="wrap" style="max-width:860px"><header class="page-hd rv"><p class="code">CART / 장바구니</p><h1>장바구니</h1></header><div data-mr="cart">${cartBody()}</div></div>`;
}
function cartQty(id, d) {
  const it = state.cart.find(x => x.id === id), m = MAT[id]; if (!it || !m) return;
  it.qty = Math.max(m.moq, Math.min(9999, it.qty + d)); store.set('bg1_cart', state.cart);
  const reg = $('[data-mr="cart"]'); if (reg) reg.innerHTML = cartBody();
}
function cartDel(id) {
  state.cart = state.cart.filter(x => x.id !== id); store.set('bg1_cart', state.cart); renderHeader();
  const reg = $('[data-mr="cart"]'); if (reg) reg.innerHTML = cartBody();
}

/* ── 화면 6: 회원 등급·포인트 ── */
function towerHTML() {
  const me = state.member ? MY.id : null;
  return `<div class="tower-ground" aria-hidden="true"></div>${TIERS.map((t, i) => `<div class="floor${t.id === me ? ' me' : ''}" style="width:${100 - i * 9}%;--a:${(0.1 + i * 0.09).toFixed(2)}"><span class="fl">L${t.level}</span><b>${t.name}</b><span class="fv">할인 <strong>${t.discount}%</strong><br>적립 <strong>${t.pointRate}%</strong></span>${t.id === me ? '<span class="me-tag">내 등급</span>' : ''}</div>`).join('')}<p class="code tower-cap">등급이 오를수록 한 층씩 올라갑니다</p>`;
}
function tierTable() {
  const me = state.member ? MY.id : null;
  return `<div class="trow head"><span>등급</span><span>자재 할인</span><span>포인트 적립</span><span class="tc">조건</span></div>${TIERS.map(t => `<div class="trow${t.id === me ? ' me' : ''}"><span class="tn"><small>L${t.level}${t.id === me ? ' · 내 등급' : ''}</small>${t.name}</span><span class="tv">${t.discount}%</span><span class="tv">${t.pointRate}%</span><span class="tc">${esc(t.rule)}</span></div>`).join('')}`;
}
function myCard() {
  if (!state.member) return `<p class="code">MY / 내 포인트</p><p class="mc-name">로그인하면 내 등급과 포인트가 보입니다</p><p class="mc-co" style="margin-top:6px">시안에서는 데모 회원(${esc(USER.name)} · ${MY.name})으로 보여 드립니다.</p><button class="btn btn-blue" type="button" data-action="login">회원가 보기 (데모 로그인)</button>`;
  const next = TIERS[MY.level];
  return `<div class="is-member"><p class="code">MY / 내 포인트</p><p class="mc-name">${esc(USER.name)}님 · ${MY.name} 등급</p><p class="mc-co">${esc(USER.company)}</p><p class="mc-pts"><b class="num" data-from="0" data-to="${USER.points}" data-suf="">${fmt(USER.points)}</b><span>P 보유</span></p><div class="mc-rows"><span>자재 할인 <b>${MY.discount}%</b> · 포인트 적립 <b>${MY.pointRate}%</b></span>${next ? `<span>다음 등급 <b>${next.name}</b> — ${esc(next.rule)}</span>` : ''}</div></div>`;
}
const VIP = TIERS[TIERS.length - 1];
function calcVals(amt, t) { const save = Math.round(amt * t.discount / 100), pay = amt - save, pts = Math.floor(pay * t.pointRate / 100); return { save, pay, pts }; }
function calcRows(amt) {
  const me = state.member ? MY.id : null, vv = calcVals(amt, VIP), max = vv.save + vv.pts;
  return TIERS.map(t => { const v = calcVals(amt, t); return `<div class="crow${t.id === me ? ' me' : ''}" data-tier="${t.id}"><b>${t.name}</b><span class="bar"><i style="transform:scaleX(${((v.save + v.pts) / max).toFixed(3)})"></i></span><span class="cv">할인 <strong>${fmt(v.save)}원</strong><br>적립 <strong>${fmt(v.pts)}P</strong></span></div>`; }).join('');
}
function bindCalc() {
  const rng = $('#calcRange'); if (!rng || rng._b) return; rng._b = 1;
  rng.addEventListener('input', () => {
    const amt = +rng.value; $('#calcAmt').textContent = won(amt);
    const vv = calcVals(amt, VIP), max = vv.save + vv.pts;
    TIERS.forEach(t => { const row = $(`.crow[data-tier="${t.id}"]`); if (!row) return; const v = calcVals(amt, t); $('.bar i', row).style.transform = `scaleX(${((v.save + v.pts) / max).toFixed(3)})`; $('.cv', row).innerHTML = `할인 <strong>${fmt(v.save)}원</strong><br>적립 <strong>${fmt(v.pts)}P</strong>`; });
  });
}
function vTiers() {
  return `<div class="wrap">
  <header class="page-hd rv"><p class="code">TIER / 회원 등급·포인트</p><h1>많이 살수록 내려가는 자재 가격</h1><p class="sub">등급이 오르면 자재 할인율과 포인트 적립률이 함께 올라갑니다.</p></header>
  <div class="tiers-top">
    <div class="my-card ticked rv" data-mr="mycard">${myCard()}</div>
    <div class="tower rv" data-onreveal="tower" data-mr="tower">${towerHTML()}</div>
  </div>
  <section class="sec"><div class="sec-hd rv"><div><p class="code">T-01 / 등급표</p><h2>등급별 할인율·적립률·조건</h2></div></div><div class="ttable rv" data-mr="ttable">${tierTable()}</div></section>
  <section class="sec" style="padding-top:0"><div class="sec-hd rv"><div><p class="code">T-02 / 계산해 보기</p><h2>구매 금액별 혜택</h2><p class="sub">막대를 움직이면 등급별 할인 금액과 적립 포인트가 바로 계산됩니다. (적립은 할인 후 결제 금액 기준 예시)</p></div></div>
    <div class="calc rv"><div class="calc-amt"><span>한 번에 구매하는 금액</span><b class="num" id="calcAmt">1,000,000원</b></div><input type="range" id="calcRange" min="100000" max="10000000" step="100000" value="1000000" aria-label="구매 금액"><div class="calc-scale"><span>10만원</span><span>1,000만원</span></div><div class="calc-rows" data-mr="calc">${calcRows(1000000)}</div><p class="code" style="margin-top:10px;color:var(--ink3)">막대 = 할인 금액 + 적립 포인트</p></div></section>
  <section class="sec" style="padding-top:0"><div class="sec-hd rv"><div><p class="code">T-03 / 추천 적립</p><h2>추천 적립은 1단계만</h2></div></div>
    <div class="ref rv">
      <div class="ref-flow">
        <div class="node gain"><b>나</b><span>회원을 추천</span></div>
        <div class="arrow">추천</div>
        <div class="node gain"><b>내가 추천한 회원</b><span>첫 구매 → 나에게 ${fmt(D.points.referral)}P 1번 적립</span></div>
        <div class="arrow x">추천</div>
        <div class="node no"><b>그 회원이 추천한 회원</b><span>나에게는 적립되지 않음</span></div>
      </div>
      <p class="ref-rule">${esc(D.points.referralRule)}<small>추천 1건당 ${fmt(D.points.referral)}P</small></p>
      <p class="p-use"><b>포인트 사용</b> — ${esc(D.points.use)}</p>
    </div>
  </section>
</div>`;
}
const vNotFound = () => `<div class="wrap"><header class="page-hd"><p class="code">404</p><h1>찾는 화면이 없습니다</h1><p class="sub"><a class="link" href="#/">홈으로 가기</a></p></header></div>`;
const VIEWS = { home: vHome, experts: vExperts, expert: vExpert, quote: vQuote, shop: vShop, item: vItem, tiers: vTiers, cart: vCart };

/* 화면별 연결 */
const AFTER = {
  home(ctx) { Hero.start(); if (!ctx.wasClick) sharedBack(); },
  experts(ctx) { if (!ctx.wasClick) sharedBack(); },
  expert(ctx) {
    const used = ctx.wasClick && sharedIn(ctx.r.parts[1]);
    stagger('.dt-in', used ? 260 : 60);
    if (!used) anim($('#dtMedia'), [{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: EASE, fill: 'backwards' });
  },
  quote(ctx) {
    const s = ctx.r.q.get('step') || '1', n = s === 'done' ? 4 : +s || 1;
    let dir = 1;
    if (ctx.prev.name === 'quote') { const ps = new URLSearchParams(String(ctx.prev.key).split('?')[1] || '').get('step') || '1'; dir = n >= (ps === 'done' ? 4 : +ps || 1) ? 1 : -1; }
    anim($('#qcard'), [{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE, fill: 'backwards' });
    if (dir > 0 && n <= 3) { const seg = $$('.qprog span')[n - 1]; if (seg) anim(seg.firstElementChild, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 620, delay: 140, easing: EASE_IO, fill: 'backwards' }); }
    if (s === 'done') $$('.done-mark circle, .done-mark path').forEach((p, i) => { const len = p.getTotalLength(); p.style.strokeDasharray = `${len} ${len}`; anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: i ? 520 : 800, delay: i ? 700 : 150, easing: EASE_IO, fill: 'backwards' }); });
  },
  shop() { bindTilt(); },
  item() { bindTilt(); stagger('.it-in'); },
  tiers() { bindCalc(); },
  cart() { }
};

/* ── 이벤트 ── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  navClick = true;
  const sh = a.matches('[data-shared]') ? a : null;
  if (sh) { const t = $('.ex-thumb', sh); if (t) pendingShared = { id: sh.dataset.shared, rect: t.getBoundingClientRect(), src: $('img', t).getAttribute('src') }; }
  const href = a.getAttribute('href'), now = location.hash || '#/';
  if (href === now) { e.preventDefault(); navClick = false; window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); }
}, true);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const d = t.dataset;
  switch (d.action) {
    case 'toggle-member': setMember(!state.member); break;
    case 'login': e.preventDefault(); if (!state.member) setMember(true); break;
    case 'cat': {
      state.heroCat = state.heroCat === d.id ? null : d.id;
      $$('.cat').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === state.heroCat)));
      const cta = $('#catCta'); cta.innerHTML = catCta(state.heroCat);
      anim(cta, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: EASE });
      Hero.show(state.heroCat); break;
    }
    case 'filter': applyFilter(d.key, d.val); break;
    case 'shopcat': applyShopCat(d.val); break;
    case 'scrollto': { const el = document.getElementById(d.target); if (el) el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); break; }
    case 'q-pick': quotePick(t); break;
    case 'q-next': quoteNext(); break;
    case 'q-prev': quotePrev(); break;
    case 'qty': { const m = MAT[d.id]; if (m) setQty(m, qtyOf(m) + (+d.d)); break; }
    case 'add-cart': addCart(d.id); break;
    case 'cart-qty': cartQty(d.id, +d.d); break;
    case 'cart-del': cartDel(d.id); break;
    case 'order': toast('시안에서는 실제 주문이 진행되지 않습니다'); break;
  }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-search]'); if (!f) return;
  e.preventDefault();
  const q = f.q.value.trim(); $$('.suggest').forEach(b => { b.hidden = true; });
  go('#/experts' + (q ? '?q=' + encodeURIComponent(q) : ''));
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.matches('form[data-search] input[name="q"]')) {
    const box = $('.suggest', t.form), q = t.value.trim();
    if (!q) { box.hidden = true; box.innerHTML = ''; return; }
    const cs = CATS.filter(c => (c.name + ' ' + c.desc).includes(q)).slice(0, 3);
    const ex = EXPS.filter(x => matchExpert(x, q)).slice(0, 4);
    box.innerHTML = (cs.map(c => `<a href="#/experts?cat=${c.id}"><span class="code">${c.code}</span>${c.name}<small>분야</small></a>`).join('') + ex.map(x => `<a href="#/expert/${x.id}"><span class="code">${x.code}</span>${esc(x.name)}<small>${CAT[x.category].name}</small></a>`).join('')) || `<p class="none">‘${esc(q)}’에 맞는 분야가 아직 없습니다. 검색을 누르면 전체에서 찾아봅니다.</p>`;
    box.hidden = false;
  } else if (t.matches('[data-q]')) {
    state.quote[t.dataset.q] = t.type === 'checkbox' ? t.checked : t.value; saveQ();
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('input[data-qty]')) { const m = MAT[t.dataset.qty]; if (m) setQty(m, +t.value); }
  else if (t.matches('[data-q]')) { state.quote[t.dataset.q] = t.type === 'checkbox' ? t.checked : t.value; saveQ(); }
});
document.addEventListener('focusout', e => {
  const f = e.target.closest && e.target.closest('form[data-search]'); if (!f) return;
  setTimeout(() => { if (!f.contains(document.activeElement)) { const b = $('.suggest', f); if (b) b.hidden = true; } }, 220);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.suggest').forEach(b => { b.hidden = true; }); });

/* ── 시작 ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
$('#notice').textContent = D.notice;
$('#ftrNotice').textContent = D.notice;
$('#ftrCo').textContent = '· ' + D.brand.company;
renderHeader();
window.addEventListener('hashchange', route);
route();
})();
