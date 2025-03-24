import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { HeartbeatsService } from './heartbeats.service';

@Controller('heartbeats')
export class HeartbeatsController {
  constructor(private readonly heartbeatsService: HeartbeatsService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(HeartbeatsController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.heartbeatsService.list(page, pageSize, sort, order);
  }
}
