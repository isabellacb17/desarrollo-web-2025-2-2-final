import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : null;
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      // Verificar firma y expiración estándar
      const payload = this.jwt.verify(token);

      // Validar roles si se requieren
      if (requiredRoles.length > 0) {
        const roles: string[] = payload?.roles ?? [];
        const ok = requiredRoles.every((r) => roles.includes(r));
        if (!ok) throw new ForbiddenException('Insufficient role');
      }

      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}


