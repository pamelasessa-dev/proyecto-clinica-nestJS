import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
  ) {
    const usuarioExistente =
      await this.prisma.usuario.findUnique({
        where: { email },
      });

    if (usuarioExistente) {
      throw new ConflictException(
        'El email ya está registrado',
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      10,
    );

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        password: passwordHash,
        rol: 'RECEPCIONISTA',
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });

    return usuario;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario =
      await this.prisma.usuario.findUnique({
        where: { email },
      });

    if (
      !usuario ||
      !(await bcrypt.compare(
        password,
        usuario.password,
      ))
    ) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const secret =
      this.configService.getOrThrow<string>(
        'JWT_SECRET',
      );

    const expiresIn =
      this.configService.getOrThrow<string>(
        'JWT_EXPIRES_IN',
      );

    const options: SignOptions = {
      expiresIn:
        expiresIn as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      {
        sub: usuario.id,
        role: usuario.rol,
      },
      secret,
      options,
    );

    return {
      token,
    };
  }
}