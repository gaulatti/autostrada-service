import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoreWebVitals } from 'src/models/core.web.vitals.model';

@Injectable()
export class CwvService {
  constructor(
    @InjectModel(CoreWebVitals) private readonly cwvModel: typeof CoreWebVitals,
  ) {}
}
