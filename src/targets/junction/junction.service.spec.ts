import { Test, TestingModule } from '@nestjs/testing';
import { JunctionService } from './junction.service';

describe('JunctionService', () => {
  let service: JunctionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JunctionService],
    }).compile();

    service = module.get<JunctionService>(JunctionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
