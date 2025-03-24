import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { PulsesService } from './pulses.service';

@Controller('pulses')
export class PulsesController {
  constructor(private readonly pulsesService: PulsesService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(PulsesController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.pulsesService.list(page, pageSize, sort, order);
  }
}
