import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pulse } from 'src/models/pulse.model';

@Injectable()
export class PulsesService {
  constructor(@InjectModel(Pulse) private readonly pulseModel: typeof Pulse) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.pulseModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
