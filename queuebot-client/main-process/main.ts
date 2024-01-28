import { app, BrowserWindow, dialog, shell, ipcMain } from 'electron';

import * as path from 'path';
import * as url from 'url';
import { SettingsStoreService } from './settings-store.service';
// import {
//   IPC_OPEN_TWITCH_LOGIN,
//   IPC_SETTINGS_GET_VALUE,
//   IPC_SETTINGS_SET_VALUE,
//   LOGIN_URL,
// } from './constants';

export const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
export const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
export const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
export const LOGIN_URL = 'http://localhost:3000/auth/twitch';

let win: BrowserWindow | null;

// if (process.defaultApp) {
//   if (process.argv.length >= 2) {
//     app.setAsDefaultProtocolClient('requestobot', process.execPath, [
//       path.resolve(process.argv[1]),
//     ]);
//   }
// } else {
//   app.setAsDefaultProtocolClient('requestobot');
// }
//
// // Windows and Linux
// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     if (win) {
//       if (win.isMinimized()) {
//         win.restore();
//       }
//       win.focus();
//     }
//
//     dialog.showErrorBox('Welcome back', `Here you go: ${commandLine.pop()}`);
//   });
// }
//
// // MacOS
// app.on('open-url', (event, url) => {
//   dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
// });

function bootstrap() {
  const settingsService = new SettingsStoreService(
    path.join(__dirname, 'settings.json'),
  );

  ipcMain.on(IPC_SETTINGS_SET_VALUE, (event, key, value) => {
    settingsService.setValue(key, value);
  });

  ipcMain.on(IPC_SETTINGS_GET_VALUE, (event, key) => {
    return settingsService.getValue(key);
  });

  ipcMain.on(IPC_OPEN_TWITCH_LOGIN, async (event) => {
    console.log('Opening external');
    await shell.openExternal(LOGIN_URL);
    console.log('opened it');
  });

  createWindow();
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
      pathname: path.join(__dirname, '/../dist/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

  // FIXME: Confirm - is this OK security-wise?  Assuming we don't load external pages in our app..
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   // config.fileProtocol is my custom file protocol
  //   if (url.startsWith('file:')) {
  //     return { action: 'allow' };
  //   }
  //   // open url in a browser and prevent default
  //   shell.openExternal(url);
  //   return { action: 'deny' };
  // });
}

app.on('ready', bootstrap);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create whatever we need to do "backend stuff" here

// option 1: Relay requests to API via node rather than frontend doing it (requires knowledge of the JWT)
// option 2: Store and retrieve the JWT locally? Are we cool with that?
// Seems like the main issues with frontend apps reading the JWT itself is concern of a rando
// package reading it and stealing it in some fashion to impersonate the user.
