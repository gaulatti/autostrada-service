import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';
import { nanoid } from 'src/utils/nanoid';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url) private readonly urlModel: typeof Url) {}

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
}
