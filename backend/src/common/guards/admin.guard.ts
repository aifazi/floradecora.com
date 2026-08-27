import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = process.env.ADMIN_API_KEY;
    if (!apiKey) throw new UnauthorizedException('Admin API key not configured');
    const provided = (req.headers['x-api-key'] as string) || (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '');
    if (provided && provided === apiKey) return true;
    throw new UnauthorizedException('Invalid or missing admin API key');
  }
}
