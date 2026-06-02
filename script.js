/* ============================================
   WEDDING INVITATION - INTERACTIVE SCRIPTS
   Features:
   - Live countdown
   - Ring scroll animation
   - Scroll-triggered reveals
   - Gallery lightbox
   - Ambient particles
   - Sparkles in final section
   ============================================ */

(() => {
  'use strict';

  // =========================================
  // 1. LIVE COUNTDOWN TIMER
  // =========================================
  const WEDDING_DATE = new Date('2026-07-13T10:30:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================
  // 2. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // =========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // =========================================
  // 3. RING SCROLL ANIMATION (KEY FEATURE)
  // =========================================
  const ringsContainer = document.querySelector('.rings-container');
  const ringAkhil = document.querySelector('.ring-akhil');
  const ringChinju = document.querySelector('.ring-chinju');

  // Show rings after scrolling past hero
  const heroSection = document.getElementById('hero');
  const finalSection = document.getElementById('final');

  function handleRingScroll() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // Hero end position
    const heroEnd = heroSection.offsetTop + heroSection.offsetHeight;
    // Final section start (hide rings when reaching final)
    const finalStart = finalSection.offsetTop - windowH;

    // Determine if rings should be visible
    const shouldShow = scrollY > heroEnd * 0.4 && scrollY < finalStart;

    if (shouldShow) {
      ringsContainer.classList.add('active');
    } else {
      ringsContainer.classList.remove('active');
      return;
    }

    // Calculate progress (0 = start, 1 = meet)
    const scrollRange = finalStart - heroEnd * 0.4;
    const progress = Math.min(Math.max((scrollY - heroEnd * 0.4) / scrollRange, 0), 1);

    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);

    // Responsive width for ring travel
    const isMobile = window.innerWidth < 600;
    const maxOffset = isMobile ? 80 : 180;
    const minOffset = isMobile ? 15 : 30;

    // Calculate offset from center (50%)
    const offset = maxOffset - (maxOffset - minOffset) * eased;

    ringAkhil.style.left = `calc(50% - ${offset}px)`;
    ringChinju.style.left = `calc(50% + ${offset}px)`;

    // Add slight rotation as they approach
    const rotation = eased * 15;
    ringAkhil.style.transform = `translateY(-50%) rotate(${-rotation}deg)`;
    ringChinju.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleRingScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', handleRingScroll);
  handleRingScroll(); // Initial

  // =========================================
  // 4. FINAL SECTION - RING UNITE & SPARKLES
  // =========================================
  const finalObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        finalSection.classList.add('united');
        createSparkles();
      } else {
        finalSection.classList.remove('united');
      }
    });
  }, { threshold: 0.4 });

  finalObserver.observe(finalSection);

  // Create sparkle elements
  const sparklesContainer = document.getElementById('sparkles');
  let sparklesCreated = false;

  function createSparkles() {
    if (sparklesCreated) return;
    sparklesCreated = true;

    const count = window.innerWidth < 600 ? 20 : 40;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 2 + 's';
      sparkle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      const size = 3 + Math.random() * 6;
      sparkle.style.width = size + 'px';
      sparkle.style.height = size + 'px';
      sparklesContainer.appendChild(sparkle);
    }
  }

  // =========================================
  // 5. GALLERY LIGHTBOX
  // =========================================
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');

  const galleryItems = document.querySelectorAll('.gallery-item');
  const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
  let currentIndex = 0;

  lightboxTotal.textContent = images.length;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightboxCurrent.textContent = currentIndex + 1;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
    lightboxCurrent.textContent = currentIndex + 1;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
    lightboxCurrent.textContent = currentIndex + 1;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });

  // =========================================
  // 6. AMBIENT PARTICLES (floating gold dust)
  // =========================================
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.4 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.pulse += 0.02;

      if (this.y < -10) this.reset();
      if (this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw() {
      const alpha = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${alpha})`);
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 600 ? 25 : 50;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
  }

  // Reduce motion if user prefers
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      initParticles();
      animateParticles();
    });
  } else {
    canvas.style.display = 'none';
  }

  // =========================================
  // 7. VISIBILITY API - pause animations when hidden
  // =========================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (!prefersReducedMotion) {
      animateParticles();
    }
  });

})();