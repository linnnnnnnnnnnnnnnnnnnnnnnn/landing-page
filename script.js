'use strict';

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  lastScroll = y;
}, { passive: true });

// ── Scroll helpers ──
function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll('.reveal, .reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal, .reveal-right') || [])];
    const idx = siblings.indexOf(entry.target);
    const base = parseFloat(getComputedStyle(entry.target).transitionDelay) || 0;
    entry.target.style.transitionDelay = `${base + idx * 0.09}s`;
    entry.target.classList.add('visible');
    io.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

// ── Hero counter (₪200,000) ──
const heroCounter = document.getElementById('heroCounter');
if (heroCounter) {
  setTimeout(() => {
    animateNum(heroCounter, 200000, 1600, v => v.toLocaleString('he-IL'));
  }, 600);
}

// ── Stats counters ──
const statNums = document.querySelectorAll('[data-target]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    animateNum(el, parseInt(el.dataset.target), 1800);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterIO.observe(el));

function animateNum(el, target, duration, format = v => v) {
  const start = performance.now();
  const raf = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = format(Math.floor(eased * target));
    if (p < 1) requestAnimationFrame(raf);
    else el.textContent = format(target);
  };
  requestAnimationFrame(raf);
}

// ── Form ──
function handleSubmit(e) {
  e.preventDefault();
  let ok = true;

  const rules = [
    { id: 'fname',   err: 'err-fname',   msg: 'נא להזין שם מלא',        test: v => v.length > 1 },
    { id: 'fphone',  err: 'err-fphone',  msg: 'נא להזין מספר טלפון',    test: v => v.length > 1 },
    { id: 'fcar',    err: 'err-fcar',    msg: 'נא להזין דגם הרכב',      test: v => v.length > 1 },
    { id: 'famount', err: 'err-famount', msg: 'נא להזין סכום הלוואה',   test: v => v.length > 0 && Number(v) >= 5000 },
  ];

  rules.forEach(({ id, err, msg, test }) => {
    const input = document.getElementById(id);
    const errEl = document.getElementById(err);
    const val = input.value.trim();
    const invalid = !test(val);
    input.classList.toggle('error', invalid);
    errEl.textContent = invalid ? msg : '';
    if (invalid) ok = false;
  });

  // Phone pattern
  const phoneEl = document.getElementById('fphone');
  if (!phoneEl.classList.contains('error')) {
    const valid = /^0\d[\d\s\-]{7,9}$/.test(phoneEl.value.trim());
    if (!valid) {
      phoneEl.classList.add('error');
      document.getElementById('err-fphone').textContent = 'פורמט טלפון לא תקין';
      ok = false;
    }
  }

  if (!ok) return;

  // Loading state
  const btn = document.getElementById('submitBtn');
  const txt = document.getElementById('submitText');
  const arr = document.getElementById('submitArrow');
  const spin = document.getElementById('submitSpinner');
  btn.disabled = true;
  txt.textContent = 'שולח...';
  arr?.classList.add('hidden');
  spin.classList.remove('hidden');

  setTimeout(() => {
    btn.disabled = false;
    txt.textContent = 'שלח פנייה';
    arr?.classList.remove('hidden');
    spin.classList.add('hidden');
    document.getElementById('contactForm').reset();
    showToast();
  }, 1800);
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

// Clear errors on input
document.querySelectorAll('.fld input, .fld textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errEl = document.getElementById('err-' + el.id);
    if (errEl) errEl.textContent = '';
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
