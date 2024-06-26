import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { WindowWithElectron } from '../../models/window.global';
import { QUEUEBOT_API_BASE_URL } from '../../app.config';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [QueueListComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private queuebotApiService: QueuebotApiService,
    private settingsService: SettingsService,
    private router: Router,
    private zone: NgZone,
    @Inject(QUEUEBOT_API_BASE_URL) private apiBaseUrl: string,
  ) {}
  ngOnInit() {
    // If we're authenticated, go right to the good stuff.
    if (window.login) {
      window.login.onProtocolHandle((url: string) => {
        const parsedUrl = new URL(url);
        const authCode = parsedUrl.searchParams.get('authCode');
        if (authCode) {
          this.submitAuthCode(authCode);
        } else {
          console.log('Unable to get auth code from URL');
        }
      });
    }

    // See if we have a channel name in settings. If we do, act as though we're logged in.. (if the JWT is expired, we'll
    // rely on the next API requests to tell us.
    this.settingsService.getValue('username').then((username) => {
      if (username != undefined) {
        this.router.navigate(['/home']);
      }
    });
  }

  submitAuthCode(value: string) {
    this.queuebotApiService
      .getAuthCodeResult(value)
      .subscribe(async (result) => {
        if (result.status == 'OK') {
          await this.settingsService.setValue('username', result.username);
          this.zone.run(() => {
            this.router.navigate(['/home']);
          });
        }
      });
  }

  openLoginPage() {
    if (window['settings']) {
      window['settings'].openTwitchLogin();
    } else {
      console.log('DEV: Open twitch auth in a new tab');
      window.open(`${this.apiBaseUrl}/auth/twitch?mode=authcode`, '_blank');
    }
  }
}
