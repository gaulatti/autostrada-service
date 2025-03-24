import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(ProviderController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.providerService.list(page, pageSize, sort, order);
  }
}
