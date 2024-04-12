import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: { seed: string }) {
    return this.authService.signIn(body.seed);
  }

  @HttpCode(HttpStatus.OK)
  @Get('create')
  create() {
    return this.authService.create();
  }
}
