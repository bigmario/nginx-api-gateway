import { Controller, Get } from '@nestjs/common';

import { Public } from '@auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'nice to greet you!, human';
  }
}
