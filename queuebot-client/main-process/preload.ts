import { contextBridge, ipcRenderer } from 'electron';
import { SongDto } from '../../common';
import {
  IPC_OPEN_TWITCH_LOGIN,
  IPC_PROTOCOL_HANDLER,
  IPC_SETTINGS_DELETE_VALUE,
  IPC_SETTINGS_GET_VALUE,
  IPC_SETTINGS_SET_VALUE,
  IPC_SONG_DOWNLOADER_PROCESS_SONG,
  IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS,
} from './constants';

contextBridge.exposeInMainWorld('settings', {
  setValue: (key: string, value: string) =>
    ipcRenderer.invoke(IPC_SETTINGS_SET_VALUE, key, value),
  getValue: (key: string) => ipcRenderer.invoke(IPC_SETTINGS_GET_VALUE, key),
  openTwitchLogin: () => ipcRenderer.invoke(IPC_OPEN_TWITCH_LOGIN),
  deleteValue: (key: string) =>
    ipcRenderer.invoke(IPC_SETTINGS_DELETE_VALUE, key),
});

// For some reason, this errors out with "
contextBridge.exposeInMainWorld('login', {
  openTwitchLogin: () => ipcRenderer.invoke(IPC_OPEN_TWITCH_LOGIN),
  onProtocolHandle: (callback: any) =>
    ipcRenderer.on(IPC_PROTOCOL_HANDLER, (_event, url) => {
      callback(url);
    }),
});

contextBridge.exposeInMainWorld('songs', {
  processSong: (songDto: SongDto) =>
    ipcRenderer.invoke(IPC_SONG_DOWNLOADER_PROCESS_SONG, songDto),
  onProcessSongProgress: (callback: any) =>
    ipcRenderer.on(
      IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS,
      (_event, songState) => {
        callback(songState);
      },
    ),
});
