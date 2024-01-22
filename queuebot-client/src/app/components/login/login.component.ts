import { Component, OnInit } from '@angular/core';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { JwtStoreService } from '../../services/jwt-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [QueueListComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(private jwtStoreService: JwtStoreService) {}
  ngOnInit() {
    // If we're authenticated, go right to the good stuff.
    if (this.jwtStoreService.getJwt()) {
      // FIXME: Use router to redirect
    }
  }
}
