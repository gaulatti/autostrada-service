import { Controller } from '@nestjs/common';
import { HeartbeatsService } from './heartbeats.service';

@Controller('heartbeats')
export class HeartbeatsController {
  constructor(private readonly heartbeatsService: HeartbeatsService) {}
}
