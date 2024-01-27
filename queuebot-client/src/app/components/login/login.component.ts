import { Component, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [QueueListComponent, HttpClientModule],
  providers: [QueuebotApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private queuebotApiService: QueuebotApiService,
    private router: Router,
  ) {}
  ngOnInit() {
    // If we're authenticated, go right to the good stuff.
  }

  submitAuthCode(value: string) {
    this.queuebotApiService.getAuthCodeResult(value).subscribe((result) => {
      if (result.status == 'OK') {
        // Username comes back as result.username
        // Need to grab the username and persist it to some kind of store or service.
        // Could consider ngrx..  otherwise our own service that stores shit?
        // Use electron-store or similar?  Or just a plain json file managed in the main process.
        // FIXME: CONTINUE HERE
        this.router.navigate(['/home']);
      }
    });
  }
}
