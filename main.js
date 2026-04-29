/* ===========================================================
   Omer Ben Simon — portfolio interactions
   - hero canvas neural net
   - reveal-on-scroll
   - magnetic buttons & custom cursor
   - 3D tilt cards
   - scroll progress + nav state
   - mobile menu
   - count-up stats
   =========================================================== */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ============== year ==============
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  // ============== nav scroll state + progress ==============
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 12);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = p + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ============== mobile menu ==============
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
    };
    burger.addEventListener('click', () => toggle());
    menu.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  // ============== reveal on scroll ==============
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if (io) io.observe(el); else el.classList.add('is-visible');
  });

  // ============== count up ==============
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1200;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  // ============== custom cursor ==============
  const cursor = document.getElementById('cursor');
  if (cursor && mqHover && !reduce) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    const linkSel = 'a, button, .magnet, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(linkSel)) cursor.classList.add('is-link');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(linkSel)) cursor.classList.remove('is-link');
    });
  }

  // ============== magnetic buttons ==============
  if (mqHover && !reduce) {
    document.querySelectorAll('.magnet').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.18}px, ${my * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ============== 3D tilt cards ==============
  if (mqHover && !reduce) {
    document.querySelectorAll('.tilt').forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -8;
        const ry = (px - 0.5) * 10;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      };
      const onLeave = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ============== hero canvas: animated neural net ==============
  const canvas = document.getElementById('net');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let mouseX = -9999, mouseY = -9999;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.min(120, Math.floor((w * h) / 14000));
      nodes = new Array(density).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x >= -40 && y >= -40 && x <= r.width + 40 && y <= r.height + 40) {
        mouseX = x; mouseY = y;
      } else { mouseX = mouseY = -9999; }
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouseX = mouseY = -9999; });
    resize();

    const linkDist = 140;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // soft gradient background within canvas
      const g = ctx.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, Math.max(w, h));
      g.addColorStop(0, 'rgba(168,107,255,0.10)');
      g.addColorStop(0.5, 'rgba(0,212,255,0.04)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update + draw nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; if (n.y > h + 10) n.y = -10;

        // mouse repulsion
        const dxm = n.x - mouseX, dym = n.y - mouseY;
        const dm = Math.hypot(dxm, dym);
        if (dm < 110) {
          const f = (110 - dm) / 110;
          n.x += (dxm / dm) * f * 1.2;
          n.y += (dym / dm) * f * 1.2;
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const o = 1 - d / linkDist;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(76,198,255,${o * 0.55})`);
            grad.addColorStop(1, `rgba(168,107,255,${o * 0.55})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = o * 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes on top
      for (const n of nodes) {
        const dxm = n.x - mouseX, dym = n.y - mouseY;
        const dm = Math.hypot(dxm, dym);
        const near = Math.max(0, 1 - dm / 180);
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,235,255,${0.55 + near * 0.4})`;
        ctx.arc(n.x, n.y, n.r + near * 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (near > 0.05) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(76,198,255,${near * 0.35})`;
          ctx.arc(n.x, n.y, (n.r + 1) * (1 + near * 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };
    draw();
  }
})();
