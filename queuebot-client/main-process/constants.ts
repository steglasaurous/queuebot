import { environment } from './environment';
export const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
export const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
export const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
export const IPC_SETTINGS_DELETE_VALUE = 'settings.deleteValue';
export const LOGIN_URL = `${environment.queuebotApiBaseUrl}/auth/twitch`;
export const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
export const IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS =
  'songDownloader.processSongProgress';

export const IPC_PROTOCOL_HANDLER = 'login.protocolHandler';

export const FILTERED_URLS = [`${environment.queuebotApiBaseUrl}/*`];
