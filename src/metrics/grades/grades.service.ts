import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade } from 'src/models/grade.model';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade) private readonly gradeModel: typeof Grade) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.gradeModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
