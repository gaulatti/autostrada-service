import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Heartbeat } from 'src/models/heartbeat.model';

@Injectable()
export class HeartbeatsService {
  constructor(
    @InjectModel(Heartbeat) private readonly heartbeatModel: typeof Heartbeat,
  ) {}
}
