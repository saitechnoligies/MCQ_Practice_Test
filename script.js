/**
 * MCQ Practice Test Application
 * Local, responsive, accessible, randomized test app with zero dependencies.
 */

// --- Default Sample Questions (Fallback for direct file:/// execution) ---
const EMBEDDED_SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    type: "single",
    options: [
      { id: "A", text: "Rome" },
      { id: "B", text: "Paris" },
      { id: "C", text: "Berlin" },
      { id: "D", text: "Madrid" }
    ],
    answer: ["B"]
  },
  {
    id: 2,
    question: "Which of the following are programming languages?",
    type: "multiple",
    options: [
      { id: "A", text: "Python" },
      { id: "B", text: "HTML" },
      { id: "C", text: "Java" },
      { id: "D", text: "CSS" },
      { id: "E", text: "Rust" }
    ],
    answer: ["A", "C", "E"]
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    type: "single",
    options: [
      { id: "A", text: "Venus" },
      { id: "B", text: "Mars" },
      { id: "C", text: "Jupiter" },
      { id: "D", text: "Saturn" }
    ],
    answer: ["B"]
  },
  {
    id: 4,
    question: "Which of the following data structures operate on a First-In-First-Out (FIFO) basis?",
    type: "single",
    options: [
      { id: "A", text: "Stack" },
      { id: "B", "text": "Queue" },
      { id: "C", text: "Binary Search Tree" },
      { id: "D", text: "Hash Map" }
    ],
    answer: ["B"]
  },
  {
    id: 5,
    question: "Which of the following are valid HTTP request methods?",
    type: "multiple",
    options: [
      { id: "A", text: "GET" },
      { id: "B", text: "POST" },
      { id: "C", text: "FETCH" },
      { id: "D", text: "DELETE" },
      { id: "E", text: "PUT" }
    ],
    answer: ["A", "B", "D", "E"]
  },
  {
    id: 6,
    question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    type: "single",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(n)" },
      { id: "C", text: "O(log n)" },
      { id: "D", text: "O(n log n)" }
    ],
    answer: ["C"]
  },
  {
    id: 7,
    question: "Which of the following are primitive data types in JavaScript?",
    type: "multiple",
    options: [
      { id: "A", text: "string" },
      { id: "B", text: "boolean" },
      { id: "C", text: "object" },
      { id: "D", text: "symbol" },
      { id: "E", text: "array" }
    ],
    answer: ["A", "B", "D"]
  },
  {
    id: 8,
    question: "Who is considered the father of computer science?",
    type: "single",
    options: [
      { id: "A", text: "Alan Turing" },
      { id: "B", text: "Charles Babbage" },
      { id: "C", text: "Ada Lovelace" },
      { id: "D", text: "John von Neumann" }
    ],
    answer: ["A"]
  },
  {
    id: 9,
    question: "Which of the following CSS properties can trigger hardware-accelerated animations?",
    type: "multiple",
    options: [
      { id: "A", text: "transform" },
      { id: "B", text: "opacity" },
      { "id": "C", text: "width" },
      { id: "D", text: "margin-left" }
    ],
    answer: ["A", "B"]
  },
  {
    id: 10,
    question: "In Git, which command creates a new branch and switches to it in a single step?",
    type: "single",
    options: [
      { id: "A", text: "git branch -m <name>" },
      { id: "B", text: "git checkout -b <name>" },
      { id: "C", text: "git switch -d <name>" },
      { id: "D", text: "git merge -b <name>" }
    ],
    answer: ["B"]
  }
];

// --- Application State ---
const state = {
  rawBank: [],             // Clean validated question bank
  activeQuestions: [],     // Shuffled questions & shuffled options for current attempt
  currentIndex: 0,         // Active question index (0-based)
  userAnswers: {},         // questionId -> Array of selected option IDs (e.g. ['B'] or ['A', 'C'])
  passThreshold: 60,       // Configurable passing percentage
  reviewFilter: 'all',     // 'all' | 'incorrect' | 'correct'
  isReviewMode: false
};

// --- DOM Element References ---
const screens = {
  setup: document.getElementById('screen-setup'),
  quiz: document.getElementById('screen-quiz'),
  results: document.getElementById('screen-results'),
  review: document.getElementById('screen-review')
};

// Setup screen elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const btnLoadSample = document.getElementById('btn-load-sample');
const setupErrorBox = document.getElementById('setup-error');
const setupErrorMessage = document.getElementById('setup-error-message');
const passThresholdInput = document.getElementById('pass-threshold');
const btnHeaderNew = document.getElementById('btn-header-new');

// Quiz screen elements
const quizProgressText = document.getElementById('quiz-progress-text');
const quizAnsweredCount = document.getElementById('quiz-answered-count');
const quizProgressFill = document.getElementById('quiz-progress-fill');
const btnToggleNav = document.getElementById('btn-toggle-nav');
const quizNavigator = document.getElementById('quiz-navigator');
const navigatorGrid = document.getElementById('navigator-grid');
const questionTypeBadge = document.getElementById('question-type-badge');
const questionTypeHint = document.getElementById('question-type-hint');
const quizQuestionTitle = document.getElementById('quiz-question-title');
const quizOptionsContainer = document.getElementById('quiz-options-container');
const btnPrevQuestion = document.getElementById('btn-prev-question');
const btnNextQuestion = document.getElementById('btn-next-question');
const btnSubmitTest = document.getElementById('btn-submit-test');
const btnClearSelection = document.getElementById('btn-clear-selection');

// Results screen elements
const scoreCircle = document.getElementById('score-circle');
const resultScorePercent = document.getElementById('result-score-percent');
const resultStatusBadge = document.getElementById('result-status-badge');
const resultFeedbackText = document.getElementById('result-feedback-text');
const statTotal = document.getElementById('stat-total');
const statCorrect = document.getElementById('stat-correct');
const statIncorrect = document.getElementById('stat-incorrect');
const statUnanswered = document.getElementById('stat-unanswered');
const btnViewReview = document.getElementById('btn-view-review');
const btnRetryIncorrect = document.getElementById('btn-retry-incorrect');
const btnRestartAll = document.getElementById('btn-restart-all');

// Review screen elements
const reviewListContainer = document.getElementById('review-list-container');
const filterCountAll = document.getElementById('filter-count-all');
const filterCountIncorrect = document.getElementById('filter-count-incorrect');
const filterCountCorrect = document.getElementById('filter-count-correct');
const filterTabs = document.querySelectorAll('.filter-tab');
const btnReviewBackResults = document.getElementById('btn-review-back-results');
const btnReviewRetryIncorrect = document.getElementById('btn-review-retry-incorrect');
const btnReviewRestartAll = document.getElementById('btn-review-restart-all');

// Modal elements
const modalUnanswered = document.getElementById('modal-unanswered');
const modalUnansweredCount = document.getElementById('modal-unanswered-count');
const modalTotalCount = document.getElementById('modal-total-count');
const modalUnansweredChips = document.getElementById('modal-unanswered-chips');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalGotoUnanswered = document.getElementById('btn-modal-goto-unanswered');
const btnModalConfirmSubmit = document.getElementById('btn-modal-confirm-submit');

// ==========================================================================
// 1. Validation Logic
// ==========================================================================

/**
 * Validates the loaded JSON structure.
 * Returns { valid: true, data: sanitizedQuestions } or { valid: false, error: string }
 */
function validateQuestionBank(data) {
  if (!Array.isArray(data)) {
    return { valid: false, error: "The JSON root must be an array of question objects." };
  }

  if (data.length === 0) {
    return { valid: false, error: "The question bank is empty. Please provide at least one question." };
  }

  const seenQuestionIds = new Set();
  const sanitizedList = [];

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    const qNum = i + 1;

    if (!q || typeof q !== 'object') {
      return { valid: false, error: `Question #${qNum} is not a valid object.` };
    }

    // Question ID validation
    if (q.id === undefined || q.id === null || String(q.id).trim() === '') {
      return { valid: false, error: `Question #${qNum} is missing a required 'id'.` };
    }
    const qIdStr = String(q.id);
    if (seenQuestionIds.has(qIdStr)) {
      return { valid: false, error: `Duplicate question id '${q.id}' found at question #${qNum}. Each question must have a unique ID.` };
    }
    seenQuestionIds.add(qIdStr);

    // Question text validation
    if (typeof q.question !== 'string' || q.question.trim() === '') {
      return { valid: false, error: `Question #${qNum} (ID: ${q.id}) is missing valid 'question' text.` };
    }

    // Type validation
    if (q.type !== 'single' && q.type !== 'multiple') {
      return {
        valid: false,
        error: `Question #${qNum} (ID: ${q.id}) has invalid type "${q.type}". Must be either "single" or "multiple".`
      };
    }

    // Options validation
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return {
        valid: false,
        error: `Question #${qNum} (ID: ${q.id}) must contain an 'options' array with at least 2 choices.`
      };
    }

    const seenOptionIds = new Set();
    const sanitizedOptions = [];

    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j];
      const optNum = j + 1;

      if (!opt || typeof opt !== 'object') {
        return { valid: false, error: `Option #${optNum} of Question #${qNum} is not a valid object.` };
      }

      if (opt.id === undefined || opt.id === null || String(opt.id).trim() === '') {
        return { valid: false, error: `Option #${optNum} of Question #${qNum} is missing an 'id'.` };
      }

      const optIdStr = String(opt.id);
      if (seenOptionIds.has(optIdStr)) {
        return {
          valid: false,
          error: `Question #${qNum} contains duplicate option id "${opt.id}". Each option ID within a question must be unique.`
        };
      }
      seenOptionIds.add(optIdStr);

      if (typeof opt.text !== 'string' || opt.text.trim() === '') {
        return { valid: false, error: `Option "${opt.id}" of Question #${qNum} has empty or missing 'text'.` };
      }

      sanitizedOptions.push({
        id: optIdStr,
        text: opt.text.trim()
      });
    }

    // Answer validation
    if (!Array.isArray(q.answer) || q.answer.length === 0) {
      return {
        valid: false,
        error: `Question #${qNum} (ID: ${q.id}) must have a non-empty 'answer' array specifying correct option IDs.`
      };
    }

    const sanitizedAnswer = [];
    for (const ansId of q.answer) {
      const ansIdStr = String(ansId);
      if (!seenOptionIds.has(ansIdStr)) {
        return {
          valid: false,
          error: `Question #${qNum} specifies answer id "${ansId}" which does not match any option ID (${Array.from(seenOptionIds).join(', ')}).`
        };
      }
      if (!sanitizedAnswer.includes(ansIdStr)) {
        sanitizedAnswer.push(ansIdStr);
      }
    }

    if (q.type === 'single' && sanitizedAnswer.length !== 1) {
      return {
        valid: false,
        error: `Question #${qNum} has type "single" but specifies ${sanitizedAnswer.length} answers. Single choice questions must have exactly 1 answer.`
      };
    }

    sanitizedList.push({
      id: qIdStr,
      question: q.question.trim(),
      type: q.type,
      options: sanitizedOptions,
      answer: sanitizedAnswer
    });
  }

  return { valid: true, data: sanitizedList };
}

// ==========================================================================
// 2. Fisher–Yates Randomization
// ==========================================================================

/**
 * Pure Fisher–Yates Shuffle Algorithm.
 * Returns a new array with items shuffled uniformly.
 */
function fisherYatesShuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Prepares questions for a test attempt:
 * 1. Shuffles all questions.
 * 2. Shuffles the options for each question independently.
 * 3. Preserves original option IDs and correct answer associations.
 */
function prepareShuffledAttempt(questions) {
  const shuffledQuestions = fisherYatesShuffle(questions);

  return shuffledQuestions.map(q => {
    return {
      id: q.id,
      question: q.question,
      type: q.type,
      // Deep clone & independently shuffle options for this attempt
      shuffledOptions: fisherYatesShuffle(q.options),
      answer: [...q.answer]
    };
  });
}

// ==========================================================================
// 3. Navigation and UI Screen Switching
// ==========================================================================

function switchScreen(screenName) {
  Object.keys(screens).forEach(key => {
    screens[key].classList.remove('active');
  });
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showSetupError(msg) {
  setupErrorMessage.textContent = msg;
  setupErrorBox.style.display = 'flex';
}

function clearSetupError() {
  setupErrorBox.style.display = 'none';
  setupErrorMessage.textContent = '';
}

// ==========================================================================
// 4. Test Initiation & Setup
// ==========================================================================

function initTestWithQuestions(questions, isRetry = false) {
  if (!questions || questions.length === 0) {
    showSetupError("Cannot start test: No valid questions provided.");
    return;
  }

  // Read threshold
  const threshVal = parseInt(passThresholdInput.value, 10);
  state.passThreshold = (!isNaN(threshVal) && threshVal >= 0 && threshVal <= 100) ? threshVal : 60;

  // Prepare randomized attempt
  state.activeQuestions = prepareShuffledAttempt(questions);
  state.currentIndex = 0;
  state.userAnswers = {};
  state.isReviewMode = false;

  // Render question UI
  renderNavigator();
  renderCurrentQuestion();
  switchScreen('quiz');
}

// ==========================================================================
// 5. Question Rendering & Option Handling
// ==========================================================================

function renderCurrentQuestion() {
  const total = state.activeQuestions.length;
  if (total === 0) return;

  const currentQ = state.activeQuestions[state.currentIndex];
  const qNum = state.currentIndex + 1;

  // Update header counters
  quizProgressText.textContent = `Question ${qNum} of ${total}`;
  const answeredCount = Object.keys(state.userAnswers).filter(id => {
    const ans = state.userAnswers[id];
    return Array.isArray(ans) && ans.length > 0;
  }).length;
  quizAnsweredCount.textContent = `${answeredCount} of ${total} answered`;

  // Progress bar percentage based on current question position
  const progressPercent = Math.round((qNum / total) * 100);
  quizProgressFill.style.width = `${progressPercent}%`;

  // Question type badge & hint
  if (currentQ.type === 'single') {
    questionTypeBadge.textContent = "Single Choice";
    questionTypeBadge.className = "badge badge-primary";
    questionTypeHint.textContent = "Choose 1 answer";
  } else {
    questionTypeBadge.textContent = "Multiple Choice";
    questionTypeBadge.className = "badge badge-warning";
    questionTypeHint.textContent = "Select all that apply";
  }

  // Set question text safely via textContent
  quizQuestionTitle.textContent = currentQ.question;

  // Clear previous options
  quizOptionsContainer.innerHTML = '';

  // Get currently saved answers for this question
  const currentSelection = state.userAnswers[currentQ.id] || [];

  // Letters to display for options (A, B, C, D...)
  const letterLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  currentQ.shuffledOptions.forEach((option, index) => {
    const isSelected = currentSelection.includes(option.id);

    // Option Card
    const card = document.createElement('div');
    card.className = `option-card type-${currentQ.type}${isSelected ? ' selected' : ''}`;
    card.setAttribute('role', currentQ.type === 'single' ? 'radio' : 'checkbox');
    card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    card.setAttribute('tabindex', '0');
    card.dataset.optionId = option.id;

    // Visual Control (radio dot or checkbox mark)
    const control = document.createElement('div');
    control.className = 'option-control';
    control.setAttribute('aria-hidden', 'true');

    if (currentQ.type === 'multiple') {
      // Checkbox SVG checkmark
      control.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    }

    // Display Letter badge (A, B, C...)
    const letterBadge = document.createElement('span');
    letterBadge.className = 'option-letter-badge';
    letterBadge.textContent = letterLabels[index % letterLabels.length] || `${index + 1}`;

    // Option Text (escaped)
    const textSpan = document.createElement('div');
    textSpan.className = 'option-text';
    textSpan.textContent = option.text;

    card.appendChild(control);
    card.appendChild(letterBadge);
    card.appendChild(textSpan);

    // Click handler
    card.addEventListener('click', () => {
      toggleOption(currentQ, option.id);
    });

    // Keyboard support (Space / Enter)
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleOption(currentQ, option.id);
      }
    });

    quizOptionsContainer.appendChild(card);
  });

  // Navigation button states
  btnPrevQuestion.disabled = (state.currentIndex === 0);

  const isLastQuestion = (state.currentIndex === total - 1);
  if (isLastQuestion) {
    btnNextQuestion.style.display = 'none';
    btnSubmitTest.style.display = 'inline-flex';
  } else {
    btnNextQuestion.style.display = 'inline-flex';
    btnSubmitTest.style.display = 'none';
  }

  // Update question navigator chips
  updateNavigatorState();
}

/**
 * Handles selecting / toggling options
 */
function toggleOption(question, optionId) {
  let currentSelection = state.userAnswers[question.id] ? [...state.userAnswers[question.id]] : [];

  if (question.type === 'single') {
    // Single select: clicking toggles or replaces
    currentSelection = [optionId];
  } else {
    // Multiple select: toggle presence in array
    const existingIndex = currentSelection.indexOf(optionId);
    if (existingIndex > -1) {
      currentSelection.splice(existingIndex, 1);
    } else {
      currentSelection.push(optionId);
    }
  }

  // Update state
  if (currentSelection.length > 0) {
    state.userAnswers[question.id] = currentSelection;
  } else {
    delete state.userAnswers[question.id];
  }

  // Re-render UI for immediate responsiveness
  renderCurrentQuestion();
}

/**
 * Clears selection for current question
 */
function clearCurrentSelection() {
  const currentQ = state.activeQuestions[state.currentIndex];
  if (currentQ && state.userAnswers[currentQ.id]) {
    delete state.userAnswers[currentQ.id];
    renderCurrentQuestion();
  }
}

// ==========================================================================
// 6. Question Navigator / Overview Drawer
// ==========================================================================

function renderNavigator() {
  navigatorGrid.innerHTML = '';
  const total = state.activeQuestions.length;

  state.activeQuestions.forEach((q, idx) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'nav-chip';
    chip.textContent = idx + 1;
    chip.dataset.index = idx;
    chip.setAttribute('aria-label', `Go to Question ${idx + 1}`);

    chip.addEventListener('click', () => {
      state.currentIndex = idx;
      renderCurrentQuestion();
    });

    navigatorGrid.appendChild(chip);
  });

  updateNavigatorState();
}

function updateNavigatorState() {
  const chips = navigatorGrid.querySelectorAll('.nav-chip');
  chips.forEach((chip, idx) => {
    const q = state.activeQuestions[idx];
    const isAnswered = state.userAnswers[q.id] && state.userAnswers[q.id].length > 0;
    const isCurrent = (idx === state.currentIndex);

    chip.classList.toggle('current', isCurrent);
    chip.classList.toggle('answered', isAnswered && !isCurrent);
  });
}

function toggleNavigator() {
  const isHidden = (quizNavigator.style.display === 'none');
  quizNavigator.style.display = isHidden ? 'block' : 'none';
  btnToggleNav.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
}

// ==========================================================================
// 7. Test Submission & Unanswered Confirmation
// ==========================================================================

function handleTestSubmitAttempt() {
  const total = state.activeQuestions.length;
  const unansweredIndices = [];

  state.activeQuestions.forEach((q, idx) => {
    const ans = state.userAnswers[q.id];
    if (!ans || ans.length === 0) {
      unansweredIndices.push(idx);
    }
  });

  if (unansweredIndices.length > 0) {
    // Show confirmation modal
    modalUnansweredCount.textContent = unansweredIndices.length;
    modalTotalCount.textContent = total;

    modalUnansweredChips.innerHTML = '';
    unansweredIndices.forEach(idx => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'modal-unanswered-chip';
      chip.textContent = `Q${idx + 1}`;
      chip.title = `Jump to question ${idx + 1}`;
      chip.addEventListener('click', () => {
        closeUnansweredModal();
        state.currentIndex = idx;
        renderCurrentQuestion();
      });
      modalUnansweredChips.appendChild(chip);
    });

    modalUnanswered.style.display = 'flex';
  } else {
    // All answered, submit directly
    finalizeSubmit();
  }
}

function closeUnansweredModal() {
  modalUnanswered.style.display = 'none';
}

function finalizeSubmit() {
  closeUnansweredModal();
  calculateAndRenderResults();
}

// ==========================================================================
// 8. Scoring & Results Calculation
// ==========================================================================

/**
 * Strict scoring rules:
 * - Single-select: correct only if chosen option matches answer[0].
 * - Multiple-select: correct only if the selected set exactly matches answer set.
 * - Selection of any wrong option => incorrect.
 * - Missing any correct option => incorrect.
 * - Unanswered => incorrect.
 */
function evaluateAnswers() {
  const total = state.activeQuestions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const evaluatedQuestions = state.activeQuestions.map(q => {
    const selected = state.userAnswers[q.id] || [];
    const isUnanswered = (selected.length === 0);

    let isCorrect = false;

    if (!isUnanswered) {
      if (q.type === 'single') {
        isCorrect = (selected.length === 1 && String(selected[0]) === String(q.answer[0]));
      } else {
        // Multiple select
        const isSameLength = (selected.length === q.answer.length);
        const allCorrectSelected = q.answer.every(ansId => selected.includes(String(ansId)));
        isCorrect = isSameLength && allCorrectSelected;
      }
    }

    if (isUnanswered) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    return {
      ...q,
      userSelected: selected,
      isCorrect,
      isUnanswered
    };
  });

  const percentage = total > 0 ? (correctCount / total) * 100 : 0;
  const isPassed = percentage >= state.passThreshold;

  return {
    total,
    correctCount,
    incorrectCount,
    unansweredCount,
    percentage: Math.round(percentage * 10) / 10,
    isPassed,
    evaluatedQuestions
  };
}

let lastEvaluation = null;

function calculateAndRenderResults() {
  lastEvaluation = evaluateAnswers();

  // Populate Results Screen
  const scoreFormatted = Number.isInteger(lastEvaluation.percentage)
    ? `${lastEvaluation.percentage}%`
    : `${lastEvaluation.percentage.toFixed(1)}%`;

  resultScorePercent.textContent = scoreFormatted;

  // Pass / Fail status badge & styling
  scoreCircle.classList.remove('passed', 'failed');
  if (lastEvaluation.isPassed) {
    scoreCircle.classList.add('passed');
    resultStatusBadge.className = 'badge badge-success badge-lg';
    resultStatusBadge.textContent = `Passed (Target: ${state.passThreshold}%)`;
    resultFeedbackText.textContent = "Great job! You met the passing standard.";
  } else {
    scoreCircle.classList.add('failed');
    resultStatusBadge.className = 'badge badge-danger badge-lg';
    resultStatusBadge.textContent = `Needs Improvement (Target: ${state.passThreshold}%)`;
    resultFeedbackText.textContent = "You did not reach the passing threshold this time. Review your mistakes and retry!";
  }

  statTotal.textContent = lastEvaluation.total;
  statCorrect.textContent = lastEvaluation.correctCount;
  statIncorrect.textContent = lastEvaluation.incorrectCount;
  statUnanswered.textContent = lastEvaluation.unansweredCount;

  // Retry incorrect button state
  const missedCount = lastEvaluation.incorrectCount + lastEvaluation.unansweredCount;
  btnRetryIncorrect.disabled = (missedCount === 0);
  btnRetryIncorrect.textContent = missedCount > 0
    ? `Retry Missed Questions (${missedCount})`
    : "No Incorrect Questions";

  switchScreen('results');
}

// ==========================================================================
// 9. Review Screen
// ==========================================================================

function renderReviewScreen(filter = 'all') {
  if (!lastEvaluation) return;

  state.reviewFilter = filter;

  // Update filter counts
  const missedCount = lastEvaluation.incorrectCount + lastEvaluation.unansweredCount;
  filterCountAll.textContent = lastEvaluation.total;
  filterCountIncorrect.textContent = missedCount;
  filterCountCorrect.textContent = lastEvaluation.correctCount;

  // Update tab active classes
  filterTabs.forEach(tab => {
    const tabFilter = tab.dataset.filter;
    const isActive = (tabFilter === filter);
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Filter questions
  let displayed = lastEvaluation.evaluatedQuestions;
  if (filter === 'incorrect') {
    displayed = displayed.filter(q => !q.isCorrect);
  } else if (filter === 'correct') {
    displayed = displayed.filter(q => q.isCorrect);
  }

  reviewListContainer.innerHTML = '';

  if (displayed.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'card text-muted';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '2rem';
    emptyMsg.textContent = "No questions match the selected filter.";
    reviewListContainer.appendChild(emptyMsg);
  } else {
    displayed.forEach((q, displayIdx) => {
      const card = createReviewCard(q, displayIdx + 1);
      reviewListContainer.appendChild(card);
    });
  }

  // Update retry incorrect button in review footer
  btnReviewRetryIncorrect.disabled = (missedCount === 0);
  btnReviewRetryIncorrect.textContent = missedCount > 0
    ? `Retry Missed (${missedCount})`
    : "No Missed Questions";

  switchScreen('review');
}

function createReviewCard(q, displayNum) {
  const card = document.createElement('div');
  const cardStatus = q.isUnanswered ? 'unanswered' : (q.isCorrect ? 'correct' : 'incorrect');
  card.className = `card review-card ${cardStatus}`;

  // Card Header
  const header = document.createElement('div');
  header.className = 'review-card-header';

  const titleWrap = document.createElement('div');
  const typeTag = document.createElement('span');
  typeTag.className = 'badge badge-neutral';
  typeTag.textContent = q.type === 'single' ? 'Single Choice' : 'Multiple Choice';

  const title = document.createElement('h3');
  title.className = 'review-card-title';
  title.style.marginTop = '0.5rem';
  title.textContent = `Q${displayNum}. ${q.question}`;

  titleWrap.appendChild(typeTag);
  titleWrap.appendChild(title);

  // Status Badge
  const statusBadge = document.createElement('span');
  if (q.isUnanswered) {
    statusBadge.className = 'badge badge-warning';
    statusBadge.textContent = 'Unanswered';
  } else if (q.isCorrect) {
    statusBadge.className = 'badge badge-success';
    statusBadge.textContent = 'Correct';
  } else {
    statusBadge.className = 'badge badge-danger';
    statusBadge.textContent = 'Incorrect';
  }

  header.appendChild(titleWrap);
  header.appendChild(statusBadge);
  card.appendChild(header);

  // Options List
  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'review-options';

  const letterLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  q.shuffledOptions.forEach((opt, optIdx) => {
    const isChosen = q.userSelected.includes(opt.id);
    const isCorrectOption = q.answer.includes(opt.id);

    const optRow = document.createElement('div');
    optRow.className = 'review-option';

    if (isCorrectOption) {
      optRow.classList.add('is-correct');
    } else if (isChosen && !isCorrectOption) {
      optRow.classList.add('is-user-wrong');
    }

    // Left side: badge letter + text
    const leftSide = document.createElement('div');
    leftSide.className = 'review-option-left';

    const letterBadge = document.createElement('span');
    letterBadge.className = 'option-letter-badge';
    letterBadge.textContent = letterLabels[optIdx % letterLabels.length] || `${optIdx + 1}`;

    const textSpan = document.createElement('span');
    textSpan.className = 'option-text';
    textSpan.textContent = opt.text;

    leftSide.appendChild(letterBadge);
    leftSide.appendChild(textSpan);
    optRow.appendChild(leftSide);

    // Right side: Status tags
    const badgeWrap = document.createElement('div');
    badgeWrap.className = 'review-badges';

    if (isChosen && isCorrectOption) {
      const b = document.createElement('span');
      b.className = 'badge badge-success';
      b.textContent = 'Your Choice ✓';
      badgeWrap.appendChild(b);
    } else if (isChosen && !isCorrectOption) {
      const b = document.createElement('span');
      b.className = 'badge badge-danger';
      b.textContent = 'Your Choice ✗';
      badgeWrap.appendChild(b);
    }

    if (isCorrectOption && !isChosen) {
      const b = document.createElement('span');
      b.className = 'badge badge-success';
      b.textContent = 'Correct Answer';
      badgeWrap.appendChild(b);
    }

    optRow.appendChild(badgeWrap);
    optionsWrap.appendChild(optRow);
  });

  card.appendChild(optionsWrap);
  return card;
}

// ==========================================================================
// 10. Retry Incorrect & Restart Test Actions
// ==========================================================================

function retryIncorrectQuestions() {
  if (!lastEvaluation) return;

  const missedQuestions = lastEvaluation.evaluatedQuestions
    .filter(q => !q.isCorrect)
    .map(q => {
      // Find the clean original question definition from rawBank
      const orig = state.rawBank.find(raw => String(raw.id) === String(q.id));
      return orig || {
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.shuffledOptions,
        answer: q.answer
      };
    });

  if (missedQuestions.length === 0) return;

  initTestWithQuestions(missedQuestions, true);
}

function restartFullTest() {
  if (!state.rawBank || state.rawBank.length === 0) return;
  initTestWithQuestions(state.rawBank, false);
}

// ==========================================================================
// 11. Event Listeners & File Loading
// ==========================================================================

function setupEventListeners() {
  // File drag & drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  // Load sample questions
  btnLoadSample.addEventListener('click', () => {
    clearSetupError();
    loadSampleData();
  });

  // Header change test button
  btnHeaderNew.addEventListener('click', () => {
    switchScreen('setup');
  });

  // Quiz navigation buttons
  btnPrevQuestion.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderCurrentQuestion();
    }
  });

  btnNextQuestion.addEventListener('click', () => {
    if (state.currentIndex < state.activeQuestions.length - 1) {
      state.currentIndex++;
      renderCurrentQuestion();
    }
  });

  btnClearSelection.addEventListener('click', () => {
    clearCurrentSelection();
  });

  btnSubmitTest.addEventListener('click', () => {
    handleTestSubmitAttempt();
  });

  btnToggleNav.addEventListener('click', () => {
    toggleNavigator();
  });

  // Modal actions
  btnModalCancel.addEventListener('click', () => {
    closeUnansweredModal();
  });

  btnModalGotoUnanswered.addEventListener('click', () => {
    const total = state.activeQuestions.length;
    for (let i = 0; i < total; i++) {
      const q = state.activeQuestions[i];
      if (!state.userAnswers[q.id] || state.userAnswers[q.id].length === 0) {
        closeUnansweredModal();
        state.currentIndex = i;
        renderCurrentQuestion();
        return;
      }
    }
    closeUnansweredModal();
  });

  btnModalConfirmSubmit.addEventListener('click', () => {
    finalizeSubmit();
  });

  // Results actions
  btnViewReview.addEventListener('click', () => {
    renderReviewScreen('all');
  });

  btnRetryIncorrect.addEventListener('click', () => {
    retryIncorrectQuestions();
  });

  btnRestartAll.addEventListener('click', () => {
    restartFullTest();
  });

  // Review screen filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      renderReviewScreen(tab.dataset.filter);
    });
  });

  btnReviewBackResults.addEventListener('click', () => {
    switchScreen('results');
  });

  btnReviewRetryIncorrect.addEventListener('click', () => {
    retryIncorrectQuestions();
  });

  btnReviewRestartAll.addEventListener('click', () => {
    restartFullTest();
  });

  // Keyboard navigation shortcuts
  document.addEventListener('keydown', (e) => {
    // If modal is open, Escape closes it
    if (modalUnanswered.style.display === 'flex' && e.key === 'Escape') {
      closeUnansweredModal();
      return;
    }

    // Only enable keyboard arrows on quiz screen when not typing in an input
    if (screens.quiz.classList.contains('active')) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && state.currentIndex < state.activeQuestions.length - 1) {
        state.currentIndex++;
        renderCurrentQuestion();
      } else if (e.key === 'ArrowLeft' && state.currentIndex > 0) {
        state.currentIndex--;
        renderCurrentQuestion();
      }
    }
  });
}

function handleFileSelected(file) {
  clearSetupError();

  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
    showSetupError(`File "${file.name}" does not appear to be a JSON file (.json). Please select a valid JSON file.`);
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      const validation = validateQuestionBank(parsed);

      if (!validation.valid) {
        showSetupError(`Invalid Question Data: ${validation.error}`);
        return;
      }

      state.rawBank = validation.data;
      initTestWithQuestions(state.rawBank);
    } catch (err) {
      showSetupError(`Failed to parse JSON file "${file.name}". Syntax Error: ${err.message}`);
    }
  };

  reader.onerror = () => {
    showSetupError(`Could not read file "${file.name}". Please try again.`);
  };

  reader.readAsText(file);
}

/**
 * Loads sample questions either from questions.json (if hosted)
 * or gracefully falls back to the embedded sample question array.
 */
function loadSampleData() {
  fetch('questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      const validation = validateQuestionBank(json);
      if (validation.valid) {
        state.rawBank = validation.data;
        initTestWithQuestions(state.rawBank);
      } else {
        throw new Error(validation.error);
      }
    })
    .catch(() => {
      // Fallback to embedded sample questions (seamless for local file:// access)
      const validation = validateQuestionBank(EMBEDDED_SAMPLE_QUESTIONS);
      if (validation.valid) {
        state.rawBank = validation.data;
        initTestWithQuestions(state.rawBank);
      } else {
        showSetupError("Failed to initialize sample questions: " + validation.error);
      }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});
