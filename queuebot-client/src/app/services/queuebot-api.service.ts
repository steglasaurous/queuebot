import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueueDto } from '../models/queue.dto';
import { Observable } from 'rxjs';
import { QUEUEBOT_API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class QueuebotApiService {
  constructor(
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
    private httpClient: HttpClient,
  ) {}

  getAuthCodeResult(authCode: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/auth-code/${authCode}`);
  }
  getSongRequestQueue(channel: string): Observable<QueueDto> {
    return this.httpClient.get<QueueDto>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests`,
      { withCredentials: true },
    );
  }
}
