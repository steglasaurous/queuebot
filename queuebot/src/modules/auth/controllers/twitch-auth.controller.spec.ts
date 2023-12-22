import { Test, TestingModule } from '@nestjs/testing';
import { TwitchAuthController } from './twitch-auth.controller';

describe('TwitchAuthController', () => {
  let controller: TwitchAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchAuthController],
    }).compile();

    controller = module.get<TwitchAuthController>(TwitchAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
