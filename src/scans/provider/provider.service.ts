import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Provider } from 'src/models/provider.model';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider) private readonly providerModel: typeof Provider,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.providerModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }
}
