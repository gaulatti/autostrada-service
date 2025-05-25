import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';
import { PerformanceService } from 'src/metrics/performance/performance.service';
import { JSONLogger } from 'src/utils/logger';
import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly performanceService: PerformanceService,
  ) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(UrlsController.name)
  private readonly logger!: JSONLogger;

  @Get()
  @Public()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.urlsService.list(page, pageSize, sort, order);
  }

  /**
   * Retrieves statistical data for urls within a specified date range.
   * COMMENTED OUT: Global stats endpoint removed in favor of performance service global stats
   *
   * @param from - The start date for the statistics query. Defaults to the current date if not provided.
   * @param to - The end date for the statistics query. Defaults to the current date if not provided.
   * @returns A promise resolving to the statistical data for the specified date range.
   */
  // @Get('/stats')
  // @Public()
  // stats(
  //   @Query('from') from: Date = new Date(),
  //   @Query('to') to: Date = new Date(),
  // ) {
  //   return this.urlsService.stats(from, to);
  // }

  /**
   * Retrieves performance statistics for a specific URL within a date range.
   * Optionally filters by platform and/or provider.
   *
   * @param slug - The slug of the URL to get performance statistics for
   * @param from - The start date for the query (ISO timestamp)
   * @param to - The end date for the query (ISO timestamp)
   * @param platform - Optional platform slug to filter by
   * @param provider - Optional provider slug to filter by
   * @returns A promise resolving to the performance statistics for the specified URL and date range
   */
  @Get(':slug/stats')
  @Public()
  async getStats(
    @Param('slug') slug: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('platform') platform?: string,
    @Query('provider') provider?: string,
  ) {
    // Resolve URL by slug
    const url = await this.urlsService.get(slug);
    if (!url) {
      throw new Error(`URL with slug ${slug} not found`);
    }

    // Validate and parse dates
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime())) {
      throw new Error('Invalid "from" date format. Expected ISO timestamp.');
    }

    if (isNaN(toDate.getTime())) {
      throw new Error('Invalid "to" date format. Expected ISO timestamp.');
    }

    if (fromDate > toDate) {
      throw new Error('"from" date must be before "to" date.');
    }

    // Get performance statistics with optional filtering
    return this.performanceService.getStats(
      url.id,
      fromDate,
      toDate,
      platform,
      provider,
    );
  }

  /**
   * Retrieves performance data points for a specific URL within a date range.
   *
   * @param slug - The slug of the URL to get performance data for
   * @param from - The start date for the query (ISO timestamp)
   * @param to - The end date for the query (ISO timestamp)
   * @returns A promise resolving to the performance data points for the specified URL and date range
   */
  @Get(':slug/datapoints')
  @Public()
  async getDataPoints(
    @Param('slug') slug: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    // Resolve URL by slug
    const url = await this.urlsService.get(slug);
    if (!url) {
      throw new Error(`URL with slug ${slug} not found`);
    }

    // Validate and parse dates
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime())) {
      throw new Error('Invalid "from" date format. Expected ISO timestamp.');
    }

    if (isNaN(toDate.getTime())) {
      throw new Error('Invalid "to" date format. Expected ISO timestamp.');
    }

    if (fromDate > toDate) {
      throw new Error('"from" date must be before "to" date.');
    }

    // Get performance data points
    return this.performanceService.getDataPoints(url.id, fromDate, toDate);
  }

  @Get(':slug')
  @Public()
  async find(@Param('slug') slug: string): Promise<{ [key: string]: any }> {
    const url = await this.urlsService.get(slug);
    return url!.toJSON();
  }
}
