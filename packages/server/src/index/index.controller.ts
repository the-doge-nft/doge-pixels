import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('')
export class IndexController {
  constructor(private readonly app: AppService) {}
  @Get('')
  getIndex() {
    return this.app.wow;
  }
}
