import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = process.env.ADMIN_API_KEY;
    if (!apiKey) {
      // In production require ADMIN_API_KEY — fail closed
      if (process.env.NODE_ENV === 'production') {
        throw new UnauthorizedException('Admin API key not configured');
      }
      // In dev, warn and allow (so local dev not blocked)
      console.warn('[AdminGuard] ADMIN_API_KEY not set — allowing in non-production');
      return true;
    }
    const provided = (req.headers['x-api-key'] as string) || (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '');
    if (provided && provided === apiKey) return true;
    throw new UnauthorizedException('Invalid or missing admin API key');
  }
}
