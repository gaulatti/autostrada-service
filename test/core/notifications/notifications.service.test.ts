import { NotificationsService } from '../../../src/core/notifications/notifications.service';
import { MessageEvent } from '@nestjs/common';
import { take } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let loggerMock: { log: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    service = new NotificationsService();
    loggerMock = { log: jest.fn(), error: jest.fn() };
    Object.defineProperty(service, 'logger', {
      get: () => loggerMock,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('connect() should add a client and log connection', () => {
    const observable = service.connect();
    expect(typeof observable.subscribe).toBe('function');
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('Client connected:'),
    );
  });

  it('sendMessageToClient() should send message if client exists', (done) => {
    const observable = service.connect();
    const clientId = Object.keys((service as any).clients)[0];
    observable.pipe(take(1)).subscribe((msg: MessageEvent) => {
      expect(msg.data).toBe('hello');
      done();
    });
    service.sendMessageToClient(clientId, 'hello');
  });

  it('sendMessageToClient() should log error if client does not exist', () => {
    service.sendMessageToClient('nonexistent', 'fail');
    expect(loggerMock.error).toHaveBeenCalledWith(
      'Client nonexistent not found',
    );
  });

  it('disconnect() should remove client and log', () => {
    service.connect();
    const clientId = Object.keys((service as any).clients)[0];
    service.disconnect(clientId);
    expect((service as any).clients[clientId]).toBeUndefined();
    expect(loggerMock.log).toHaveBeenCalledWith(
      'Client Disconnected',
      clientId,
    );
  });

  it('disconnect() should log if client does not exist', () => {
    service.disconnect('fake');
    expect(loggerMock.log).toHaveBeenCalledWith(
      'Client Not Found for Disconnection',
      'fake',
    );
  });

  it('broadcast() should emit to all subscribers', (done) => {
    const observable = service.connect();
    observable.pipe(take(1)).subscribe((msg: MessageEvent) => {
      // msg.data can be string or object, handle both
      const data =
        typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
      expect(data).toEqual({ foo: 'bar' });
      done();
    });
    service.broadcast({ foo: 'bar' });
  });
});
