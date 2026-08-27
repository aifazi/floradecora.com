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
        // Enforce admin role — a valid JWT alone is not sufficient for admin endpoints.
        if ((payload as { role?: string }).role !== 'admin') {
          throw new UnauthorizedException('Admin role required');
        }
        (req as unknown as Record<string, unknown>).user = payload;
        return true;
      } catch (err) {
        if (err instanceof UnauthorizedException) throw err;
        // fall through to api key
      }
    }

    // 2) Fallback to ADMIN_API_KEY
    const apiKey = process.env.ADMIN_API_KEY;
    if (apiKey) {
      const provided = (req.headers['x-api-key'] as string) || auth?.replace(/^Bearer\s+/i, '');
      if (provided && provided === apiKey) return true;
    }

    throw new UnauthorizedException('Invalid or missing authentication');
  }
}
