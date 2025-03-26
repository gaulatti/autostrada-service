import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';
import { Heartbeat } from 'src/models/heartbeat.model';

@Injectable()
export class CwvService {
  constructor(
    @InjectModel(CoreWebVitals) private readonly cwvModel: typeof CoreWebVitals,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.cwvModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Creates a new record in the CWV (Core Web Vitals) model using the provided heartbeat and timing metrics.
   *
   * @param heartbeat - The heartbeat object containing the ID to associate with the CWV record.
   * @param timings - An object containing various timing metrics such as TTFB, FCP, DCL, LCP, TTI, SI, CLS, and TBT.
   * @returns void
   */
  create(heartbeat: Heartbeat, { timings }: any) {
    void this.cwvModel.create({
      heartbeats_id: heartbeat.id,
      ttfb: timings['TTFB'],
      fcp: timings['FCP'],
      dcl: timings['DCL'],
      lcp: timings['LCP'],
      tti: timings['TTI'],
      si: timings['SI'],
      cls: timings['CLS'],
      tbt: timings['TBT'],
    });
  }
}
