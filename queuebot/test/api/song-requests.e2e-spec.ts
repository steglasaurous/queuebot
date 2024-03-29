import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestChatClient } from '../../src/modules/chat/services/clients/test-chat.client';
import { createNestApp, setupDatabaseFixtures } from '../helpers';
import { AuthService } from '../../src/modules/auth/services/auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let chatClient: TestChatClient;
  let authService: AuthService;

  beforeAll(async () => {
    await setupDatabaseFixtures();
  }, 30000);

  beforeEach(async () => {
    app = await createNestApp();
    await app.init();
    chatClient = app.get('ChatClients')[0];
    authService = app.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should delete a song request for a broadcaster', async () => {
    const channelName = 'channelwithrequests';
    const jwt = authService.getJwt({
      username: 'channelwithrequests',
      displayName: 'channelwithrequests',
      id: 999,
      userAuthSources: [],
    });

    // NOTE: My IDE complains that request() is not callable, however IT WORKS :)
    const response = await request
      .agent(app.getHttpServer())
      .delete(`/api/channels/${channelName}/song-requests/1`)
      .set('Cookie', [`jwt=${jwt}`])
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
