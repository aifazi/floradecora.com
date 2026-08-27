import { Controller, Post, Get, Body, Req, Res, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { loginSchema } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

function cookieOpts(maxAge: number) {
  const secure = process.env.COOKIE_SECURE === 'false' ? false : process.env.COOKIE_SECURE === 'true' ? true : process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    const { accessToken, refreshToken } = await this.authService.login(parsed.data.email, parsed.data.password);

    // httpOnly cookies for browser
    res.cookie('access_token', accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie('refresh_token', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req as unknown as { cookies?: Record<string, string> }).cookies?.refresh_token || (req.body as { refreshToken?: string })?.refreshToken;
    if (!token) throw new HttpException('Missing refresh token', HttpStatus.UNAUTHORIZED);
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie('access_token', accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie('refresh_token', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));
    return { accessToken, refreshToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req as unknown as { cookies?: Record<string, string> }).cookies?.refresh_token || (req.body as { refreshToken?: string })?.refreshToken;
    if (token) await this.authService.logout(token);
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user?: { userId: string } }) {
    const userId = (req as unknown as { user: { userId: string } }).user.userId;
    return this.authService.me(userId);
  }

  // seed endpoint - ALWAYS requires ADMIN_API_KEY. Used to bootstrap the first admin.
  // No longer unauthenticated when the users table is empty (prevents public admin takeover).
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('seed')
  async seed(@Body() body: unknown, @Req() req: Request) {
    const apiKey = process.env.ADMIN_API_KEY;
    const provided = (req.headers['x-api-key'] as string) || (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '');
    if (!apiKey || provided !== apiKey) {
      throw new HttpException('Seed requires admin API key', HttpStatus.FORBIDDEN);
    }
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw new HttpException({ error: 'Invalid input', issues: parsed.error.flatten() }, HttpStatus.BAD_REQUEST);
    const user = await this.authService.ensureAdmin(parsed.data.email, parsed.data.password);
    return { id: user.id, email: user.email };
  }
}
