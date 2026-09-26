import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7);

    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    try {
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      if (typeof decoded.sub !== 'number' || typeof decoded.role !== 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      const user: JwtPayload = {
        sub: decoded.sub,
        role: decoded.role,
      };

      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
