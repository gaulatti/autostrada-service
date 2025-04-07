import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Cluster } from 'src/models/cluster.model';
import { Grade } from 'src/models/grade.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Platform } from 'src/models/platform.model';
import { Pulse } from 'src/models/pulse.model';
import { Url } from 'src/models/url.model';
import {
  getClusterStability,
  getPlatformDifferences,
  minDatapointsFilter,
  StabilityObject,
} from 'src/utils/stats';

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
   * This method fetches clusters along with their associated URLs, pulses, heartbeats,
   * and grades, filtered by the `createdAt` timestamp of the heartbeats. It then calculates
   * the stability of clusters for both desktop and mobile platforms, sorts the results
   * by average stability in descending order, and returns the top 10 results for each platform.
   *
   * Additionally, it computes the differences between platforms and includes the top 10
   * differences in the response.
   *
   * @param from - The start date of the range to filter heartbeats.
   * @param to - The end date of the range to filter heartbeats.
   * @returns An object containing the top 10 stability results for mobile and desktop platforms,
   *          as well as the top 10 platform differences.
   */
  async stats(from: Date, to: Date) {
    const clusters = await this.clusterModel.findAll({
      order: [['id', 'desc']],
      include: [
        {
          model: Url,
          include: [
            {
              model: Pulse,
              include: [
                {
                  model: Heartbeat,
                  where: {
                    createdAt: {
                      [Op.between]: [from, to],
                    },
                  },
                  include: [Grade, Platform],
                },
              ],
            },
          ],
        },
      ],
    });

    const stability: StabilityObject = minDatapointsFilter({
      desktop: getClusterStability(clusters, 'desktop'),
      mobile: getClusterStability(clusters, 'mobile'),
    });

    stability.desktop.sort((a, b) => b.average! - a.average!);
    stability.mobile.sort((a, b) => b.average! - a.average!);

    return {
      stability: {
        mobile: stability.mobile.slice(0, 3),
        desktop: stability.desktop.slice(0, 3),
        differences: getPlatformDifferences(stability).slice(0, 3),
      },
    };
  }
}
