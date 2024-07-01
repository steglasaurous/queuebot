import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SongDto } from '../../../../../common';
import { DownloadState, LocalSongState } from '../../models/local-song-state';
import { MatIcon } from '@angular/material/icon';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-local-song-status',
  standalone: true,
  imports: [MatIcon, PercentPipe],
  templateUrl: './local-song-status.component.html',
})
export class LocalSongStatusComponent implements OnInit, OnDestroy {
  @Input()
  song!: SongDto;

  @Input()
  songState?: LocalSongState = {
    downloadState: DownloadState.Waiting,
    songId: 0,
    downloadProgress: 0,
  };
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    // Remove the listener
  }

  protected readonly DownloadState = DownloadState;
}
