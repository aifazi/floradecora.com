import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.issueTokens(user.id, user.email, user.role);
  }

  async issueTokens(userId: string, email: string, role: string) {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, role, jti: accessJti },
      { secret: process.env.JWT_SECRET, algorithm: 'HS256', expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, jti: refreshJti },
      { secret: process.env.JWT_SECRET, algorithm: 'HS256', expiresIn: '7d' },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        jti: refreshJti,
        tokenHash: hashToken(refreshToken),
        userId,
        expiresAt,
      },
    });

    // cleanup expired revoked tokens (best effort)
    this.prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});

    return { accessToken, refreshToken, accessJti, refreshJti };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; jti: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({ where: { jti: payload.jti } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }
    if (stored.tokenHash !== hashToken(refreshToken)) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    // revoke old
    await this.prisma.refreshToken.update({ where: { jti: payload.jti }, data: { revoked: true } });

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.issueTokens(user.id, user.email, user.role);
  }

  async logout(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ jti: string }>(refreshToken, {
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
      });
      await this.prisma.refreshToken.updateMany({ where: { jti: payload.jti }, data: { revoked: true } });
    } catch {
      // ignore
    }
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true, createdAt: true } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async ensureAdmin(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return existing;
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { email: email.toLowerCase(), password: hash, role: 'admin' } });
  }
}
