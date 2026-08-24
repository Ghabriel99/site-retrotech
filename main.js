/**
 * Retrotech — interações da landing page
 * Sem dependências externas.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =============== ANO NO RODAPÉ =============== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =============== MENU MOBILE =============== */
  (function mobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('mainNav');
    const backdrop = document.querySelector('.nav-backdrop');
    if (!hamburger || !nav || !backdrop) return;

    function openNav() {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
      nav.classList.add('is-open');
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      nav.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      setTimeout(() => { backdrop.hidden = true; }, 250);
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) closeNav();
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });

    // Fecha o drawer se a tela voltar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && nav.classList.contains('is-open')) closeNav();
    });
  })();

  /* =============== HEADER COM SOMBRA AO ROLAR =============== */
  (function stickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* =============== ANIMAÇÃO DE ENTRADA =============== */
  (function revealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => {
      // O que já está na primeira dobra aparece de imediato (sem depender do observer)
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
    });
  })();

  /* =============== LINK ATIVO NA NAVEGAÇÃO =============== */
  (function activeNavLink() {
    const links = Array.from(document.querySelectorAll('.main-nav ul a[href^="#"]'));
    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.35, rootMargin: '-80px 0px -55% 0px' });

    sections.forEach(section => observer.observe(section));
  })();

});
