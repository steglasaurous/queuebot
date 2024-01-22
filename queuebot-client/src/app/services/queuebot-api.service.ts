import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueueDto } from '../models/queue.dto';
import { Observable } from 'rxjs';
import { JwtStoreService } from './jwt-store.service';
import { environment } from '../../environments/environment';
import { QUEUEBOT_API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class QueuebotApiService {
  constructor(
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
    private httpClient: HttpClient,
    private jwtStore: JwtStoreService,
  ) {}

  getSongRequestQueue(channel: string): Observable<QueueDto> {
    const jwt = this.jwtStore.getJwt();
    if (!jwt) {
      return new Observable<QueueDto>((subscriber) => {
        subscriber.error('No JWT present in local storage');
      });
    }

    return this.httpClient.get<QueueDto>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests`,
      {
        headers: {
          Authorization: `Bearer ${this.jwtStore.getJwt()}`,
        },
      },
    );
  }
}
