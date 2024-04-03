import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { LocalSongStatusComponent } from '../local-song-status/local-song-status.component';
import { LocalSongState } from '../../models/local-song-state';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-queue-list',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    DragDropModule,
    MatIcon,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    LocalSongStatusComponent,
  ],
  providers: [],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.css',
})
export class QueueListComponent implements OnInit {
  @Input()
  channelName: string = '';

  songRequests: SongRequestDto[] = [];

  downloadedSongStatus: Map<number, LocalSongState> = new Map<
    number,
    LocalSongState
  >();

  columnsToDisplay = ['song', 'songLength', 'requester', 'ops'];
  constructor(
    private queuebotApiService: QueuebotApiService,
    private websocketService: WebsocketService,
    private ref: ChangeDetectorRef,
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

      this.websocketService.messages$.subscribe(async (message) => {
        console.log(message);

        if (message.event == 'songRequestQueueChanged') {
          this.songRequests = message.data as SongRequestDto[];

          if (window.songs) {
            for (const songRequest of this.songRequests) {
              console.log('Calling processSong', { songRequest: songRequest });
              await window.songs.processSong(songRequest);
            }
          } else {
            console.log(
              'Window.songs does not exist, not calling processSong()',
            );
          }
        }
      });
    }

    // Attach to listening to the download progress thing.
    if (window.songs) {
      console.log('Connecting to onProcessSongProgress');
      window.songs.onProcessSongProgress((songState: LocalSongState) => {
        console.log('Download update', { songState: songState });
        this.downloadedSongStatus.set(songState.songId, songState);
        this.ref.detectChanges();
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

  deleteSongRequest(songRequestId: number) {
    this.queuebotApiService
      .deleteSongRequest(this.channelName, songRequestId)
      .subscribe({
        next: (result) => {
          console.log('got result', { result: result });
        },
        error: (err) => {
          console.log('Got error', { err: err });
        },
      });
  }

  setSongRequestActive(songRequestId: number) {
    this.queuebotApiService
      .setSongRequestActive(this.channelName, songRequestId)
      .subscribe();
  }
}
