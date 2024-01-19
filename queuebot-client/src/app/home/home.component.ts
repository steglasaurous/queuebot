import { Component } from '@angular/core';
import {QueueListComponent} from "../queue-list/queue-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QueueListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
