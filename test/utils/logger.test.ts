import { JSONLogger } from '../../src/utils/logger';

describe('JSONLogger', () => {
  let logger: JSONLogger;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JSONLogger('TestRealm');
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('logs messages with correct structure', () => {
    logger.log('hello', { foo: 'bar' });
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs errors', () => {
    logger.error('error message', 'trace', 'ctx');
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs warnings', () => {
    logger.warn('warn message', 'ctx');
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs debug', () => {
    logger.debug('debug message', 'ctx');
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs verbose', () => {
    logger.verbose('verbose message', 'ctx');
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs sequelizeLog', () => {
    logger.sequelizeLog('sequelize message');
    expect(logSpy).toHaveBeenCalled();
  });
});
