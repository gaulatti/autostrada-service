import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';
import { PulsesService } from 'src/scans/pulses/pulses.service';
import { JSONLogger } from 'src/utils/logger';
import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly pulsesService: PulsesService,
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

  @Get(':slug')
  @Public()
  async find(
    @Param('slug') slug: string,
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ): Promise<{ [key: string]: any }> {
    const url = await this.urlsService.get(slug);
    const stats = await this.pulsesService.stats(from, to, { url_id: url!.id });
    return { ...url!.toJSON(), stats };
  }

  @Get(':slug/pulses')
  @Public()
  async pulses(
    @Param('slug') slug: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ) {
    const url = await this.urlsService.get(slug);
    return await this.pulsesService.list(
      page,
      pageSize,
      sort,
      order,
      from,
      to,
      {
        url_id: url!.id,
      },
    );
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
  ) {
    return this.urlsService.stats(from, to);
  }
}
