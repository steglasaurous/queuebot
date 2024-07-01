import { Component } from '@angular/core';
import { QueueListComponent } from '../../components/queue-list/queue-list.component';
import { SettingsService } from '../../services/settings.service';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { NgIf } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ChannelDto } from '../../../../../common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeGameComponent } from '../../components/change-game/change-game.component';
import { ButtonPrimaryComponent } from '../../components/button-primary/button-primary.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    QueueListComponent,
    NgIf,
    MatSlideToggle,
    ButtonPrimaryComponent,
    InputTextComponent,
    MatAutocomplete,
  ],
  providers: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  channelName: string = '';
  channel: ChannelDto = {
    channelName: '',
    inChannel: false,
    queueOpen: false,
    enabled: false,
    game: {
      id: 0,
      displayName: '',
      setGameName: '',
      twitchCategoryId: '0',
      name: '',
    },
  };
  nextSongDisabled: boolean = false;
  constructor(
    private settingsService: SettingsService,
    private queuebotApiService: QueuebotApiService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.settingsService.getValue('username').then((value) => {
      console.log('Setting channel name', { channelName: value });
      if (value != undefined) {
        this.channelName = value;
      }

      this.queuebotApiService
        .getChannel(this.channelName)
        .subscribe((channel: ChannelDto) => {
          this.channel = channel;
        });
    });
  }

  nextSong() {
    // TODO: Disable the next song button while the request is in progress, then re-enable when the request completes (or fails)
    this.nextSongDisabled = true;
    this.queuebotApiService.nextSong(this.channelName).subscribe({
      next: () => {
        this.nextSongDisabled = false;
      },
      error: () => {
        this.nextSongDisabled = false;
      },
    });
  }

  async logout() {
    await this.settingsService.deleteValue('username');
    await this.settingsService.deleteValue('jwt');
    await this.router.navigate(['']);
  }

  toggleQueueOpen() {
    if (this.channel.queueOpen) {
      this.queuebotApiService
        .closeQueue(this.channelName)
        .subscribe((channelDto) => {
          this.channel = channelDto;
        });
    } else {
      this.queuebotApiService
        .openQueue(this.channelName)
        .subscribe((channelDto) => {
          this.channel = channelDto;
        });
    }
  }

  showChangeGameModal() {
    console.log('open modal');
    const dialogRef = this.dialog.open(ChangeGameComponent, {
      data: { gameId: 0 },
    });

    dialogRef.afterClosed().subscribe((gameId) => {
      this.queuebotApiService
        .setGame(this.channelName, gameId)
        .subscribe((channelDto) => {
          this.channel = channelDto;
        });
    });
  }
}
