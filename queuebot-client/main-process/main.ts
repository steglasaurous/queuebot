import { app, BrowserWindow, shell, ipcMain, session } from 'electron';

import * as path from 'path';
import * as url from 'url';
import { SettingsStoreService } from './settings-store.service';
import { DownloadHandler } from './downloader/handlers/download-handler.interface';
import { SpinRhythmDownloadHandler } from './downloader/handlers/spin-rhythm-download-handler';
import { SongDownloader } from './downloader/song-downloader';
import { SongDto } from '../../common';
import * as cookie from 'cookie';
import { environment } from './environment';

// import {
//   IPC_OPEN_TWITCH_LOGIN,
//   IPC_SETTINGS_GET_VALUE,
//   IPC_SETTINGS_SET_VALUE,
//   LOGIN_URL,
// } from './constants';

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

const settingsService = new SettingsStoreService(
  app.getPath('userData') + path.sep + 'settings.json',
);

let win: BrowserWindow | null;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('requestobot', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('requestobot');
}

// Windows and Linux
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
      win.webContents.send(IPC_PROTOCOL_HANDLER, commandLine.pop());
    }
  });
}

// MacOS
app.on('open-url', (event, url) => {
  if (win) {
    win.focus();
    win.webContents.send(IPC_PROTOCOL_HANDLER, url);
  }
});

function bootstrap() {
  const songDownloader = getDownloaderService();

  ipcMain.handle(IPC_SETTINGS_SET_VALUE, (event, key, value) => {
    settingsService.setValue(key, value);
  });

  ipcMain.handle(IPC_SETTINGS_GET_VALUE, (event, key) => {
    return settingsService.getValue(key);
  });

  ipcMain.handle(IPC_SETTINGS_DELETE_VALUE, (event, key) => {
    return settingsService.deleteValue(key);
  });

  ipcMain.handle(IPC_OPEN_TWITCH_LOGIN, (event, args) => {
    console.log('Opening external');
    shell.openExternal(LOGIN_URL).then(() => {
      console.log('opened it');
    });
  });

  ipcMain.handle(
    IPC_SONG_DOWNLOADER_PROCESS_SONG,
    async (event, song: SongDto) => {
      await songDownloader.processSong(song, (songState: any) => {
        win?.webContents.send(
          IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS,
          songState,
        );
      });
    },
  );

  createWindow();
}

function getDownloaderService() {
  const appData = process.env['APPDATA'];
  const downloadHandlers: DownloadHandler[] = [];

  if (appData) {
    downloadHandlers.push(
      new SpinRhythmDownloadHandler(
        appData.replace('Roaming', 'LocalLow') +
          '\\Super Spin Digital\\Spin Rhythm XD\\Custom',
      ),
    );
  } else {
    console.warn(
      'Unable to find the APPDATA dir - song downloaders will not download.',
    );
  }

  return new SongDownloader(downloadHandlers);
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '/../render/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

  // This attaches the JWT cookie to the outgoing request if available,
  // so authenticated endpoints work correctly.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: [`${environment.queuebotApiBaseUrl}/*`],
    },
    (details, callback) => {
      const jwt = settingsService.getValue('jwt');
      if (jwt) {
        details.requestHeaders['Cookie'] = `jwt=${jwt};`;
      }
      callback({ requestHeaders: details.requestHeaders });
    },
  );

  // This captures the JWT cookie when /authCode is called in the app.
  // This allows authenticated requests to work correctly, but still
  // retain the ability for the frontend app to continue working normally
  // in a regular browser.
  // (In electron, the frontend is loaded as a file url, which doesn't allow cookies
  // to be stored - cookies only work when the app is served from an http(s) url.
  session.defaultSession.webRequest.onCompleted(
    {
      urls: FILTERED_URLS,
    },
    (details) => {
      // We only care about the auth-code endpoint, which sets the cookie.
      // Otherwise no work needs to be done.
      if (!details.url.includes('auth-code')) {
        return;
      }

      if (details.responseHeaders && details.responseHeaders['set-cookie']) {
        // Note: This only works if the endpoint passes back a single cookie.  If there's multiple
        // cookies at some future date, this needs to be updated.
        const decodedCookie = cookie.parse(
          details.responseHeaders['set-cookie'][0],
        );

        if (decodedCookie['jwt']) {
          // Store this locally.
          console.log('Storing jwt');
          settingsService.setValue('jwt', decodedCookie['jwt']);
        }
      }
    },
  );
}

app.on('ready', bootstrap);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
