import { Controller } from '@nestjs/common';
import { ClustersService } from './clusters.service';

@Controller('clusters')
export class ClustersController {
  constructor(private readonly clustersService: ClustersService) {}
}
