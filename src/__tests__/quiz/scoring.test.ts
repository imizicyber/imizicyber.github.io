import { describe, it, expect, beforeEach } from 'vitest';
import { calculateScore, getBand, getAnswersFromDOM } from '@/scripts/quiz/scoring';

describe('quiz scoring', () => {
  describe('calculateScore', () => {
    it('returns 0 for all-zero answers', () => {
      expect(calculateScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(0);
    });

    it('returns 30 for all-max answers', () => {
      expect(calculateScore([3, 3, 3, 3, 3, 3, 3, 3, 3, 3])).toBe(30);
    });

    it('sums mixed answers correctly', () => {
      expect(calculateScore([1, 2, 3, 1, 2, 3, 1, 2, 3, 1])).toBe(19);
    });
  });

  describe('getBand', () => {
    it('returns Critical Risk for score 0', () => {
      expect(getBand(0).label).toBe('Critical Risk');
    });

    it('returns Critical Risk for score 9', () => {
      expect(getBand(9).label).toBe('Critical Risk');
    });

    it('returns High Risk for score 10', () => {
      expect(getBand(10).label).toBe('High Risk');
    });

    it('returns Moderate Risk for score 18', () => {
      expect(getBand(18).label).toBe('Moderate Risk');
    });

    it('returns Low-Moderate Risk for score 24', () => {
      expect(getBand(24).label).toBe('Low-Moderate Risk');
    });

    it('returns Strong Posture for score 29', () => {
      expect(getBand(29).label).toBe('Strong Posture');
    });

    it('returns Strong Posture for score 30', () => {
      expect(getBand(30).label).toBe('Strong Posture');
    });
  });

  describe('getAnswersFromDOM', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('returns zeros when no radio buttons are checked', () => {
      const answers = getAnswersFromDOM();
      expect(answers).toHaveLength(10);
      answers.forEach((a) => expect(a).toBe(0));
    });

    it('reads checked radio button values', () => {
      // Create radio buttons for questions 1-3
      document.body.innerHTML = `
        <input type="radio" name="q1" value="2" checked />
        <input type="radio" name="q2" value="3" checked />
        <input type="radio" name="q3" value="1" checked />
      `;
      const answers = getAnswersFromDOM();
      expect(answers[0]).toBe(2);
      expect(answers[1]).toBe(3);
      expect(answers[2]).toBe(1);
      // Remaining should be 0
      for (let i = 3; i < 10; i++) {
        expect(answers[i]).toBe(0);
      }
    });
  });
});
