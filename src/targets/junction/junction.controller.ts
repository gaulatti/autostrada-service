import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { JunctionService } from './junction.service';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';

@Controller('junction')
export class JunctionController {
  constructor(private readonly junctionService: JunctionService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(JunctionController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.junctionService.list(page, pageSize, sort, order);
  }
}
