const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

// Smoothed pointer position used by both the canvas drawing and CSS glow layer.
const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.36,
  targetX: window.innerWidth * 0.5,
  targetY: window.innerHeight * 0.36,
  active: false,
};

function getThemeColours() {
  const styles = getComputedStyle(document.body);

  return {
    accent: styles.getPropertyValue("--accent").trim() || "#2563eb",
    muted: styles.getPropertyValue("--text-muted").trim() || "#a3a3a3",
  };
}

function hexToRgb(hex) {
  const value = hex.replace("#", "").trim();

  if (value.length !== 3 && value.length !== 6) {
    return { r: 37, g: 99, b: 235 };
  }

  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  const number = Number.parseInt(normalized, 16);

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildParticles(width, height) {
  const area = width * height;
  const count = Math.min(90, Math.max(42, Math.floor(area / 22000)));

  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.26,
    vy: (Math.random() - 0.5) * 0.26,
    radius: index % 9 === 0 ? 2.2 : 1.2 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
    stream: index % 8 === 0,
  }));
}

export function initTechBackground(canvas) {
  if (!canvas || prefersReducedMotion.matches) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let deviceScale = 1;
  let particles = [];
  let animationFrame = null;

  const resize = () => {
    deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * deviceScale);
    canvas.height = Math.floor(height * deviceScale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    particles = buildParticles(width, height);
  };

  const updatePointerCss = () => {
    if (!width || !height) return;

    document.body.style.setProperty(
      "--mouse-x",
      `${(pointer.x / width) * 100}%`,
    );
    document.body.style.setProperty(
      "--mouse-y",
      `${(pointer.y / height) * 100}%`,
    );
  };

  const onPointerMove = (event) => {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => {
    pointer.active = false;
    pointer.targetX = width * 0.5;
    pointer.targetY = height * 0.36;
  };

  const drawConnections = (accent) => {
    const isLight = document.body.classList.contains("light-theme");
    const linkLimit = width < 720 ? 118 : 154;

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const first = particles[i];
        const second = particles[j];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);

        if (distance >= linkLimit) continue;

        const midpointDistance = Math.hypot(
          (first.x + second.x) * 0.5 - pointer.x,
          (first.y + second.y) * 0.5 - pointer.y,
        );
        const pointerBoost =
          Math.max(0, 1 - midpointDistance / 220) *
          (pointer.active ? (isLight ? 0.24 : 0.18) : (isLight ? 0.12 : 0.08));
        const alpha =
          (1 - distance / linkLimit) * (isLight ? 0.36 : 0.2) + pointerBoost;

        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.strokeStyle = rgba(accent, alpha);
        context.lineWidth = pointerBoost > 0.1 ? 1.4 : 1;
        context.stroke();
      }
    }
  };

  const drawParticles = (accent, muted, time) => {
    const isLight = document.body.classList.contains("light-theme");

    particles.forEach((particle) => {
      const distanceToPointer = Math.hypot(
        particle.x - pointer.x,
        particle.y - pointer.y,
      );
      const boost = Math.max(0, 1 - distanceToPointer / 180);
      const pulse = Math.sin(particle.phase + time * 0.001) * 0.45;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.radius + pulse + boost * 1.7,
        0,
        Math.PI * 2,
      );
      context.fillStyle = rgba(accent, (isLight ? 0.58 : 0.48) + boost * 0.3);
      context.fill();

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        Math.max(0.7, particle.radius * 0.55),
        0,
        Math.PI * 2,
      );
      context.fillStyle = rgba(muted, isLight ? 0.38 : 0.24);
      context.fill();
    });
  };

  const updateParticles = () => {
    particles.forEach((particle) => {
      particle.phase += 0.012;

      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      const influenceRadius = pointer.active ? 190 : 120;

      // Pointer interaction: nearby particles are gently pushed away.
      if (distance < influenceRadius) {
        const force =
          (1 - distance / influenceRadius) * (pointer.active ? 1.9 : 0.55);
        particle.vx += (dx / distance) * force * 0.022;
        particle.vy += (dy / distance) * force * 0.022;
      }

      particle.vx += Math.cos(particle.phase) * 0.002;
      particle.vy += Math.sin(particle.phase) * 0.002;
      particle.vx *= 0.985;
      particle.vy *= 0.985;

      particle.x += particle.vx + (particle.stream ? 0.16 : 0);
      particle.y += particle.vy;

      if (particle.x < -50) particle.x = width + 50;
      if (particle.x > width + 50) particle.x = -50;
      if (particle.y < -50) particle.y = height + 50;
      if (particle.y > height + 50) particle.y = -50;
    });
  };

  const draw = (time = 0) => {
    const { accent, muted } = getThemeColours();

    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;
    updatePointerCss();

    context.clearRect(0, 0, width, height);
    updateParticles();
    drawConnections(accent);
    drawParticles(accent, muted, time);

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);

  // Stop immediately if the user enables reduced motion while the page is open.
  prefersReducedMotion.addEventListener("change", (event) => {
    if (!event.matches || !animationFrame) return;

    window.cancelAnimationFrame(animationFrame);
    context.clearRect(0, 0, width, height);
  });
}
