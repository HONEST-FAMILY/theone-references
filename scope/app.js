const anchors = Array.from(document.querySelectorAll('aside nav a'));
const sections = Array.from(document.querySelectorAll('main section'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anchors.forEach(anchor => {
      const current = anchor.hash === '#' + entry.target.id;
      anchor.classList.toggle('active', current);
      if (current) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-8% 0px -70% 0px', threshold: 0 });
sections.forEach(section => observer.observe(section));
