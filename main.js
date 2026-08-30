/* ============================================================
   Omer Ben Simon — portfolio v3 interactions
   GSAP + ScrollTrigger + Lenis (CDN) with graceful fallbacks:
   every effect degrades to IntersectionObserver / CSS if the
   libraries fail to load, and to static content under
   prefers-reduced-motion.
   ============================================================ */

(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const desktop = window.matchMedia('(min-width: 900px)').matches;

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ============== smooth scroll (Lenis) ============== */
  let lenis = null;
  if (!reduce && typeof window.Lenis !== 'undefined' && finePointer) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const scrollToEl = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el);
      history.replaceState(null, '', id);
    });
  });

  /* ============== year ============== */
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  /* ============== preloader ============== */
  const loader = document.getElementById('loader');
  const bootLines = [
    { html: '<span class="l-accent">$</span> init omer.bensimon --v3', d: 0 },
    { html: 'loading adversarial_ml.ko <span class="l-ok">[ok]</span>', d: 160 },
    { html: 'loading agentic_security.ko <span class="l-ok">[ok]</span>', d: 300 },
    { html: 'mounting /research /red-team <span class="l-ok">[ok]</span>', d: 440 },
    { html: '<span class="l-ok">ready.</span>', d: 600 },
  ];
  const finishLoader = () => {
    if (!loader || loader.classList.contains('done')) return;
    loader.classList.add('done');
    document.body.style.overflow = '';
    heroIntro();
  };
  if (loader) {
    const seen = (() => { try { return sessionStorage.getItem('booted'); } catch (e) { return null; } })();
    if (reduce || seen) {
      loader.classList.add('done');
      requestAnimationFrame(heroIntro);
    } else {
      try { sessionStorage.setItem('booted', '1'); } catch (e) { /* private mode */ }
      document.body.style.overflow = 'hidden';
      const term = loader.querySelector('.loader-term');
      const bar = loader.querySelector('.loader-bar i');
      bootLines.forEach((l, i) => {
        setTimeout(() => {
          const s = document.createElement('span');
          s.className = 'l-line';
          s.innerHTML = l.html;
          term.insertBefore(s, term.querySelector('.loader-bar'));
          if (bar) bar.style.width = ((i + 1) / bootLines.length) * 100 + '%';
        }, l.d);
      });
      setTimeout(finishLoader, 950);
      loader.addEventListener('click', finishLoader);
    }
  } else {
    heroIntro();
  }

  /* ============== hero: split text + intro timeline ============== */
  function splitTitle() {
    document.querySelectorAll('.hero-title .line').forEach((line) => {
      const text = line.textContent;
      line.setAttribute('aria-hidden', 'true');
      line.textContent = '';
      text.split(' ').forEach((word, wi, arr) => {
        const w = document.createElement('span');
        w.className = 'word';
        [...word].forEach((ch) => {
          const c = document.createElement('span');
          c.className = 'char';
          c.textContent = ch;
          w.appendChild(c);
        });
        line.appendChild(w);
        if (wi < arr.length - 1) line.appendChild(document.createTextNode(' '));
      });
      if (line.classList.contains('gradient')) {
        line.querySelectorAll('.char').forEach((c) => c.classList.add('gradient'));
      }
    });
  }

  let introDone = false;
  function heroIntro() {
    if (introDone) return;
    introDone = true;
    const title = document.querySelector('.hero-title');
    if (!title) return;
    if (!hasGSAP || reduce) {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    splitTitle();
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-title .char', {
      yPercent: 120,
      opacity: 0,
      rotateX: -40,
      duration: 1.1,
      stagger: { each: 0.02, from: 'start' },
    })
      .add(() => {
        document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in'));
      }, '-=0.7');
  }

  /* ============== hero canvas: neural net ============== */
  const canvas = document.getElementById('net');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(90, Math.floor((W * H) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

    let visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    }
    const LINK = 130;
    const tick = () => {
      requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) { n.x += dx / 900; n.y += dy / 900; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.35;
            ctx.strokeStyle = 'rgba(0, 229, 255,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    tick();
  }

  /* ============== nav: progress / hide / scrollspy ============== */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 12);
      nav.classList.toggle('hidden', y > 400 && y > lastY);
    }
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const spy = () => {
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const map = [...links].map((a) => ({ a, el: document.querySelector(a.getAttribute('href')) })).filter((m) => m.el);
    if (!map.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const hit = map.find((m) => m.el === e.target);
          if (hit) hit.a.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((m) => io.observe(m.el));
  };
  spy();

  /* ============== mobile menu ============== */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    const toggle = (open) => {
      const isOpen = open ?? !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', isOpen);
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (lenis) isOpen ? lenis.stop() : lenis.start();
    };
    burger.addEventListener('click', () => toggle());
    menu.querySelectorAll('[data-close]').forEach((a) => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) toggle(false);
    });
  }

  /* ============== visibility trigger ==============
     Lenis smooth-scroll desyncs a plain IntersectionObserver (the initial
     callback fires but scroll-driven changes don't), so when GSAP is present
     we drive every in-view trigger through ScrollTrigger, which is synced to
     Lenis. IntersectionObserver is the fallback when GSAP fails to load. */
  const whenVisible = (el, cb, start) => {
    if (reduce) { cb(); return; }
    if (hasGSAP) {
      ScrollTrigger.create({ trigger: el, start: start || 'top 90%', once: true, onEnter: cb });
      return;
    }
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { cb(); o.disconnect(); }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      o.observe(el);
    } else {
      cb();
    }
  };

  /* ============== reveal on scroll ============== */
  document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => {
    if (el.closest('.hero')) return; // hero handled by intro timeline
    whenVisible(el, () => el.classList.add('in'));
  });

  /* ============== text scramble on mono kickers ============== */
  if (!reduce) {
    const CHARS = '!<>-_\\/[]{}=+*^?#01';
    const scramble = (el) => {
      const original = el.dataset.text || el.textContent;
      el.dataset.text = original;
      let frame = 0;
      const total = Math.min(30, original.length * 2 + 8);
      const step = () => {
        frame++;
        const prog = frame / total;
        el.textContent = [...original]
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i / original.length < prog * 1.4) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = original;
      };
      requestAnimationFrame(step);
    };
    document.querySelectorAll('[data-scramble]').forEach((el) => whenVisible(el, () => scramble(el), 'top 80%'));
  }

  /* ============== count-up stats ============== */
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const countUp = (el) => {
    const target = parseFloat(el.dataset.target || '0');
    const dec = (el.dataset.target || '').includes('.') ? 1 : 0;
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = (target * ease(p)).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    };
    requestAnimationFrame(step);
  };
  document.querySelectorAll('.count[data-target]').forEach((el) => {
    if (reduce) { el.textContent = el.dataset.target; return; }
    whenVisible(el, () => countUp(el), 'top 85%');
  });

  /* ============== marquees (rAF, scroll-velocity reactive) ============== */
  document.querySelectorAll('.marquee, .footer-marquee').forEach((mq) => {
    const track = mq.querySelector('.marquee-track');
    if (!track) return;
    // measure one segment, then repeat it enough to cover the viewport plus a
    // spare copy so the wrap is seamless (deterministic — a while-loop broke on
    // the footer's very large type where one copy already exceeds the viewport)
    const base = track.innerHTML;
    track.innerHTML = base;
    const seg = track.scrollWidth;
    if (seg < 10) return; // not laid out / empty — leave as-is
    const copies = Math.max(3, Math.ceil((window.innerWidth + seg) / seg) + 1);
    track.innerHTML = base.repeat(copies);
    if (reduce) return;
    let x = 0, vel = 0, lastScroll = window.scrollY;
    const dir = mq.dataset.dir === 'rtl' ? 1 : -1;
    const speed = parseFloat(mq.dataset.speed || '0.6');
    const loop = () => {
      const sy = window.scrollY;
      vel += (sy - lastScroll) * 0.06;
      lastScroll = sy;
      vel *= 0.92;
      x += dir * (speed + Math.min(Math.abs(vel), 6));
      // wrap on a single-segment boundary → seamless regardless of copy count
      if (x <= -seg) x += seg;
      if (x > 0) x -= seg;
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });

  /* ============== GSAP scroll choreography ============== */
  const researchStage = document.querySelector('.research-stage');
  if (hasGSAP && !reduce) {
    // section rules draw in
    document.querySelectorAll('.section-rule').forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'power3.out',
        duration: 1.2,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // ghost numerals drift
    document.querySelectorAll('.ghost-num').forEach((el) => {
      gsap.fromTo(el, { yPercent: 30 }, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('.section'), start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // hero parallax out
    gsap.to('.hero-inner', {
      yPercent: -12,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // research: pinned horizontal gallery — responsive via matchMedia so it
    // sets up above 900px and tears back down to a vertical stack below it.
    if (researchStage && typeof gsap.matchMedia === 'function') {
      const track = researchStage.querySelector('.research-track');
      const amount = () => Math.max(0, track.scrollWidth - researchStage.clientWidth);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        researchStage.classList.remove('no-pin');
        const tween = gsap.to(track, {
          x: () => -amount(),
          ease: 'none',
          scrollTrigger: {
            trigger: researchStage,
            start: 'top 12%',
            end: () => '+=' + (amount() + 200),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          gsap.set(track, { clearProps: 'transform' });
          researchStage.classList.add('no-pin');
        };
      });
      mm.add('(max-width: 899px)', () => {
        researchStage.classList.add('no-pin');
      });
    } else if (researchStage) {
      researchStage.classList.add('no-pin');
    }

    // timeline draw + dot activation
    const timeline = document.querySelector('.timeline');
    if (timeline) {
      const draw = timeline.querySelector('.timeline-draw');
      if (draw) {
        gsap.to(draw, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
        });
      }
      document.querySelectorAll('.tl-item').forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          end: 'bottom 40%',
          onEnter: () => item.classList.add('is-active'),
          onLeaveBack: () => item.classList.remove('is-active'),
        });
      });
    }

    // project art parallax float
    document.querySelectorAll('.project-art').forEach((art) => {
      gsap.fromTo(art, { y: 50 }, {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // contact CTA rise
    gsap.from('.contact-cta', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-cta', start: 'top 85%' },
    });
  } else {
    if (researchStage) researchStage.classList.add('no-pin');
    if ('IntersectionObserver' in window && !reduce) {
      const tio = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting));
      }, { rootMargin: '-30% 0px -30% 0px' });
      document.querySelectorAll('.tl-item').forEach((item) => tio.observe(item));
    } else {
      document.querySelectorAll('.tl-item').forEach((item) => item.classList.add('is-active'));
    }
    const draw = document.querySelector('.timeline-draw');
    if (draw) draw.style.transform = 'scaleY(1)';
  }

  /* ============== custom cursor ============== */
  const cursor = document.getElementById('cursor');
  if (cursor && finePointer && !reduce) {
    let cx = -100, cy = -100, tx = -100, ty = -100, shown = false;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cursor.style.opacity = '1'; cx = tx; cy = ty; }
    });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    };
    loop();
    const hoverables = 'a, button, .r-card, .stat, .stack-cat, .tl-content';
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }

  /* ============== magnetic buttons ============== */
  if (finePointer && !reduce) {
    document.querySelectorAll('.magnet').forEach((el) => {
      const strength = 22;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ============== 3D tilt on project art ============== */
  if (finePointer && !reduce) {
    document.querySelectorAll('.project-art').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        el.style.setProperty('transform', 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)');
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('transform'); });
    });
  }

  /* ============== research card spotlight ============== */
  if (finePointer) {
    document.querySelectorAll('.r-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }
})();
