import { BackupService } from '../../../src/dal/backup/backup.service';

describe('BackupService', () => {
  it('should be defined', () => {
    expect(new BackupService()).toBeDefined();
  });
});
