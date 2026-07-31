/* ==========================================================================
   NAVEEN K — PORTFOLIO SCRIPT
   Shared across all pages: navbar behaviour, mobile menu, scroll reveal,
   card tilt, animated skill bars / cgpa ring, back-to-top, contact form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar background on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated skill bars (fills width when scrolled into view) ---------- */
  const bars = document.querySelectorAll('.bar-fill');
  if ('IntersectionObserver' in window && bars.length) {
    const barIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-level') || '0';
          entry.target.style.width = target + '%';
          barIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(bar => barIo.observe(bar));
  }

  /* ---------- Animated CGPA ring (About page) ---------- */
  const ring = document.querySelector('.cgpa-ring circle.value');
  if (ring) {
    const radius = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;
    const pct = parseFloat(ring.getAttribute('data-pct') || '0') / 10; // scale to /10
    const setOffset = () => {
      const offset = circumference - pct * circumference;
      ring.style.strokeDashoffset = `${offset}`;
    };
    if ('IntersectionObserver' in window) {
      const ringIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { setOffset(); ringIo.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      ringIo.observe(ring);
    } else {
      setOffset();
    }
  }

  /* ---------- Subtle 3D card tilt on pointer move (desktop only) ---------- */
  const tiltCards = document.querySelectorAll('.tilt');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -6;
        const rotateY = ((x / rect.width) - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------- Hero typing role text (Home page only) ---------- */
  const roleEl = document.querySelector('.hero-role .role-text');
  if (roleEl) {
    const roles = [
      'Mechatronics Engineering Student',
      'Robotics & Automation Enthusiast',
      'Embedded Systems Learner',
      'Control Engineering Explorer'
    ];
    let roleIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 35 : 55);
    };
    type();
  }

  /* ---------- Contact form (frontend-only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value.trim();
      if (!name) {
        formStatus.textContent = '> Please enter your name before sending.';
        formStatus.style.color = '#ff6b6b';
        return;
      }
      formStatus.style.color = '';
      formStatus.textContent = '> Message ready — connect a form service (e.g. Formspree) to send it.';
      contactForm.reset();
    });
  }

  /* ---------- Floating ambient nodes generator (hero background) ---------- */
  const nodeField = document.querySelector('.floating-nodes');
  if (nodeField) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const node = document.createElement('span');
      node.className = 'node' + (i % 2 === 0 ? '' : ' copper');
      const size = 3 + Math.random() * 5;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.left = `${Math.random() * 100}%`;
      node.style.top = `${Math.random() * 100}%`;
      node.style.animationDuration = `${6 + Math.random() * 6}s`;
      node.style.animationDelay = `${Math.random() * 4}s`;
      nodeField.appendChild(node);
    }
  }

});
