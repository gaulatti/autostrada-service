import { Controller } from '@nestjs/common';
import { JunctionService } from './junction.service';

@Controller('junction')
export class JunctionController {
  constructor(private readonly junctionService: JunctionService) {}
}
