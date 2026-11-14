/* Kidus portfolio: L3 immersive motion, driven by DESIGN.md */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;

  const perf = {
    isMobile: matchMedia('(max-width: 640px)').matches,
    lowCore: (navigator.hardwareConcurrency || 8) < 4,
    reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    canHover: matchMedia('(hover: hover)').matches,
  };
  const rich = !perf.reduce && !perf.lowCore;
  if (perf.reduce) root.classList.add('is-reduced');

  /* ---------- Basics (no GSAP needed) ---------- */
  $('#year').textContent = new Date().getFullYear();

  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('#nav-toggle');
  const links = $('#nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // Active nav link
  const navMap = new Map($$('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navMap.forEach((a) => a.classList.remove('active'));
        const a = navMap.get(en.target.id);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['about', 'build', 'projects', 'contact'].forEach((id) => { const el = document.getElementById(id); if (el) navIO.observe(el); });

  // Spotlight cards (rAF throttled, hover devices only)
  if (perf.canHover) {
    $$('.card').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
          raf = 0;
        });
      });
    });
  }

  // Click-to-copy email + spark burst
  const copyBtn = $('#copy-email');
  const copyLabel = $('#copy-label');
  const spark = (x, y) => {
    if (!window.gsap || perf.reduce) return;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.left = x + 'px'; s.style.top = y + 'px';
      document.body.appendChild(s);
      const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
      const d = 40 + Math.random() * 50;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.2, duration: 0.7, ease: 'power2.out', onComplete: () => s.remove() });
    }
  };
  copyBtn.addEventListener('click', async (e) => {
    const email = copyBtn.dataset.email;
    try { await navigator.clipboard.writeText(email); } catch (err) { /* clipboard unavailable */ }
    copyLabel.textContent = 'Copied';
    spark(e.clientX, e.clientY);
    setTimeout(() => { copyLabel.textContent = email; }, 1800);
  });

  // Bottom-of-page surprise
  const toast = $('#toast');
  let toastShown = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !toastShown) {
      toastShown = true;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }, { threshold: 1 }).observe($('#end'));

  /* ---------- Everything below needs GSAP ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (perf.reduce) return; // content stays visible, no animation

  // Magnetic buttons (hover devices)
  if (perf.canHover) {
    $$('[data-magnet]').forEach((el) => {
      let raf = 0;
      el.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) / r.width;
          const y = (e.clientY - (r.top + r.height / 2)) / r.height;
          gsap.to(el, { x: x * 12, y: y * 12, duration: 0.3, ease: 'power2.out' });
          raf = 0;
        });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
    });
  }

  // Scramble text
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_';
  const scramble = (el) => {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    let frame = 0; const total = 26;
    const id = setInterval(() => {
      frame++;
      const p = frame / total;
      el.textContent = Array.from(final).map((c, i) => (c === ' ' || i < final.length * p) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (frame >= total) { clearInterval(id); el.textContent = final; }
    }, 30);
  };
  $$('.scramble').forEach((el) => {
    if (el.id === 'hero-eyebrow') return;
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scramble(el) });
  });

  // Split H2 into chars (scroll float)
  $$('.split-h2').forEach((h) => {
    const text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.textContent = '';
    text.split(' ').forEach((w, wi, arr) => {
      const word = document.createElement('span'); word.className = 'word'; word.setAttribute('aria-hidden', 'true');
      Array.from(w).forEach((ch) => { const c = document.createElement('span'); c.className = 'char'; c.textContent = ch; word.appendChild(c); });
      h.appendChild(word);
      if (wi < arr.length - 1) h.appendChild(document.createTextNode(' '));
    });
    gsap.from($$('.char', h), { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.025, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  // Counters
  $$('.count').forEach((el) => {
    const to = Number(el.dataset.to); const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
  });

  // Bento reveal (clear transform afterwards so CSS hover works)
  gsap.from('.bento .card', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.bento', start: 'top 85%', once: true } });

  /* ---------- Hero: entrance, float, parallax, converge ---------- */
  const hero = $('#home');
  const stars = $$('.star');
  const cards = $$('.star-card');
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from(nav, { y: -20, opacity: 0, duration: 0.8 }, 0)
    .add(() => scramble($('#hero-eyebrow')), 0.1)
    .fromTo('.hero .line', { clipPath: 'inset(0 0 100% 0)', y: 40 }, { clipPath: 'inset(0 0 -20% 0)', y: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, 0.15)
    .from('.hero-lead, .hero .cta > *', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.7)
    .from(cards, { scale: 0, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', stagger: { amount: 1.2, from: 'center' } }, 0.2)
    .add(initConverge);

  if (!perf.isMobile) {
    // idle floating, paused when hero is off-screen
    const floats = $$('.star-float').map((el) => gsap.to(el, { y: gsap.utils.random(-14, 14), rotation: gsap.utils.random(-3, 3), duration: gsap.utils.random(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    // mouse parallax: rAF lerp, only while hero is visible
    let heroVisible = true; let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      stars.forEach((s) => {
        const d = Number(s.dataset.depth) || 0.5;
        s.style.setProperty('--dx', (cx * 26 * d).toFixed(2) + 'px');
        s.style.setProperty('--dy', (cy * 26 * d).toFixed(2) + 'px');
      });
      raf = heroVisible && perf.canHover ? requestAnimationFrame(loop) : 0;
    };
    if (perf.canHover) {
      hero.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }
    ScrollTrigger.create({
      trigger: hero, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => {
        heroVisible = self.isActive;
        floats.forEach((t) => (self.isActive ? t.resume() : t.pause()));
        if (heroVisible && !raf && perf.canHover) raf = requestAnimationFrame(loop);
      },
    });
    if (perf.canHover) raf = requestAnimationFrame(loop);
  }

  // Converge: hero cards fly together while the About panel arrives
  function initConverge() {
    if (perf.isMobile) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'bottom 85%', end: 'bottom 5%', scrub: 1, invalidateOnRefresh: true } });
    tl.to(cards, {
      x: (i, el) => { const r = el.getBoundingClientRect(); const h = hero.getBoundingClientRect(); return (h.left + h.width / 2) - (r.left + r.width / 2); },
      y: (i, el) => { const r = el.getBoundingClientRect(); const h = hero.getBoundingClientRect(); return (h.top + h.height * 0.92) - (r.top + r.height / 2); },
      scale: 0.15, opacity: 0, ease: 'power2.in',
      stagger: { amount: 0.6, from: 'random' },
    }).from('.about-panel', { scale: 0.82, opacity: 0, ease: 'power3.out' }, '-=0.3');
  }

  /* ---------- Pin-scrub: left pin / right swap ---------- */
  if (!perf.isMobile) {
    const wrap = $('.pin-swap');
    const scenes = $$('.scene');
    const title = $('#pin-title'), body = $('#pin-body'), num = $('#pin-num'), bar = $('#pin-bar');
    let current = 0;
    const swapTo = (idx) => {
      if (idx === current) return;
      current = idx;
      wrap.classList.add('swapping');
      setTimeout(() => {
        title.innerHTML = scenes[idx].dataset.title;
        body.innerHTML = scenes[idx].dataset.body;
        num.textContent = String(idx + 1).padStart(2, '0');
        wrap.classList.remove('swapping');
      }, 200);
      scenes.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      bar.style.transform = 'scaleX(' + ((idx + 1) / scenes.length) + ')';
    };
    ScrollTrigger.create({
      trigger: wrap, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => swapTo(Math.min(Math.floor(self.progress * scenes.length), scenes.length - 1)),
    });
  }

  /* ---------- WebGL signature moment (single scene) ---------- */
  const stage = $('.webgl-scene');
  const initGL = async () => {
    if (!rich || perf.isMobile) { stage.classList.add('no-gl'); return; }
    let THREE;
    try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); }
    catch (err) { stage.classList.add('no-gl'); return; }
    try {
      const canvas = $('#gl');
      const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 6;

      const mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.2, 0.38, 200, 32),
        new THREE.MeshPhysicalMaterial({ color: css('--text'), metalness: 0.55, roughness: 0.18, iridescence: 1, iridescenceIOR: 1.4, clearcoat: 1, clearcoatRoughness: 0.1 })
      );
      scene.add(mesh);
      scene.add(new THREE.HemisphereLight(css('--text'), css('--bg'), 0.9));
      const l1 = new THREE.PointLight(css('--accent'), 90, 24); l1.position.set(4, 3, 4); scene.add(l1);
      const l2 = new THREE.PointLight(css('--accent-2'), 90, 24); l2.position.set(-4, -3, 4); scene.add(l2);

      // particle dust
      const N = 120; const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 3 + Math.random() * 2.5; const t = Math.random() * Math.PI * 2; const p = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(p) * Math.cos(t); pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t); pos[i * 3 + 2] = r * Math.cos(p);
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const points = new THREE.Points(geo, new THREE.PointsMaterial({ color: css('--accent'), size: 0.04, transparent: true, opacity: 0.8 }));
      scene.add(points);

      const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      resize();
      new ResizeObserver(resize).observe(stage);

      gsap.to(mesh.rotation, { x: Math.PI * 1.2, y: Math.PI * 2, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1 } });

      // render only while visible
      let visible = false, raf = 0;
      const tick = () => {
        if (!visible) { raf = 0; return; }
        mesh.rotation.z += 0.003; points.rotation.y += 0.0008;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      }).observe(stage);
    } catch (err) {
      stage.classList.add('no-gl');
    }
  };
  initGL();

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
