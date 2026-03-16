import { BANDS, QUESTIONS } from './data';
import type { ScoreBand } from './data';

export function calculateScore(answers: number[]): number {
  return answers.reduce((sum, val) => sum + val, 0);
}

export function getBand(score: number): ScoreBand {
  const band = BANDS.find((b) => score >= b.min && score <= b.max);
  if (!band) return BANDS[0]; // fallback to Critical Risk
  return band;
}

export function getAnswersFromDOM(): number[] {
  const answers: number[] = [];
  for (let i = 1; i <= QUESTIONS.length; i++) {
    const el = document.querySelector<HTMLInputElement>(`input[name="q${i}"]:checked`);
    answers.push(el ? parseInt(el.value, 10) : 0);
  }
  return answers;
}
