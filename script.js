document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      menuToggle.textContent = '☰';
    }
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const setActiveNav = () => {
  const current = sections.reduce((active, section) => {
    const distance = Math.abs(section.getBoundingClientRect().top - 120);
    return distance < active.distance ? { id: section.id, distance } : active;
  }, { id: 'conceptos', distance: Infinity }).id;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  observer.observe(element);
});

const quiz = document.querySelector('[data-quiz]');
const feedback = quiz?.querySelector('.quiz-feedback');
quiz?.querySelectorAll('[data-answer]').forEach(option => {
  option.addEventListener('click', () => {
    quiz.querySelectorAll('button').forEach(button => button.classList.remove('correct', 'wrong'));
    const isCorrect = option.dataset.answer === 'correct';
    option.classList.add(isCorrect ? 'correct' : 'wrong');
    if (feedback) feedback.textContent = isCorrect
      ? '✓ Correcto: medir y registrar evidencia es una acción de control.'
      : 'Revisa la diferencia: esa acción corresponde a la gestión del sistema.';
  });
});

const checklist = [...document.querySelectorAll('#checklist-items input[type="checkbox"]')];
const progressValue = document.querySelector('#progress-value');
const progressBar = document.querySelector('#progress-bar');
const progressText = document.querySelector('#progress-text');
const storageKey = 'calidad-practica-4-checklist';

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  checklist.forEach((box, index) => { box.checked = Boolean(saved[index]); });
} catch (_) { /* El sitio funciona aunque el almacenamiento local no esté disponible. */ }

const updateProgress = () => {
  const completed = checklist.filter(box => box.checked).length;
  const percentage = Math.round((completed / checklist.length) * 100);
  if (progressValue) progressValue.textContent = `${percentage}%`;
  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `${completed} de ${checklist.length} criterios completados`;
  try { localStorage.setItem(storageKey, JSON.stringify(checklist.map(box => box.checked))); } catch (_) { /* noop */ }
};
checklist.forEach(box => box.addEventListener('change', updateProgress));
updateProgress();
