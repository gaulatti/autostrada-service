import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';
import { Grade } from 'src/models/grade.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Platform } from 'src/models/platform.model';
import { Provider } from 'src/models/provider.model';
import { Pulse } from 'src/models/pulse.model';
import { Url } from 'src/models/url.model';
import { UrlsService } from 'src/targets/urls/urls.service';
import { nanoid } from 'src/utils/nanoid';
import {
  getAveragePerformance,
  getGradesDistribution,
  getGradeStability,
  getHistory,
  getPlatformDifferences,
  getTimeOfDayPerformance,
  getUrlsMonitored,
  minDatapointsFilter,
  StabilityObject,
} from 'src/utils/stats';
import { HeartbeatsService } from '../heartbeats/heartbeats.service';

@Injectable()
export class PulsesService {
  constructor(
    @InjectModel(Pulse) private readonly pulseModel: typeof Pulse,
    private readonly heartbeatsService: HeartbeatsService,
    private readonly urlService: UrlsService,
  ) {}

  /**
   * Retrieves a paginated list of pulses with optional sorting and filtering by date range.
   *
   * @param page - The current page number (1-based index).
   * @param pageSize - The number of items per page.
   * @param sort - The field to sort the results by.
   * @param order - The sorting order, either 'asc' for ascending or 'desc' for descending.
   * @param from - The start date for filtering pulses by their creation date.
   * @param to - The end date for filtering pulses by their creation date.
   * @returns A promise that resolves to an object containing the total count of pulses (`count`)
   *          and an array of pulse records (`rows`), each including their slug, creation date,
   *          update date, and associated URL details.
   */
  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
    from: Date,
    to: Date,
    where?: any,
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.pulseModel.findAndCountAll({
      where: {
        ...where,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      attributes: ['slug', 'createdAt', 'updatedAt'],
      include: [{ model: Url, attributes: ['slug', 'url'] }],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Retrieves statistical data for pulses within a specified date range.
   *
   * @param from - The start date of the range to filter pulses.
   * @param to - The end date of the range to filter pulses.
   * @returns An object containing the following statistical information:
   * - `totalPulses`: The total number of pulses within the date range.
   * - `averagePerformance`: The average performance score of the pulses.
   * - `urlsMonitored`: The number of unique URLs monitored in the pulses.
   * - `lastPulse`: The timestamp of the most recent pulse in the range.
   * - `stability`: An object containing stability data:
   *   - `mobile`: The top 3 mobile stability variations.
   *   - `desktop`: The top 3 desktop stability variations.
   *   - `differences`: The top 3 platform differences in stability.
   */
  async stats(from: Date, to: Date, where?: any) {
    const pulses = await this.findForStats(from, to, where);

    const totalPulses = pulses.length;
    const averagePerformance = getAveragePerformance(pulses);
    const urlsMonitored = getUrlsMonitored(pulses);
    const lastPulse = pulses[0]?.updatedAt;

    let stability: StabilityObject = {
      desktop: getGradeStability(pulses, 'desktop'),
      mobile: getGradeStability(pulses, 'mobile'),
    };

    stability.desktop.sort((a, b) => a.variation! - b.variation!);
    stability.mobile.sort((a, b) => a.variation! - b.variation!);

    /**
     * For stability stats: You must be "this"
     * tall to ride this ride.
     *
     * This is to avoid ranking urls where there are minimum datapoints.
     */
    if (!where) {
      stability = minDatapointsFilter(stability);
    }

    /**
     * Most stats rely on the pool of heartbeats, let's flat them once.
     */
    const heartbeats = pulses.flatMap((pulse) => pulse.heartbeats);

    return {
      totalPulses,
      averagePerformance,
      urlsMonitored,
      lastPulse,
      stability: {
        mobile: stability.mobile.slice(0, 3),
        desktop: stability.desktop.slice(0, 3),
        differences: getPlatformDifferences(stability).slice(0, 3),
      },
      timeOfDay: getTimeOfDayPerformance(heartbeats),
      grades: getGradesDistribution(heartbeats),
      history: getHistory(heartbeats),
    };
  }

  /**
   * Retrieves pulse records within a specified date range, optionally filtered by additional conditions.
   *
   * @param from - The start date of the range to filter records.
   * @param to - The end date of the range to filter records.
   * @param where - Optional additional filtering conditions.
   * @returns A promise that resolves to an array of pulse records, including associated URLs and heartbeats.
   *
   * The returned records include:
   * - `id` and `updatedAt` attributes of the pulse.
   * - Associated `Url` model with `url` and `slug` attributes.
   * - Associated `Heartbeat` model with `id` and `updatedAt` attributes,
   *   and its nested associations: `CoreWebVitals`, `Grade`, and `Platform`.
   */
  async findForStats(from: Date, to: Date, where?: any) {
    return this.pulseModel.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      attributes: ['id', 'updatedAt'],
      order: [['id', 'desc']],
      include: [
        { model: Url, attributes: ['url', 'slug'] },
        {
          model: Heartbeat,
          attributes: ['id', 'updatedAt'],
          include: [CoreWebVitals, Grade, Platform],
        },
      ],
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
  async deliver(data) {
    const { url, slug, mobile, desktop } = data;
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
     * TODO: Support multiple outputs, not just "mobile | desktop".
     * Keeping it this way to shutdown wiphala and migrate to n8n.
     */
    const output = [mobile, desktop];

    /**
     * Create heartbeats with metrics.
     */

    output.forEach((item) => void this.heartbeatsService.create(pulse, item));
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
