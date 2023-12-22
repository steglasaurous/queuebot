import { Test, TestingModule } from '@nestjs/testing';
import { ClientLauncherController } from './client-launcher.controller';

describe('ClientLauncherController', () => {
  let controller: ClientLauncherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientLauncherController],
    }).compile();

    controller = module.get<ClientLauncherController>(ClientLauncherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
