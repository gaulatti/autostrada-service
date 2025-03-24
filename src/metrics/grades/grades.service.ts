import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade } from 'src/models/grade.model';

@Injectable()
export class GradesService {
  constructor(@InjectModel(Grade) private readonly gradeModel: typeof Grade) {}
}
