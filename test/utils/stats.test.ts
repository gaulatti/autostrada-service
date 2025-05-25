import { calculatePercentileStats } from '../../src/utils/stats';

describe('calculatePercentileStats', () => {
  it('returns zeros for empty array', () => {
    expect(calculatePercentileStats([])).toEqual({
      min: 0,
      p50: 0,
      avg: 0,
      p75: 0,
      p90: 0,
      p99: 0,
      max: 0,
    });
  });

  it('calculates correct stats for a single value', () => {
    expect(calculatePercentileStats([42])).toEqual({
      min: 42,
      p50: 42,
      avg: 42,
      p75: 42,
      p90: 42,
      p99: 42,
      max: 42,
    });
  });

  it('calculates correct stats for multiple values', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(calculatePercentileStats(arr)).toEqual({
      min: 1,
      p50: 5,
      avg: 5.5,
      p75: 8,
      p90: 9,
      p99: 10,
      max: 10,
    });
  });

  it('handles unsorted input', () => {
    const arr = [10, 1, 5, 3];
    const stats = calculatePercentileStats(arr);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(10);
    expect(stats.avg).toBeCloseTo(4.75, 2);
  });
});
