const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Interactive particle network behind the hero. Points drift, connect when
 * close and are drawn towards the pointer. Pauses when off-screen or when the
 * tab is hidden, so it costs nothing while not visible.
 */
function initHeroNetwork() {
  const hero = document.querySelector('.hero');
  const canvas = hero?.querySelector('.hero__canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  const LINK_DISTANCE = 140;
  const POINTER_RADIUS = 180;
  const pointer = { x: -1e4, y: -1e4 };
  let width = 0;
  let height = 0;
  let points = [];
  let frame = null;
  let onScreen = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ({ width, height } = canvas.getBoundingClientRect());
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(110, (width * height) / 12000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  function step(p) {
    const dx = pointer.x - p.x;
    const dy = pointer.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0 && dist < POINTER_RADIUS) {
      p.vx += (dx / dist) * 0.02;
      p.vy += (dy / dist) * 0.02;
    }
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    // Keep a minimum drift so the network never freezes.
    if (Math.abs(p.vx) + Math.abs(p.vy) < 0.15) p.vx += (Math.random() - 0.5) * 0.2;
  }

  function line(a, b, alpha) {
    ctx.strokeStyle = `rgba(78, 167, 216, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      step(a);
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DISTANCE) line(a, b, (1 - d / LINK_DISTANCE) * 0.35);
      }
      const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
      if (dp < POINTER_RADIUS) line(a, pointer, (1 - dp / POINTER_RADIUS) * 0.8);
    }

    ctx.fillStyle = 'rgba(160, 210, 240, 0.9)';
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  }

  const start = () => {
    if (frame === null && onScreen && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  };

  hero.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  hero.addEventListener('pointerleave', () => {
    pointer.x = -1e4;
    pointer.y = -1e4;
  });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    onScreen ? start() : stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  resize();
  start();
}

/** Types and deletes the words from data-words="A|B|C" in a loop. */
function initTypewriter() {
  const el = document.querySelector('[data-words]');
  if (!el || prefersReducedMotion()) return;

  const words = el.dataset.words.split('|');
  let word = 0;
  let length = words[0].length;
  let deleting = true;

  const tick = () => {
    const current = words[word];
    length += deleting ? -1 : 1;
    el.textContent = current.slice(0, length);

    let delay = deleting ? 45 : 85;
    if (!deleting && length === current.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && length === 0) {
      deleting = false;
      word = (word + 1) % words.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2600);
}
