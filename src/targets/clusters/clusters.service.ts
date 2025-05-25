import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';
import { Url } from 'src/models/url.model';

@Injectable()
export class ClustersService {
  constructor(
    @InjectModel(Cluster) private readonly clusterModel: typeof Cluster,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.clusterModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Retrieves a Cluster record based on the provided slug.
   *
   * @param slug - The unique identifier for the Cluster to retrieve.
   * @returns A promise that resolves to the Cluster record if found, or `null` if no record matches the slug.
   */
  async get(slug: string) {
    return this.clusterModel.findOne({ where: { slug }, include: [Url] });
  }

  /**
   * Retrieves statistical data for clusters within a specified date range.
   *
   * @param from - The start date of the range to filter performance records.
   * @param to - The end date of the range to filter performance records.
   * @returns An object containing empty statistical data (placeholder).
   */
  async stats(from: Date, to: Date): Promise<any> {
    // TODO: Implement stats functionality using performance records directly
    // For now, return empty placeholder data
    console.log(
      `Stats requested for range: ${from.toISOString()} to ${to.toISOString()}`,
    );

    return Promise.resolve({
      stability: {
        mobile: [],
        desktop: [],
        differences: [],
      },
    });
  }
}
