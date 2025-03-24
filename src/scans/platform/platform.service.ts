import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Platform } from 'src/models/platform.model';

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel(Platform) private readonly platformModel: typeof Platform,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.platformModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
