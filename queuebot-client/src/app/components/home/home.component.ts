import { Component } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { SettingsService } from '../../services/settings.service';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QueueListComponent, NgIf],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  channelName: string = '';

  constructor(private settingsService: SettingsService) {
    settingsService.getValue('username').then((value) => {
      console.log('Setting channel name', { channelName: value });
      if (value != undefined) {
        this.channelName = value;
      }
    });
  }
}
