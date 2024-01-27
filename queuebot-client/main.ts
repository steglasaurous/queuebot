import { app, BrowserWindow, dialog, shell } from 'electron';

import * as path from 'path';
import * as url from 'url';

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
  // FIXME: Continue here - do create window and setup preloads, services, etc.
}

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

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

app.on('ready', createWindow);
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
