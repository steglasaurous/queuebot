"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
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
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/browser/index.html'),
        protocol: 'file:',
        slashes: true,
    }));
    win.on('closed', function () {
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
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Create whatever we need to do "backend stuff" here
