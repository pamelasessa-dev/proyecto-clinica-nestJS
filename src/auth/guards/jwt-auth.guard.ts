import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: number;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Bearer eyJhbGci...
    const token = authHeader.substring(7);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_SECRET no está configurado',
      );
    }

    try {
      const decoded = jwt.verify(token, secret);

      // jwt.verify() puede devolver string u objeto
      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      if (
        typeof decoded.sub !== 'number' ||
        typeof decoded.role !== 'string'
      ) {
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

      throw new UnauthorizedException(
        'Token inválido o expirado',
      );
    }
  }
}