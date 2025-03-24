import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Platform } from 'src/models/platform.model';

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel(Platform) private readonly platformModel: typeof Platform,
  ) {}
}
