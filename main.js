/**
 * LAMBORGHINI REVUELTO — LUXURY EDITORIAL EXPERIENCE
 * Architecture: GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
 * Principles: 100% Flat Black Canvas (#000000), Pure Monochrome, 6-Chapter Narrative
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 0. LENIS SCROLL & GSAP SCROLLTRIGGER SYNCHRONIZATION
  // ------------------------------------------------------------------------
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis with high-inertia editorial feel
  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.8,
    infinite: false,
  });

  // Synchronize Lenis scroll position with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Bind Lenis raf to GSAP ticker for 60fps/120fps display refresh
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Zero lag smoothing for instant tactile responsiveness
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          closeMenuOverlay();
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.6 });
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 1. CHƯƠNG 1: THE OVERTURE (HERO VIDEO MODAL)
  // ------------------------------------------------------------------------
  const openFilmBtn = document.getElementById('btn-discover-film');
  const filmModal = document.getElementById('film-modal');
  const filmVideo = document.getElementById('film-modal-video');
  const filmCloseBtn = document.getElementById('btn-film-close');
  const filmBackdrop = document.getElementById('film-modal-backdrop');

  let isFilmModalOpen = false;

  function openFilmModal() {
    if (isFilmModalOpen) return;
    isFilmModalOpen = true;

    lenis.stop();
    document.body.style.overflow = 'hidden';

    filmModal.classList.remove('pointer-events-none', 'opacity-0');
    filmModal.classList.add('pointer-events-auto', 'opacity-100');

    filmVideo.currentTime = 0;
    filmVideo.muted = false;
    filmVideo.volume = 1.0;

    const playPromise = filmVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback if browser requires user gesture confirmation
        filmVideo.muted = true;
        filmVideo.play();
      });
    }

    gsap.fromTo(
      '#film-video-container',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    );
  }

  function closeFilmModal() {
    if (!isFilmModalOpen) return;

    gsap.to('#film-video-container', {
      opacity: 0,
      scale: 0.96,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        filmVideo.pause();
        filmVideo.currentTime = 0;
        filmModal.classList.remove('pointer-events-auto', 'opacity-100');
        filmModal.classList.add('pointer-events-none', 'opacity-0');

        lenis.start();
        document.body.style.overflow = '';
        isFilmModalOpen = false;
      },
    });
  }

  if (openFilmBtn) {
    openFilmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openFilmModal();
    });
  }

  if (filmCloseBtn) {
    filmCloseBtn.addEventListener('click', closeFilmModal);
  }

  if (filmBackdrop) {
    filmBackdrop.addEventListener('click', closeFilmModal);
  }

  // ------------------------------------------------------------------------
  // 2. CHƯƠNG 2: THE ANATOMY (PINNED SCROLL - 400VH VIRTUAL HEIGHT)
  // ------------------------------------------------------------------------
  const anatomySection = document.getElementById('anatomy-section');
  const img1 = document.getElementById('anatomy-img-1');
  const img2 = document.getElementById('anatomy-img-2');
  const img3 = document.getElementById('anatomy-img-3');

  const cap1 = document.getElementById('anatomy-cap-1');
  const cap2 = document.getElementById('anatomy-cap-2');
  const cap3 = document.getElementById('anatomy-cap-3');
  const indicator = document.getElementById('anatomy-step-indicator');

  if (anatomySection && img1 && img2 && img3) {
    // Initial states: Layer 1 is visible, Layers 2 & 3 are hidden
    gsap.set(img1, { opacity: 1, scale: 1 });
    gsap.set(img2, { opacity: 0, scale: 1.04 });
    gsap.set(img3, { opacity: 0, scale: 1.04 });

    gsap.set(cap1, { opacity: 1, y: 0 });
    gsap.set(cap2, { opacity: 0, y: 24 });
    gsap.set(cap3, { opacity: 0, y: 24 });

    const anatomyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: anatomySection,
        start: 'top top',
        end: '+=3200', // 400vh virtual scroll height
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.35) {
            if (indicator) indicator.textContent = '01 / 03';
          } else if (progress < 0.7) {
            if (indicator) indicator.textContent = '02 / 03';
          } else {
            if (indicator) indicator.textContent = '03 / 03';
          }
        },
      },
    });

    // Step 1: Hold Stance
    anatomyTimeline
      .to({}, { duration: 0.8 })

      // Cross-fade Step 1 -> Step 2 (Aerodynamics)
      .to(img1, { opacity: 0, scale: 0.97, duration: 1, ease: 'power2.inOut' })
      .to(cap1, { opacity: 0, y: -20, duration: 0.7, ease: 'power2.inOut' }, '<')
      .to(img2, { opacity: 1, scale: 1, duration: 1, ease: 'power2.inOut' }, '<')
      .fromTo(cap2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.inOut' }, '<+=0.2')

      // Step 2: Hold Aerodynamics
      .to({}, { duration: 0.8 })

      // Cross-fade Step 2 -> Step 3 (Monofuselage)
      .to(img2, { opacity: 0, scale: 0.97, duration: 1, ease: 'power2.inOut' })
      .to(cap2, { opacity: 0, y: -20, duration: 0.7, ease: 'power2.inOut' }, '<')
      .to(img3, { opacity: 1, scale: 1, duration: 1, ease: 'power2.inOut' }, '<')
      .fromTo(cap3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.inOut' }, '<+=0.2')

      // Step 3: Hold Monofuselage
      .to({}, { duration: 0.8 });
  }

  // ------------------------------------------------------------------------
  // 3. CHƯƠNG 3: TYPOGRAPHIC IMPACT (MASSIVE TEXT SCRUB)
  // ------------------------------------------------------------------------
  const scrubWords = document.querySelectorAll('.scrub-word');
  const impactTrigger = document.getElementById('chapter-impact');

  if (scrubWords.length > 0 && impactTrigger) {
    gsap.fromTo(
      scrubWords,
      { color: '#27272A' },
      {
        color: '#FFFFFF',
        stagger: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: impactTrigger,
          start: 'top 70%',
          end: 'bottom 45%',
          scrub: 0.8,
        },
      }
    );
  }

  // ------------------------------------------------------------------------
  // 4. CHƯƠNG 4: ASYMMETRIC PHOTO ESSAY (STAGGERED PARALLAX)
  // ------------------------------------------------------------------------
  const essaySection = document.getElementById('chapter-essay');
  const colLeft = document.getElementById('essay-col-left');
  const colRight = document.getElementById('essay-col-right');

  if (essaySection) {
    if (colLeft) {
      gsap.to(colLeft, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: essaySection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    if (colRight) {
      gsap.to(colRight, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: essaySection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  // ------------------------------------------------------------------------
  // 5. CHƯƠNG 5: RAW BENCHMARK & SOUND TOGGLE
  // ------------------------------------------------------------------------
  const benchmarkVideo = document.getElementById('benchmark-video');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  const soundLabel = document.getElementById('sound-status-label');

  if (benchmarkVideo && soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = benchmarkVideo.muted;
      benchmarkVideo.muted = !isMuted;

      if (!benchmarkVideo.muted) {
        soundLabel.textContent = 'SOUND: ON';
        soundToggleBtn.classList.add('text-white');
        soundToggleBtn.classList.remove('text-[#71717A]');
      } else {
        soundLabel.textContent = 'SOUND: OFF';
        soundToggleBtn.classList.remove('text-white');
        soundToggleBtn.classList.add('text-[#71717A]');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. MINIMALIST OVERLAY MENU & INQUIRE MODAL
  // ------------------------------------------------------------------------
  const menuTrigger = document.getElementById('nav-menu-trigger');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuCloseBtn = document.getElementById('menu-close-btn');

  function openMenuOverlay() {
    menuOverlay.classList.remove('pointer-events-none', 'opacity-0');
    menuOverlay.classList.add('pointer-events-auto', 'opacity-100');
    lenis.stop();
  }

  function closeMenuOverlay() {
    menuOverlay.classList.remove('pointer-events-auto', 'opacity-100');
    menuOverlay.classList.add('pointer-events-none', 'opacity-0');
    lenis.start();
  }

  if (menuTrigger) menuTrigger.addEventListener('click', openMenuOverlay);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenuOverlay);

  // Inquire Drawer / Modal
  const inquireTriggers = document.querySelectorAll('.inquire-trigger');
  const inquireModal = document.getElementById('inquire-modal');
  const inquireCloseBtn = document.getElementById('inquire-close-btn');
  const inquireBackdrop = document.getElementById('inquire-backdrop');
  const inquireForm = document.getElementById('inquire-form');
  const inquireSuccess = document.getElementById('inquire-success');

  function openInquireModal() {
    closeMenuOverlay();
    inquireModal.classList.remove('pointer-events-none', 'opacity-0');
    inquireModal.classList.add('pointer-events-auto', 'opacity-100');
    lenis.stop();
  }

  function closeInquireModal() {
    inquireModal.classList.remove('pointer-events-auto', 'opacity-100');
    inquireModal.classList.add('pointer-events-none', 'opacity-0');
    lenis.start();
    setTimeout(() => {
      if (inquireForm) inquireForm.classList.remove('hidden');
      if (inquireSuccess) inquireSuccess.classList.add('hidden');
    }, 300);
  }

  inquireTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openInquireModal();
    });
  });

  if (inquireCloseBtn) inquireCloseBtn.addEventListener('click', closeInquireModal);
  if (inquireBackdrop) inquireBackdrop.addEventListener('click', closeInquireModal);

  if (inquireForm) {
    inquireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      inquireForm.classList.add('hidden');
      inquireSuccess.classList.remove('hidden');
    });
  }

  // Global ESC Key Listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isFilmModalOpen) closeFilmModal();
      closeMenuOverlay();
      closeInquireModal();
    }
  });
});
