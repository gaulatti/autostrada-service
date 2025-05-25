import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';
import { Url } from 'src/models/url.model';
import { getClusterStability, getPlatformDifferences } from 'src/utils/stats';
import { Op } from 'sequelize';

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
    // Find all clusters with their URLs and performances in the date range
    const clusters = await this.clusterModel.findAll({
      include: [
        {
          model: Url,
          as: 'urls',
          include: [
            {
              association: 'performances',
              where: {
                createdAt: { [Op.between]: [from, to] },
              },
              required: false,
            },
          ],
        },
      ],
    });

    // Flatten all performances and attach cluster info
    const performances: any[] = [];
    for (const cluster of clusters) {
      for (const url of cluster.urls || []) {
        for (const perf of url.performances || []) {
          performances.push({ ...perf.toJSON(), cluster });
        }
      }
    }

    // Compute cluster stability
    const clusterStability = getClusterStability(performances);
    clusterStability.sort((a, b) => a.variation - b.variation);
    const differences = getPlatformDifferences({
      desktop: clusterStability,
      mobile: clusterStability,
    });

    return {
      stability: {
        desktop: clusterStability.slice(0, 3),
        mobile: clusterStability.slice(0, 3),
        differences: differences.slice(0, 3),
      },
    };
  }
}
