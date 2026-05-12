// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Scroll to section helper
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

// Scroll reveal via IntersectionObserver
const revealEls = document.querySelectorAll('.reveal, .reveal-delay');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-delay')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animated counters
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Form validation & submit
function handleSubmit(e) {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'fname',   errId: 'err-fname',   msg: 'נא להזין שם מלא' },
    { id: 'fphone',  errId: 'err-fphone',  msg: 'נא להזין מספר טלפון' },
    { id: 'fcar',    errId: 'err-fcar',    msg: 'נא להזין דגם הרכב' },
    { id: 'famount', errId: 'err-famount', msg: 'נא להזין סכום הלוואה' },
  ];

  fields.forEach(({ id, errId, msg }) => {
    const input = document.getElementById(id);
    const err = document.getElementById(errId);
    const empty = !input.value.trim();
    input.classList.toggle('error', empty);
    err.textContent = empty ? msg : '';
    if (empty) valid = false;
  });

  // Phone format check
  const phone = document.getElementById('fphone');
  if (phone.value.trim() && !/^0\d{1,2}[-\s]?\d{7}$/.test(phone.value.trim())) {
    phone.classList.add('error');
    document.getElementById('err-fphone').textContent = 'מספר טלפון לא תקין';
    valid = false;
  }

  if (!valid) return;

  // Simulate async submit
  const btn = document.getElementById('submitBtn');
  const text = document.getElementById('submitText');
  const spinner = document.getElementById('submitSpinner');
  btn.disabled = true;
  text.classList.add('hidden');
  spinner.classList.remove('hidden');

  setTimeout(() => {
    btn.disabled = false;
    text.classList.remove('hidden');
    spinner.classList.add('hidden');
    document.getElementById('contactForm').reset();
    showToast();
  }, 1600);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// Clear field errors on input
document.querySelectorAll('.field input, .field textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
    const errEl = document.getElementById('err-' + input.id.replace('f', 'f'));
    if (errEl) errEl.textContent = '';
  });
});
