/* ============================================================
   ТЕМА 71 — JS-движок интерактивных заданий
   
   СОДЕРЖИТ:
   1. Управление прогрессом и вкладками
   2. Квиз с одиночным выбором (renderQuiz / checkQuiz / resetQuiz)
   3. Сортировка drag&drop (initSort / checkSort / resetSort)
   4. Заполнение пропусков в коде (checkFill / resetFill)
   5. Сопоставление пар (matchClick)
   6. Мульти-выбор (renderMulti / checkMulti / resetMulti)
   
   КАК ПЕРЕИСПОЛЬЗОВАТЬ:
   — Замени данные в разделах DATA на свои
   — ID элементов в HTML должны совпадать с теми, что используются ниже
   — updateProgress() вызывается автоматически при markDone()
   ============================================================ */

// ============================================================
// SECTION 1: ГЛОБАЛЬНОЕ СОСТОЯНИЕ И ПРОГРЕСС
// ============================================================

const state = {
    scores: [0, 0, 0, 0, 0],   // очки за каждое задание
    done:   [false, false, false, false, false] // выполнено ли задание
  };
  
  let currentTab = 0;
  
  /** Обновляет прогресс-бар и счётчик очков в шапке */
  function updateProgress() {
    const done  = state.done.filter(Boolean).length;
    const total = state.scores.reduce((a, b) => a + b, 0);
  
    document.getElementById('progressFill').style.width = (done / 5 * 100) + '%';
    document.getElementById('progressText').textContent  = `${done} / 5 заданий`;
    document.getElementById('scoreDisplay').textContent  = total;
  }
  
  /** Переключает активную вкладку */
  function switchTab(i) {
    document.querySelectorAll('.task-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel' + i).classList.add('active');
    document.getElementById('tab' + i).classList.add('active');
    currentTab = i;
  }
  
  /**
   * Помечает задание выполненным и начисляет очки.
   * Повторный вызов не перезаписывает результат.
   * @param {number} i   — индекс задания (0–4)
   * @param {number} pts — количество очков
   */
  function markDone(i, pts) {
    if (!state.done[i]) {
      state.done[i]   = true;
      state.scores[i] = pts;
      document.getElementById('tab' + i).classList.add('done');
      updateProgress();
    }
  }
  
  /**
   * Показывает блок обратной связи.
   * @param {string} id   — id элемента .feedback
   * @param {string} type — 'success' | 'error' | 'info'
   * @param {string} msg  — HTML-сообщение
   */
  function showFeedback(id, type, msg) {
    const el = document.getElementById(id);
    el.className = 'feedback show ' + type;
    el.innerHTML = msg;
  }
  
  // ============================================================
  // SECTION 2: ЗАДАНИЕ 1 — КВИЗ (одиночный выбор)
  // ============================================================
  
  /**
   * DATA: массив вопросов.
   * Замени на свои данные. Поле `correct` — индекс правильного варианта (0-based).
   */
  const quiz1Data = [
    {
      q: "Какой HTTP-метод используется для ЧАСТИЧНОГО обновления ресурса?",
      opts: ["GET", "PUT", "PATCH", "DELETE"],
      correct: 2,
      exp: "PATCH — частичное обновление (только изменённые поля). PUT — полная замена ресурса."
    },
    {
      q: "В каком формате пишется OpenAPI-спецификация?",
      opts: ["XML или CSV", "YAML или JSON", "Markdown или HTML", "Только JSON"],
      correct: 1,
      exp: "OpenAPI поддерживает оба формата: YAML (читаемее) и JSON (удобнее для парсинга)."
    },
    {
      q: "Какой HTTP-статус означает 'Ресурс не найден'?",
      opts: ["200", "401", "404", "500"],
      correct: 2,
      exp: "404 Not Found — сервер не нашёл запрошенный ресурс. 401 — не авторизован, 500 — серверная ошибка."
    }
  ];
  
  let quiz1Answered = []; // хранит выбранные ответы пользователя
  
  /** Рендерит квиз из quiz1Data в контейнер #quiz1Questions */
  function renderQuiz1() {
    const container = document.getElementById('quiz1Questions');
    container.innerHTML = '';
    quiz1Answered = new Array(quiz1Data.length).fill(null);
  
    quiz1Data.forEach((q, qi) => {
      const div = document.createElement('div');
      div.style.marginBottom = '24px';
      div.innerHTML = `
        <p style="font-size:14px;margin-bottom:12px;color:var(--text)">
          <strong style="color:var(--muted);font-size:11px">ВОПРОС ${qi + 1}</strong><br>${q.q}
        </p>`;
  
      const opts = document.createElement('div');
      opts.className = 'quiz-options';
  
      q.opts.forEach((o, oi) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.innerHTML = `<span class="opt-label">${String.fromCharCode(65 + oi)}</span>${o}`;
  
        btn.onclick = () => {
          if (quiz1Answered[qi] !== null) return; // уже отвечено
          quiz1Answered[qi] = oi;
  
          opts.querySelectorAll('.quiz-opt').forEach((b, bi) => {
            b.disabled = true;
            if (bi === q.correct) b.classList.add('correct');
            else if (bi === oi)   b.classList.add('wrong');
          });
        };
  
        opts.appendChild(btn);
      });
  
      div.appendChild(opts);
      container.appendChild(div);
    });
  }
  
  /** Проверяет квиз, начисляет очки, показывает объяснения */
  function checkQuiz1() {
    const correct = quiz1Answered.filter((a, i) => a === quiz1Data[i].correct).length;
    const total   = quiz1Data.length;
    const pts     = Math.round(correct / total * 20);
    const explanations = quiz1Data.map(q => `• ${q.exp}`).join('<br>');
  
    if (correct === total) {
      showFeedback('quiz1Feedback', 'success',
        `✅ Все ${total} ответа верны! +${pts} очков<br><br>${explanations}`);
      markDone(0, pts);
    } else {
      showFeedback('quiz1Feedback', 'error',
        `❌ Правильных: ${correct}/${total}. Изучите объяснения:<br><br>${explanations}`);
      if (correct > 0) markDone(0, pts);
    }
  }
  
  function resetQuiz1() {
    document.getElementById('quiz1Feedback').className = 'feedback';
    renderQuiz1();
  }
  
  // ============================================================
  // SECTION 3: ЗАДАНИЕ 2 — СОРТИРОВКА (drag & drop)
  // ============================================================
  
  /**
   * DATA: правильный порядок значений data-val у .sort-item.
   * В HTML у каждого .sort-item должен быть атрибут data-val="...".
   */
  const correctOrder = ['openapi', 'info', 'servers', 'paths', 'components', 'security'];
  
  let dragSrc = null; // ссылка на перетаскиваемый элемент
  
  /** Инициализирует drag&drop в списке #sortList и перемешивает элементы */
  function initSort() {
    const list = document.getElementById('sortList');
  
    // Перемешать элементы
    for (let i = list.children.length; i >= 0; i--)
      list.appendChild(list.children[Math.random() * i | 0]);
  
    list.querySelectorAll('.sort-item').forEach(item => {
      item.addEventListener('dragstart', e => {
        dragSrc = item;
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', e => {
        item.classList.remove('dragging');
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
      });
      item.addEventListener('drop', e => {
        e.preventDefault();
        if (dragSrc !== item) {
          const items  = [...list.querySelectorAll('.sort-item')];
          const srcIdx = items.indexOf(dragSrc);
          const tgtIdx = items.indexOf(item);
          if (srcIdx < tgtIdx) item.after(dragSrc);
          else                  item.before(dragSrc);
        }
      });
    });
  }
  
  /** Проверяет порядок элементов относительно correctOrder */
  function checkSort() {
    const list  = document.getElementById('sortList');
    const items = [...list.querySelectorAll('.sort-item')];
    const current = items.map(i => i.dataset.val);
    let correct = 0;
  
    items.forEach((item, i) => {
      // Показываем номер позиции
      item.querySelector('.sort-num').textContent = i + 1;
  
      if (current[i] === correctOrder[i]) {
        item.classList.add('correct-pos');
        correct++;
      } else {
        item.classList.add('wrong-pos');
      }
    });
  
    const pts = Math.round(correct / correctOrder.length * 20);
  
    if (correct === correctOrder.length) {
      showFeedback('sort2Feedback', 'success', `✅ Порядок правильный! +${pts} очков`);
      markDone(1, pts);
    } else {
      showFeedback('sort2Feedback', 'error',
        `❌ Правильно расставлено: ${correct}/${correctOrder.length}. ` +
        `Правильный порядок: ${correctOrder.join(' → ')}`);
      if (correct > 0) markDone(1, pts);
    }
  }
  
  function resetSort() {
    document.getElementById('sort2Feedback').className = 'feedback';
    const list = document.getElementById('sortList');
  
    list.querySelectorAll('.sort-item').forEach(item => {
      item.querySelector('.sort-num').textContent = '?';
      item.className = 'sort-item'; // убираем correct-pos / wrong-pos
    });
  
    initSort();
  }
  
  // ============================================================
  // SECTION 4: ЗАДАНИЕ 3 — ЗАПОЛНИ ПРОПУСК В КОДЕ
  // ============================================================
  
  /**
   * DATA: объект { id_инпута: 'правильный_ответ' }.
   * Инпуты должны быть в HTML с классом .fill-blank и соответствующими id.
   */
  const fillAnswers = {
    f1: 'operationId',
    f2: 'summary',
    f3: 'parameters',
    f4: 'responses',
    f5: 'schema'
  };
  
  /** Проверяет все fill-blank поля */
  function checkFill() {
    let correct = 0;
  
    Object.entries(fillAnswers).forEach(([id, ans]) => {
      const el  = document.getElementById(id);
      const val = el.value.trim().toLowerCase();
  
      if (val === ans) {
        el.classList.add('correct');
        el.classList.remove('wrong');
        correct++;
      } else {
        el.classList.add('wrong');
        el.classList.remove('correct');
      }
    });
  
    const total = Object.keys(fillAnswers).length;
    const pts   = Math.round(correct / total * 20);
  
    if (correct === total) {
      showFeedback('fill3Feedback', 'success', `✅ Все поля заполнены верно! +${pts} очков`);
      markDone(2, pts);
    } else {
      const answers = Object.values(fillAnswers).join(', ');
      showFeedback('fill3Feedback', 'error',
        `❌ Правильно: ${correct}/${total}. Подсказка — ответы: ${answers}`);
      if (correct > 0) markDone(2, pts);
    }
  }
  
  function resetFill() {
    Object.keys(fillAnswers).forEach(id => {
      const el = document.getElementById(id);
      el.value = '';
      el.className = 'fill-blank';
    });
    document.getElementById('fill3Feedback').className = 'feedback';
  }
  
  // ============================================================
  // SECTION 5: ЗАДАНИЕ 4 — СОПОСТАВЛЕНИЕ ПАР (matching)
  // ============================================================
  
  let matchSelected = null;  // текущий выделенный элемент
  let matchedCount  = 0;     // сколько пар найдено
  
  /**
   * Вызывается при клике на .match-item.
   * У каждого элемента должен быть атрибут data-id="ключ".
   * Левая колонка — #matchLeft, правая — #matchRight.
   * @param {HTMLElement} el
   * @param {string} id — значение data-id (не используется, читается из el.dataset.id)
   */
  function matchClick(el) {
    if (el.classList.contains('matched')) return;
  
    if (!matchSelected) {
      el.classList.add('selected');
      matchSelected = el;
    } else {
      if (matchSelected === el) {
        el.classList.remove('selected');
        matchSelected = null;
        return;
      }
  
      const side1 = matchSelected.closest('.match-col').id;
      const side2 = el.closest('.match-col').id;
  
      // Клик в ту же колонку — просто перевыбираем
      if (side1 === side2) {
        matchSelected.classList.remove('selected');
        el.classList.add('selected');
        matchSelected = el;
        return;
      }
  
      const id1 = matchSelected.dataset.id;
      const id2 = el.dataset.id;
  
      if (id1 === id2) {
        // Верная пара
        matchSelected.classList.remove('selected');
        matchSelected.classList.add('matched');
        el.classList.add('matched');
        matchSelected = null;
        matchedCount++;
  
        // Подбери totalPairs под своё задание
        const totalPairs = document.querySelectorAll('#matchLeft .match-item').length;
        if (matchedCount === totalPairs) {
          showFeedback('match4Feedback', 'success', '✅ Все пары найдены! +20 очков');
          markDone(3, 20);
        }
      } else {
        // Неверная пара
        matchSelected.classList.add('wrong-match');
        el.classList.add('wrong-match');
  
        const prev = matchSelected;
        setTimeout(() => {
          prev.classList.remove('selected', 'wrong-match');
          el.classList.remove('wrong-match');
          matchSelected = null;
        }, 800);
      }
    }
  }
  
  // ============================================================
  // SECTION 6: ЗАДАНИЕ 5 — МУЛЬТИ-ВЫБОР (chips)
  // ============================================================
  
  /**
   * DATA: массив вопросов с вариантами ответов.
   * correct: true — правильный вариант.
   */
  const multiData = [
    {
      q: "Какие коды HTTP-ответа ОБЯЗАТЕЛЬНО должны быть задокументированы для эндпоинта аутентификации?",
      opts: [
        { t: "200 — успешная аутентификация",   correct: true  },
        { t: "101 — Switching Protocols",         correct: false },
        { t: "401 — неверные учётные данные",    correct: true  },
        { t: "500 — внутренняя ошибка сервера",  correct: true  }
      ]
    },
    {
      q: "Что должна содержать хорошая документация REST API?",
      opts: [
        { t: "Примеры реальных запросов и ответов",         correct: true  },
        { t: "Исходный код всех микросервисов",              correct: false },
        { t: "Описание rate limiting (ограничений запросов)", correct: true  },
        { t: "Changelog версий и миграционные гайды",        correct: true  }
      ]
    }
  ];
  
  /** Рендерит мульти-выбор в #multiQuestions */
  function renderMulti() {
    const cont = document.getElementById('multiQuestions');
    cont.innerHTML = '';
  
    multiData.forEach((q, qi) => {
      const div = document.createElement('div');
      div.style.marginBottom = '24px';
      div.innerHTML = `
        <p style="font-size:14px;margin-bottom:12px">
          <strong style="color:var(--muted);font-size:11px">ВОПРОС ${qi + 1}</strong><br>${q.q}
        </p>`;
  
      const chips = document.createElement('div');
      chips.className = 'chips';
  
      q.opts.forEach(o => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = o.t;
        chip.onclick = () => {
          // Нельзя менять уже проверенные ответы
          if (chip.classList.contains('correct') || chip.classList.contains('wrong-selected')) return;
          chip.classList.toggle('selected');
        };
        chips.appendChild(chip);
      });
  
      div.appendChild(chips);
      cont.appendChild(div);
    });
  }
  
  /** Проверяет мульти-выбор */
  function checkMulti() {
    let totalCorrect = 0;
    let totalAll     = 0;
    const cont = document.getElementById('multiQuestions');
  
    multiData.forEach((q, qi) => {
      const chips = [...cont.querySelectorAll('.chips')][qi].querySelectorAll('.chip');
  
      q.opts.forEach((o, oi) => {
        const chip     = chips[oi];
        const selected = chip.classList.contains('selected');
        chip.classList.remove('selected');
  
        if (o.correct) {
          chip.classList.add('correct');
          if (selected) totalCorrect++;
          totalAll++;
        } else if (selected) {
          chip.classList.add('wrong-selected');
        }
      });
    });
  
    const pts = Math.round(totalCorrect / totalAll * 20);
  
    if (totalCorrect === totalAll) {
      showFeedback('multi5Feedback', 'success',
        `✅ Все правильные варианты отмечены! +${pts} очков`);
      markDone(4, pts);
    } else {
      showFeedback('multi5Feedback', 'error',
        `❌ Выбрано правильно: ${totalCorrect}/${totalAll}. Правильные ответы выделены зелёным.`);
      if (totalCorrect > 0) markDone(4, pts);
    }
  }
  
  function resetMulti() {
    document.getElementById('multi5Feedback').className = 'feedback';
    renderMulti();
  }
  
  // ============================================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================================
  renderQuiz1();
  initSort();
  renderMulti();
  updateProgress();