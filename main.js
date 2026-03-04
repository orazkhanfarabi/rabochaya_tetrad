/* ============================================================
   main.js — Рабочая тетрадь «Мобильная разработка»
   ============================================================ */

// ============================================================
// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
// ============================================================

function showInstr(id, btn) {
  document.querySelectorAll('.instr-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.instr-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('instr-' + id).classList.add('active');
  btn.classList.add('active');
}

const THEME_KEY = 'workbook_theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light') applyTheme('light', false);
}

function applyTheme(theme, save = true) {
  const body   = document.body;
  const btn    = document.getElementById('themeToggle');

  if (theme === 'light') {
    body.classList.add('light');
    if (btn) btn.textContent = '🌙';
    if (btn) btn.title = 'Переключить на тёмную тему';
  } else {
    body.classList.remove('light');
    if (btn) btn.textContent = '☀️';
    if (btn) btn.title = 'Переключить на светлую тему';
  }

  if (save) localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
}

// ============================================================
// КВИЗ — form#quizForm, #result
// Все вопросы используют name="q1", по 4 варианта на вопрос
// Правильные ответы по порядку:
// 1→b  2→a  3→c  4→b  5→c  6→a  7→b  8→b  9→a  10→d
// ============================================================

const quizCorrect = ["b","a","c","b","c","a","b","b","a","d"];

function checkQuiz() {
  const form   = document.getElementById('quizForm');
  const result = document.getElementById('result');
  const radios = [...form.querySelectorAll('input[type="radio"]')];
  const perQ   = 4;
  const total  = quizCorrect.length;

  let score = 0, answered = 0;

  for (let q = 0; q < total; q++) {
    const group   = radios.slice(q * perQ, q * perQ + perQ);
    const checked = group.find(r => r.checked);
    if (checked) {
      answered++;
      if (checked.value === quizCorrect[q]) score++;
    }
  }

  if (answered < total) {
    result.textContent = `⚠️ Ответьте на все вопросы! (${answered} из ${total})`;
    result.className   = 'info-msg';
    return;
  }

  const pct  = Math.round(score / total * 100);
  const grade = score === total ? '— Отлично! 🎉'
              : pct >= 70       ? '— Хорошо 👍'
              : pct >= 50       ? '— Удовлетворительно'
              :                   '— Требуется повторение';

  result.textContent = `Правильных ответов: ${score} из ${total} (${pct}%) ${grade}`;
  result.className   = pct >= 70 ? 'success' : 'error';
}

// ============================================================
// КРОССВОРД — #cw1–#cw8, #crosswordResult
// ============================================================

const crosswordAnswers = {
  cw1: "программа",
  cw2: "прототип",
  cw3: "отладка",
  cw4: "приложение",
  cw5: "эмулятор",
  cw6: "эксплуатация",
  cw7: "смартфон",
  cw8: "интерфейс"
};

function checkCrossword() {
  const result = document.getElementById('crosswordResult');
  let score = 0;
  const total = Object.keys(crosswordAnswers).length;

  for (const [id, correct] of Object.entries(crosswordAnswers)) {
    const input = document.getElementById(id);
    if (!input) continue;

    const val = input.value.trim().toLowerCase();

    if (val === correct) {
      score++;
      input.style.borderColor = '#10b981';
      input.style.background  = 'rgba(16,185,129,0.08)';
      input.style.color       = '#10b981';
    } else if (val === '') {
      input.style.borderColor = '';
      input.style.background  = '';
      input.style.color       = '';
    } else {
      input.style.borderColor = '#ef4444';
      input.style.background  = 'rgba(239,68,68,0.08)';
      input.style.color       = '#ef4444';
    }
  }

  const pct = Math.round(score / total * 100);
  result.textContent = `Правильных слов: ${score} из ${total} (${pct}%)`;
  result.className   = score === total ? 'success' : score > 0 ? 'info-msg' : 'error';
}

// ============================================================
// РЕБУС — #rebusAnswer, #rebusResult
// ============================================================

function checkRebus() {
  const input  = document.getElementById('rebusAnswer');
  const result = document.getElementById('rebusResult');
  if (!input || !result) return;

  const answer  = input.value.trim().toLowerCase();
  const correct = answer.includes('разработка');

  if (correct) {
    input.style.borderColor = '#10b981';
    input.style.background  = 'rgba(16,185,129,0.08)';
    input.style.color       = '#10b981';
    result.textContent = '✅ Верно! Мобильная разработка!';
    result.className   = 'success';
  } else {
    input.style.borderColor = '#ef4444';
    input.style.background  = 'rgba(239,68,68,0.08)';
    input.style.color       = '#ef4444';
    result.textContent = '❌ Попробуйте ещё раз. Подсказка: создание программ для смартфонов.';
    result.className   = 'error';
  }
}

// ============================================================
// ГЛОССАРИЙ — #searchGlossary, #glossaryList
// ============================================================

function filterGlossary() {
  const input = document.getElementById('searchGlossary');
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  const items = document.querySelectorAll('#glossaryList li');
  let visible = 0;

  items.forEach(item => {
    const match = item.textContent.toLowerCase().includes(query);
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  input.style.borderColor = (query.length > 0 && visible === 0) ? '#ef4444' : '';
}

// ============================================================
// РЕФЛЕКСИЯ — #reflection textarea, #reflectionSaved
// ============================================================

function saveReflection() {
  const textarea = document.querySelector('#reflection textarea');
  const saved    = document.getElementById('reflectionSaved');
  if (!saved) return;

  const text = textarea ? textarea.value.trim() : '';

  if (!text) {
    saved.textContent = '⚠️ Напишите что-нибудь перед сохранением.';
    saved.className   = 'info-msg';
    return;
  }

  try {
    localStorage.setItem('reflection_' + new Date().toISOString().slice(0,10), text);
  } catch(e) {}

  saved.textContent = '✅ Рефлексия сохранена!';
  saved.className   = 'success';

  setTimeout(() => { saved.textContent = ''; saved.className = ''; }, 3000);
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Восстановить тему ---
  initTheme();

  // --- Добавить кнопку переключения темы в DOM ---
  const toggleBtn = document.createElement('button');
  toggleBtn.id        = 'themeToggle';
  toggleBtn.className = 'theme-toggle';
  toggleBtn.title     = 'Переключить на светлую тему';
  toggleBtn.textContent = '☀️';
  toggleBtn.onclick   = toggleTheme;
  document.body.appendChild(toggleBtn);

  // Обновляем иконку если тема уже светлая
  if (document.body.classList.contains('light')) {
    toggleBtn.textContent = '🌙';
    toggleBtn.title = 'Переключить на тёмную тему';
  }

  // --- Живой поиск глоссария ---
  const search = document.getElementById('searchGlossary');
  if (search) search.addEventListener('input', filterGlossary);

  // --- Плавный скролл по nav ---
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const navH = document.querySelector('nav')?.offsetHeight || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Подсветка активного пункта nav при скролле ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.style.color             = active ? 'var(--accent)' : '';
          a.style.borderBottomColor = active ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-56px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
});