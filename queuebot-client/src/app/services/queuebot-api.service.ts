import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueueDto } from '../models/queue.dto';
import { Observable } from 'rxjs';
import { QUEUEBOT_API_BASE_URL } from '../app.config';
import { SongRequestDto } from '../models/song-request.dto';

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
  getSongRequestQueue(channel: string): Observable<SongRequestDto[]> {
    return this.httpClient.get<SongRequestDto[]>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests`,
      { withCredentials: true },
    );
  }
}