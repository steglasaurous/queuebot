import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService } from '../services/settings.service';
import { QueuebotApiService } from '../services/queuebot-api.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  providers: [SettingsService, QueuebotApiService, WebsocketService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'queuebot-client';

  constructor() {
    console.log('starting app');
  }
}
