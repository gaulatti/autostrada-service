import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { ClustersService } from './clusters.service';
import { Public } from 'src/decorators/public.decorator';

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

  /**
   * Retrieves statistical data for urls within a specified date range.
   *
   * @param from - The start date for the statistics query. Defaults to the current date if not provided.
   * @param to - The end date for the statistics query. Defaults to the current date if not provided.
   * @returns A promise resolving to the statistical data for the specified date range.
   */
  @Get('/stats')
  @Public()
  stats(
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ): Promise<any> {
    return this.clustersService.stats(from, to);
  }
}
