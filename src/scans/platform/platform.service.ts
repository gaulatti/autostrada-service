import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Platform } from 'src/models/platform.model';
import { nanoid } from 'src/utils/nanoid';

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel(Platform) private readonly platformModel: typeof Platform,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.platformModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Retrieves a platform instance by its user agent. If no instance exists,
   * a new one is created with a generated slug and saved to the database.
   *
   * @param userAgent - The user agent string to search for or create a platform instance.
   * @returns A promise that resolves to the platform instance.
   */
  async getByUserAgent(userAgent: string) {
    const [instance, created] = await this.platformModel.findOrBuild({
      where: { user_agent: userAgent },
    });
    if (created) {
      instance.slug = nanoid();
      instance.type = this.getUserAgentType(userAgent);
      await instance.save();
    }
    return instance;
  }

  /**
   * Determines the type of device based on the provided user agent string.
   *
   * @param userAgent - The user agent string to evaluate.
   * @returns `'mobile'` if the user agent matches common mobile device patterns,
   *          otherwise `'desktop'`.
   */
  private getUserAgentType = (userAgent: string): 'mobile' | 'desktop' => {
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return mobileRegex.test(userAgent) ? 'mobile' : 'desktop';
  };
}
