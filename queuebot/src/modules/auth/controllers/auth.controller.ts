import { Controller, Get, Render } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  @Render('auth/index')
  selectLogin() {
    return;
  }
}
