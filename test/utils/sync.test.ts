import { fetchDatabaseCredentials } from '../../src/utils/sync';

describe('fetchDatabaseCredentials', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns credentials from env vars', async () => {
    process.env.DB_USERNAME = 'user';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_HOST = 'host';
    const creds = await fetchDatabaseCredentials();
    expect(creds).toEqual({ username: 'user', password: 'pass', host: 'host' });
  });

  it('throws if no credentials are provided', async () => {
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_HOST;
    delete process.env.DB_CREDENTIALS;
    await expect(fetchDatabaseCredentials()).rejects.toThrow('Database credentials are not provided.');
  });
});
