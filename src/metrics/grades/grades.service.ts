import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade } from 'src/models/grade.model';
import { Heartbeat } from 'src/models/heartbeat.model';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade) private readonly gradeModel: typeof Grade) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.gradeModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Creates a new grade entry in the database associated with a specific heartbeat.
   *
   * @param heartbeat - The heartbeat object containing the ID to associate with the grade.
   * @param metrics - An object containing the performance, accessibility, best practices, and SEO scores.
   * @param metrics.performance - The performance score as a number.
   * @param metrics.accessibility - The accessibility score as a number.
   * @param metrics.bestPractices - The best practices score as a number.
   * @param metrics.seo - The SEO score as a number.
   * @returns void
   */
  create(
    heartbeat: Heartbeat,
    { performance, accessibility, bestPractices, seo }: Record<string, number>,
  ) {
    void this.gradeModel.create({
      heartbeats_id: heartbeat.id,
      performance,
      accessibility,
      seo,
      best_practices: bestPractices,
    });
  }
}
