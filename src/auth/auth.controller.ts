import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import {ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ 
    summary: 'Registra un usuario como RECEPCIONISTA',
   })
  @ApiBody({ 
    type: RegisterDto, 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado correctamente.',
   })
  @ApiResponse({ 
    status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.',
   })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado.' 
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto){
    return this.authService.register(
      registerDto.nombre,
      registerDto.apellido,
      registerDto.email,
      registerDto.password,
    );
  }
  
  
  @ApiOperation({ 
    summary: 'Inicia sesión y obtiene un JWT',
  })
  @ApiBody({ 
    type: LoginDto, 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Login correcto. Devuelve el token JWT.',
   })
  @ApiResponse({ 
    status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.',
   })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas.' 
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
