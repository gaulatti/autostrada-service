import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthorizationService } from 'src/authorization/authorization.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: AuthorizationService, useValue: {} }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should call kickoff on AppService with user context', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    const kickoffResult = { id: 1, name: 'Test User', enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with undefined user', async () => {
    const kickoffResult = { enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(undefined);
    expect(appService.kickoff).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(kickoffResult);
  });

  it('should propagate errors from AppService.kickoff', async () => {
    const error = new Error('kickoff failed');
    const appService = {
      kickoff: jest.fn().mockRejectedValue(error),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toThrow(
      'kickoff failed',
    );
  });

  it('should call kickoff on AppService with a complex user object', async () => {
    const mockUser = {
      id: 2,
      name: 'Complex User',
      roles: ['admin', 'user'],
      meta: { active: true },
    };
    const kickoffResult = {
      id: 2,
      name: 'Complex User',
      roles: ['admin', 'user'],
      meta: { active: true },
      enums: [],
    };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with null user', async () => {
    const kickoffResult = { enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(null);
    expect(appService.kickoff).toHaveBeenCalledWith(null);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with empty object user', async () => {
    const kickoffResult = { enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff({});
    expect(appService.kickoff).toHaveBeenCalledWith({});
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with undefined and handle rejection', async () => {
    const error = new Error('undefined user not allowed');
    const appService = {
      kickoff: jest.fn().mockRejectedValue(error),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toThrow(
      'undefined user not allowed',
    );
  });

  it('should call kickoff on AppService and handle thrown non-Error', async () => {
    const appService = {
      kickoff: jest.fn().mockRejectedValue('some string error'),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toBe(
      'some string error',
    );
  });

  it('should call kickoff on AppService with a user missing expected fields', async () => {
    const mockUser = { foo: 'bar' };
    const kickoffResult = { foo: 'bar', enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with a user containing nested objects', async () => {
    const mockUser = {
      id: 3,
      profile: { name: 'Nested', details: { age: 30 } },
    };
    const kickoffResult = {
      id: 3,
      profile: { name: 'Nested', details: { age: 30 } },
      enums: [],
    };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with a user containing special values', async () => {
    const mockUser = {
      id: 6,
      value: NaN,
      flag: undefined,
      empty: null,
    };
    const kickoffResult = {
      id: 6,
      value: NaN,
      flag: undefined,
      empty: null,
      enums: [],
    };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with a user containing a date', async () => {
    const now = new Date();
    const mockUser = { id: 7, created: now };
    const kickoffResult = { id: 7, created: now, enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService with a user containing a function property', async () => {
    const fn = () => 42;
    const mockUser = { id: 8, fn };
    const kickoffResult = { id: 8, fn, enums: [] };
    const appService = {
      kickoff: jest.fn().mockResolvedValue(kickoffResult),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    const result = await controller.kickoff(mockUser);
    expect(appService.kickoff).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(kickoffResult);
  });

  it('should call kickoff on AppService and handle thrown number error', async () => {
    const appService = {
      kickoff: jest.fn().mockRejectedValue(12345),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toBe(12345);
  });

  it('should call kickoff on AppService and handle thrown boolean error', async () => {
    const appService = {
      kickoff: jest.fn().mockRejectedValue(false),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toBe(false);
  });

  it('should call kickoff on AppService and handle thrown object error', async () => {
    const errorObj = { message: 'object error', code: 500 };
    const appService = {
      kickoff: jest.fn().mockRejectedValue(errorObj),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: AuthorizationService, useValue: {} },
      ],
    }).compile();
    const controller = app.get<AppController>(AppController);
    await expect(controller.kickoff(undefined)).rejects.toBe(errorObj);
  });

  // No additional controller methods to test; all logic is delegated to AppService.kickoff
});
