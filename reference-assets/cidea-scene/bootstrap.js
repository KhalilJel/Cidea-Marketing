/* Cidea's accessible shell around the isolated reference runtime. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const motion = document.querySelector('.cidea-motion');
  const canvas = document.querySelector('#canvas');
  const params = new URLSearchParams(location.search);
  // Knappetekster på sidens språk (norsk forside /no, engelsk forside /).
  const en = root.lang === 'en';
  const t = en ? { close: 'Close menu', open: 'Open menu', play: 'Play animation', pause: 'Pause animation' }
    : { close: 'Lukk meny', open: 'Åpne meny', play: 'Spill animasjon', pause: 'Pause animasjon' };
  let paused = false;
  let initialized = false;
  let watchdog;
  function fallback(reason) {
    root.classList.add('cidea-static');
    root.classList.remove('cidea-enhanced');
    root.dataset.scene = reason;
    const store = window.cideaReference?.store;
    if (store) {
      store.RAFCollection?.remove(store.WebGL?.onRaf);
      store.ASS?.disable();
    }
    clearTimeout(watchdog);
    motion.hidden = true;
  }
  function menu(open) {
    root.classList.toggle('cidea-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t.close : t.open);
    if (open) nav.querySelector('a')?.focus();
  }
  // The reference navigation is replaced with native links and our own menu.
  toggle.addEventListener('click', () => menu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { menu(false); toggle.focus(); }
    if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
      const links = [...nav.querySelectorAll('a')];
      const first = links[0], last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
      else if (document.activeElement === toggle) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
    }
  });
  const mobile = matchMedia('(max-width: 767px)');
  mobile.addEventListener('change', () => menu(false));
  document.querySelector('.header__logo').addEventListener('click', () => {
    const store = window.cideaReference?.store;
    if (initialized && !root.classList.contains('cidea-static')) store.ASS.scrollTo(0);
    else window.scrollTo({top:0, behavior:'instant'});
  });
  document.querySelector('.cidea-skip').addEventListener('click', event => {
    event.preventDefault();
    window.cideaReference?.store?.ASS?.scrollTo(0);
    document.querySelector('#innhold').focus({preventScroll:true});
  });
  function syncPause() {
    const store = window.cideaReference?.store;
    if (!initialized || !store?.WebGL || root.classList.contains('cidea-static')) return;
    store.RAFCollection.remove(store.WebGL.onRaf);
    if (!paused && !document.hidden) store.RAFCollection.add(store.WebGL.onRaf, 99);
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? t.play : t.pause;
  }
  motion.addEventListener('click', () => { paused = !paused; syncPause(); });
  document.addEventListener('visibilitychange', syncPause);
  window.addEventListener('pagehide', () => {
    const store=window.cideaReference?.store;
    store?.RAFCollection?.remove(store.WebGL?.onRaf);
  });
  window.addEventListener('pageshow', syncPause);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback('context-lost'); });
  reduced.addEventListener('change', event => { if (event.matches) fallback('reduced-motion'); });
  if (reduced.matches || params.get('motion') === 'off') { fallback('reduced-motion'); return; }
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!gl) { fallback('no-webgl'); return; }
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  async function script(name) {
    await new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = `/cidea-scene/scripts/${name}.js`;
      el.onload = resolve; el.onerror = reject;
      document.body.append(el);
    });
  }
  root.classList.remove('cidea-static');
  root.classList.add('cidea-enhanced');
  watchdog = setTimeout(() => fallback('loading-timeout'), 18000);
  (async () => {
    try {
      await script('manifest'); await script('vendor'); await script('theme');
      window.dispatchEvent(new Event('cidea:ready'));
      const store = window.cideaReference?.store;
      if (!store) throw new Error('Scene initialization failed');
      await store.AssetLoader.load();
      // The CSS intro event can fire before the runtime attaches its listener.
      // All assets are now loaded: complete the intro through its own timeline.
      const loader = store.SiteLoader;
      if (loader && !loader.dom.el.classList.contains('loaded')) {
        loader.currentProgress = 100;
        loader.onCriticalAnimationEnd();
      }
      await loader?.revealed;
      initialized = true;
      root.dataset.scene = 'ready';
      clearTimeout(watchdog);
      syncPause();
    } catch (error) { console.error('Cidea scene:', error); fallback('load-error'); }
  })();
})();
