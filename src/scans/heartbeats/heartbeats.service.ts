import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Heartbeat } from 'src/models/heartbeat.model';

@Injectable()
export class HeartbeatsService {
  constructor(
    @InjectModel(Heartbeat) private readonly heartbeatModel: typeof Heartbeat,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.heartbeatModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
