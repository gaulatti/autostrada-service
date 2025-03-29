import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';
import { Grade } from 'src/models/grade.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Platform } from 'src/models/platform.model';
import { Provider } from 'src/models/provider.model';
import { Pulse } from 'src/models/pulse.model';
import { Url } from 'src/models/url.model';
import { UrlsService } from 'src/targets/urls/urls.service';
import { DeliverRequest } from 'src/types/client';
import { nanoid } from 'src/utils/nanoid';
import { HeartbeatsService } from '../heartbeats/heartbeats.service';

@Injectable()
export class PulsesService {
  constructor(
    @InjectModel(Pulse) private readonly pulseModel: typeof Pulse,
    private readonly heartbeatsService: HeartbeatsService,
    private readonly urlService: UrlsService,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.pulseModel.findAndCountAll({
      include: [Url],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Processes the delivery of data by extracting relevant information from the payload,
   * creating a pulse record, and generating heartbeats with associated metrics.
   *
   * @param data - The delivery request containing the payload with necessary information.
   *
   * @remarks
   * - The payload is expected to be a JSON string containing `dataValues`, `context`, and `sequence`.
   * - The `sequence` is searched for an item named 'AutostradaProcess' to extract mobile and desktop files.
   * - A URL record is fetched using the `urlService` based on the provided URL.
   * - A new pulse record is created in the database using the `pulseModel`.
   * - Heartbeats are asynchronously created for both mobile and desktop metrics using the `heartbeatsService`.
   *
   * @throws Will throw an error if the payload is invalid or if required data is missing.
   */
  async deliver(data: DeliverRequest) {
    const {
      dataValues: { slug },
      context: {
        metadata: { url },
        sequence,
      },
    } = JSON.parse(data.payload);

    /**
     * URL
     */
    const urlRecord = await this.urlService.getByFQDN(url);

    /**
     * Pulse
     */
    const pulse = await this.pulseModel.create({
      url_id: urlRecord.id,
      slug: nanoid(),
      playlist_slug: slug,
    });

    /**
     * Create heartbeats with metrics.
     */

    const slot = sequence.find(
      (item: { name: string }) => item.name === 'AutostradaProcess',
    );
    if (slot) {
      slot.output.forEach(
        (item) => void this.heartbeatsService.create(pulse, item),
      );
    }
  }

  async findBySlug(slug: string) {
    return this.pulseModel.findOne({
      where: { slug },
      include: [
        Url,
        {
          model: Heartbeat,
          include: [Platform, Provider, CoreWebVitals, Grade],
        },
      ],
    });
  }
}
