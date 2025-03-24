import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { ClustersService } from './clusters.service';

@Controller('clusters')
export class ClustersController {
  constructor(private readonly clustersService: ClustersService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(ClustersController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.clustersService.list(page, pageSize, sort, order);
  }
}
