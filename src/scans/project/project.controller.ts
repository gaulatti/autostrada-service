import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(ProjectController.name)
  private readonly logger!: JSONLogger;

  @Get()
  list(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: string,
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.projectService.list(page, pageSize, sort, order);
  }
}
