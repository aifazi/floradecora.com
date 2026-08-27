import { JwtOrApiKeyGuard } from './jwt-or-apikey.guard';
import { UnauthorizedException } from '@nestjs/common';

function makeContext(req: Record<string, unknown>) {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as import('@nestjs/common').ExecutionContext;
}

describe('JwtOrApiKeyGuard', () => {
  const adminPayload = { sub: '1', email: 'a@b.co', role: 'admin', jti: 'x' };

  it('allows an admin JWT', async () => {
    const guard = new JwtOrApiKeyGuard({
      verifyAsync: jest.fn().mockResolvedValue(adminPayload),
    } as never);
    const req: Record<string, unknown> = { headers: { authorization: 'Bearer tok' }, cookies: {} };
    const ctx = makeContext(req);
    expect(await guard.canActivate(ctx)).toBe(true);
    expect((req.user as { role: string }).role).toBe('admin');
  });

  it('rejects a non-admin JWT', async () => {
    const guard = new JwtOrApiKeyGuard({
      verifyAsync: jest.fn().mockResolvedValue({ sub: '1', role: 'user', jti: 'x' }),
    } as never);
    const req: Record<string, unknown> = { headers: { authorization: 'Bearer tok' }, cookies: {} };
    const ctx = makeContext(req);
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('allows a valid ADMIN_API_KEY fallback', async () => {
    process.env.ADMIN_API_KEY = 'topsecret';
    const guard = new JwtOrApiKeyGuard({
      verifyAsync: jest.fn().mockRejectedValue(new Error('invalid')),
    } as never);
    const req: Record<string, unknown> = { headers: { 'x-api-key': 'topsecret' }, cookies: {} };
    const ctx = makeContext(req);
    expect(await guard.canActivate(ctx)).toBe(true);
    delete process.env.ADMIN_API_KEY;
  });

  it('rejects when no auth is supplied', async () => {
    delete process.env.ADMIN_API_KEY;
    const guard = new JwtOrApiKeyGuard({
      verifyAsync: jest.fn().mockRejectedValue(new Error('invalid')),
    } as never);
    const req: Record<string, unknown> = { headers: {}, cookies: {} };
    const ctx = makeContext(req);
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
