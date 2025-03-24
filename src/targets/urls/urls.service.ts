import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url) private readonly urlModel: typeof Url) {}
}
