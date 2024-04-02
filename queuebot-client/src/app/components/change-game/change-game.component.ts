import { Component } from '@angular/core';
import { QueuebotApiService } from '../../services/queuebot-api.service';
import { GameDto } from '../../../../../common';
import { MatDialogRef } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-change-game',
  standalone: true,
  imports: [NgFor],
  templateUrl: './change-game.component.html',
  styleUrl: './change-game.component.css',
})
export class ChangeGameComponent {
  games: GameDto[] = [];
  constructor(
    private queuebotApiService: QueuebotApiService,
    public dialogRef: MatDialogRef<ChangeGameComponent>,
  ) {
    this.queuebotApiService.getGames().subscribe((gameDtos) => {
      this.games = gameDtos;
    });
  }

  selectGame(id: number) {
    // Return this back to the caller if we can, it has awareness of what channel to update.
    this.dialogRef.close(id);
  }
}
