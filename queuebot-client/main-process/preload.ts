import { contextBridge } from 'electron';
import { SettingsStoreService } from './settings-store.service';
import * as path from 'path';
import ipcRenderer = Electron.ipcRenderer;

contextBridge.exposeInMainWorld('settings', {
  setValue: (key: string, value: string) =>
    ipcRenderer.invoke('settings.setValue', key, value),
  getValue: (key: string) => ipcRenderer.invoke('settings.getValue', key),
});
