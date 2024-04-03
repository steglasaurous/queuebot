import * as fs from 'fs';

export class SettingsStoreService {
  constructor(private filePath: string) {}

  setValue(key: string, value: string) {
    const settings = this.loadSettings();

    settings[key] = value;

    this.saveSettings(settings);

    console.log('Wrote setting to settings file', {
      filePath: this.filePath,
      key: key,
      value: value,
    });
  }

  getValue(key: string): string | undefined {
    const settings = this.loadSettings();
    if (settings[key]) {
      return settings[key];
    }
    return undefined;
  }

  deleteValue(key: string): void {
    const settings = this.loadSettings();
    if (settings[key]) {
      delete settings[key];
    }

    this.saveSettings(settings);
  }

  private loadSettings(): any {
    let settings;

    if (!fs.existsSync(this.filePath)) {
      // assume we need to create it.
      settings = {};
    } else {
      settings = JSON.parse(fs.readFileSync(this.filePath).toString());
    }

    return settings;
  }

  private saveSettings(settings: any): void {
    fs.writeFileSync(this.filePath, JSON.stringify(settings));
  }
}
