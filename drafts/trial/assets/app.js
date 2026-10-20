(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.close);
      if (el) el.remove();
    });
  });

  const timers = document.querySelectorAll('[data-timer]');
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - now) / 1000));
    const text = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)} 남음`;
    timers.forEach((el) => { el.textContent = text; });
  };
  if (timers.length) {
    tick();
    setInterval(tick, 1000);
  }

  document.querySelectorAll('.scroller').forEach((box) => {
    const track = box.querySelector('[data-hs]');
    const next = box.querySelector('[data-next]');
    if (!track || !next) return;
    const prev = next.cloneNode(true);
    prev.classList.add('prev');
    prev.removeAttribute('data-next');
    prev.setAttribute('aria-label', next.getAttribute('aria-label').replace('다음', '이전'));
    box.appendChild(prev);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      next.hidden = max <= 2 || track.scrollLeft >= max - 2;
      prev.hidden = max <= 2 || track.scrollLeft <= 2;
    };
    const go = (dir) => {
      const max = track.scrollWidth - track.clientWidth;
      const step = Math.max(120, track.clientWidth - 40);
      const left = Math.max(0, Math.min(max, track.scrollLeft + dir * step));
      track.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
    };
    next.addEventListener('click', () => go(1));
    prev.addEventListener('click', () => go(-1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  document.querySelectorAll('[data-carousel]').forEach((box) => {
    const track = box.querySelector('[data-track]');
    const out = box.querySelector('[data-count]');
    if (!track) return;
    const total = track.children.length;
    let index = 0;
    let paused = false;
    let inView = true;
    const sync = () => {
      const w = track.clientWidth || 1;
      index = Math.min(total - 1, Math.max(0, Math.round(track.scrollLeft / w)));
      if (out) out.textContent = String(index + 1);
    };
    track.addEventListener('scroll', () => window.requestAnimationFrame(sync), { passive: true });
    ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => box.addEventListener(ev, () => { paused = true; }, { passive: true }));
    ['pointerleave', 'focusout'].forEach((ev) => box.addEventListener(ev, () => { paused = false; }));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; }).observe(box);
    }
    if (!reduce && total > 1) {
      setInterval(() => {
        if (paused || !inView || document.hidden || track.clientWidth === 0) return;
        const to = (index + 1) % total;
        track.scrollTo({ left: to * track.clientWidth, behavior: to === 0 ? 'auto' : 'smooth' });
      }, 4500);
    }
  });

  const ticker = document.querySelector('[data-ticker]');
  if (ticker) {
    const words = [
      ['new', '욕실 리모델링'], ['up', '옥상 방수'], ['new', '상가 인테리어'], ['new', '단독주택 설계'], ['up', '외벽 도장'],
      ['new', '창호 교체'], ['new', '석고보드'], ['up', '건축 인허가'], ['new', '타일 줄눈'], ['up', '전기 증설'],
    ];
    const rank = ticker.querySelector('.tk-rank');
    const mark = ticker.querySelector('.tk-mark');
    const word = ticker.querySelector('.tk-word');
    let k = 0;
    const render = () => {
      const [m, w] = words[k];
      rank.textContent = String(k + 1);
      mark.className = `tk-mark ${m}`;
      mark.innerHTML = m === 'new' ? 'NEW' : '<svg width="24" height="24" aria-hidden="true"><use href="#i-up"/></svg>';
      word.textContent = w;
      ticker.classList.remove('swap');
      void ticker.offsetWidth;
      ticker.classList.add('swap');
    };
    if (!reduce) {
      setInterval(() => {
        if (document.hidden) return;
        k = (k + 1) % words.length;
        render();
      }, 3000);
    }
  }

  const search = document.querySelector('.search input');
  if (search && 'ResizeObserver' in window) {
    const longText = search.getAttribute('placeholder');
    new ResizeObserver(() => {
      const w = search.clientWidth;
      if (w > 0) search.setAttribute('placeholder', w < 200 ? '시공 분야 검색' : longText);
    }).observe(search);
  }

  document.querySelectorAll('.chips').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.bm');
    if (!btn) return;
    e.preventDefault();
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? '저장됨' : '저장');
  });
})();
