import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../data-store/entities/user.entity';
import { getGenericNestMock } from '../../../../test/helpers';

describe('AuthService', () => {
  let service: AuthService;
  let jwtServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        return getGenericNestMock(token);
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtServiceMock =
      module.get<jest.MockedClass<typeof JwtService>>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a JWT for a valid user object', () => {
    const user = new User();
    user.id = 1;
    user.username = 'testuser1';
    user.displayName = 'testuser1-displayname';

    jwtServiceMock.sign.mockImplementation(() => 'TESTJWT');

    const result = service.getJwt(user);

    expect(result).toBe('TESTJWT');
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      username: user.username,
      displayName: user.displayName,
      sub: user.id,
    });
  });
});
