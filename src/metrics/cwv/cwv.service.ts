import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';

@Injectable()
export class CwvService {
  constructor(
    @InjectModel(CoreWebVitals) private readonly cwvModel: typeof CoreWebVitals,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.cwvModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
