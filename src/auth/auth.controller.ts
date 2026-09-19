import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      nombre: string;
      apellido: string;
      email: string;
      password: string;
      rol: string;
    },
  ) {
    return this.authService.register(
      body.nombre,
      body.apellido,
      body.email,
      body.password,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}