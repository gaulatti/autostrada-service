import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(GradesController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.gradesService.list(page, pageSize, sort, order);
  }
}
