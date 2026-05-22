/* ============================================================================
   CLINICA DENTAL OLMOS — Main JS
   Animations, interactions, particles
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ── Preloader ───────────────────────────────────────────────────────────
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => preloader.classList.add("hidden"), 1600);
    });
    // Fallback
    setTimeout(() => preloader.classList.add("hidden"), 3000);
  }

  // ── Nav scroll ──────────────────────────────────────────────────────────
  const nav = document.getElementById("nav");
  if (nav) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > 60) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
      lastScroll = y;
    }, { passive: true });
  }

  // ── Mobile menu ─────────────────────────────────────────────────────────
  const burger = document.getElementById("nav-burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        burger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // ── Scroll reveal ───────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => revealObs.observe(el));
  }

  // ── Counter animation ──────────────────────────────────────────────────
  const counterEls = document.querySelectorAll("[data-count]");
  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const isYear = el.dataset.year === "true";
    const dur = 2000;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = Math.floor(target * eased);
      const display = isYear ? v.toString() : v.toLocaleString("es-ES");
      el.textContent = prefix + display + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Before/After sliders ────────────────────────────────────────────────
  document.querySelectorAll(".ba-slider").forEach(slider => {
    const bar = slider.querySelector(".ba-bar");
    if (!bar) return;
    let dragging = false;

    function updatePos(clientX) {
      const r = slider.getBoundingClientRect();
      const p = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
      bar.style.left = p + "%";
    }

    slider.addEventListener("mousedown", e => { dragging = true; updatePos(e.clientX); });
    slider.addEventListener("touchstart", e => { dragging = true; if (e.touches[0]) updatePos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("mousemove", e => { if (dragging) updatePos(e.clientX); });
    window.addEventListener("touchmove", e => { if (dragging && e.touches[0]) updatePos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("mouseup", () => { dragging = false; });
    window.addEventListener("touchend", () => { dragging = false; });
  });

  // ── Cursor glow (desktop) ──────────────────────────────────────────────
  const cursorGlow = document.getElementById("cursor-glow");
  if (cursorGlow && window.matchMedia("(min-width: 961px)").matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener("mousemove", e => {
      mx = e.clientX;
      my = e.clientY;
      cursorGlow.classList.add("visible");
    });

    document.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("visible");
    });

    function updateCursor() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      cursorGlow.style.left = cx + "px";
      cursorGlow.style.top = cy + "px";
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // ── Hero particles canvas ─────────────────────────────────────────────
  const canvas = document.getElementById("hero-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.opTarget = this.opacity;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += (this.opTarget - this.opacity) * 0.02;
        if (Math.random() < 0.005) this.opTarget = Math.random() * 0.4 + 0.1;
        if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 101, 170, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 101, 170, ${0.06 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => { resize(); });
    resize();
    initParticles();
    animate();
  }

  // ── Smooth anchor scroll ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ── Parallax on hero photo ─────────────────────────────────────────────
  const heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && window.matchMedia("(min-width: 961px)").matches) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${y * -0.04}px)`;
      }
    }, { passive: true });
  }

});
