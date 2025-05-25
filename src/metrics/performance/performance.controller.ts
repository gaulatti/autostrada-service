import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';
import { JSONLogger } from 'src/utils/logger';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(PerformanceController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.performanceService.list(page, pageSize, sort, order);
  }

  /**
   * Creates a new performance record.
   *
   * @param data - The performance data containing URL slug, platform slug, provider slug, optional createdAt, and raw metrics
   * @returns A response with 201 Created status and the new performance record's ID in the response body
   */
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    data: {
      url_slug: string;
      platform_slug: string;
      provider_slug: string;
      createdAt?: Date;
      metrics: {
        ttfb?: number;
        fcp?: number;
        dcl?: number;
        lcp?: number;
        tti?: number;
        si?: number;
        cls?: string;
        tbt?: number;
      };
    },
  ) {
    try {
      const performance = await this.performanceService.createPerformanceRecord(
        data.url_slug,
        data.platform_slug,
        data.provider_slug,
        data.createdAt,
        data.metrics,
      );

      // Return the performance record ID
      return {
        id: performance.id,
      };
    } catch (error) {
      this.logger.error('Error creating performance record:', error);
      throw error;
    }
  }

  /**
   * Retrieves performance statistics across all URLs within a date range.
   * Optionally filters by platform and/or provider.
   *
   * @param from - The start date for the query (ISO timestamp)
   * @param to - The end date for the query (ISO timestamp)
   * @param platform - Optional platform slug to filter by
   * @param provider - Optional provider slug to filter by
   * @returns A promise resolving to the performance statistics for the specified date range
   */
  @Get('stats')
  @Public()
  async getStats(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('platform') platform?: string,
    @Query('provider') provider?: string,
  ) {
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

    // Get performance statistics across all URLs with optional filtering
    return this.performanceService.getStats(
      undefined,
      fromDate,
      toDate,
      platform,
      provider,
    );
  }
}
