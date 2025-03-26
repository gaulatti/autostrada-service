import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
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

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.pulsesService.list(page, pageSize, sort, order);
  }

  /**
   * Handles the gRPC method 'Deliver' for the 'ClientService'.
   *
   * @param data - The request data for the deliver operation.
   * @returns A promise that resolves to a DeliverResponse indicating the success of the operation.
   */
  @GrpcMethod('ClientService', 'Deliver')
  deliver(data: DeliverRequest): DeliverResponse {
    console.log({ data });
    return { success: true };
  }
}
