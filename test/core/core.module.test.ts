import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from 'src/core/core.module';

describe('CoreModule', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();
    expect(module).toBeDefined();
  });
});
