import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Junction } from 'src/models/junction.model';

@Injectable()
export class JunctionService {
  constructor(
    @InjectModel(Junction) private readonly junctionModel: typeof Junction,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.junctionModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
