import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';
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
  @Public()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.clustersService.list(page, pageSize, sort, order);
  }

  /**
   * Retrieves a cluster by its slug and fetches statistical data for its associated URLs
   * within a specified date range.
   *
   * @param slug - The unique identifier for the cluster.
   * @param from - The start date for the statistics query. Defaults to the current date.
   * @param to - The end date for the statistics query. Defaults to the current date.
   * @returns A promise that resolves to an object containing the cluster data and its associated statistics.
   *
   * @throws Will throw an error if the cluster cannot be retrieved or if there is an issue fetching statistics.
   */
  @Get(':slug')
  @Public()
  async find(@Param('slug') slug: string): Promise<{ [key: string]: any }> {
    const cluster = await this.clustersService.get(slug);
    return cluster!.toJSON();
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
