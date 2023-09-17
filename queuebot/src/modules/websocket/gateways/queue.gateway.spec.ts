import { Test, TestingModule } from '@nestjs/testing';
import { QueueGateway } from './queue.gateway';
import { getGenericNestMock } from '../../../../test/helpers';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';

describe('QueueGateway', () => {
  let gateway: QueueGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueGateway,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    gateway = module.get<QueueGateway>(QueueGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
