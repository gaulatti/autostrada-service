import { Test, TestingModule } from '@nestjs/testing';
import { CwvController } from './cwv.controller';

describe('CwvController', () => {
  let controller: CwvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CwvController],
    }).compile();

    controller = module.get<CwvController>(CwvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
