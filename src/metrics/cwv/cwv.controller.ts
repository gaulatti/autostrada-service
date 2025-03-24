import { Controller } from '@nestjs/common';
import { CwvService } from './cwv.service';

@Controller('cwv')
export class CwvController {
  constructor(private readonly cwvService: CwvService) {}
}
