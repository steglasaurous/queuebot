import { Component, Input, OnInit } from '@angular/core';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { QueueDto } from '../../models/queue.dto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SongRequestDto } from '../../models/song-request.dto';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-queue-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, DragDropModule],
  providers: [],
  templateUrl: './queue-list.component.html',
  styleUrl: './queue-list.component.scss',
})
export class QueueListComponent implements OnInit {
  @Input()
  channelName: string = '';

  songRequests: SongRequestDto[] = [];
  constructor(private queuebotApiService: QueuebotApiService) {}

  ngOnInit() {
    // Retrieve the latest queue data
    if (this.channelName != '') {
      this.queuebotApiService
        .getSongRequestQueue(this.channelName)
        .subscribe((result) => {
          console.log('Got queue', result);
          this.songRequests = result;
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
