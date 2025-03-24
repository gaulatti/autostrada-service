import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private readonly projectModel: typeof Project,
  ) {}
}
