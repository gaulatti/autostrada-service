import { Test, TestingModule } from '@nestjs/testing';
import { JunctionController } from './junction.controller';

describe('JunctionController', () => {
  let controller: JunctionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JunctionController],
    }).compile();

    controller = module.get<JunctionController>(JunctionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
