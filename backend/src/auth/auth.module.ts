import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtOrApiKeyGuard } from './guards/jwt-or-apikey.guard';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is required — set a strong 32+ char secret (openssl rand -base64 32)');
        if (secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
        return { secret, signOptions: { algorithm: 'HS256' as const } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtOrApiKeyGuard],
  exports: [AuthService, JwtModule, JwtOrApiKeyGuard],
})
export class AuthModule {}
