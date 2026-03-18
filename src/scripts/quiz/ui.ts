import { QUESTIONS } from './data';
import type { ScoreBand } from './data';
import { calculateScore, getBand, getAnswersFromDOM } from './scoring';
import { generatePDF, fallbackHTML } from './pdf';
import { ANALYTICS } from '@/data/site';

let quizAnswers: number[] = [];
let quizTotal = 0;
let quizBand: ScoreBand | null = null;

/** Create a bullet element for score summary */
export function createBullet(iconClass: string, iconText: string, labelText: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'bullet';

  const icon = document.createElement('span');
  icon.className = `bullet-icon ${iconClass}`;
  icon.textContent = iconText;

  const label = document.createElement('span');
  label.textContent = labelText;

  div.appendChild(icon);
  div.appendChild(label);
  return div;
}

/** Create a breakdown bar element for category scores */
export function createBreakdownBar(label: string, score: number): HTMLElement {
  const pct = Math.round((score / 3) * 100);

  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '12px';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '4px';

  const labelSpan = document.createElement('span');
  labelSpan.style.fontSize = '.84rem';
  labelSpan.style.color = 'var(--white)';
  labelSpan.style.fontWeight = '600';
  labelSpan.textContent = label;

  const scoreSpan = document.createElement('span');
  scoreSpan.style.fontFamily = 'var(--mono)';
  scoreSpan.style.fontSize = '.72rem';
  scoreSpan.style.color = 'var(--txt3)';
  scoreSpan.textContent = `${score}/3`;

  header.appendChild(labelSpan);
  header.appendChild(scoreSpan);

  const track = document.createElement('div');
  track.style.height = '6px';
  track.style.background = 'var(--bg3)';
  track.style.borderRadius = '3px';
  track.style.overflow = 'hidden';

  const fill = document.createElement('div');
  fill.style.height = '100%';
  fill.style.width = `${pct}%`;
  fill.style.background = 'linear-gradient(90deg,var(--acc2),var(--acc))';
  fill.style.borderRadius = '3px';

  track.appendChild(fill);
  wrapper.appendChild(header);
  wrapper.appendChild(track);
  return wrapper;
}

/** Create a recommendation item element */
export function createRecoItem(
  priority: string,
  priorityClass: string,
  heading: string,
  body: string,
): HTMLElement {
  const div = document.createElement('div');
  div.className = 'reco-item';

  const prioritySpan = document.createElement('span');
  prioritySpan.className = `reco-priority ${priorityClass}`;
  prioritySpan.textContent = priority;

  const textDiv = document.createElement('div');
  textDiv.className = 'reco-text';

  const strong = document.createElement('strong');
  strong.textContent = heading;

  textDiv.appendChild(strong);
  textDiv.appendChild(document.createTextNode(body));

  div.appendChild(prioritySpan);
  div.appendChild(textDiv);
  return div;
}

export function initQuiz(): void {
  const cards = document.querySelectorAll<HTMLElement>('.quiz-card');
  const calcBtn = document.getElementById('calc-btn') as HTMLButtonElement | null;
  let currentStep = 0;
  let advanceTimer: ReturnType<typeof setTimeout> | null = null;

  if (!cards.length || !calcBtn) return;

  const calcButton = calcBtn;
  cards[0].classList.add('active');
  calcButton.style.display = 'none';

  // Add back buttons to cards after the first
  for (let i = 1; i < cards.length; i++) {
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'q-back';
    back.textContent = '\u2190 Back';
    back.setAttribute('data-step', String(i));
    cards[i].insertBefore(back, cards[i].firstChild);
  }

  document.querySelectorAll<HTMLButtonElement>('.q-back').forEach(function (b) {
    b.addEventListener('click', function () {
      goToStep(parseInt(b.getAttribute('data-step') ?? '1', 10) - 1);
    });
  });

  function goToStep(step: number): void {
    if (advanceTimer) clearTimeout(advanceTimer);
    cards[currentStep].classList.remove('active');
    currentStep = step;
    cards[currentStep].classList.add('active');
    cards[currentStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
    updateProgress();
  }

  document.querySelectorAll('.options').forEach(function (og, idx) {
    og.querySelectorAll<HTMLElement>('.option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        og.querySelectorAll('.option').forEach(function (o) {
          o.classList.remove('selected');
        });
        opt.classList.add('selected');
        updateProgress();
        if (advanceTimer) clearTimeout(advanceTimer);
        advanceTimer = setTimeout(function () {
          if (idx < cards.length - 1) {
            goToStep(idx + 1);
          } else {
            calcButton.style.display = 'block';
            calcButton.disabled = false;
            calcButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      });
    });
  });

  function updateProgress(): void {
    let answered = 0;
    for (let i = 1; i <= 10; i++) {
      if (document.querySelector('input[name="q' + i + '"]:checked')) answered++;
    }
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = (answered / 10) * 100 + '%';
  }

  function showScore(): void {
    quizAnswers = getAnswersFromDOM();
    quizTotal = calculateScore(quizAnswers);
    quizBand = getBand(quizTotal);

    const circ = document.getElementById('score-circle');
    if (circ) circ.className = 'score-circle ' + quizBand.cls;
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) scoreDisplay.className = 'score-circle-wrap ' + quizBand.cls;

    const scoreNum = document.getElementById('score-num');
    if (scoreNum) scoreNum.textContent = String(quizTotal);
    const bandLabel = document.getElementById('band-label');
    if (bandLabel) bandLabel.textContent = quizBand.label;
    const bandDesc = document.getElementById('band-desc');
    if (bandDesc) bandDesc.textContent = quizBand.desc;

    // Prelim bullets
    const bulletsContent = document.getElementById('bullets-content');
    if (bulletsContent) {
      bulletsContent.replaceChildren();
      let hasBullets = false;
      quizAnswers.forEach(function (v, idx) {
        if (v <= 1) {
          bulletsContent.appendChild(
            createBullet('bi-warn', '!', QUESTIONS[idx].label + ': ' + QUESTIONS[idx].recos[v].h),
          );
          hasBullets = true;
        } else if (v >= 3) {
          bulletsContent.appendChild(
            createBullet('bi-ok', '\u2713', QUESTIONS[idx].label + ': strong'),
          );
          hasBullets = true;
        }
      });
      if (!hasBullets) {
        bulletsContent.appendChild(
          createBullet(
            'bi-ok',
            '\u2713',
            'No critical gaps identified in your preliminary assessment.',
          ),
        );
      }
    }

    // Hidden fields
    const hScore = document.getElementById('h-score') as HTMLInputElement | null;
    if (hScore) hScore.value = String(quizTotal);
    const hBand = document.getElementById('h-band') as HTMLInputElement | null;
    if (hBand) hBand.value = quizBand.label;
    const hAnswers = document.getElementById('h-answers') as HTMLInputElement | null;
    if (hAnswers)
      hAnswers.value = quizAnswers
        .map(function (v, i) {
          return QUESTIONS[i].label + ': ' + v + '/3';
        })
        .join(', ');

    // Build full report content (shown after download)
    const breakdownContent = document.getElementById('breakdown-content');
    if (breakdownContent) {
      breakdownContent.replaceChildren();
      quizAnswers.forEach(function (v, idx) {
        breakdownContent.appendChild(createBreakdownBar(QUESTIONS[idx].label, v));
      });
    }

    const recosContent = document.getElementById('recos-content');
    if (recosContent) {
      recosContent.replaceChildren();
      quizAnswers.forEach(function (v, idx) {
        const r = QUESTIONS[idx].recos[v];
        const pcls =
          r.p === 'CRITICAL'
            ? 'p-critical'
            : r.p === 'HIGH'
              ? 'p-high'
              : r.p === 'MEDIUM'
                ? 'p-medium'
                : 'p-low';
        recosContent.appendChild(createRecoItem(r.p, pcls, r.h, r.b));
      });
    }

    // Show result
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) quizForm.style.display = 'none';
    const rs = document.getElementById('result-section');
    if (rs) {
      rs.style.display = 'block';
      rs.classList.add('visible');
      rs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function submitGate(e: Event): void {
    e.preventDefault();
    const btn = document.getElementById('gate-submit-btn') as HTMLButtonElement | null;
    const nameInput = document.getElementById('g-name') as HTMLInputElement | null;
    const orgInput = document.getElementById('g-org') as HTMLInputElement | null;
    if (!btn || !nameInput || !orgInput || !quizBand) return;

    const name = nameInput.value;
    const org = orgInput.value;
    btn.disabled = true;
    btn.textContent = 'Generating report\u2026';

    try {
      const form = document.getElementById('gate-form') as HTMLFormElement | null;
      if (form) {
        const data = new FormData(form);
        fetch(ANALYTICS.formspreeUrl, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        })
          .then(function (r) {
            if (!r.ok)
              r.json().then(function (d: Record<string, unknown>) {
                console.warn('Formspree:', d.error || r.status);
              });
          })
          .catch(function (err: unknown) {
            console.warn('Formspree network error:', err);
          });
      }
    } catch {
      /* noop */
    }

    try {
      generatePDF(quizTotal, quizBand ?? getBand(0), quizAnswers, name, org);
      const fullReport = document.getElementById('full-report');
      if (fullReport) fullReport.classList.add('visible');
      const msg = document.getElementById('gate-msg-success');
      if (msg) msg.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
    } catch {
      fallbackHTML(quizTotal, quizBand ?? getBand(0), quizAnswers, name, org);
      const fullReport = document.getElementById('full-report');
      if (fullReport) fullReport.classList.add('visible');
      const msg = document.getElementById('gate-msg-success');
      if (msg) msg.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
    }
  }

  // Bind calculate button
  calcBtn.addEventListener('click', showScore);

  // Bind gate form
  const gateForm = document.getElementById('gate-form');
  if (gateForm) gateForm.addEventListener('submit', submitGate);
}
