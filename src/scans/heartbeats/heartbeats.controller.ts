import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { Public } from 'src/decorators/public.decorator';
import { JSONLogger } from 'src/utils/logger';
import { streamToString } from 'src/utils/s3';
import { Readable } from 'stream';
import { HeartbeatsService } from './heartbeats.service';

/**
 * The AWS S3 client.
 */
const s3Client = new S3Client();

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

  @Get(':slug')
  @Public()
  async get(@Param('slug') slug: string) {
    const heartbeat = await this.heartbeatsService.get(slug);
    const date = new Date(heartbeat!.createdAt);
    const output = { ...heartbeat!.toJSON() };

    /**
     * Get report from S3
     */
    try {
      const path = `scans/${date.getUTCFullYear()}/${date.getMonth() + 1}/${slug}.min.json`;
      const s3Response = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.ASSETS_BUCKET_NAME,
          Key: path,
        }),
      );

      /**
       * Deliver the report
       */
      const report = JSON.parse(
        await streamToString(s3Response.Body as Readable),
      );

      output['report'] = report;
    } catch (e) {
      this.logger.error(e);
    }

    return output;
  }
}
