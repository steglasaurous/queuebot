import { Component, NgZone, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { WindowWithElectron } from '../../models/window.global';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [QueueListComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private queuebotApiService: QueuebotApiService,
    private settingsService: SettingsService,
    private router: Router,
    private zone: NgZone,
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
  }

  submitAuthCode(value: string) {
    this.queuebotApiService.getAuthCodeResult(value).subscribe((result) => {
      if (result.status == 'OK') {
        this.settingsService.setValue('username', result.username);
        // Username comes back as result.username
        // Need to grab the username and persist it to some kind of store or service.
        // Could consider ngrx..  otherwise our own service that stores shit?
        // Use electron-store or similar?  Or just a plain json file managed in the main process.
        // FIXME: CONTINUE HERE
        console.log('Triggering navigate');
        this.zone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }

  openLoginPage() {
    if (window['settings']) {
      // FIXME: Continue here - setup method on preload.ts
      // Make sure additional ts files are being compiled as expected.
      window['settings'].openTwitchLogin();
    } else {
      console.log('DEV: Open twitch auth in a new tab');
      window.open('http://localhost:3000/auth/twitch', '_blank');
    }
  }
}
