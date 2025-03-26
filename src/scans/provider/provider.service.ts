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

  /**
   * Retrieves a provider record based on the given slug.
   *
   * @param slug - The unique identifier (slug) of the provider to retrieve.
   * @returns A promise that resolves to the provider record if found, or `null` if no matching record exists.
   */
  async getBySlug(slug: string) {
    return this.providerModel.findOne({ where: { slug } });
  }
}
