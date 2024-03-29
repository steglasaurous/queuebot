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

        if (message.event == 'songRequestQueueChanged') {
          this.songRequests = message.data as SongRequestDto[];

          if (window.songs) {
            for (const songRequest of this.songRequests) {
              window.songs.processSong(songRequest);
            }
          } else {
            console.log(
              'Window.songs does not exist, not calling processSong()',
            );
          }
        }
      });
    }
  }

  drop($event: CdkDragDrop<any, any>) {
    // RE-order the list we have now, and send an API update to swap shit.
    // We got the previous and current index.  Use these to resolve them to our dataset
    this.queuebotApiService
      .swapOrder(
        this.channelName,
        this.songRequests[$event.previousIndex].id,
        this.songRequests[$event.currentIndex].id,
      )
      .subscribe({
        next: (result) => {
          console.log('got result', { result: result });
        },
        error: (err) => {
          console.log('Got error', { err: err });
        },
      });
    moveItemInArray(
      this.songRequests,
      $event.previousIndex,
      $event.currentIndex,
    );

    console.log($event);
  }
}
