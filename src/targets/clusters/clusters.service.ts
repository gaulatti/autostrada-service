import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cluster } from 'src/models/cluster.model';

@Injectable()
export class ClustersService {
  constructor(
    @InjectModel(Cluster) private readonly clusterModel: typeof Cluster,
  ) {}
}
