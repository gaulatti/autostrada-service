import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pulse } from 'src/models/pulse.model';

@Injectable()
export class PulsesService {
  constructor(@InjectModel(Pulse) private readonly pulseModel: typeof Pulse) {}
}
