import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url) private readonly urlModel: typeof Url) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.urlModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
