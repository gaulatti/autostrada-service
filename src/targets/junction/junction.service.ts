import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Junction } from 'src/models/junction.model';

@Injectable()
export class JunctionService {
  constructor(
    @InjectModel(Junction) private readonly junctionModel: typeof Junction,
  ) {}
}
