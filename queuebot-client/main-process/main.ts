import { app, BrowserWindow, dialog, shell, ipcMain, session } from 'electron';

import * as path from 'path';
import * as url from 'url';
import { SettingsStoreService } from './settings-store.service';
import { DownloadHandler } from './downloader/handlers/download-handler.interface';
import { SpinRhythmDownloadHandler } from './downloader/handlers/spin-rhythm-download-handler';
import { SongDownloader } from './downloader/song-downloader';
import { SongDto } from '../../common';

// import {
//   IPC_OPEN_TWITCH_LOGIN,
//   IPC_SETTINGS_GET_VALUE,
//   IPC_SETTINGS_SET_VALUE,
//   LOGIN_URL,
// } from './constants';

export const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
export const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
export const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
// FIXME: Need to make this configurable at build time
export const LOGIN_URL = 'http://localhost:3000/auth/twitch';
export const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
export const IPC_PROTOCOL_HANDLER = 'login.protocolHandler';

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
      // FIXME: Handle exchanging the authCode for a JWT here, and store the JWT locally.
      // Inform the render process once the exchange is complete and JWT is stored.
      win.webContents.send(IPC_PROTOCOL_HANDLER, commandLine.pop());
    }
    // Pass this up to the render so it can get its JWT cookie set.

    // dialog.showErrorBox('Welcome back', `Here you go: ${commandLine.pop()}`);
  });
}

// MacOS
app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
});

function bootstrap() {
  const settingsService = new SettingsStoreService(
    path.join(__dirname, 'settings.json'),
  );

  const songDownloader = getDownloaderService();

  ipcMain.handle(IPC_SETTINGS_SET_VALUE, (event, key, value) => {
    settingsService.setValue(key, value);
  });

  ipcMain.handle(IPC_SETTINGS_GET_VALUE, (event, key) => {
    return settingsService.getValue(key);
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
      console.log('Processing song for auto-download');
      await songDownloader.processSong(song);
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

  // According to documentation, this SHOULD work, however it appears it does not.
  // session.defaultSession.cookies
  //   .set({
  //     url: 'http://localhost:3000/',
  //     name: 'jwt',
  //     value: 'testValue',
  //   })
  //   .then(
  //     () => {
  //       console.log('Done');
  //     },
  //     (error) => {
  //       console.log('Error', error);
  //     },
  //   );

  // This works, albeit a bit more invasive.
  // FIXME: Work out strategy for setting JWT here - perhaps this makes the authCode exchange request
  //        from the main process and saves the JWT to storage.
  // This could also mean we can use local JWT tools that work in node to decode the contents of the
  // JWT as needed, including the user's info and when the JWT expires.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: [
        'http://localhost:3000/*',
        'https://queuebot.steglasaurous.com/*',
        'https://queuebot-dev.steglasaurous.com/*',
      ],
    },
    (details, callback) => {
      details.requestHeaders['Cookie'] = 'jwt=balls;';
      callback({ requestHeaders: details.requestHeaders });
    },
  );
}

app.on('ready', bootstrap);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
