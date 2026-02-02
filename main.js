/**
 * main.js - autoplay + swipe (sem setas)
 *
 * Substitua todo o seu main.js por este.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =============== YEAR =============== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =============== HAMBURGER =============== */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.style.display = expanded ? 'none' : 'block';
    });
  }

  /* =============== SLIDER =============== */
  /* =============== SLIDER CORRIGIDO (DOTS, AUTOPLAY, SWIPE) =============== */
  (function initServiceSlider() {
    const slider = document.getElementById('serviceSlider');
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.slider-dots .dot'));
    const progressBar = slider.querySelector('.slider-progress__bar');

    if (!track || slides.length === 0 || dots.length === 0) {
      console.warn('Slider: elementos essenciais ausentes.');
      return;
    }

    let index = 0;
    const total = slides.length;
    const intervalMs = 6000;
    let autoplayTimer = null;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    /* ==================== FUNÇÕES PRINCIPAIS ==================== */

    function updateSlideWidths() {
      slides.forEach(s => s.style.minWidth = `${slider.clientWidth}px`);
    }

    function goTo(i, instant = false) {
      index = (i + total) % total;
      const offset = -index * 100;

      track.style.transition = instant ? "none" : "transform .6s cubic-bezier(.22,.9,.35,1)";
      track.style.transform = `translateX(${offset}%)`;

      dots.forEach((d, idx) => d.classList.toggle("active", idx === index));

      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        setTimeout(() => {
          progressBar.style.transition = `width ${intervalMs}ms linear`;
          progressBar.style.width = "100%";
        }, 30);
      }
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    /* ==================== AUTOPLAY ==================== */

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isPaused && !isDragging) next();
      }, intervalMs);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
      if (progressBar) progressBar.style.width = "0%";
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    /* ==================== DOTS ==================== */

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goTo(i);
        resetAutoplay();
      });
    });

    /* ==================== SWIPE ==================== */

    slider.addEventListener("pointerdown", e => {
      startX = e.clientX;
      isDragging = true;
      track.style.transition = "none";
      stopAutoplay();
    });

    slider.addEventListener("pointermove", e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const slideWidth = slider.clientWidth;
      const baseOffset = -index * slideWidth;
      track.style.transform = `translateX(${baseOffset + dx}px)`;
    });

    function endSwipe(e) {
      if (!isDragging) return;
      isDragging = false;

      const dx = e.clientX - startX;
      const threshold = slider.clientWidth * 0.18;

      if (dx > threshold) prev();
      else if (dx < -threshold) next();
      else goTo(index); // snap back

      startAutoplay();
    }

    slider.addEventListener("pointerup", endSwipe);
    slider.addEventListener("pointerleave", endSwipe);

    /* ==================== INIT ==================== */

    updateSlideWidths();
    goTo(0, true);
    startAutoplay();

    window.addEventListener("resize", () => {
      updateSlideWidths();
      goTo(index, true);
    });
  })();

  // mobile nav toggle (adiciona/remover .mobile-open na nav)
  (function mobileNavToggle() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');
    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('mobile-open', !expanded);
      // prevent background scroll when menu open
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    // close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  })();


});
