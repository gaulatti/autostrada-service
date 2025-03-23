import { Test, TestingModule } from '@nestjs/testing';
import { CwvService } from './cwv.service';

describe('CwvService', () => {
  let service: CwvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CwvService],
    }).compile();

    service = module.get<CwvService>(CwvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
