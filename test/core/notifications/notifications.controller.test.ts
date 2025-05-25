import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../../../src/core/notifications/notifications.controller';
import { NotificationsService } from '../../../src/core/notifications/notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: { notify: jest.fn() },
        },
      ],
    }).compile();
    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
