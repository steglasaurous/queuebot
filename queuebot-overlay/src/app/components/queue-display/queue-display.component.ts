import { Component, OnInit } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import { SongRequestDto } from '../../../../../common';
import { WebsocketService } from '../../services/websocket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-queue-display',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
  ],
  templateUrl: './queue-display.component.html',
  styleUrl: './queue-display.component.css'
})
export class QueueDisplayComponent implements OnInit {
  songRequests: SongRequestDto[] = [];

  constructor(
    private websocketService: WebsocketService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    const channel: string = this.route.snapshot.queryParamMap.get('channel') ?? "";

    if (channel) {
      if (!this.websocketService.isConnected) {
        this.websocketService.connect({
          next: () => {
            this.websocketService.sendMessage({
              event: 'subscribe',
              data: {
                channelName: channel,
              },
            });
          },
          error: () => {},
          complete: () => {},
        });
      }
    }

    this.websocketService.messages$.subscribe(async (message) => {
      console.log(message);

      if (message.event == 'songRequestQueueChanged') {
        this.songRequests = message.data as SongRequestDto[];
      } else if (message.event == 'queue') {
        this.songRequests = message.data.songRequests;
      }
    });
  }
}
