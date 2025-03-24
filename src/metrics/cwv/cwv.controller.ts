import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CwvService } from './cwv.service';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';

@Controller('cwv')
export class CwvController {
  constructor(private readonly cwvService: CwvService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(CwvController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.cwvService.list(page, pageSize, sort, order);
  }
}
