import { nanoid } from '../../src/utils/nanoid';

describe('nanoid', () => {
  it('returns a string of length 21', () => {
    const id = nanoid();
    expect(typeof id).toBe('string');
    expect(id).toHaveLength(21);
  });

  it('uses only allowed characters', () => {
    const id = nanoid();
    expect(id).toMatch(/^[A-Za-z0-9]{21}$/);
  });
});
