import { Component, Input, OnInit } from '@angular/core';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SongRequestDto } from '../../../../../common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { WebsocketService } from '../../services/websocket.service';
import { MatIcon } from '@angular/material/icon';
import { WindowWithElectron } from '../../models/window.global';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-queue-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, DragDropModule, MatIcon],
  providers: [],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.scss',
})
export class QueueListComponent implements OnInit {
  @Input()
  channelName: string = '';

  songRequests: SongRequestDto[] = [];
  constructor(
    private queuebotApiService: QueuebotApiService,
    private websocketService: WebsocketService,
  ) {}

  ngOnInit() {
    // Retrieve the latest queue data
    if (this.channelName != '') {
      this.queuebotApiService
        .getSongRequestQueue(this.channelName)
        .subscribe((result) => {
          console.log('Got queue', result);
          this.songRequests = result;
          if (window.songs) {
            for (const songRequest of this.songRequests) {
              window.songs.processSong(songRequest.song);
            }
          }
          // Process song requests for anything we need to download locally.
        });

      if (!this.websocketService.isConnected) {
        this.websocketService.connect({
          next: () => {
            this.websocketService.sendMessage({
              event: 'subscribe',
              data: {
                channelName: this.channelName,
              },
            });
          },
          error: () => {},
          complete: () => {},
        });
      }

      this.websocketService.messages$.subscribe((message) => {
        console.log(message);
        if (message.event == 'songRequestAdded') {
          console.log('Adding new song');
          this.songRequests.push(message.data as SongRequestDto);
          if (window.songs) {
            window.songs.processSong(message.data.song);
          }
        }
      });
    }
  }

  drop($event: CdkDragDrop<any, any>) {
    // RE-order the list we have now, and send an API update to swap shit.
    moveItemInArray(
      this.songRequests,
      $event.previousIndex,
      $event.currentIndex,
    );

    console.log($event);
  }
}
