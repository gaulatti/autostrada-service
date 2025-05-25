import { Readable } from 'stream';
import { streamToString } from '../../src/utils/s3';

describe('streamToString', () => {
  it('converts a readable stream to a string', async () => {
    const readable = Readable.from([
      Buffer.from('hello '),
      Buffer.from('world'),
    ]);
    const result = await streamToString(readable);
    expect(result).toBe('hello world');
  });
});
