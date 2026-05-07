// Sanity tests - verify package loads

import * as ViralFlow from '../src/index';
import * as Types from '../src/types';
import * as Utils from '../src/utils';

describe('Package Loading', () => {
  test('main export is defined', () => {
    expect(ViralFlow).toBeDefined();
  });

  test('types are exported', () => {
    expect(Types).toBeDefined();
  });

  test('utils are exported', () => {
    expect(Utils).toBeDefined();
  });
});

describe('Utility Functions', () => {
  test('generateId creates unique IDs', () => {
    const id1 = Utils.generateId('topic');
    const id2 = Utils.generateId('topic');
    expect(id1).toMatch(/^topic-[a-f0-9]{16}$/);
    expect(id2).toMatch(/^topic-[a-f0-9]{16}$/);
    expect(id1).not.toEqual(id2);
  });

  test('getCurrentTimestamp returns ISO string', () => {
    const ts = Utils.getCurrentTimestamp();
    expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test('calculateEngagementRate computes correctly', () => {
    const rate = Utils.calculateEngagementRate(100, 50, 25, 10000);
    expect(rate).toBeCloseTo(0.0175, 4);
  });

  test('scorePerformance returns 0-100', () => {
    const score = Utils.scorePerformance({
      views: 5000,
      engagement_rate: 0.05,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
