import { Test, TestingModule } from '@nestjs/testing';
import { SteamAuthController } from './steam-auth.controller';
import { getGenericNestMock } from '../../../test/test-helper';
import { JWT_COOKIE_NAME, JWT_EXPIRE_TIME } from '../../injection-tokens';

describe('SteamAuthController', () => {
  let controller: SteamAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SteamAuthController],
      providers: [
        {
          provide: JWT_COOKIE_NAME,
          useValue: 'jwt',
        },
        {
          provide: JWT_EXPIRE_TIME,
          useValue: '60s',
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    controller = module.get<SteamAuthController>(SteamAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
