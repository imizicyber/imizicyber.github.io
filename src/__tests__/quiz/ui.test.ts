import { describe, it, expect } from 'vitest';
import { createBullet, createBreakdownBar, createRecoItem } from '@/scripts/quiz/ui';

describe('quiz ui helpers', () => {
  describe('createBullet', () => {
    it('creates a div with class "bullet"', () => {
      const el = createBullet('bi-warn', '!', 'Test label');
      expect(el.tagName).toBe('DIV');
      expect(el.className).toBe('bullet');
    });

    it('creates icon span with correct class and text', () => {
      const el = createBullet('bi-warn', '!', 'Test label');
      const icon = el.querySelector('.bullet-icon') as HTMLElement;
      expect(icon).not.toBeNull();
      expect(icon.className).toBe('bullet-icon bi-warn');
      expect(icon.textContent).toBe('!');
    });

    it('creates label span with correct text', () => {
      const el = createBullet('bi-ok', '\u2713', 'Strong posture');
      const spans = el.querySelectorAll('span');
      expect(spans).toHaveLength(2);
      expect(spans[1].textContent).toBe('Strong posture');
    });

    it('handles ok icon class', () => {
      const el = createBullet('bi-ok', '\u2713', 'No gaps');
      const icon = el.querySelector('.bullet-icon') as HTMLElement;
      expect(icon.className).toBe('bullet-icon bi-ok');
      expect(icon.textContent).toBe('\u2713');
    });
  });

  describe('createBreakdownBar', () => {
    it('creates a wrapper div with header and track', () => {
      const el = createBreakdownBar('Penetration Testing', 2);
      expect(el.tagName).toBe('DIV');
      expect(el.children).toHaveLength(2); // header + track
    });

    it('displays the label text', () => {
      const el = createBreakdownBar('Penetration Testing', 2);
      const labelSpan = el.querySelector('span') as HTMLElement;
      expect(labelSpan.textContent).toBe('Penetration Testing');
    });

    it('displays the score as N/3', () => {
      const el = createBreakdownBar('Access Management', 3);
      const spans = el.querySelectorAll('span');
      expect(spans[1].textContent).toBe('3/3');
    });

    it('calculates correct fill width percentage', () => {
      const el = createBreakdownBar('Testing', 2);
      const fill = el.querySelector('div > div > div') as HTMLElement;
      // 2/3 = 66.67 -> Math.round = 67
      expect(fill.style.width).toBe('67%');
    });

    it('sets 0% width for score 0', () => {
      const el = createBreakdownBar('Testing', 0);
      const fill = el.querySelector('div > div > div') as HTMLElement;
      expect(fill.style.width).toBe('0%');
    });

    it('sets 100% width for score 3', () => {
      const el = createBreakdownBar('Testing', 3);
      const fill = el.querySelector('div > div > div') as HTMLElement;
      expect(fill.style.width).toBe('100%');
    });
  });

  describe('createRecoItem', () => {
    it('creates a div with class "reco-item"', () => {
      const el = createRecoItem('CRITICAL', 'p-critical', 'Do something', 'Details here');
      expect(el.tagName).toBe('DIV');
      expect(el.className).toBe('reco-item');
    });

    it('creates priority span with correct class and text', () => {
      const el = createRecoItem('HIGH', 'p-high', 'Enable MFA', 'MFA is important');
      const prioritySpan = el.querySelector('.reco-priority') as HTMLElement;
      expect(prioritySpan).not.toBeNull();
      expect(prioritySpan.className).toBe('reco-priority p-high');
      expect(prioritySpan.textContent).toBe('HIGH');
    });

    it('creates reco-text div with heading and body', () => {
      const el = createRecoItem('MEDIUM', 'p-medium', 'Add testing', 'Testing is good');
      const textDiv = el.querySelector('.reco-text') as HTMLElement;
      expect(textDiv).not.toBeNull();
      const strong = textDiv.querySelector('strong') as HTMLElement;
      expect(strong.textContent).toBe('Add testing');
      expect(textDiv.textContent).toContain('Testing is good');
    });

    it('works with LOW priority', () => {
      const el = createRecoItem('LOW', 'p-low', 'Maintain', 'Keep going');
      const prioritySpan = el.querySelector('.reco-priority') as HTMLElement;
      expect(prioritySpan.className).toBe('reco-priority p-low');
    });
  });
});
