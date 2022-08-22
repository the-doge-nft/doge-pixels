import { Controller, Get } from '@nestjs/common';

@Controller('pixels')
export class PixelsController {
  // constructor() {}

  @Get('test')
  async testPostPixels() {
    return { success: true };
  }
}
