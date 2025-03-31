import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';
import { PulsesService } from 'src/scans/pulses/pulses.service';
import { nanoid } from 'src/utils/nanoid';
import {
  getGradeStability,
  getPlatformDifferences,
  minDatapointsFilter,
  StabilityObject,
} from 'src/utils/stats';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url) private readonly urlModel: typeof Url,
    @Inject(forwardRef(() => PulsesService))
    private readonly pulsesService: PulsesService,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.urlModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Retrieves or creates a URL instance based on the fully qualified domain name (FQDN).
   *
   * @param url - The fully qualified domain name (FQDN) to search for or create.
   * @returns A promise that resolves to the URL instance. If the instance is newly created,
   *          it will also have a generated slug.
   */
  async getByFQDN(url: string) {
    const [instance, created] = await this.urlModel.findOrBuild({
      where: { url },
    });
    if (created) {
      instance.slug = nanoid();
      await instance.save();
    }
    return instance;
  }

  /**
   * Retrieves a URL record based on the provided slug.
   *
   * @param slug - The unique identifier for the URL to retrieve.
   * @returns A promise that resolves to the URL record if found, or `null` if no record matches the slug.
   */
  async get(slug: string) {
    return this.urlModel.findOne({ where: { slug } });
  }

  /**
   * Retrieves statistical data for a given date range, including stability metrics
   * for desktop and mobile platforms, and calculates platform differences.
   *
   * @param from - The start date of the range for which statistics are to be retrieved.
   * @param to - The end date of the range for which statistics are to be retrieved.
   * @returns An object containing stability metrics for mobile and desktop platforms,
   *          as well as the top 10 platform differences.
   */
  async stats(from: Date, to: Date) {
    const pulses = await this.pulsesService.findForStats(from, to);

    const stability: StabilityObject = minDatapointsFilter({
      desktop: getGradeStability(pulses, 'desktop'),
      mobile: getGradeStability(pulses, 'mobile'),
    });

    stability.desktop.sort((a, b) => b.average! - a.average!);
    stability.mobile.sort((a, b) => b.average! - a.average!);

    return {
      stability: {
        mobile: stability.mobile.slice(0, 10),
        desktop: stability.desktop.slice(0, 10),
        differences: getPlatformDifferences(stability).slice(0, 10),
      },
    };
  }
}
