import { getHostAndPort } from '../../src/utils/network';

describe('network utils', () => {
  describe('getHostAndPort', () => {
    it('parses hostname and port from URL', () => {
      expect(getHostAndPort('http://localhost:1234')).toEqual({
        hostname: 'localhost',
        port: 1234,
      });
    });
    it('throws on invalid URL', () => {
      expect(() => getHostAndPort('not-a-url')).toThrow();
    });
  });
});
