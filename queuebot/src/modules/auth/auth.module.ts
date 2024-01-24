import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SteamAuthController } from './controllers/steam-auth.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { SteamAuthStrategy } from './strategies/steam-auth.strategy';
import {
  BASE_URL,
  JWT_COOKIE_NAME,
  JWT_EXPIRE_TIME,
  JWT_SECRET,
  STEAM_APIKEY,
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} from '../../injection-tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DataStoreModule } from '../data-store/data-store.module';
import { TwitchAuthController } from './controllers/twitch-auth.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthCodeController } from './controllers/auth-code.controller';

@Module({
  imports: [
    DataStoreModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // FIXME: Should use JWT_SECRET and JWT_EXPIRE_TIME from injection, but apparently I can't use @Inject() in this context.
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({}),
  ],
  providers: [
    AuthService,
    // SteamAuthStrategy,
    JwtStrategy,
    {
      provide: STEAM_APIKEY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('STEAM_APIKEY');
      },
    },
    {
      provide: BASE_URL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('BASE_URL');
      },
    },
    {
      provide: JWT_SECRET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('JWT_SECRET');
      },
    },
    {
      provide: JWT_COOKIE_NAME,
      useValue: 'jwt',
    },
    {
      provide: JWT_EXPIRE_TIME,
      useValue: '8h',
    },
    {
      provide: TWITCH_CLIENT_ID,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('TWITCH_APP_CLIENT_ID');
      },
    },
    {
      provide: TWITCH_CLIENT_SECRET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('TWITCH_APP_CLIENT_SECRET');
      },
    },
  ],
  controllers: [
    SteamAuthController,
    AuthController,
    TwitchAuthController,
    AuthCodeController,
  ],
})
export class AuthModule {}
