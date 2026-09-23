
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
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

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new InternalServerErrorException(
        'La configuración de autenticación no está disponible',
      );
    }

    const token = jwt.sign(
      {
        sub:usuario.id,
        role:usuario.rol,
      },
      secret,
      {
        expiresIn: '8h',
      },
    );

    return { token };
  }
}