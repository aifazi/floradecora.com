import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: unknown }>();

    // 1) Try JWT (Bearer or cookie)
    const auth = req.headers['authorization'] as string | undefined;
    let token: string | undefined;
    if (auth?.startsWith('Bearer ')) token = auth.slice(7);
    else if ((req as unknown as { cookies?: Record<string, string> }).cookies?.access_token) token = (req as unknown as { cookies: Record<string, string> }).cookies.access_token;
    else if ((req as unknown as { cookies?: Record<string, string> }).cookies?.accessToken) token = (req as unknown as { cookies: Record<string, string> }).cookies.accessToken;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
          algorithms: ['HS256'],
        });
        (req as unknown as Record<string, unknown>).user = payload;
        return true;
      } catch {
        // fall through to api key
      }
    }

    // 2) Fallback to ADMIN_API_KEY
    const apiKey = process.env.ADMIN_API_KEY;
    if (apiKey) {
      const provided = (req.headers['x-api-key'] as string) || auth?.replace(/^Bearer\s+/i, '');
      if (provided && provided === apiKey) return true;
    }

    // In non-production allow if no JWT_SECRET/ADMIN_API_KEY configured (dev convenience)
    if (!process.env.JWT_SECRET && !process.env.ADMIN_API_KEY && process.env.NODE_ENV !== 'production') {
      console.warn('[JwtOrApiKeyGuard] No JWT_SECRET/ADMIN_API_KEY — allowing in dev');
      return true;
    }

    throw new UnauthorizedException('Invalid or missing authentication');
  }
}
