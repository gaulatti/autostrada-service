import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
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
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.urlsService.list(page, pageSize, sort, order);
  }

  @Get(':slug')
  async find(
    @Param('slug') slug: string,
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ): Promise<{ [key: string]: any }> {
    const url = await this.urlsService.get(slug);
    const stats = await this.pulsesService.stats(from, to, { url_id: url!.id });
    return { ...url, stats };
  }

  @Get(':slug/pulses')
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
}
