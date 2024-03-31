import { contextBridge, ipcRenderer } from 'electron';
import { SongDto } from '../../common';
// import {
//   IPC_OPEN_TWITCH_LOGIN,
//   IPC_SETTINGS_GET_VALUE,
//   IPC_SETTINGS_SET_VALUE,
// } from './constants';

// FIXME: Doing the import above fails - would be ideal to keep these in one place
const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
const IPC_SETTINGS_DELETE_VALUE = 'settings.deleteValue';
export const IPC_PROTOCOL_HANDLER = 'login.protocolHandler';

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
});
