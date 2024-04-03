import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
// import { TestChatClient } from '../../src/modules/chat/services/clients/test-chat.client';
import { createNestApp, setupDatabaseFixtures } from '../helpers';
import { AuthService } from '../../src/modules/auth/services/auth.service';

describe('SongRequests controller (e2e)', () => {
  let app: INestApplication;
  // let chatClient: TestChatClient;
  let authService: AuthService;

  beforeAll(async () => {
    await setupDatabaseFixtures();
  }, 30000);

  beforeEach(async () => {
    app = await createNestApp();
    await app.init();
    // chatClient = app.get('ChatClients')[0];
    authService = app.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should set a song request as active', async () => {
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
      .put(`/api/channels/${channelName}/song-requests/1`)
      .set('Cookie', [`jwt=${jwt}`])
      .send({ songRequestId: 1, isActive: true });

    expect(response.statusCode).toEqual(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.isActive).toBeTruthy();

    const requestListResponse = await request
      .agent(app.getHttpServer())
      .get(`/api/channels/${channelName}/song-requests`)
      .send();

    expect(requestListResponse.body.length).toEqual(2);
    expect(requestListResponse.body[0].isActive).toBeTruthy();
    expect(requestListResponse.body[1].isActive).toBeFalsy();
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

    // Get the song request list. It should not contain the request we just deleted.

    const requestListResponse = await request
      .agent(app.getHttpServer())
      .get(`/api/channels/${channelName}/song-requests`)
      .send();

    expect(requestListResponse.body.length).toEqual(1);
    expect(requestListResponse.body[0].id).not.toEqual(1);
  });

  // FIXME: Implement these tests.
  xit('should return a 401 if no JWT is present in cookies', () => {});
  xit('should return a 403 if the user is not the owner of the channel', () => {});
  xit('should return a 400 if the song request id does not exist', () => {});
  xit('should return a 403 if the user is not the owner of the channel AND is not the original requester of the song request', () => {});
  xit('should delete the request if the user is the original requester of the song', () => {});
});
