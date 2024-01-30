import { app, BrowserWindow, dialog, shell, ipcMain } from 'electron';

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
    }

    dialog.showErrorBox('Welcome back', `Here you go: ${commandLine.pop()}`);
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
      preload: path.join(__dirname, '/../dist/main-process/preload.js'),
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '/../dist/render/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', bootstrap);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
