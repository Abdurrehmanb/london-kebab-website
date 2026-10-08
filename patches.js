(() => {
  const dividerSvg = `<svg viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0 12h58"/><path d="M1142 12h58"/>
      <g transform="translate(86 2)"><path d="M0 16 17 3l17 13H0Z"/><path d="M5 12h24"/><path d="m10 8 3 2m7-4 3 2m-1 5 3 2"/></g>
      <g transform="translate(332 3)"><path d="M2 3h31l-5 16H7L2 3Z"/><path d="M8 7h20M10 11h16M12 15h12"/><path d="M0 3h35"/></g>
      <g transform="translate(573 2)"><path d="M7 19V3"/><path d="M7 6h24M7 10h22M7 14h20"/><path d="M31 3v16"/><path d="M4 19h30"/></g>
      <g transform="translate(812 3)"><path d="M2 3h31l-5 16H7L2 3Z"/><path d="M8 7h20M10 11h16M12 15h12"/><path d="M0 3h35"/></g>
      <g transform="translate(1052 2)"><path d="M0 16 17 3l17 13H0Z"/><path d="M5 12h24"/><path d="m10 8 3 2m7-4 3 2m-1 5 3 2"/></g>
      <path d="M37 12h21m104 0h112m36 0h112m34 0h112m35 0h112m34 0h112" opacity=".8"/>
      <path d="M170 6q4-5 8 0m392 0q4-5 8 0m392 0q4-5 8 0" opacity=".7"/>
    </g>
  </svg>`;

  function addDividers() {
    const selectors = ['.menu-section', '.cinema', '.pizza-section', '.offer-section', '.location-section', '.footer'];
    document.querySelectorAll(selectors.join(',')).forEach(section => {
      if (section.previousElementSibling?.classList.contains('culinary-divider')) return;
      const divider = document.createElement('div');
      divider.className = 'culinary-divider';
      divider.style.color = 'var(--gold)';
      divider.innerHTML = dividerSvg;
      section.parentNode.insertBefore(divider, section);
    });
  }

  function patchFooterLogo() {
    const mark = document.querySelector('.footer-wordmark');
    if (!mark || mark.querySelector('img')) return;
    mark.innerHTML = '<img src="/img/logo.webp" alt="London Kebab & Pizzeria" style="width:108px;height:auto;max-height:72px;object-fit:contain;">';
  }

  function patchVideo() {
    document.querySelectorAll('.cinema video').forEach(video => {
      video.autoplay = true;
      video.defaultMuted = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.removeAttribute('controls');
      const tryPlay = () => {
        video.muted = true;
        video.play().catch(() => {});
      };
      if (video.readyState >= 2) tryPlay();
      video.addEventListener('canplay', tryPlay, { once: true });
      window.addEventListener('pageshow', tryPlay, { once: true });
    });
  }

  function apply() {
    addDividers();
    patchFooterLogo();
    patchVideo();
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
