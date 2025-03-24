import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';

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
}
