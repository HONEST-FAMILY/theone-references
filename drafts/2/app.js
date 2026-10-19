/* BUILDGO 시안 2 · 사용성 — 한 페이지 앱 (# 주소로 화면 전환) */
(function () {
  'use strict';
  const D = window.BUILDGO;
  const A = window.BGArt;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MQ_PC = window.matchMedia('(min-width: 1180px)');

  /* ---------- 저장소 ---------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 환경 */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* noop */ } }
  };
  const K = { user: 'bg2.user', compare: 'bg2.compare', cart: 'bg2.cart', quotes: 'bg2.quotes', draft: 'bg2.quoteDraft', recent: 'bg2.recent' };

  const catById = {}; D.categories.forEach((c) => { catById[c.id] = c; });
  const expById = {}; D.experts.forEach((e) => { expById[e.id] = e; });
  const matById = {}; D.materials.forEach((m) => { matById[m.id] = m; });
  const mcatById = {}; D.materialCategories.forEach((c) => { mcatById[c.id] = c; });
  const tierById = {}; D.tiers.forEach((t) => { tierById[t.id] = t; });

  const S = {
    user: LS.get(K.user, null),
    compare: LS.get(K.compare, []).filter((id) => expById[id]).slice(0, 3),
    cart: LS.get(K.cart, []).filter((it) => matById[it.id]),
    quotes: LS.get(K.quotes, []),
    draft: LS.get(K.draft, null),
    recent: LS.get(K.recent, ['욕실 방수', '석고보드']),
    pkgSel: {},
    qty: {}
  };
  const draftFromStorage = !!(S.draft && ['category', 'region', 'size', 'budget', 'schedule', 'detail', 'name', 'phone'].some((k) => S.draft[k]));
  const save = {
    user() { S.user ? LS.set(K.user, S.user) : LS.del(K.user); },
    compare() { LS.set(K.compare, S.compare); },
    cart() { LS.set(K.cart, S.cart); },
    quotes() { LS.set(K.quotes, S.quotes); },
    draft() { S.draft ? LS.set(K.draft, S.draft) : LS.del(K.draft); },
    recent() { LS.set(K.recent, S.recent); }
  };

  /* ---------- 숫자·가격 ---------- */
  const num = (n) => Number(n).toLocaleString('ko-KR');
  const won = (n) => num(n) + '원';
  const man = (n) => (n >= 10000 && n % 10000 === 0 ? num(n / 10000) + '만원' : won(n));
  const pkgPrice = (p) => (p.price === null ? '현장 견적' : p.price === 0 ? '무료' : man(p.price));
  const pkgDays = (p) => (p.days === null ? '현장 협의' : p.days + '일');
  const startPriceText = (e) => (e.startPrice > 0 ? man(e.startPrice) + '부터' : '현장 견적 · 실측 무료');
  const myTier = () => (S.user ? tierById[S.user.tier] : null);
  function calc(unit, qty, tierId) {
    const t = tierById[tierId || 'basic'];
    const list = unit * qty;
    const discount = Math.round(list * t.discount / 100);
    const pay = list - discount;
    const points = Math.floor(pay * t.pointRate / 100);
    return { list, discount, pay, points, tier: t };
  }
  const regionMatch = (full, r) => (r === '부산·경남' ? /^(부산|경남)/.test(full) : full.indexOf(r) === 0);

  /* ---------- 그림 ---------- */
  const artCache = new Map();
  function art(key, make) { if (!artCache.has(key)) artCache.set(key, A.uri(make())); return artCache.get(key); }
  const pfImg = (p, o) => art('p' + p.type + p.seed + (o ? o.w + 'x' + o.h : ''), () => A.forItem(p.type, p.seed, o));
  const matImg = (m) => art('m' + m.id, () => A.texture(m.texture, { seed: parseInt(m.id.slice(1), 10) * 7 + 3 }));

  /* ---------- 아이콘 ---------- */
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    chevR: '<path d="M9 5l7 7-7 7"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>',
    shieldOff: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>',
    doc: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    building: '<path d="M4 21V5l8-3v19M12 21V9l8 3v9M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 14h2M15 17h2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cart: '<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
    box: '<path d="M3 8l9-5 9 5v9l-9 5-9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v9"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    inbox: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h4"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8c-1-2.5-2.4-4-4-4a2 2 0 0 0 0 4M12 8c1-2.5 2.4-4 4-4a2 2 0 0 1 0 4"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M9.5 16V8h3.2a2.5 2.5 0 0 1 0 5H9.5"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    columns: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    plan: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 11h7v9M10 15h11M14 4v7"/>',
    beam: '<path d="M4 4h16v3.5h-6v9h6V20H4v-3.5h6v-9H4z"/>',
    sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 12.5a1.8 1.8 0 0 1 3.6 0V15h10.8v-2.5a1.8 1.8 0 0 1 3.6 0V18H3z"/><path d="M5.5 18v2M18.5 18v2"/>',
    pipe: '<path d="M3 8h8a4 4 0 0 1 4 4v9"/><path d="M3 13h4a3 3 0 0 1 3 3v5"/><path d="M3 6v9M8 21h9"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
    window: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/>'
  };
  const ic = (n, cls) => '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + IC[n] + '</svg>';
  const starIc = () => '<svg class="ic ic--star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + IC.star + '</svg>';
  const stars = (n) => '<span class="stars" aria-label="별점 ' + n + '점 (5점 만점)">' + [1, 2, 3, 4, 5].map((i) => '<svg class="ic ic--star' + (i > n ? ' off' : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC.star + '</svg>').join('') + '</span>';

  /* ---------- 검색 ---------- */
  const SYN = { '창문': '창호', '샷시': '창호', '새시': '창호', '문': '도어', '집짓기': '골조', '신축': '골조', '리모델링': '인테리어', '도면': '설계', '허가': '인허가', '누수': '방수', '비새': '방수', '보일러': '설비', '전기': '설비', '배관': '설비', '바닥': '바닥재', '마루': '강마루', '벽돌': '적벽돌', '합판': '합판' };
  const POPULAR = ['욕실 방수', '아파트 인테리어', '석고보드', '창호 교체', '설계 인허가', '보일러'];
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, '');
  const expHay = (e) => norm(e.name + e.tagline + catById[e.category].name + catById[e.category].desc + e.region + e.packages.map((p) => p.items.join('')).join(''));
  const matHay = (m) => norm(m.name + m.spec + mcatById[m.category].name);
  const INDEX = [].concat(
    D.categories.map((c) => ({ type: 'cat', id: c.id, title: c.name, sub: c.desc, hay: norm(c.name + c.desc), href: '#/experts?cat=' + c.id })),
    D.experts.map((e) => ({ type: 'exp', id: e.id, title: e.name, sub: catById[e.category].name + ' · ' + e.region + ' · ★ ' + e.rating, hay: expHay(e), href: '#/expert/' + e.id })),
    D.materials.map((m) => ({ type: 'mat', id: m.id, title: m.name, sub: m.spec + ' · ' + mcatById[m.category].name, hay: matHay(m), href: '#/product/' + m.id }))
  );
  const toks = (q) => String(q).trim().split(/\s+/).map(norm).filter(Boolean);
  function tokMatch(hay, t) {
    if (hay.indexOf(t) >= 0) return true;
    return Object.keys(SYN).some((k) => t.indexOf(norm(k)) >= 0 && hay.indexOf(norm(SYN[k])) >= 0);
  }
  const matchHay = (hay, q) => { const ts = toks(q); return ts.length > 0 && ts.every((t) => tokMatch(hay, t)); };
  const searchAll = (q) => INDEX.filter((it) => matchHay(it.hay, q));
  function hl(text, q) {
    const ts = String(q).trim().split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!ts.length) return esc(text);
    const re = new RegExp('(' + ts.join('|') + ')', 'gi');
    return String(text).split(re).map((part, i) => (i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part))).join('');
  }
  function addRecent(q) {
    q = q.trim(); if (!q) return;
    S.recent = [q].concat(S.recent.filter((t) => t !== q)).slice(0, 8);
    save.recent();
  }

  function suggestHTML(q, pid) {
    q = q.trim();
    if (!q) {
      const recent = S.recent.length
        ? '<ul class="chips chips--wrap">' + S.recent.map((t) => '<li class="rchip"><button type="button" class="chip chip--sm" data-sp="term" data-q="' + esc(t) + '">' + ic('clock') + esc(t) + '</button><button type="button" class="rchip__x" data-sp="del" data-q="' + esc(t) + '" aria-label="최근 검색어 ' + esc(t) + ' 지우기">' + ic('x') + '</button></li>').join('') + '</ul>'
        : '<p class="sp__empty">최근 검색어가 없어요.</p>';
      return '<div class="sp__sec"><div class="sp__head"><h2>최근 검색어</h2>' + (S.recent.length ? '<button type="button" class="link-btn" data-sp="clear">모두 지우기</button>' : '') + '</div>' + recent + '</div>' +
        '<div class="sp__sec"><div class="sp__head"><h2>많이 찾는 검색어</h2></div><ul class="chips chips--wrap">' + POPULAR.map((t) => '<li><button type="button" class="chip chip--sm" data-sp="term" data-q="' + esc(t) + '">' + ic('trend') + esc(t) + '</button></li>').join('') + '</ul></div>' +
        '<div class="sp__sec"><div class="sp__head"><h2>시공 분야 바로가기</h2></div><ul class="sp__cats">' + D.categories.map((c) => '<li><a href="#/experts?cat=' + c.id + '" class="sp__cat">' + ic(c.icon) + '<span>' + c.name + '</span></a></li>').join('') + '</ul></div>';
    }
    const res = searchAll(q);
    if (!res.length) {
      return '<div class="sp__none" role="status">' + ic('search', 'ic--lg') + '<p><strong>‘' + esc(q) + '’</strong>에 맞는 결과가 없어요.</p><p class="muted">띄어쓰기를 빼거나, 아래 검색어로 찾아 보세요.</p><ul class="chips chips--wrap chips--center">' + POPULAR.map((t) => '<li><button type="button" class="chip chip--sm" data-sp="term" data-q="' + esc(t) + '">' + esc(t) + '</button></li>').join('') + '</ul></div>';
    }
    const groups = [['cat', '시공 분야', 3], ['exp', '전문가', 4], ['mat', '자재 (회원전용 자재몰)', 4]];
    let i = 0;
    const body = groups.map((g) => {
      const items = res.filter((r) => r.type === g[0]);
      if (!items.length) return '';
      return '<div role="group" aria-labelledby="' + pid + '-g' + g[0] + '" class="sp__group"><p class="sp__gh" id="' + pid + '-g' + g[0] + '">' + g[1] + ' <span>' + items.length + '</span></p>' +
        items.slice(0, g[2]).map((it) => {
          const id = pid + '-o' + (i++);
          let thumb;
          if (it.type === 'cat') thumb = '<span class="sp__ico">' + ic(catById[it.id].icon) + '</span>';
          else if (it.type === 'exp') thumb = '<img class="sp__thumb" src="' + pfImg(expById[it.id].portfolio[0]) + '" alt="" width="40" height="40">';
          else thumb = '<img class="sp__thumb" src="' + matImg(matById[it.id]) + '" alt="" width="40" height="40">';
          return '<div role="option" id="' + id + '" class="sp__opt" data-href="' + it.href + '" aria-selected="false">' + thumb + '<span class="sp__txt"><span class="sp__t">' + hl(it.title, q) + '</span><span class="sp__s">' + esc(it.sub) + '</span></span>' + ic('chevR', 'sp__go') + '</div>';
        }).join('') + '</div>';
    }).join('');
    return '<div role="listbox" id="' + pid + '-list" aria-label="검색 제안">' + body + '</div>' +
      '<button type="button" class="sp__all" data-sp="all">' + ic('search') + '‘' + esc(q) + '’ 전문가 검색 결과 모두 보기</button>';
  }

  const searches = [];
  function makeSearch(root) {
    const form = $('form', root), input = $('input', root), panel = $('.sp', root), cancel = $('.search__cancel', root);
    const pid = panel.id;
    let active = -1;
    const isOpen = () => root.classList.contains('open');
    function paint() { panel.innerHTML = suggestHTML(input.value, pid); active = -1; input.removeAttribute('aria-activedescendant'); }
    function open() {
      if (isOpen()) return;
      searches.forEach((s) => { if (s.root !== root) s.close(); });
      root.classList.add('open'); panel.hidden = false; input.setAttribute('aria-expanded', 'true');
      if (!MQ_PC.matches && root.id === 'headSearch') document.body.classList.add('search-open');
      paint();
    }
    function close() {
      if (!isOpen()) return;
      root.classList.remove('open'); panel.hidden = true; input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant'); active = -1;
      if (root.id === 'headSearch') document.body.classList.remove('search-open');
    }
    function submit(q) {
      q = (q == null ? input.value : q).trim();
      if (!q) { input.focus(); return; }
      addRecent(q); input.value = q; close(); input.blur();
      go('#/experts?q=' + encodeURIComponent(q));
    }
    function choose(opt) {
      addRecent(input.value || opt.textContent);
      close(); input.blur(); go(opt.dataset.href);
    }
    input.addEventListener('focus', open);
    input.addEventListener('click', open);
    input.addEventListener('input', () => { if (!isOpen()) open(); else paint(); });
    input.addEventListener('keydown', (e) => {
      const opts = $$('[role=option]', panel);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!isOpen()) open();
        if (!opts.length) return;
        e.preventDefault();
        active = e.key === 'ArrowDown' ? (active + 1) % opts.length : (active - 1 + opts.length) % opts.length;
        opts.forEach((o, i) => { o.classList.toggle('active', i === active); o.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
        input.setAttribute('aria-activedescendant', opts[active].id);
        opts[active].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Escape') {
        if (isOpen()) { e.preventDefault(); close(); }
      } else if (e.key === 'Enter' && active >= 0 && opts[active]) {
        e.preventDefault(); choose(opts[active]);
      }
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    panel.addEventListener('mousedown', (e) => { if (!e.target.closest('a')) e.preventDefault(); });
    panel.addEventListener('click', (e) => {
      const opt = e.target.closest('[role=option]');
      if (opt) { choose(opt); return; }
      const b = e.target.closest('[data-sp]');
      if (b) {
        const k = b.dataset.sp;
        if (k === 'term') submit(b.dataset.q);
        else if (k === 'all') submit();
        else if (k === 'del') { S.recent = S.recent.filter((t) => t !== b.dataset.q); save.recent(); paint(); input.focus(); }
        else if (k === 'clear') { S.recent = []; save.recent(); paint(); input.focus(); }
        return;
      }
      if (e.target.closest('a')) close();
    });
    if (cancel) cancel.addEventListener('click', () => { close(); input.blur(); });
    root.addEventListener('focusout', (e) => { if (e.relatedTarget && !root.contains(e.relatedTarget)) close(); });
    document.addEventListener('pointerdown', (e) => { if (isOpen() && !root.contains(e.target)) close(); });
    const api = { root, open, close, input };
    searches.push(api);
    return api;
  }
  const closeSearches = () => searches.forEach((s) => s.close());

  /* ---------- 공통 조각 ---------- */
  const metaRow = () => '<div class="meta-row wrap"><span class="draft-badge">시안 2 · 사용성</span><a href="../../" class="meta-row__back">← 레퍼런스 보드</a></div>';
  function verifyLine(e) {
    const v = e.verified;
    const ok = [v.license ? '면허' : '', v.business ? '사업자' : '', v.insurance ? '보험' : ''].filter(Boolean);
    const miss = [!v.license ? '면허 미확인' : '', !v.business ? '사업자 미확인' : '', !v.insurance ? '보험 미가입' : ''].filter(Boolean);
    return '<span class="vb">' + ic('shield') + ok.join('·') + ' 확인</span>' + (miss.length ? '<span class="vb vb--miss">' + miss.join(' · ') + '</span>' : '');
  }
  function cmpBtn(e, cls) {
    const on = S.compare.indexOf(e.id) >= 0;
    return '<button type="button" class="btn btn--sm btn--line cmp-btn ' + (cls || '') + '" data-act="cmp" data-id="' + e.id + '" data-fk="cmp-' + e.id + '" aria-pressed="' + on + '" aria-label="' + esc(e.name) + ' 비교함에 ' + (on ? '담음, 누르면 빼기' : '담기') + '">' + (on ? ic('check') + '비교 담음' : ic('plus') + '비교 담기') + '</button>';
  }
  function expertCard(e) {
    const c = catById[e.category];
    return '<li class="ex card">' +
      '<a class="ex__link" href="#/expert/' + e.id + '">' +
        '<img class="ex__img" src="' + pfImg(e.portfolio[0]) + '" alt="" width="480" height="320" loading="lazy">' +
        '<span class="ex__body">' +
          '<span class="ex__meta">' + c.name + ' · ' + e.region + '</span>' +
          '<span class="ex__name">' + esc(e.name) + '</span>' +
          '<span class="ex__rate">' + starIc() + '<strong>' + e.rating + '</strong><span>후기 ' + num(e.reviews) + '</span><span class="sep" aria-hidden="true">·</span><span>보통 ' + e.responseHours + '시간 안에 답변</span></span>' +
          '<span class="ex__tag">' + esc(e.tagline) + '</span>' +
          '<span class="ex__verify">' + verifyLine(e) + '</span>' +
          '<span class="ex__price">' + startPriceText(e) + '</span>' +
        '</span>' +
      '</a>' +
      '<div class="ex__actions">' + cmpBtn(e) + '<button type="button" class="btn btn--sm btn--soft" data-act="quote" data-expert="' + e.id + '" aria-label="' + esc(e.name) + '에 무료 견적 신청">무료 견적</button></div>' +
    '</li>';
  }
  function footer() {
    return '<footer class="foot"><div class="wrap foot__in"><p class="foot__logo">BUILD<span>GO</span></p><p>운영 더원파트너스 · 건축·시공 전문가 매칭과 회원전용 자재 도매몰</p><p class="foot__notice">' + esc(D.notice) + '</p><p><a href="../../">← 레퍼런스 보드로 돌아가기</a></p></div></footer>';
  }
  function emptyBox(o) {
    return '<div class="empty" role="status">' + '<span class="empty__ic">' + ic(o.icon || 'search', 'ic--lg') + '</span><h2 class="empty__t">' + o.title + '</h2><p class="empty__d">' + o.desc + '</p>' + (o.actions ? '<div class="empty__acts">' + o.actions + '</div>' : '') + '</div>';
  }
  function priceRows(c, unitLabel) {
    return '<dl class="pb">' +
      '<div class="pb__row"><dt>정가</dt><dd>' + won(c.list) + (unitLabel ? '<small>' + unitLabel + '</small>' : '') + '</dd></div>' +
      '<div class="pb__row pb__row--dc"><dt>등급 할인 <span class="tier-pill tier--' + c.tier.id + '">' + c.tier.name + ' ' + c.tier.discount + '%</span></dt><dd>' + (c.discount ? '−' + won(c.discount) : '0원') + '</dd></div>' +
      '<div class="pb__row pb__row--pay"><dt>결제 예정</dt><dd>' + won(c.pay) + '</dd></div>' +
      '<div class="pb__row pb__row--pt"><dt>적립 예정 포인트 <small>(' + c.tier.pointRate + '%)</small></dt><dd>' + num(c.points) + 'P</dd></div>' +
    '</dl>';
  }
  function lockedPrice(compact) {
    if (compact) return '<p class="lockp">' + ic('lock') + '<span><strong>회원 전용 가격</strong> — 로그인</span></p>';
    return '<div class="lockbox">' + ic('lock', 'ic--lg') + '<div><p class="lockbox__t">회원 전용 가격 — 로그인</p><p class="lockbox__d">로그인하면 등급별 할인가와 적립 예정 포인트가 보여요.</p></div><button type="button" class="btn btn--blue" data-act="login">데모 로그인</button></div>';
  }
  function memberSummary() {
    if (!S.user) {
      return '<div class="member card"><div class="member__txt"><p class="member__t">회원이면 자재를 등급별 할인가로 살 수 있어요</p><p class="member__d">' + D.tiers.map((t) => t.name + ' ' + t.discount + '%').join(' · ') + ' 할인 · 결제 금액의 ' + D.tiers[0].pointRate + '~' + D.tiers[D.tiers.length - 1].pointRate + '% 적립</p></div><div class="member__acts"><button type="button" class="btn btn--blue" data-act="login">데모 로그인</button><a class="btn btn--line" href="#/me">등급 안내</a></div></div>';
    }
    const t = myTier();
    return '<div class="member card"><div class="member__who"><span class="tier-pill tier--' + t.id + '">' + t.name + '</span><p class="member__t">' + esc(S.user.name) + ' 님 <span class="muted">' + esc(S.user.company) + '</span></p></div>' +
      '<dl class="member__stats"><div><dt>보유 포인트</dt><dd>' + num(S.user.points) + 'P</dd></div><div><dt>자재 할인</dt><dd>' + t.discount + '%</dd></div><div><dt>포인트 적립</dt><dd>' + t.pointRate + '%</dd></div></dl>' +
      '<a class="btn btn--line" href="#/me">등급·포인트 보기</a></div>';
  }

  /* ---------- 라우터 ---------- */
  const view = $('#view');
  let token = 0, navByClick = false, firstPaint = true, curRoute = null, prevHash = '';
  const scrollMem = {};
  const GROUP = { home: 'home', experts: 'find', expert: 'find', compare: 'find', mall: 'mall', product: 'mall', cart: 'mall', quote: 'quote', quotes: 'quote', me: 'me' };
  function parseHash() {
    const h = (location.hash || '').replace(/^#/, '') || '/';
    const qi = h.indexOf('?');
    const path = qi >= 0 ? h.slice(0, qi) : h;
    const parts = path.split('/').filter(Boolean);
    return { hash: location.hash || '#/', parts, name: parts[0] || 'home', params: new URLSearchParams(qi >= 0 ? h.slice(qi + 1) : '') };
  }
  function go(hash) { navByClick = true; if (location.hash === hash) render(); else location.hash = hash; }
  function replace(hash) { history.replaceState(null, '', hash); render({ keepScroll: true, noSkeleton: true }); }
  function setParams(obj) {
    const r = parseHash();
    Object.keys(obj).forEach((k) => { if (obj[k] === null || obj[k] === '' || obj[k] === 'all') r.params.delete(k); else r.params.set(k, obj[k]); });
    const qs = r.params.toString();
    history.replaceState(null, '', '#/' + r.parts.join('/') + (qs ? '?' + qs : ''));
    rerender();
  }

  function render(opt) {
    opt = opt || {};
    const r = parseHash();
    curRoute = r;
    closeSearches();
    cleanupHero();
    const page = PAGES[r.name] || PAGES.notfound;
    document.body.dataset.route = r.name;
    const my = ++token;
    const skel = !opt.noSkeleton && !RM.matches && SKELETON[r.name];
    if (skel) {
      view.innerHTML = metaRow() + SKELETON[r.name]();
      view.setAttribute('aria-busy', 'true');
      setDock(''); renderTray(r, true);
      setTimeout(() => { if (my === token) paint(page, r, opt); }, 300);
    } else paint(page, r, opt);
  }
  function paint(page, r, opt) {
    const out = page(r);
    if (out.redirect) { history.replaceState(null, '', out.redirect); render({ noSkeleton: true }); if (out.toast) toast(out.toast); return; }
    view.innerHTML = out.html;
    view.removeAttribute('aria-busy');
    document.title = out.title + ' · BUILDGO 시안 2';
    setDock(out.dock || '');
    document.body.classList.toggle('no-tab', !!out.hideTab);
    updateChrome(r);
    if (!RM.matches && !opt.keepScroll) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); }
    if (out.after) out.after();
    if (!opt.keepScroll) {
      const y = navByClick ? 0 : (scrollMem[r.hash] || 0);
      window.scrollTo(0, y);
      if (!firstPaint && navByClick) { const h1 = $('h1', view); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); } }
    }
    navByClick = false; firstPaint = false;
    layout();
  }
  function rerender() {
    const r = parseHash();
    curRoute = r;
    const page = PAGES[r.name] || PAGES.notfound;
    const ae = document.activeElement;
    const fk = ae && ae.dataset ? ae.dataset.fk : null;
    const sl = {};
    $$('[data-keep-scroll]', view).forEach((el) => { sl[el.id] = el.scrollLeft; });
    const out = page(r);
    if (out.redirect) { history.replaceState(null, '', out.redirect); render({ noSkeleton: true }); return; }
    cleanupHero();
    view.innerHTML = out.html;
    setDock(out.dock || '');
    document.body.classList.toggle('no-tab', !!out.hideTab);
    updateChrome(r);
    if (out.after) out.after();
    Object.keys(sl).forEach((id) => { const el = document.getElementById(id); if (el) el.scrollLeft = sl[id]; });
    if (fk) { const el = document.querySelector('[data-fk="' + fk + '"]'); if (el) el.focus({ preventScroll: true }); }
    layout();
  }
  function setDock(html) {
    const dock = $('#dock');
    dock.innerHTML = html; dock.hidden = !html;
    document.body.classList.toggle('has-dock', !!html);
  }
  window.addEventListener('hashchange', (e) => {
    try { const old = new URL(e.oldURL).hash || '#/'; scrollMem[old] = window.scrollY; prevHash = old; } catch (err) { /* noop */ }
    render();
  });

  /* ---------- 위·아래 고정 영역 높이 ---------- */
  function layout() {
    const top = $('#topbar').offsetHeight;
    document.documentElement.style.setProperty('--top-h', top + 'px');
    let bottom = 0;
    ['.tabbar', '#dock', '#tray'].forEach((s) => { const el = $(s); if (el && !el.hidden && getComputedStyle(el).display !== 'none') bottom = Math.max(bottom, el.getBoundingClientRect().height + (window.innerHeight - el.getBoundingClientRect().bottom)); });
    document.documentElement.style.setProperty('--bottom-h', Math.round(bottom) + 'px');
  }
  window.addEventListener('resize', layout);

  function updateChrome(r) {
    const g = GROUP[r.name] || '';
    const hi = $('#q-head');
    if (hi && document.activeElement !== hi) hi.value = (r.name === 'experts' || r.name === 'mall') ? (r.params.get('q') || '') : '';
    $$('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === g;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const cartN = S.cart.length;
    const cb = $('#cartBadge'); cb.hidden = !cartN; cb.textContent = cartN;
    $('#cartLink').setAttribute('aria-label', '장바구니' + (cartN ? ', 상품 ' + cartN + '개' : ', 비어 있음'));
    const qb = $('#quoteBadge'); qb.hidden = !S.quotes.length; qb.textContent = S.quotes.length;
    const hu = $('#headUser');
    if (S.user) {
      const t = myTier();
      hu.innerHTML = '<a class="userchip" href="#/me" aria-label="내 정보: ' + esc(S.user.name) + ' 님, ' + t.name + ' 등급, ' + num(S.user.points) + '포인트"><span class="tier-pill tier--' + t.id + '">' + t.name + '</span><span>' + esc(S.user.name) + ' 님</span></a>';
    } else hu.innerHTML = '<button type="button" class="btn btn--sm btn--line" data-act="login">데모 로그인</button>';
    renderTray(r);
  }
  function renderTray(r, hide) {
    const tray = $('#tray');
    const show = !hide && S.compare.length > 0 && (r.name === 'home' || r.name === 'experts');
    tray.hidden = !show;
    document.body.classList.toggle('has-tray', show);
    if (!show) { tray.innerHTML = ''; return; }
    const n = S.compare.length;
    tray.innerHTML = '<div class="tray__in" role="region" aria-label="비교함">' +
      '<p class="tray__label">' + ic('columns') + '<strong>비교함</strong><span>' + n + '/3</span></p>' +
      '<ul class="tray__list" id="trayList" data-keep-scroll>' + S.compare.map((id) => '<li><span>' + esc(expById[id].name) + '</span><button type="button" data-act="cmp" data-id="' + id + '" aria-label="' + esc(expById[id].name) + ' 비교함에서 빼기">' + ic('x') + '</button></li>').join('') + '</ul>' +
      (n >= 2 ? '<a class="btn btn--blue tray__go" href="#/compare">비교하기</a>' : '<p class="tray__hint">1명 더 담으면<br>비교할 수 있어요</p>') +
    '</div>';
  }

  /* ---------- 알림(토스트) ---------- */
  let toastT = 0;
  function toast(msg, action) {
    const el = $('#toast');
    el.innerHTML = '<div class="toast__in"><span>' + msg + '</span>' + (action ? '<a href="' + action.href + '" class="toast__a">' + action.label + '</a>' : '') + '</div>';
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 3600);
  }

  /* ---------- 뼈대(스켈레톤) ---------- */
  const skCards = (n, cls) => '<ul class="' + cls + '" aria-hidden="true">' + Array.from({ length: n }, () => '<li class="card sk-card"><div class="sk sk--img"></div><div class="sk-lines"><div class="sk" style="width:40%"></div><div class="sk" style="width:70%;height:20px"></div><div class="sk" style="width:85%"></div><div class="sk" style="width:55%"></div></div></li>').join('') + '</ul>';
  const SKELETON = {
    experts: () => '<div class="wrap page"><p class="sr-only" role="status">전문가 목록을 불러오는 중이에요</p><div class="sk" style="height:32px;width:220px;margin:8px 0 20px"></div><div class="layout2"><div class="sk-side"><div class="sk" style="height:44px"></div><div class="sk" style="height:44px"></div><div class="sk" style="height:44px"></div></div>' + skCards(4, 'ex-grid') + '</div></div>',
    mall: () => '<div class="wrap page"><p class="sr-only" role="status">자재 목록을 불러오는 중이에요</p><div class="sk" style="height:32px;width:240px;margin:8px 0 20px"></div><div class="sk" style="height:72px;margin-bottom:20px"></div><div class="layout2"><div class="sk-side"><div class="sk" style="height:44px"></div><div class="sk" style="height:44px"></div><div class="sk" style="height:44px"></div></div>' + skCards(6, 'mat-grid') + '</div></div>',
    expert: () => '<div class="wrap page"><p class="sr-only" role="status">전문가 정보를 불러오는 중이에요</p><div class="sk" style="height:20px;width:100px;margin:8px 0 16px"></div><div class="sk sk--hero"></div><div class="sk" style="height:32px;width:50%;margin:20px 0 12px"></div><div class="sk" style="height:18px;width:70%"></div><div class="sk" style="height:140px;margin-top:24px"></div></div>',
    product: () => '<div class="wrap page"><p class="sr-only" role="status">상품 정보를 불러오는 중이에요</p><div class="sk" style="height:20px;width:100px;margin:8px 0 16px"></div><div class="layout-prod"><div class="sk sk--hero"></div><div><div class="sk" style="height:32px;width:70%;margin-bottom:12px"></div><div class="sk" style="height:18px;width:50%;margin-bottom:24px"></div><div class="sk" style="height:180px"></div></div></div></div>'
  };

  /* ---------- 화면: 홈 ---------- */
  function pageHome() {
    const top4 = D.experts.slice().sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4);
    const mallPick = ['m1', 'm2', 'm5', 'm7'].map((id) => matById[id]);
    const t = myTier();
    const maxDc = Math.max.apply(null, D.tiers.map((x) => x.discount));
    const maxPt = Math.max.apply(null, D.tiers.map((x) => x.pointRate));
    const html = metaRow() +
      '<section class="hero"><div class="wrap hero__grid">' +
        '<div class="hero__main">' +
          '<p class="eyebrow">건축·시공 전문가 매칭 · 회원전용 자재 도매몰</p>' +
          '<h1 class="hero__t">설계부터 시공까지,<br>검증된 전문가에게 맡기세요</h1>' +
          '<p class="hero__d">필요한 공사를 알려 주시면 무료로 견적을 받아 비교할 수 있어요.</p>' +
          '<div class="search search--hero" data-search id="heroSearch">' +
            '<form class="search__form" role="search" action="#" autocomplete="off"><label class="sr-only" for="q-hero">시공 분야, 전문가, 자재 검색</label>' +
            '<input class="search__input" id="q-hero" type="search" enterkeyhint="search" placeholder="필요한 시공 분야를 입력해 보세요" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="sp-hero">' +
            '<button class="search__btn" type="submit" aria-label="검색하기">' + ic('search') + '<span class="search__btn-t" aria-hidden="true">검색</span></button></form>' +
            '<div class="sp" id="sp-hero" hidden></div>' +
          '</div>' +
          '<ul class="chips chips--wrap hero__pop" aria-label="많이 찾는 검색어">' + POPULAR.slice(0, 4).map((q) => '<li><a class="chip chip--sm chip--ghost" href="#/experts?q=' + encodeURIComponent(q) + '" data-recent="' + esc(q) + '">' + esc(q) + '</a></li>').join('') + '</ul>' +
          '<div class="hero__cta"><a class="btn btn--orange btn--lg" href="#/quote/1">무료 견적 신청하기</a><a class="btn btn--line btn--lg" href="#/experts">전문가 둘러보기</a></div>' +
        '</div>' +
        '<nav class="cats card" aria-labelledby="cats-h"><h2 class="cats__h" id="cats-h">어떤 공사가 필요하세요?</h2><ul class="cats__grid">' +
          D.categories.map((c) => '<li><a class="cat" href="#/experts?cat=' + c.id + '"><span class="cat__ic">' + ic(c.icon) + '</span><span class="cat__n">' + c.name + '</span><span class="cat__d">' + c.desc + '</span></a></li>').join('') +
        '</ul></nav>' +
      '</div></section>' +
      '<section class="wrap sec sec--tight" aria-label="내 등급과 포인트">' + memberSummary() + '</section>' +
      '<section class="wrap sec" aria-labelledby="rec-h"><div class="sec__head"><h2 id="rec-h">평점 높은 전문가</h2><a class="more" href="#/experts?sort=rating">전체 보기' + ic('chevR') + '</a></div>' +
        '<p class="sec__d">마음에 드는 곳은 ‘비교 담기’로 최대 3곳까지 한 표로 비교할 수 있어요.</p>' +
        '<ul class="ex-grid ex-grid--4">' + top4.map(expertCard).join('') + '</ul></section>' +
      '<section class="wrap sec" aria-labelledby="mall-h"><div class="mall-entry card">' +
        '<div class="mall-entry__txt"><p class="eyebrow eyebrow--blue">' + ic('lock') + '회원전용</p><h2 id="mall-h">자재 도매몰</h2><p>등급에 따라 최대 ' + maxDc + '% 할인, 결제 금액의 최대 ' + maxPt + '%를 포인트로 돌려드려요.' + (t ? ' <strong>' + esc(S.user.name) + ' 님은 ' + t.name + ' — ' + t.discount + '% 할인 중</strong>' : '') + '</p><a class="btn btn--blue" href="#/mall">자재몰 들어가기' + ic('arrowR') + '</a></div>' +
        '<ul class="mall-entry__items">' + mallPick.map((m) => '<li><a href="#/product/' + m.id + '"><img src="' + matImg(m) + '" alt="" width="480" height="360" loading="lazy"><span class="mall-entry__n">' + m.name + '</span><span class="mall-entry__p">' + (t ? won(calc(m.price, 1, t.id).pay) + ' / ' + m.unit : ic('lock') + '회원 전용 가격') + '</span></a></li>').join('') + '</ul>' +
      '</div></section>' +
      '<section class="wrap sec" aria-labelledby="how-h"><h2 id="how-h" class="sec__h">이렇게 진행돼요</h2><ol class="how">' +
        '<li><span class="how__n">1</span><div><strong>무료 견적 요청</strong><p>분야·규모·일정을 3단계로 알려 주세요. 쓰던 내용은 자동 저장돼요.</p></div></li>' +
        '<li><span class="how__n">2</span><div><strong>견적 비교</strong><p>가격·기간·평점·응답 시간·검증 여부를 한 표로 비교해요.</p></div></li>' +
        '<li><span class="how__n">3</span><div><strong>계약·시공</strong><p>자재는 회원가로 사고, 포인트는 시공 계약금에도 쓸 수 있어요.</p></div></li>' +
      '</ol></section>' + footer();
    return {
      title: '홈', html,
      after() {
        const hs = $('#heroSearch');
        if (hs) {
          makeSearch(hs);
          if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((ents) => { document.body.classList.toggle('hero-search-on', ents[0].isIntersecting); }, { rootMargin: '-' + ($('#topbar').offsetHeight + 8) + 'px 0px 0px 0px' });
            io.observe($('form', hs));
            heroObs.push(io);
          }
        }
      }
    };
  }
  const heroObs = [];
  function cleanupHero() {
    heroObs.splice(0).forEach((io) => io.disconnect());
    for (let i = searches.length - 1; i >= 0; i--) if (searches[i].root.id === 'heroSearch') searches.splice(i, 1);
    document.body.classList.remove('hero-search-on');
  }

  /* ---------- 화면: 전문가 목록 ---------- */
  const SORTS = [['rec', '추천순'], ['rating', '평점 높은순'], ['reviews', '후기 많은순'], ['fast', '답변 빠른순'], ['price', '시작가 낮은순']];
  function sortExperts(list, s) {
    const l = list.slice();
    if (s === 'rating') l.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (s === 'reviews') l.sort((a, b) => b.reviews - a.reviews);
    else if (s === 'fast') l.sort((a, b) => a.responseHours - b.responseHours);
    else if (s === 'price') l.sort((a, b) => (a.startPrice || Infinity) - (b.startPrice || Infinity));
    return l;
  }
  function chip(label, n, on, act, k, v, fk) {
    return '<li><button type="button" class="chip' + (on ? ' on' : '') + (n === 0 ? ' zero' : '') + '" data-act="' + act + '" data-k="' + k + '" data-v="' + esc(v) + '" data-fk="' + fk + '" aria-pressed="' + on + '">' + (on ? ic('check') : '') + '<span>' + label + '</span><span class="chip__n"><span class="sr-only">결과 </span>' + n + '<span class="sr-only">개</span></span></button></li>';
  }
  function pageExperts(r) {
    const p = r.params, q = p.get('q') || '', cat = p.get('cat') || 'all', region = p.get('region') || 'all', sort = p.get('sort') || 'rec';
    const base = q ? D.experts.filter((e) => matchHay(expHay(e), q)) : D.experts.slice();
    const fc = (e) => cat === 'all' || e.category === cat;
    const fr = (e) => region === 'all' || regionMatch(e.region, region);
    const list = sortExperts(base.filter((e) => fc(e) && fr(e)), sort);
    const matN = q ? D.materials.filter((m) => matchHay(matHay(m), q)).length : 0;
    const catChips = chip('전체', base.filter(fr).length, cat === 'all', 'fset', 'cat', 'all', 'fc-all') + D.categories.map((c) => chip(c.name, base.filter((e) => e.category === c.id && fr(e)).length, cat === c.id, 'fset', 'cat', c.id, 'fc-' + c.id)).join('');
    const regChips = chip('전체', base.filter(fc).length, region === 'all', 'fset', 'region', 'all', 'fr-all') + D.regions.map((rg) => chip(rg, base.filter((e) => fc(e) && regionMatch(e.region, rg)).length, region === rg, 'fset', 'region', rg, 'fr-' + rg)).join('');
    const active = [];
    if (q) active.push(['q', '‘' + esc(q) + '’ 검색']);
    if (cat !== 'all') active.push(['cat', catById[cat] ? catById[cat].name : cat]);
    if (region !== 'all') active.push(['region', esc(region)]);
    let results;
    if (list.length) results = '<ul class="ex-grid">' + list.map(expertCard).join('') + '</ul>';
    else if (q && !base.length) {
      results = emptyBox({ title: '‘' + esc(q) + '’ 검색 결과가 없어요', desc: '띄어쓰기를 빼거나 더 짧은 말로 찾아 보세요. 예: ‘욕실방수’ → ‘방수’', actions: '<button type="button" class="btn btn--line" data-act="fset" data-k="q" data-v="all">검색어 지우기</button><ul class="chips chips--wrap chips--center">' + POPULAR.map((t) => '<li><a class="chip chip--sm" href="#/experts?q=' + encodeURIComponent(t) + '">' + esc(t) + '</a></li>').join('') + '</ul>' });
    } else {
      const what = [region !== 'all' ? '‘' + esc(region) + '’ 지역' : '', cat !== 'all' ? '‘' + catById[cat].name + '’' : ''].filter(Boolean).join('의 ');
      results = emptyBox({ title: '조건에 맞는 전문가가 아직 없어요', desc: (what ? what + ' 전문가는 아직 등록되지 않았어요. ' : '') + '지역을 넓히거나 분야를 바꿔 보세요. 견적 요청을 남겨 두는 방법도 있어요.', actions: (region !== 'all' ? '<button type="button" class="btn btn--blue" data-act="fset" data-k="region" data-v="all">지역 전체로 보기</button>' : '') + '<button type="button" class="btn btn--line" data-act="freset">조건 모두 지우기</button><a class="btn btn--orange" href="#/quote/1">무료 견적 신청하기</a>' });
    }
    const html = metaRow() + '<div class="wrap page">' +
      '<div class="page__head"><h1>' + (q ? '‘' + esc(q) + '’ 검색 결과' : '시공 찾기') + '</h1><p class="page__d">분야와 지역을 고르면 바로 걸러져요. 칩 옆 숫자는 결과 수예요.</p></div>' +
      '<div class="layout2">' +
        '<aside class="filters" aria-label="필터">' +
          '<div class="fgroup"><h2 class="fgroup__h" id="fh-cat">분야</h2><div class="chipscroll" id="rowCat" data-keep-scroll><ul class="chips" role="group" aria-labelledby="fh-cat">' + catChips + '</ul></div></div>' +
          '<div class="fgroup"><h2 class="fgroup__h" id="fh-reg">지역</h2><div class="chipscroll" id="rowReg" data-keep-scroll><ul class="chips" role="group" aria-labelledby="fh-reg">' + regChips + '</ul></div></div>' +
          (active.length ? '<button type="button" class="link-btn filters__reset pc-only" data-act="freset">' + ic('x') + '조건 모두 지우기</button>' : '') +
        '</aside>' +
        '<div class="results">' +
          '<div class="results__bar"><p class="results__n" role="status">전문가 <strong>' + list.length + '</strong>명</p>' +
            '<label class="sort"><span class="sr-only">정렬 기준</span><select data-change="sort" data-fk="sort">' + SORTS.map((s) => '<option value="' + s[0] + '"' + (s[0] === sort ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></label></div>' +
          (active.length ? '<ul class="chips chips--wrap active-f" aria-label="적용된 조건">' + active.map((a) => '<li><button type="button" class="chip chip--sm chip--soft" data-act="fset" data-k="' + a[0] + '" data-v="all" aria-label="' + a[1].replace(/<[^>]+>/g, '') + ' 조건 빼기">' + a[1] + ic('x') + '</button></li>').join('') + '</ul>' : '') +
          (matN ? '<a class="crosslink" href="#/mall?q=' + encodeURIComponent(q) + '">' + ic('box') + '<span>자재몰에서 ‘' + esc(q) + '’ 자재 <strong>' + matN + '개</strong>도 찾았어요</span>' + ic('chevR') + '</a>' : '') +
          results +
        '</div>' +
      '</div></div>';
    return { title: q ? '‘' + q + '’ 검색 결과' : '시공 찾기', html };
  }

  /* ---------- 화면: 전문가 상세 ---------- */
  function sideCard(e) {
    const i = S.pkgSel[e.id] || 0, p = e.packages[i];
    return '<p class="side__k">선택한 패키지</p><p class="side__tier">' + p.tier + '</p><p class="side__price">' + pkgPrice(p) + '</p><p class="side__days">' + ic('clock') + '기간 ' + pkgDays(p) + '</p>' +
      '<button type="button" class="btn btn--orange btn--lg btn--block" data-act="quote" data-expert="' + e.id + '">무료 견적 신청</button>' +
      cmpBtn(e, 'btn--block') +
      '<p class="side__note">' + ic('info') + '보통 ' + e.responseHours + '시간 안에 답변해요. 견적 요청은 무료예요.</p>';
  }
  function pageExpert(r) {
    const e = expById[r.parts[1]];
    if (!e) return PAGES.notfound();
    const c = catById[e.category], v = e.verified;
    const sel = S.pkgSel[e.id] || 0;
    const html = metaRow() + '<div class="wrap page">' +
      '<nav class="crumb" aria-label="이동"><a href="#/experts" data-act="back">' + ic('chevL') + '목록으로</a></nav>' +
      '<div class="detail">' +
        '<div class="detail__main">' +
          '<div class="dh"><img class="dh__cover" src="' + pfImg(e.portfolio[0], { w: 960, h: 440 }) + '" alt="' + esc(e.portfolio[0].title) + ' 예시 그림" width="960" height="440">' +
            '<div class="dh__info"><p class="ex__meta">' + c.name + ' · ' + e.region + ' · 경력 ' + e.years + '년</p><h1 class="dh__t">' + esc(e.name) + '</h1><p class="dh__tag">' + esc(e.tagline) + '</p>' +
            '<p class="ex__rate ex__rate--lg">' + starIc() + '<strong>' + e.rating + '</strong><a href="#rv" data-act="jump" data-to="rv">후기 ' + num(e.reviews) + '개</a><span class="sep" aria-hidden="true">·</span><span>보통 ' + e.responseHours + '시간 안에 답변</span></p></div></div>' +
          '<section class="block" aria-labelledby="vh"><h2 id="vh">검증 정보</h2><ul class="vlist">' +
            '<li class="' + (v.license ? 'ok' : 'no') + '">' + ic('doc') + '<div><strong>면허</strong><span>' + (v.license ? esc(v.license) + ' 확인' : '확인 안 됨') + '</span></div>' + ic(v.license ? 'check' : 'alert', 'vlist__s') + '</li>' +
            '<li class="' + (v.business ? 'ok' : 'no') + '">' + ic('building') + '<div><strong>사업자</strong><span>' + (v.business ? '사업자 등록 확인' : '확인 안 됨') + '</span></div>' + ic(v.business ? 'check' : 'alert', 'vlist__s') + '</li>' +
            '<li class="' + (v.insurance ? 'ok' : 'no') + '">' + ic(v.insurance ? 'shield' : 'shieldOff') + '<div><strong>보험</strong><span>' + (v.insurance ? '보험 가입 확인' : '보험 미가입 — 계약 전에 꼭 물어보세요') + '</span></div>' + ic(v.insurance ? 'check' : 'alert', 'vlist__s') + '</li>' +
          '</ul></section>' +
          '<section class="block" aria-labelledby="pkh"><h2 id="pkh">패키지 비교</h2><p class="block__d">하나를 고르면 견적 요청에 함께 담겨요. 가격이 정해지지 않은 항목은 ‘현장 견적’이에요.</p>' +
            '<div class="pk-grid" role="radiogroup" aria-labelledby="pkh">' + e.packages.map((p, i) => '<label class="pk' + (i === sel ? ' on' : '') + '"><input class="sr-only" type="radio" name="pkg" value="' + i + '"' + (i === sel ? ' checked' : '') + ' data-change="pkg" data-id="' + e.id + '" data-fk="pkg-' + i + '"><span class="pk__top"><span class="pk__radio" aria-hidden="true"></span><span class="pk__tier">' + p.tier + '</span></span><span class="pk__price">' + pkgPrice(p) + '</span><span class="pk__days">' + ic('clock') + '기간 ' + pkgDays(p) + '</span><span class="pk__items">' + p.items.map((it) => '<span>' + ic('check') + esc(it) + '</span>').join('') + '</span></label>').join('') + '</div>' +
            '<p class="note">' + ic('coin') + '포인트 사용: ' + esc(D.points.use) + '</p></section>' +
          '<section class="block" aria-labelledby="pfh"><h2 id="pfh">포트폴리오 <span class="count">' + e.portfolio.length + '</span></h2><ul class="pf-grid">' + e.portfolio.map((p) => '<li><figure><img src="' + pfImg(p) + '" alt="' + esc(p.title) + ' 예시 그림" width="480" height="320" loading="lazy"><figcaption>' + esc(p.title) + '</figcaption></figure></li>').join('') + '</ul></section>' +
          '<section class="block" id="rv" aria-labelledby="rvh"><h2 id="rvh">후기</h2><div class="rv-sum"><span class="rv-sum__n">' + starIc() + e.rating + '</span><span>후기 ' + num(e.reviews) + '개</span></div><ul class="rv-list">' + e.reviewsSample.map((rv) => '<li><p class="rv__head"><strong>' + esc(rv.author) + '</strong>' + stars(rv.rating) + '</p><p>' + esc(rv.text) + '</p></li>').join('') + '</ul><p class="note">' + ic('info') + '시안에서는 후기 ' + e.reviewsSample.length + '개만 보여 드려요.</p></section>' +
        '</div>' +
        '<aside class="detail__side" aria-label="견적 신청"><div class="side card" id="sideCard">' + sideCard(e) + '</div></aside>' +
      '</div></div>';
    const p = e.packages[sel];
    const dock = '<div class="dock__in"><div class="dock__info"><span class="dock__k">' + p.tier + '</span><strong>' + pkgPrice(p) + '</strong></div>' +
      '<button type="button" class="btn btn--line dock__icon" data-act="cmp" data-id="' + e.id + '" aria-pressed="' + (S.compare.indexOf(e.id) >= 0) + '" aria-label="비교함에 ' + (S.compare.indexOf(e.id) >= 0 ? '담음, 누르면 빼기' : '담기') + '">' + ic(S.compare.indexOf(e.id) >= 0 ? 'check' : 'columns') + '<span>비교</span></button>' +
      '<button type="button" class="btn btn--orange dock__main" data-act="quote" data-expert="' + e.id + '">무료 견적 신청</button></div>';
    return { title: e.name, html, dock, hideTab: true };
  }

  /* ---------- 화면: 비교 ---------- */
  function pageCompare() {
    const list = S.compare.map((id) => expById[id]);
    if (list.length < 2) {
      return { title: '전문가 비교', html: metaRow() + '<div class="wrap page"><div class="page__head"><h1>전문가 비교</h1></div>' + emptyBox({ icon: 'columns', title: list.length ? '1명 더 담으면 비교할 수 있어요' : '비교함이 비어 있어요', desc: '전문가 카드의 ‘비교 담기’를 눌러 2~3명을 담아 주세요. 가격·기간·평점·응답 시간·검증 여부를 한 표로 보여 드려요.', actions: '<a class="btn btn--blue" href="#/experts">전문가 고르러 가기</a>' }) + '</div>' };
    }
    const sp = (e) => (e.startPrice > 0 ? e.startPrice : Infinity);
    const minP = Math.min.apply(null, list.map(sp));
    const dur = (e) => (e.packages[0].days == null ? Infinity : e.packages[0].days);
    const minD = Math.min.apply(null, list.map(dur));
    const maxR = Math.max.apply(null, list.map((e) => e.rating));
    const minH = Math.min.apply(null, list.map((e) => e.responseHours));
    const maxY = Math.max.apply(null, list.map((e) => e.years));
    const best = (cond, label) => (cond ? '<span class="best">' + label + '</span>' : '');
    const row = (label, cells) => '<div class="ct__row" role="row"><div class="ct__label" role="rowheader">' + label + '</div>' + cells.map((c) => '<div class="ct__cell" role="cell">' + c + '</div>').join('') + '</div>';
    const vrow = (e) => {
      const v = e.verified;
      return '<ul class="ct__v"><li class="' + (v.license ? 'ok' : 'no') + '">' + ic(v.license ? 'check' : 'x') + '면허' + (v.license ? '<small>' + esc(v.license) + '</small>' : '') + '</li><li class="' + (v.business ? 'ok' : 'no') + '">' + ic(v.business ? 'check' : 'x') + '사업자</li><li class="' + (v.insurance ? 'ok' : 'no') + '">' + ic(v.insurance ? 'check' : 'x') + (v.insurance ? '보험' : '보험 미가입') + '</li></ul>';
    };
    const html = metaRow() + '<div class="wrap page"><nav class="crumb" aria-label="이동"><a href="#/experts" data-act="back">' + ic('chevL') + '목록으로</a></nav>' +
      '<div class="page__head"><h1>전문가 비교 <span class="count">' + list.length + '명</span></h1><p class="page__d">파란 표시는 그 줄에서 가장 좋은 값이에요. 시작가·기간은 가장 기본 패키지 기준이에요.</p></div>' +
      '<div class="ct" role="table" aria-label="전문가 비교표" style="--n:' + list.length + '">' +
        '<div class="ct__row ct__row--head" role="row"><div class="ct__label" role="columnheader"><span class="sr-only">항목</span></div>' + list.map((e) => '<div class="ct__cell" role="columnheader"><img src="' + pfImg(e.portfolio[0]) + '" alt="" width="480" height="320"><a class="ct__name" href="#/expert/' + e.id + '">' + esc(e.name) + '</a><button type="button" class="ct__rm" data-act="cmp" data-id="' + e.id + '" aria-label="' + esc(e.name) + ' 비교에서 빼기">' + ic('x') + '<span>빼기</span></button></div>').join('') + '</div>' +
        row('분야', list.map((e) => catById[e.category].name)) +
        row('지역', list.map((e) => esc(e.region))) +
        row('시작가', list.map((e) => '<strong>' + (e.startPrice > 0 ? man(e.startPrice) : '현장 견적') + '</strong>' + best(sp(e) === minP && minP !== Infinity, '가장 낮음'))) +
        row('기간', list.map((e) => '<strong>' + pkgDays(e.packages[0]) + '</strong><small>' + e.packages[0].tier + ' 기준</small>' + best(dur(e) === minD && minD !== Infinity, '가장 짧음'))) +
        row('평점', list.map((e) => '<strong>' + starIc() + e.rating + '</strong><small>후기 ' + num(e.reviews) + '개</small>' + best(e.rating === maxR, '가장 높음'))) +
        row('응답 시간', list.map((e) => '<strong>보통 ' + e.responseHours + '시간</strong>' + best(e.responseHours === minH, '가장 빠름'))) +
        row('검증', list.map(vrow)) +
        row('경력', list.map((e) => '<strong>' + e.years + '년</strong>' + best(e.years === maxY, '가장 김'))) +
        row('', list.map((e) => '<a class="btn btn--sm btn--line btn--block" href="#/expert/' + e.id + '">자세히 보기</a>')) +
      '</div>' +
      (list.length < 3 ? '<p class="note">' + ic('info') + '1명 더 담을 수 있어요. <a href="#/experts">전문가 더 담기</a></p>' : '') +
      '<div class="cmp-cta card"><div><p class="cmp-cta__t">담은 ' + list.length + '곳에 한 번에 견적 요청</p><p class="muted">같은 내용을 한 번만 쓰면 ' + list.length + '곳 모두에게 보내요.</p></div><button type="button" class="btn btn--orange btn--lg" data-act="quoteAll">' + list.length + '곳에 무료 견적 신청</button></div>' +
    '</div>';
    return { title: '전문가 비교', html };
  }

  /* ---------- 화면: 견적 요청 3단계 ---------- */
  const Q = {
    size: ['10평 미만', '10~20평', '20~30평', '30~40평', '40평 이상', '잘 모르겠어요'],
    budget: ['500만원 미만', '500만~2,000만원', '2,000만~5,000만원', '5,000만원 이상', '상담 후 정할게요'],
    schedule: ['최대한 빨리', '1개월 안', '3개월 안', '날짜는 아직 미정'],
    contactTime: ['오전 (9~12시)', '오후 (12~18시)', '저녁 (18~21시)', '아무 때나']
  };
  const STEP_NAMES = ['분야', '규모·예산·일정', '연락처'];
  let resumeShown = false;
  const blankDraft = () => ({ category: '', region: '', experts: [], pkg: '', size: '', budget: '', schedule: '', detail: '', name: '', phone: '', contactTime: '', agree: false, maxStep: 1, savedAt: 0 });
  const draft = () => { if (!S.draft) S.draft = blankDraft(); return S.draft; };
  const draftHasData = () => S.draft && ['category', 'region', 'size', 'budget', 'schedule', 'detail', 'name', 'phone'].some((k) => S.draft[k]);
  function validate(step) {
    const d = draft(), err = {};
    if (step === 1) {
      if (!d.category) err.category = '시공 분야를 하나 골라 주세요.';
      if (!d.region) err.region = '공사할 지역을 골라 주세요.';
    } else if (step === 2) {
      if (!d.size) err.size = '대략적인 규모를 골라 주세요. 잘 모르면 ‘잘 모르겠어요’를 누르세요.';
      if (!d.budget) err.budget = '예산 범위를 골라 주세요. 아직 모르면 ‘상담 후 정할게요’를 누르세요.';
      if (!d.schedule) err.schedule = '언제 시작하고 싶은지 골라 주세요.';
    } else if (step === 3) {
      if (!d.name || d.name.trim().length < 2) err.name = '이름을 2글자 이상 적어 주세요.';
      if (!/^01\d{8,9}$/.test((d.phone || '').replace(/\D/g, ''))) err.phone = '휴대폰 번호를 확인해 주세요. 010으로 시작하는 숫자 10~11자리예요.';
      if (!d.agree) err.agree = '연락처 전달에 동의해야 견적을 받을 수 있어요.';
    }
    return err;
  }
  let qErrors = {};
  const fmtPhone = (v) => { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length < 4) return d; if (d.length < 8) return d.slice(0, 3) + '-' + d.slice(3); if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6); return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7); };
  const errHTML = (k) => '<p class="ferr" id="err-' + k + '"' + (qErrors[k] ? '' : ' hidden') + '>' + ic('alert') + '<span>' + (qErrors[k] || '') + '</span></p>';
  function radioChips(name, opts, val, label, cls) {
    return '<fieldset class="field' + (qErrors[name] ? ' invalid' : '') + '" id="f-' + name + '"><legend class="field__l">' + label + '</legend><div class="rchips ' + (cls || '') + '">' + opts.map((o, i) => '<label class="rc"><input type="radio" name="' + name + '" value="' + esc(o) + '"' + (val === o ? ' checked' : '') + ' data-q="' + name + '" data-fk="q-' + name + '-' + i + '"' + (qErrors[name] ? ' aria-invalid="true" aria-describedby="err-' + name + '"' : '') + '><span>' + esc(o) + '</span></label>').join('') + '</div>' + errHTML(name) + '</fieldset>';
  }
  function recipients(d) {
    if (d.experts && d.experts.length) return '<div class="recip"><p class="recip__k">받는 곳 ' + d.experts.length + '곳</p><ul class="chips chips--wrap">' + d.experts.map((id) => '<li><span class="chip chip--sm chip--soft chip--static">' + esc(expById[id].name) + '<button type="button" class="chip__x" data-act="qRmExpert" data-id="' + id + '" aria-label="' + esc(expById[id].name) + ' 받는 곳에서 빼기">' + ic('x') + '</button></span></li>').join('') + '</ul>' + (d.pkg ? '<p class="recip__pkg">선택한 패키지: ' + esc(d.pkg) + '</p>' : '') + '</div>';
    return '<div class="recip recip--auto">' + ic('info') + '<p>받는 곳을 고르지 않았어요. 분야와 지역이 맞는 전문가에게 보내는 흐름이에요. <a href="#/experts">전문가 직접 고르기</a></p></div>';
  }
  function summaryDL(d, edit) {
    const rows = [['분야', d.category ? catById[d.category].name : '', 1], ['지역', d.region, 1], ['규모', d.size, 2], ['예산', d.budget, 2], ['시작 시기', d.schedule, 2], ['더 알려 줄 내용', d.detail, 2], ['이름', d.name, 3], ['휴대폰', d.phone, 3], ['연락받기 편한 시간', d.contactTime, 3]];
    return '<dl class="sum">' + rows.map((r) => '<div class="sum__row"><dt>' + r[0] + '</dt><dd>' + (r[1] ? esc(r[1]) : '<span class="muted">아직 안 적었어요</span>') + (edit ? '<a href="#/quote/' + r[2] + '" class="sum__edit" aria-label="' + r[0] + ' 고치기">고치기</a>' : '') + '</dd></div>').join('') + '</dl>';
  }
  function pageQuote(r) {
    const stepRaw = r.parts[1];
    if (stepRaw === 'done') return pageQuoteDone(r);
    const step = parseInt(stepRaw, 10);
    if (!(step >= 1 && step <= 3)) return { redirect: '#/quote/1' };
    for (let s = 1; s < step; s++) {
      if (Object.keys(validate(s)).length) return { redirect: '#/quote/' + s, toast: '앞 단계를 먼저 채워 주세요.' };
    }
    const d = draft();
    if (d.maxStep < step) { d.maxStep = step; save.draft(); }
    let body = '';
    let resume = '';
    if (draftFromStorage && !resumeShown && draftHasData()) { resumeShown = true; resume = '<div class="resume">' + ic('info') + '<p>작성하던 내용을 불러왔어요. 새로고침해도 이 기기에 남아 있어요.</p><button type="button" class="link-btn" data-act="qRestart">처음부터 다시 쓰기</button></div>'; }
    if (step === 1) {
      body = recipients(d) +
        '<fieldset class="field' + (qErrors.category ? ' invalid' : '') + '" id="f-category"><legend class="field__l">어떤 공사가 필요하세요?</legend><div class="rtiles">' + D.categories.map((c, i) => '<label class="rt"><input type="radio" name="category" value="' + c.id + '"' + (d.category === c.id ? ' checked' : '') + ' data-q="category" data-fk="q-cat-' + i + '"' + (qErrors.category ? ' aria-invalid="true" aria-describedby="err-category"' : '') + '><span class="rt__ic">' + ic(c.icon) + '</span><span class="rt__n">' + c.name + '</span><span class="rt__d">' + c.desc + '</span></label>').join('') + '</div>' + errHTML('category') + '</fieldset>' +
        radioChips('region', D.regions, d.region, '공사할 곳은 어디인가요?');
    } else if (step === 2) {
      body = radioChips('size', Q.size, d.size, '공사 규모는 어느 정도예요?') +
        radioChips('budget', Q.budget, d.budget, '생각하는 예산은요?') +
        radioChips('schedule', Q.schedule, d.schedule, '언제 시작하고 싶으세요?') +
        '<div class="field"><label class="field__l" for="q-detail">더 알려 줄 내용 <span class="opt">선택</span></label><textarea id="q-detail" class="inp" rows="4" maxlength="300" data-q="detail" data-fk="q-detail" placeholder="예: 30년 된 2층 주택이고, 장마 때 옥상에서 물이 새요." aria-describedby="q-detail-c">' + esc(d.detail) + '</textarea><p class="field__h" id="q-detail-c"><span id="detailCount">' + (d.detail || '').length + '</span>/300자</p></div>';
    } else {
      body = '<div class="field' + (qErrors.name ? ' invalid' : '') + '"><label class="field__l" for="q-name">이름</label><input id="q-name" class="inp" type="text" autocomplete="name" data-q="name" data-fk="q-name" value="' + esc(d.name) + '" placeholder="예: 김건축"' + (qErrors.name ? ' aria-invalid="true" aria-describedby="err-name"' : '') + '>' + errHTML('name') + '</div>' +
        '<div class="field' + (qErrors.phone ? ' invalid' : '') + '"><label class="field__l" for="q-phone">휴대폰 번호</label><input id="q-phone" class="inp" type="tel" inputmode="numeric" autocomplete="tel" data-q="phone" data-fk="q-phone" value="' + esc(d.phone) + '" placeholder="010-1234-5678" aria-describedby="q-phone-h' + (qErrors.phone ? ' err-phone' : '') + '"' + (qErrors.phone ? ' aria-invalid="true"' : '') + '><p class="field__h" id="q-phone-h">숫자만 넣으면 줄표(-)는 저절로 들어가요.</p>' + errHTML('phone') + '</div>' +
        radioChips('contactTime', Q.contactTime, d.contactTime, '연락받기 편한 시간 <span class="opt">선택</span>') +
        '<div class="field' + (qErrors.agree ? ' invalid' : '') + '"><label class="agree"><input type="checkbox" data-q="agree" data-fk="q-agree"' + (d.agree ? ' checked' : '') + (qErrors.agree ? ' aria-invalid="true" aria-describedby="err-agree"' : '') + '><span>견적을 받기 위해 이름과 연락처를 전문가에게 전달하는 데 동의해요. <strong>(필수)</strong></span></label>' + errHTML('agree') + '</div>' +
        '<div class="field"><p class="field__l">보내기 전에 확인해 주세요</p>' + summaryDL(d, true) + '</div>';
    }
    const pct = Math.round(step / 3 * 100);
    const nav = (where) => '<div class="qnav qnav--' + where + '">' + (step > 1 ? '<a class="btn btn--line btn--lg qnav__prev" href="#/quote/' + (step - 1) + '">' + ic('chevL') + '이전</a>' : '') +
      (step < 3 ? '<button type="button" class="btn btn--orange btn--lg qnav__next" data-act="qNext" data-step="' + step + '">다음' + ic('chevR') + '</button>' : '<button type="button" class="btn btn--orange btn--lg qnav__next" data-act="qSubmit">견적 요청 보내기</button>') + '</div>';
    const html = metaRow() + '<div class="wrap page"><div class="qlayout"><div class="qmain">' +
      '<div class="qhead"><h1>무료 견적 요청</h1><p class="qhead__step" id="qStep"><strong>' + step + '</strong>/3 단계 · ' + STEP_NAMES[step - 1] + '</p>' +
        '<div class="qbar" role="progressbar" aria-label="견적 요청 진행" aria-valuemin="1" aria-valuemax="3" aria-valuenow="' + step + '" aria-valuetext="3단계 중 ' + step + '단계"><span style="width:' + pct + '%"></span></div>' +
        '<ol class="qsteps">' + STEP_NAMES.map((n, i) => '<li class="' + (i + 1 < step ? 'done' : i + 1 === step ? 'now' : '') + '"' + (i + 1 === step ? ' aria-current="step"' : '') + '>' + (i + 1 < step ? '<a href="#/quote/' + (i + 1) + '">' + ic('check') + n + '</a>' : '<span>' + (i + 1) + '. ' + n + '</span>') + '</li>').join('') + '</ol>' +
      '</div>' +
      '<div class="errsum" id="errSum" role="alert"' + (Object.keys(qErrors).length ? '' : ' hidden') + '>' + (Object.keys(qErrors).length ? ic('alert') + '<span>빠진 내용이 ' + Object.keys(qErrors).length + '개 있어요. 빨간 글씨를 확인해 주세요.</span>' : '') + '</div>' +
      resume + '<form class="qform" id="qForm" novalidate>' + body + '</form>' +
      '<p class="autosave" id="autosave" aria-live="polite">' + ic('check') + (d.savedAt ? '자동 저장됨 · ' + timeStr(d.savedAt) : '입력한 내용은 이 기기에 자동 저장돼요. 새로고침해도 남아 있어요.') + '</p>' +
      nav('inline') +
      '</div><aside class="qside pc-only" aria-label="입력한 내용"><div class="card qside__card"><p class="qside__t">지금까지 입력한 내용</p><div id="liveSum">' + summaryDL(d, false) + '</div>' + recipientsMini(d) + '</div></aside></div></div>';
    const dock = '<div class="dock__in dock__in--q">' + (step > 1 ? '<a class="btn btn--line dock__prev" href="#/quote/' + (step - 1) + '">' + ic('chevL') + '이전</a>' : '') + (step < 3 ? '<button type="button" class="btn btn--orange dock__main" data-act="qNext" data-step="' + step + '">다음 (' + step + '/3)</button>' : '<button type="button" class="btn btn--orange dock__main" data-act="qSubmit">견적 요청 보내기</button>') + '</div>';
    return { title: '견적 요청 ' + step + '/3', html, dock, hideTab: true };
  }
  const recipientsMini = (d) => '<p class="qside__r">' + ic('user') + (d.experts && d.experts.length ? '받는 곳: ' + d.experts.map((id) => esc(expById[id].name)).join(', ') : '받는 곳: 분야·지역이 맞는 전문가') + '</p>';
  const timeStr = (ts) => { const t = new Date(ts); const h = t.getHours(), m = t.getMinutes(); return (h < 12 ? '오전 ' : '오후 ') + ((h % 12) || 12) + ':' + String(m).padStart(2, '0'); };
  function pageQuoteDone(r) {
    const q = S.quotes.find((x) => x.id === r.params.get('id')) || S.quotes[0];
    if (!q) return { redirect: '#/quote/1' };
    const hours = respHours(q);
    const html = metaRow() + '<div class="wrap page"><div class="done card">' +
      '<span class="done__ic">' + ic('check', 'ic--lg') + '</span><h1>견적 요청을 보냈어요</h1>' +
      '<p class="done__d">시안이라 실제로 전송되지는 않아요. 실제 서비스에서는 전문가가 확인하면 문자로 알려 드려요.</p>' +
      '<ol class="track"><li class="done">' + ic('check') + '<span>요청 보냄</span></li><li class="now"><span class="track__dot"></span><span>전문가 확인 중<small>' + (hours ? '보통 ' + hours + '시간 안에 답변' : '') + '</small></span></li><li><span class="track__dot"></span><span>견적 도착 · 비교</span></li></ol>' +
      summaryDL(q, false) +
      '<div class="done__acts"><a class="btn btn--blue btn--lg" href="#/quotes">견적함에서 보기</a><a class="btn btn--line btn--lg" href="#/">홈으로</a></div>' +
    '</div></div>';
    return { title: '견적 요청 완료', html };
  }
  function respHours(q) {
    const pool = q.experts && q.experts.length ? q.experts.map((id) => expById[id]) : D.experts.filter((e) => e.category === q.category);
    return pool.length ? Math.min.apply(null, pool.map((e) => e.responseHours)) : 0;
  }

  /* ---------- 화면: 견적함 ---------- */
  function pageQuotes() {
    const d = S.draft;
    const draftCard = draftHasData() ? '<div class="draftcard card">' + ic('inbox') + '<div><p class="draftcard__t">작성 중인 요청이 있어요</p><p class="muted">' + (d.category ? catById[d.category].name + ' · ' : '') + (d.maxStep || 1) + '/3 단계까지 입력 · ' + (d.savedAt ? timeStr(d.savedAt) + ' 자동 저장' : '') + '</p></div><a class="btn btn--blue" href="#/quote/' + Math.min(d.maxStep || 1, 3) + '">이어서 쓰기</a></div>' : '';
    const list = S.quotes.length ? '<ul class="qlist">' + S.quotes.map((q) => {
      const c = catById[q.category]; const h = respHours(q);
      return '<li class="qcard card"><div class="qcard__top"><span class="qcard__ic">' + ic(c.icon) + '</span><div><p class="qcard__t">' + c.name + ' · ' + esc(q.region) + '</p><p class="muted">' + new Date(q.createdAt).toLocaleDateString('ko-KR') + ' ' + timeStr(q.createdAt) + ' 요청 · ' + (q.experts.length ? q.experts.map((id) => esc(expById[id].name)).join(', ') : '분야·지역 맞춤') + '</p></div><span class="status">전문가 확인 중</span></div>' +
        '<ol class="track track--sm"><li class="done">' + ic('check') + '<span>요청 보냄</span></li><li class="now"><span class="track__dot"></span><span>전문가 확인 중' + (h ? '<small>보통 ' + h + '시간 안에 답변</small>' : '') + '</span></li><li><span class="track__dot"></span><span>견적 도착</span></li></ol>' +
        '<details class="qcard__more"><summary>보낸 내용 보기</summary>' + summaryDL(q, false) + '<button type="button" class="link-btn link-btn--danger" data-act="qCancel" data-id="' + q.id + '">' + ic('trash') + '이 요청 지우기</button></details></li>';
    }).join('') + '</ul>' : emptyBox({ icon: 'inbox', title: '아직 보낸 견적 요청이 없어요', desc: '3단계만 채우면 무료로 견적을 받을 수 있어요. 쓰던 내용은 자동 저장돼요.', actions: '<a class="btn btn--orange btn--lg" href="#/quote/1">무료 견적 신청하기</a>' });
    const html = metaRow() + '<div class="wrap page page--narrow"><div class="page__head"><h1>견적함 <span class="count">' + S.quotes.length + '건</span></h1><p class="page__d">보낸 요청과 진행 상황을 여기서 확인해요.</p></div>' + draftCard + list + '</div>';
    return { title: '견적함', html };
  }

  /* ---------- 화면: 자재몰 ---------- */
  function matCard(m) {
    const t = myTier();
    let price;
    if (t) {
      const c = calc(m.price, 1, t.id);
      price = '<p class="mc__list"><span class="sr-only">정가</span><s>' + won(c.list) + '</s><span class="mc__dc">' + t.name + ' −' + t.discount + '%</span></p><p class="mc__pay"><span class="sr-only">결제 예정</span>' + won(c.pay) + '<small>/' + m.unit + '</small></p><p class="mc__pt">적립 예정 ' + num(c.points) + 'P</p>';
    } else price = lockedPrice(true);
    return '<li class="mc card"><a href="#/product/' + m.id + '" class="mc__link"><span class="mc__imgw"><img src="' + matImg(m) + '" alt="" width="480" height="360" loading="lazy"><span class="stock' + (m.stock === '당일 출고' ? ' stock--now' : '') + '">' + m.stock + '</span></span><span class="mc__body"><span class="mc__cat">' + mcatById[m.category].name + '</span><span class="mc__n">' + esc(m.name) + '</span><span class="mc__spec">' + esc(m.spec) + '</span>' + price + '<span class="mc__moq">최소 ' + m.moq + m.unit.replace(/\(.*\)/, '') + '부터</span></span></a></li>';
  }
  function pageMall(r) {
    const cat = r.params.get('cat') || 'all', q = r.params.get('q') || '';
    const base = q ? D.materials.filter((m) => matchHay(matHay(m), q)) : D.materials.slice();
    const list = base.filter((m) => cat === 'all' || m.category === cat);
    const t = myTier();
    const chips = chip('전체', base.length, cat === 'all', 'mset', 'cat', 'all', 'mc-all') + D.materialCategories.map((c) => chip(c.name, base.filter((m) => m.category === c.id).length, cat === c.id, 'mset', 'cat', c.id, 'mc-' + c.id)).join('');
    const banner = t
      ? '<div class="mbanner mbanner--on">' + '<span class="tier-pill tier--' + t.id + '">' + t.name + '</span><p><strong>' + esc(S.user.name) + ' 님은 모든 자재 ' + t.discount + '% 할인</strong> · 결제 금액의 ' + t.pointRate + '% 포인트 적립 · 보유 ' + num(S.user.points) + 'P</p><a class="link-btn" href="#/me">등급 안내</a></div>'
      : '<div class="mbanner">' + ic('lock', 'ic--lg') + '<div><p class="mbanner__t">회원 전용 가격이에요</p><p>로그인하면 내 등급의 할인가와 적립 예정 포인트가 보여요. (' + D.tiers.map((x) => x.name + ' ' + x.discount + '%').join(' · ') + ')</p></div><button type="button" class="btn btn--blue" data-act="login">데모 로그인</button></div>';
    let results;
    if (list.length) results = '<ul class="mat-grid">' + list.map(matCard).join('') + '</ul>';
    else if (q && !base.length) results = emptyBox({ icon: 'box', title: '‘' + esc(q) + '’ 자재를 찾지 못했어요', desc: '이름 일부만 넣어 보세요. 예: ‘석고’, ‘타일’, ‘단열’', actions: '<button type="button" class="btn btn--line" data-act="mset" data-k="q" data-v="all">검색어 지우기</button>' });
    else results = emptyBox({ icon: 'box', title: '이 분류는 아직 상품을 준비하고 있어요', desc: '‘' + (mcatById[cat] ? mcatById[cat].name : '') + '’ 상품이 들어오면 여기에 보여요. 다른 분류를 둘러보세요.', actions: '<button type="button" class="btn btn--blue" data-act="mset" data-k="cat" data-v="all">전체 자재 보기</button>' });
    const html = metaRow() + '<div class="wrap page">' +
      '<div class="page__head"><h1>' + (q ? '‘' + esc(q) + '’ 자재' : '회원전용 자재 도매몰') + '</h1><p class="page__d">가격은 정가 · 등급 할인 · 결제 예정 · 적립 예정 포인트로 나눠 보여 드려요.</p></div>' +
      banner +
      '<div class="layout2">' +
        '<aside class="filters" aria-label="자재 분류"><div class="fgroup"><h2 class="fgroup__h" id="mh-cat">분류</h2><div class="chipscroll" id="rowMat" data-keep-scroll><ul class="chips" role="group" aria-labelledby="mh-cat">' + chips + '</ul></div></div></aside>' +
        '<div class="results"><div class="results__bar"><p class="results__n" role="status">자재 <strong>' + list.length + '</strong>개</p>' + (q ? '<button type="button" class="chip chip--sm chip--soft" data-act="mset" data-k="q" data-v="all">‘' + esc(q) + '’ 검색' + ic('x') + '</button>' : '') + '</div>' + results + '</div>' +
      '</div></div>';
    return { title: '자재몰', html };
  }

  /* ---------- 화면: 상품 상세 ---------- */
  const unitShort = (m) => m.unit.replace(/\(.*\)/, '');
  function prodPrice(m) {
    const t = myTier(), qty = S.qty[m.id] || m.moq;
    if (!t) return lockedPrice(false);
    return priceRows(calc(m.price, qty, t.id), won(m.price) + ' × ' + num(qty) + unitShort(m));
  }
  function tierTable(m) {
    const t = myTier(), qty = S.qty[m.id] || m.moq;
    return '<div class="ttable" role="table" aria-label="등급별 가격"><div class="ttable__row ttable__row--h" role="row"><span role="columnheader">등급</span><span role="columnheader">할인</span><span role="columnheader">결제 예정</span><span role="columnheader">적립</span></div>' +
      D.tiers.map((x) => { const c = calc(m.price, qty, x.id); const mine = t && t.id === x.id; return '<div class="ttable__row' + (mine ? ' mine' : '') + '" role="row"><span role="cell">' + x.name + (mine ? ' <small>내 등급</small>' : '') + '</span><span role="cell">' + x.discount + '%</span><span role="cell">' + (t ? won(c.pay) : '<span class="muted">로그인</span>') + '</span><span role="cell">' + (t ? num(c.points) + 'P' : x.pointRate + '%') + '</span></div>'; }).join('') + '</div>';
  }
  function pageProduct(r) {
    const m = matById[r.parts[1]];
    if (!m) return PAGES.notfound();
    const qty = S.qty[m.id] || m.moq, t = myTier();
    const under = qty < m.moq;
    const html = metaRow() + '<div class="wrap page"><nav class="crumb" aria-label="이동"><a href="#/mall" data-act="back">' + ic('chevL') + '자재 목록으로</a></nav>' +
      '<div class="layout-prod">' +
        '<div class="prod__img"><img src="' + matImg(m) + '" alt="' + esc(m.name) + ' 재질 예시 그림" width="480" height="360"><span class="stock' + (m.stock === '당일 출고' ? ' stock--now' : '') + '">' + m.stock + '</span></div>' +
        '<div class="prod__info">' +
          '<p class="mc__cat">' + mcatById[m.category].name + '</p><h1 class="prod__t">' + esc(m.name) + '</h1>' +
          '<dl class="specs"><div><dt>규격</dt><dd>' + esc(m.spec) + '</dd></div><div><dt>판매 단위</dt><dd>' + esc(m.unit) + '</dd></div><div><dt>출고</dt><dd>' + esc(m.stock) + '</dd></div><div><dt>최소 주문</dt><dd>' + m.moq + unitShort(m) + '</dd></div></dl>' +
          '<div class="qtyrow"><span class="qtyrow__l" id="qty-l">수량</span><div class="stepper" role="group" aria-labelledby="qty-l"><button type="button" data-act="qty" data-id="' + m.id + '" data-d="-1" aria-label="수량 1 줄이기" data-fk="qm"' + (qty <= 1 ? ' disabled' : '') + '>' + ic('minus') + '</button><input type="number" inputmode="numeric" min="1" max="9999" value="' + qty + '" data-change="qtyInput" data-id="' + m.id + '" aria-label="수량 (' + esc(m.unit) + ')" data-fk="qi"><button type="button" data-act="qty" data-id="' + m.id + '" data-d="1" aria-label="수량 1 늘리기" data-fk="qp">' + ic('plus') + '</button></div><span class="qtyrow__u">' + esc(unitShort(m)) + '</span></div>' +
          '<p class="hint' + (under ? ' hint--warn' : '') + '" id="moqHint">' + ic(under ? 'alert' : 'info') + (under ? '최소 주문은 ' + m.moq + unitShort(m) + '이에요. 지금 ' + qty + unitShort(m) + ' — ' + (m.moq - qty) + unitShort(m) + ' 더 담아야 주문할 수 있어요.' : '최소 ' + m.moq + unitShort(m) + '부터 주문할 수 있어요.') + '</p>' +
          '<div id="prodPrice">' + prodPrice(m) + '</div>' +
          '<div class="pc-only">' + (t ? '<button type="button" class="btn btn--orange btn--lg btn--block" data-act="addCart" data-id="' + m.id + '">장바구니 담기</button>' : '') + '</div>' +
          '<section class="block block--flat" aria-labelledby="tt-h"><h2 id="tt-h">등급별로 이렇게 달라져요 <small>(' + num(qty) + unitShort(m) + ' 기준)</small></h2><div id="tierTable">' + tierTable(m) + '</div><p class="note">' + ic('coin') + esc(D.points.use) + '</p></section>' +
        '</div>' +
      '</div></div>';
    const dock = t
      ? '<div class="dock__in"><div class="dock__info"><span class="dock__k">결제 예정</span><strong id="dockPay">' + won(calc(m.price, qty, t.id).pay) + '</strong></div><button type="button" class="btn btn--orange dock__main" data-act="addCart" data-id="' + m.id + '">장바구니 담기</button></div>'
      : '<div class="dock__in"><div class="dock__info"><span class="dock__k">' + ic('lock') + '회원 전용 가격</span></div><button type="button" class="btn btn--blue dock__main" data-act="login">데모 로그인하고 가격 보기</button></div>';
    return { title: m.name, html, dock, hideTab: true };
  }
  function refreshProduct(m) {
    const qty = S.qty[m.id] || m.moq, t = myTier(), under = qty < m.moq;
    const pp = $('#prodPrice'); if (pp) pp.innerHTML = prodPrice(m);
    const tt = $('#tierTable'); if (tt) tt.innerHTML = tierTable(m);
    const h = $('#tt-h small'); if (h) h.textContent = '(' + num(qty) + unitShort(m) + ' 기준)';
    const mh = $('#moqHint');
    if (mh) { mh.className = 'hint' + (under ? ' hint--warn' : ''); mh.innerHTML = ic(under ? 'alert' : 'info') + (under ? '최소 주문은 ' + m.moq + unitShort(m) + '이에요. 지금 ' + qty + unitShort(m) + ' — ' + (m.moq - qty) + unitShort(m) + ' 더 담아야 주문할 수 있어요.' : '최소 ' + m.moq + unitShort(m) + '부터 주문할 수 있어요.'); }
    const inp = $('.stepper input'); if (inp && document.activeElement !== inp) inp.value = qty;
    const minus = $('.stepper button[data-d="-1"]'); if (minus) minus.disabled = qty <= 1;
    const dp = $('#dockPay'); if (dp && t) dp.textContent = won(calc(m.price, qty, t.id).pay);
  }

  /* ---------- 화면: 장바구니 ---------- */
  function pageCart() {
    const t = myTier();
    if (!S.cart.length) return { title: '장바구니', html: metaRow() + '<div class="wrap page page--narrow"><div class="page__head"><h1>장바구니</h1></div>' + emptyBox({ icon: 'cart', title: '장바구니가 비어 있어요', desc: '자재몰에서 필요한 자재를 담아 보세요. 등급 할인가로 계산돼요.', actions: '<a class="btn btn--blue btn--lg" href="#/mall">자재몰 둘러보기</a>' }) + '</div>' };
    let sum = { list: 0, discount: 0, pay: 0, points: 0 };
    const issues = [];
    const items = S.cart.map((it) => {
      const m = matById[it.id], c = calc(m.price, it.qty, t ? t.id : 'basic');
      sum.list += c.list; sum.discount += c.discount; sum.pay += c.pay; sum.points += c.points;
      const under = it.qty < m.moq;
      if (under) issues.push(m);
      return '<li class="ci card' + (under ? ' ci--warn' : '') + '" id="ci-' + m.id + '"><a href="#/product/' + m.id + '" class="ci__img"><img src="' + matImg(m) + '" alt="" width="480" height="360"></a><div class="ci__body"><a class="ci__n" href="#/product/' + m.id + '">' + esc(m.name) + '</a><p class="muted">' + esc(m.spec) + ' · ' + esc(m.unit) + '</p>' +
        '<div class="ci__row"><div class="stepper stepper--sm" role="group" aria-label="' + esc(m.name) + ' 수량"><button type="button" data-act="cqty" data-id="' + m.id + '" data-d="-1" aria-label="' + esc(m.name) + ' 수량 1 줄이기" data-fk="cm-' + m.id + '"' + (it.qty <= 1 ? ' disabled' : '') + '>' + ic('minus') + '</button><input type="number" inputmode="numeric" min="1" max="9999" value="' + it.qty + '" data-change="cqtyInput" data-id="' + m.id + '" aria-label="' + esc(m.name) + ' 수량" data-fk="ci-' + m.id + '"><button type="button" data-act="cqty" data-id="' + m.id + '" data-d="1" aria-label="' + esc(m.name) + ' 수량 1 늘리기" data-fk="cp-' + m.id + '">' + ic('plus') + '</button></div>' +
        '<p class="ci__price">' + (t ? '<s>' + won(c.list) + '</s><strong>' + won(c.pay) + '</strong><small>적립 ' + num(c.points) + 'P</small>' : lockedPrice(true)) + '</p></div>' +
        (under ? '<div class="moqwarn" role="alert">' + ic('alert') + '<p>최소 주문은 <strong>' + m.moq + unitShort(m) + '</strong>이에요. 지금 ' + it.qty + unitShort(m) + ' — ' + (m.moq - it.qty) + unitShort(m) + ' 더 필요해요.</p><button type="button" class="btn btn--sm btn--soft" data-act="cfix" data-id="' + m.id + '">' + m.moq + unitShort(m) + '로 맞추기</button></div>' : '') +
        '<button type="button" class="ci__rm" data-act="crm" data-id="' + m.id + '" aria-label="' + esc(m.name) + ' 장바구니에서 빼기">' + ic('x') + '</button></div></li>';
    }).join('');
    const totals = t
      ? '<dl class="pb"><div class="pb__row"><dt>정가 합계</dt><dd>' + won(sum.list) + '</dd></div><div class="pb__row pb__row--dc"><dt>등급 할인 <span class="tier-pill tier--' + t.id + '">' + t.name + ' ' + t.discount + '%</span></dt><dd>−' + won(sum.discount) + '</dd></div><div class="pb__row pb__row--pay"><dt>결제 예정</dt><dd>' + won(sum.pay) + '</dd></div><div class="pb__row pb__row--pt"><dt>적립 예정 포인트 <small>(' + t.pointRate + '%)</small></dt><dd>' + num(sum.points) + 'P</dd></div></dl><p class="note">' + ic('coin') + '보유 ' + num(S.user.points) + 'P · ' + esc(D.points.use) + '</p>'
      : lockedPrice(false);
    const orderBtn = t ? '<button type="button" class="btn btn--orange btn--lg btn--block" data-act="order">' + (issues.length ? '주문하기 (수량 확인 필요)' : won(sum.pay) + ' 주문하기') + '</button>' : '';
    const html = metaRow() + '<div class="wrap page"><div class="page__head"><h1>장바구니 <span class="count">' + S.cart.length + '개</span></h1></div>' +
      (issues.length ? '<div class="errsum" role="status">' + ic('alert') + '<span>최소 주문 수량보다 적게 담긴 상품이 ' + issues.length + '개 있어요. 각 상품의 ‘맞추기’를 누르면 바로 고쳐져요.</span></div>' : '') +
      '<div class="layout-cart"><ul class="clist">' + items + '</ul><aside class="csum card" aria-label="결제 금액"><h2 class="csum__t">결제 금액</h2>' + totals + '<div class="pc-only">' + orderBtn + '</div></aside></div></div>';
    const dock = t ? '<div class="dock__in"><div class="dock__info"><span class="dock__k">결제 예정</span><strong>' + won(sum.pay) + '</strong></div><button type="button" class="btn btn--orange dock__main" data-act="order">주문하기</button></div>' : '<div class="dock__in"><button type="button" class="btn btn--blue dock__main" data-act="login">데모 로그인하고 가격 보기</button></div>';
    return { title: '장바구니', html, dock, hideTab: true };
  }

  /* ---------- 화면: 내 정보 · 등급·포인트 ---------- */
  function pageMe() {
    const t = myTier();
    const prof = t
      ? '<div class="prof card"><div class="prof__top"><span class="prof__av" aria-hidden="true">' + esc(S.user.name.slice(0, 1)) + '</span><div><p class="prof__n">' + esc(S.user.name) + ' 님 <span class="tier-pill tier--' + t.id + '">' + t.name + '</span></p><p class="muted">' + esc(S.user.company) + '</p></div></div>' +
        '<div class="prof__pt"><p class="prof__k">' + ic('coin') + '내 포인트</p><p class="prof__v">' + num(S.user.points) + '<span>P</span></p><p class="muted">' + esc(D.points.use) + '</p></div>' +
        '<dl class="prof__stats"><div><dt>자재 할인</dt><dd>' + t.discount + '%</dd></div><div><dt>포인트 적립</dt><dd>' + t.pointRate + '%</dd></div><div><dt>견적함</dt><dd><a href="#/quotes">' + S.quotes.length + '건</a></dd></div><div><dt>장바구니</dt><dd><a href="#/cart">' + S.cart.length + '개</a></dd></div></dl>' +
        nextTier(t) + '<button type="button" class="link-btn" data-act="logout">로그아웃 (시안)</button></div>'
      : '<div class="prof card prof--guest">' + ic('user', 'ic--lg') + '<p class="prof__n">로그인하면 내 등급과 포인트가 보여요</p><p class="muted">시안에서는 ‘데모 로그인’으로 골드 회원 화면을 볼 수 있어요.</p><button type="button" class="btn btn--orange btn--lg" data-act="login">데모 로그인 (골드 회원 예시)</button></div>';
    const tiers = '<section class="block" aria-labelledby="tier-h"><h2 id="tier-h">회원 등급표</h2><p class="block__d">등급이 높을수록 자재를 더 싸게 사고, 포인트도 더 많이 쌓여요.</p><div class="tgrid" role="table" aria-label="회원 등급별 혜택"><div class="tgrid__row tgrid__row--h" role="row"><span role="columnheader">등급</span><span role="columnheader">자재 할인</span><span role="columnheader">포인트 적립</span><span role="columnheader">조건</span></div>' +
      D.tiers.map((x) => '<div class="tgrid__row' + (t && t.id === x.id ? ' mine' : '') + '" role="row"><span role="cell" class="tgrid__n"><span class="tier-pill tier--' + x.id + '">' + x.name + '</span>' + (t && t.id === x.id ? '<small>내 등급</small>' : '') + '</span><span role="cell"><strong>' + x.discount + '%</strong></span><span role="cell"><strong>' + x.pointRate + '%</strong></span><span role="cell" class="tgrid__rule">' + esc(x.rule) + '</span></div>').join('') + '</div></section>';
    const ref = '<section class="block" aria-labelledby="ref-h"><h2 id="ref-h">' + ic('gift') + '추천 적립 ' + num(D.points.referral) + 'P</h2><p class="ref__rule">' + esc(D.points.referralRule) + '</p>' +
      '<ol class="refflow" aria-label="추천 적립 예시"><li class="ok"><span class="refflow__who">나</span><span class="refflow__arrow" aria-hidden="true">→</span><span class="refflow__who">내가 추천한 회원</span><span class="refflow__res">첫 구매하면 <strong>+' + num(D.points.referral) + 'P</strong> 1번</span></li>' +
      '<li class="no"><span class="refflow__who">내가 추천한 회원</span><span class="refflow__arrow" aria-hidden="true">→</span><span class="refflow__who">그 회원이 추천한 사람</span><span class="refflow__res">나에게는 <strong>적립 없음</strong></span></li></ol>' +
      (t ? '<div class="refcode"><p>내 추천 코드 <strong>BUILD-KIM48</strong> <small class="muted">(예시)</small></p><button type="button" class="btn btn--sm btn--line" data-act="copy">코드 복사</button></div>' : '') + '</section>';
    const html = metaRow() + '<div class="wrap page"><div class="page__head"><h1>내 정보 · 등급·포인트</h1></div><div class="layout-me"><div>' + prof + '</div><div>' + tiers + ref + '</div></div></div>' + footer();
    return { title: '내 정보', html };
  }
  function nextTier(t) {
    const i = D.tiers.findIndex((x) => x.id === t.id);
    const n = D.tiers[i + 1];
    return n ? '<p class="nexttier">' + ic('trend') + '다음 등급 <strong>' + n.name + '</strong> 조건: ' + esc(n.rule) + ' — 할인 ' + n.discount + '% · 적립 ' + n.pointRate + '%</p>' : '<p class="nexttier">가장 높은 등급이에요.</p>';
  }

  /* ---------- 404 ---------- */
  const PAGES = {
    home: pageHome, experts: pageExperts, expert: pageExpert, compare: pageCompare, quote: pageQuote, quotes: pageQuotes, mall: pageMall, product: pageProduct, cart: pageCart, me: pageMe,
    notfound() { return { title: '찾을 수 없음', html: metaRow() + '<div class="wrap page">' + emptyBox({ icon: 'alert', title: '페이지를 찾을 수 없어요', desc: '주소가 바뀌었거나 없는 화면이에요.', actions: '<a class="btn btn--blue" href="#/">홈으로</a>' }) + '</div>' }; }
  };

  /* ---------- 동작 ---------- */
  function startQuote(expertIds, pkg) {
    const d = draft();
    if (expertIds && expertIds.length) {
      d.experts = expertIds.slice(0, 3);
      const cats = d.experts.map((id) => expById[id].category);
      d.category = cats[0];
      const reg = D.regions.find((rg) => regionMatch(expById[d.experts[0]].region, rg));
      if (!d.region && reg) d.region = reg;
    }
    d.pkg = pkg || '';
    d.savedAt = Date.now();
    qErrors = {};
    save.draft();
    go('#/quote/1');
  }
  function toggleCompare(id) {
    const i = S.compare.indexOf(id);
    if (i >= 0) { S.compare.splice(i, 1); toast(esc(expById[id].name) + '을(를) 비교함에서 뺐어요.'); }
    else if (S.compare.length >= 3) { toast('비교는 최대 3명까지 할 수 있어요. 하나를 빼고 다시 담아 주세요.'); return; }
    else {
      S.compare.push(id);
      toast(esc(expById[id].name) + '을(를) 비교함에 담았어요 (' + S.compare.length + '/3).', S.compare.length >= 2 && curRoute && curRoute.name === 'expert' ? { href: '#/compare', label: '비교하기' } : null);
    }
    save.compare();
    rerender();
  }
  function setDraftField(k, v) {
    const d = draft();
    d[k] = v; d.savedAt = Date.now();
    save.draft();
    if (qErrors[k]) {
      delete qErrors[k];
      const f = document.getElementById('err-' + k); if (f) f.hidden = true;
      const box = f && f.closest('.field'); if (box) box.classList.remove('invalid');
      $$('[data-q="' + k + '"]').forEach((el) => el.removeAttribute('aria-invalid'));
      const es = $('#errSum'); if (es) { const n = Object.keys(qErrors).length; if (!n) { es.hidden = true; es.innerHTML = ''; } else es.innerHTML = ic('alert') + '<span>빠진 내용이 ' + n + '개 있어요. 빨간 글씨를 확인해 주세요.</span>'; }
    }
    const as = $('#autosave'); if (as) as.innerHTML = ic('check') + '자동 저장됨 · ' + timeStr(d.savedAt);
    const ls = $('#liveSum'); if (ls) ls.innerHTML = summaryDL(d, false);
  }
  function showErrors(step) {
    qErrors = validate(step);
    rerender();
    const first = Object.keys(qErrors)[0];
    if (first) {
      const el = $('[data-q="' + first + '"]');
      if (el) { el.focus({ preventScroll: true }); const box = el.closest('.field') || el; box.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' }); }
    }
  }
  function cartSet(id, qty) {
    const it = S.cart.find((x) => x.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(9999, qty | 0 || 1)); save.cart(); rerender();
  }

  const ACT = {
    skip() { view.focus(); window.scrollTo(0, 0); },
    login() {
      S.user = Object.assign({}, D.demoUser); save.user();
      toast(esc(S.user.name) + ' 님(' + tierById[S.user.tier].name + ' 회원 예시)으로 로그인했어요. 이제 등급가가 보여요.');
      rerender();
    },
    logout() { S.user = null; save.user(); toast('로그아웃했어요.'); rerender(); },
    cmp(b) { toggleCompare(b.dataset.id); },
    quote(b) { const e = expById[b.dataset.expert]; const i = S.pkgSel[e.id] || 0; startQuote([e.id], curRoute && curRoute.name === 'expert' ? e.packages[i].tier : ''); },
    quoteAll() { startQuote(S.compare.slice()); },
    fset(b) { const o = {}; o[b.dataset.k] = b.dataset.v; setParams(o); },
    freset() { setParams({ cat: null, region: null, q: null }); },
    mset(b) { const o = {}; o[b.dataset.k] = b.dataset.v; setParams(o); },
    back(a, e) { const base = a.getAttribute('href'); if (prevHash && (prevHash === base || prevHash.indexOf(base + '?') === 0)) { e.preventDefault(); history.back(); } },
    jump(a, e) { e.preventDefault(); const el = document.getElementById(a.dataset.to); if (el) { el.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' }); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); } },
    qNext(b) {
      const step = +b.dataset.step;
      if (Object.keys(validate(step)).length) { showErrors(step); return; }
      qErrors = {}; go('#/quote/' + (step + 1));
    },
    qSubmit() {
      for (let s = 1; s <= 3; s++) { if (Object.keys(validate(s)).length) { if (s < 3) { go('#/quote/' + s); setTimeout(() => showErrors(s), 50); } else showErrors(3); return; } }
      const d = draft();
      const q = Object.assign({}, d, { id: 'q' + Date.now(), createdAt: Date.now() });
      delete q.maxStep; delete q.savedAt; delete q.agree;
      S.quotes.unshift(q); save.quotes();
      S.draft = null; save.draft(); qErrors = {};
      navByClick = true;
      location.replace('#/quote/done?id=' + q.id);
    },
    qRestart() { S.draft = blankDraft(); save.draft(); qErrors = {}; resumeShown = true; if (curRoute && curRoute.parts[1] !== '1') go('#/quote/1'); else rerender(); toast('처음부터 다시 쓸 수 있게 비웠어요.'); },
    qRmExpert(b) { const d = draft(); d.experts = d.experts.filter((x) => x !== b.dataset.id); if (!d.experts.length) d.pkg = ''; d.savedAt = Date.now(); save.draft(); rerender(); },
    qCancel(b) { S.quotes = S.quotes.filter((q) => q.id !== b.dataset.id); save.quotes(); rerender(); toast('요청을 지웠어요.'); },
    qty(b) { const m = matById[b.dataset.id]; S.qty[m.id] = Math.max(1, Math.min(9999, (S.qty[m.id] || m.moq) + (+b.dataset.d))); refreshProduct(m); },
    addCart(b) {
      const m = matById[b.dataset.id], qty = S.qty[m.id] || m.moq;
      const it = S.cart.find((x) => x.id === m.id);
      if (it) it.qty += qty; else S.cart.push({ id: m.id, qty });
      save.cart(); updateChrome(curRoute);
      toast(esc(m.name) + ' ' + num(qty) + unitShort(m) + '을(를) 장바구니에 담았어요.', { href: '#/cart', label: '장바구니 보기' });
    },
    cqty(b) { const it = S.cart.find((x) => x.id === b.dataset.id); if (it) cartSet(it.id, it.qty + (+b.dataset.d)); },
    cfix(b) { cartSet(b.dataset.id, matById[b.dataset.id].moq); toast('최소 주문 수량으로 맞췄어요.'); },
    crm(b) { const m = matById[b.dataset.id]; S.cart = S.cart.filter((x) => x.id !== b.dataset.id); save.cart(); rerender(); toast(esc(m.name) + '을(를) 장바구니에서 뺐어요.'); },
    order() {
      const bad = S.cart.find((it) => it.qty < matById[it.id].moq);
      if (bad) { const el = $('#ci-' + bad.id); if (el) { el.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' }); const fb = $('[data-act="cfix"]', el); if (fb) fb.focus({ preventScroll: true }); } toast('최소 주문 수량을 먼저 채워 주세요.'); return; }
      toast('시안이라 실제 주문은 되지 않아요. 실제 서비스에서는 여기서 결제로 넘어가요.');
    },
    copy() { const done = () => toast('추천 코드를 복사했어요 (예시 코드).'); if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText('BUILD-KIM48').then(done, done); else done(); }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (el && !el.disabled) { const f = ACT[el.dataset.act]; if (f) { f(el, e); return; } }
    const a = e.target.closest('a[href^="#/"]');
    if (a) {
      navByClick = true;
      sessionStorage.setItem('bg2.inapp', '1');
      if (a.dataset.recent) addRecent(a.dataset.recent);
    }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-change="sort"]')) setParams({ sort: t.value === 'rec' ? null : t.value });
    else if (t.matches('[data-change="pkg"]')) {
      const ex = expById[t.dataset.id]; S.pkgSel[ex.id] = +t.value;
      $$('.pk').forEach((l, i) => l.classList.toggle('on', i === +t.value));
      const sc = $('#sideCard'); if (sc) sc.innerHTML = sideCard(ex);
      const p = ex.packages[+t.value]; const di = $('.dock__info'); if (di) di.innerHTML = '<span class="dock__k">' + p.tier + '</span><strong>' + pkgPrice(p) + '</strong>';
    } else if (t.matches('[data-change="qtyInput"]')) { const m = matById[t.dataset.id]; S.qty[m.id] = Math.max(1, Math.min(9999, parseInt(t.value, 10) || 1)); t.value = S.qty[m.id]; refreshProduct(m); }
    else if (t.matches('[data-change="cqtyInput"]')) cartSet(t.dataset.id, parseInt(t.value, 10));
    else if (t.matches('[data-q]')) { const k = t.dataset.q; setDraftField(k, t.type === 'checkbox' ? t.checked : t.value); }
  });
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t.matches('[data-q]') || t.type === 'radio' || t.type === 'checkbox') return;
    if (t.dataset.q === 'phone') { const pos = t.value.length; t.value = fmtPhone(t.value); if (pos === t.value.length) { /* 커서 유지 */ } }
    if (t.dataset.q === 'detail') { const c = $('#detailCount'); if (c) c.textContent = t.value.length; }
    setDraftField(t.dataset.q, t.value);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { const t = $('#toast'); if (t.classList.contains('show')) t.classList.remove('show'); }
  });

  /* ---------- 시작 ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  $('#noticeText').textContent = D.notice;
  makeSearch($('#headSearch'));
  const headInput = $('#q-head');
  const syncPh = () => { headInput.placeholder = MQ_PC.matches ? '필요한 시공 분야를 입력해 보세요' : headInput.dataset.phM; layout(); };
  if (MQ_PC.addEventListener) MQ_PC.addEventListener('change', syncPh);
  syncPh();
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe($('#topbar'));
  render({ noSkeleton: true });
})();
