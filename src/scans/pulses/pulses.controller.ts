import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Logger } from 'src/decorators/logger.decorator';
import { DeliverRequest, DeliverResponse } from 'src/types/client';
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

  /**
   * Handles the listing of pulses with optional query parameters for pagination, sorting, and filtering.
   *
   * @param page - The page number for pagination. Must be an integer.
   * @param pageSize - The number of items per page for pagination. Must be an integer.
   * @param sort - The field by which to sort the results.
   * @param order - The order of sorting, either 'asc' for ascending or 'desc' for descending.
   * @param from - The start date for filtering results. Defaults to the current date if not provided.
   * @param to - The end date for filtering results. Defaults to the current date if not provided.
   * @returns A list of pulses based on the provided query parameters.
   */
  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ) {
    return this.pulsesService.list(page, pageSize, sort, order, from, to);
  }

  /**
   * Retrieves statistical data for pulses within a specified date range.
   *
   * @param from - The start date for the statistics query. Defaults to the current date if not provided.
   * @param to - The end date for the statistics query. Defaults to the current date if not provided.
   * @returns A promise resolving to the statistical data for the specified date range.
   */
  @Get('/stats')
  async stats(
    @Query('from') from: Date = new Date(),
    @Query('to') to: Date = new Date(),
  ) {
    return this.pulsesService.stats(from, to);
  }

  /**
   * Retrieves a pulse by its slug identifier.
   *
   * @param slug - The unique identifier for the pulse.
   * @returns An object containing the pulse data.
   *
   * @remarks
   * This method currently supports outputs for "mobile" and "desktop" platforms.
   * Future enhancements may include support for multiple outputs per platform type,
   * such as specific outputs for Android or iPhone under the "mobile" category.
   */
  @Get(':slug')
  async get(@Param('slug') slug: string) {
    /**
     * TODO: Support multiple outputs, not just "mobile | desktop".
     *
     * Future-proofing this involves getting multiple outputs per platform type,
     * such as android or iphone for mobile at the same time.
     */
    const pulse = await this.pulsesService.findBySlug(slug);
    return { pulse };
  }

  /**
   * Handles the gRPC method 'Deliver' for the 'ClientService'.
   *
   * @param data - The request data for the deliver operation.
   * @returns A promise that resolves to a DeliverResponse indicating the success of the operation.
   */
  @GrpcMethod('ClientService', 'Deliver')
  deliver(data: DeliverRequest): DeliverResponse {
    void this.pulsesService.deliver(data);
    return { success: true };
  }
}
