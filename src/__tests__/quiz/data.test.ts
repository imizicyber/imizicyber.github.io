import { describe, it, expect } from 'vitest';
import { QUESTIONS, BANDS } from '@/scripts/quiz/data';

describe('quiz data', () => {
  it('has exactly 10 questions', () => {
    expect(QUESTIONS).toHaveLength(10);
  });

  it('every question has a non-empty label', () => {
    QUESTIONS.forEach((q) => {
      expect(q.label.length).toBeGreaterThan(0);
    });
  });

  it('every question has exactly 4 recommendations', () => {
    QUESTIONS.forEach((q) => {
      expect(q.recos).toHaveLength(4);
    });
  });

  it('recommendations have sequential pts 0-3', () => {
    QUESTIONS.forEach((q) => {
      q.recos.forEach((r, i) => {
        expect(r.pts).toBe(i);
      });
    });
  });

  it('has exactly 5 scoring bands', () => {
    expect(BANDS).toHaveLength(5);
  });

  it('bands cover full 0-30 range without gaps', () => {
    expect(BANDS[0].min).toBe(0);
    expect(BANDS[BANDS.length - 1].max).toBe(30);
    for (let i = 1; i < BANDS.length; i++) {
      expect(BANDS[i].min).toBe(BANDS[i - 1].max + 1);
    }
  });

  it('every band has a non-empty label and desc', () => {
    BANDS.forEach((b) => {
      expect(b.label.length).toBeGreaterThan(0);
      expect(b.desc.length).toBeGreaterThan(0);
    });
  });
});
