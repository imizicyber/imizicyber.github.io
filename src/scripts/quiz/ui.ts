import { QUESTIONS } from './data';
import type { ScoreBand } from './data';
import { calculateScore, getBand, getAnswersFromDOM } from './scoring';
import { loadJsPDF, generatePDF, fallbackHTML } from './pdf';
import { ANALYTICS } from '@/data/site';

let quizAnswers: number[] = [];
let quizTotal = 0;
let quizBand: ScoreBand | null = null;

export function initQuiz(): void {
  const cards = document.querySelectorAll<HTMLElement>('.quiz-card');
  const calcBtn = document.getElementById('calc-btn') as HTMLButtonElement | null;
  let currentStep = 0;
  let advanceTimer: ReturnType<typeof setTimeout> | null = null;

  if (!cards.length || !calcBtn) return;

  cards[0].classList.add('active');
  calcBtn.style.display = 'none';

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
      goToStep(parseInt(b.getAttribute('data-step')!, 10) - 1);
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
        og.querySelectorAll('.option').forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        updateProgress();
        if (advanceTimer) clearTimeout(advanceTimer);
        advanceTimer = setTimeout(function () {
          if (idx < cards.length - 1) {
            goToStep(idx + 1);
          } else {
            calcBtn!.style.display = 'block';
            calcBtn!.disabled = false;
            calcBtn!.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    if (progress) progress.style.width = (answered / 10 * 100) + '%';
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
    let bulletsHtml = '';
    quizAnswers.forEach(function (v, idx) {
      if (v <= 1) {
        bulletsHtml += '<div class="bullet"><span class="bullet-icon bi-warn">!</span><span>' + QUESTIONS[idx].label + ': ' + QUESTIONS[idx].recos[v].h + '</span></div>';
      } else if (v >= 3) {
        bulletsHtml += '<div class="bullet"><span class="bullet-icon bi-ok">&#10003;</span><span>' + QUESTIONS[idx].label + ': strong</span></div>';
      }
    });
    const bulletsContent = document.getElementById('bullets-content');
    if (bulletsContent) {
      bulletsContent.innerHTML = bulletsHtml || '<div class="bullet"><span class="bullet-icon bi-ok">&#10003;</span><span>No critical gaps identified in your preliminary assessment.</span></div>';
    }

    // Hidden fields
    const hScore = document.getElementById('h-score') as HTMLInputElement | null;
    if (hScore) hScore.value = String(quizTotal);
    const hBand = document.getElementById('h-band') as HTMLInputElement | null;
    if (hBand) hBand.value = quizBand.label;
    const hAnswers = document.getElementById('h-answers') as HTMLInputElement | null;
    if (hAnswers) hAnswers.value = quizAnswers.map(function (v, i) { return QUESTIONS[i].label + ': ' + v + '/3'; }).join(', ');

    // Build full report content (shown after download)
    let breakdownHtml = '';
    quizAnswers.forEach(function (v, idx) {
      const pct = Math.round(v / 3 * 100);
      breakdownHtml += '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:.84rem;color:var(--white);font-weight:600">' + QUESTIONS[idx].label + '</span><span style="font-family:var(--mono);font-size:.72rem;color:var(--txt3)">' + v + '/3</span></div><div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--acc2),var(--acc));border-radius:3px"></div></div></div>';
    });
    const breakdownContent = document.getElementById('breakdown-content');
    if (breakdownContent) breakdownContent.innerHTML = breakdownHtml;

    let recosHtml = '';
    quizAnswers.forEach(function (v, idx) {
      const r = QUESTIONS[idx].recos[v];
      const pcls = r.p === 'CRITICAL' ? 'p-critical' : r.p === 'HIGH' ? 'p-high' : r.p === 'MEDIUM' ? 'p-medium' : 'p-low';
      recosHtml += '<div class="reco-item"><span class="reco-priority ' + pcls + '">' + r.p + '</span><div class="reco-text"><strong>' + r.h + '</strong>' + r.b + '</div></div>';
    });
    const recosContent = document.getElementById('recos-content');
    if (recosContent) recosContent.innerHTML = recosHtml;

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
        }).then(function (r) {
          if (!r.ok) r.json().then(function (d: Record<string, unknown>) { console.warn('Formspree:', d.error || r.status); });
        }).catch(function (err: unknown) { console.warn('Formspree network error:', err); });
      }
    } catch { /* noop */ }

    loadJsPDF().then(function () {
      generatePDF(quizTotal, quizBand!, quizAnswers, name, org);
      const fullReport = document.getElementById('full-report');
      if (fullReport) fullReport.classList.add('visible');
      const msg = document.getElementById('gate-msg-success');
      if (msg) msg.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
    }).catch(function () {
      fallbackHTML(quizTotal, quizBand!, quizAnswers, name, org);
      const fullReport = document.getElementById('full-report');
      if (fullReport) fullReport.classList.add('visible');
      const msg = document.getElementById('gate-msg-success');
      if (msg) msg.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
    });
  }

  // Bind calculate button
  calcBtn.addEventListener('click', showScore);

  // Bind gate form
  const gateForm = document.getElementById('gate-form');
  if (gateForm) gateForm.addEventListener('submit', submitGate);
}
