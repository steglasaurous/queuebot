import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, timer } from 'rxjs';
import { QUEUEBOT_API_BASE_URL } from '../app.config';
import { GameDto, SongRequestDto } from '../../../../common';
import { ChannelDto } from '../../../../common';

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

  getChannel(channel: string): Observable<ChannelDto> {
    return this.httpClient
      .get<ChannelDto>(`${this.apiBaseUrl}/api/channels/${channel}`, {
        withCredentials: true,
      })
      .pipe(
        retry({
          delay: () => {
            console.log('API request failed, retrying...');
            return timer(5000);
          },
        }),
      );
  }

  swapOrder(
    channel: string,
    sourceSongRequestId: number,
    destinationSongRequestId: number,
  ): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests/${sourceSongRequestId}/swapOrder`,
      {
        songRequestId: destinationSongRequestId,
      },
      {
        withCredentials: true,
      },
    );
  }

  deleteSongRequest(
    channel: string,
    songRequestId: number,
  ): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests/${songRequestId}`,
      {
        withCredentials: true,
      },
    );
  }

  nextSong(channel: string): Observable<SongRequestDto | undefined> {
    return this.httpClient.put<SongRequestDto>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests/next-song`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  setSongRequestActive(
    channel: string,
    songRequestId: number,
  ): Observable<SongRequestDto> {
    return this.httpClient.put<SongRequestDto>(
      `${this.apiBaseUrl}/api/channels/${channel}/song-requests/${songRequestId}`,
      {
        songRequestId: songRequestId,
        isActive: true,
      },
      {
        withCredentials: true,
      },
    );
  }

  closeQueue(channel: string): Observable<ChannelDto> {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channel}`,
      {
        queueOpen: false,
      },
      {
        withCredentials: true,
      },
    );
  }

  openQueue(channel: string): Observable<ChannelDto> {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channel}`,
      {
        queueOpen: true,
      },
      {
        withCredentials: true,
      },
    );
  }

  getGames(): Observable<GameDto[]> {
    return this.httpClient.get<GameDto[]>(`${this.apiBaseUrl}/api/games`);
  }

  setGame(channel: string, gameId: number) {
    return this.httpClient.put<ChannelDto>(
      `${this.apiBaseUrl}/api/channels/${channel}`,
      {
        game: { id: gameId },
      },
      {
        withCredentials: true,
      },
    );
  }
}
