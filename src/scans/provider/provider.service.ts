import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Provider } from 'src/models/provider.model';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider) private readonly providerModel: typeof Provider,
  ) {}
}
