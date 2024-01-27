import * as fs from 'fs';

export class SettingsStoreService {
  constructor(private filePath: string) {}

  setValue(key: string, value: string) {
    let settings: any;
    if (!fs.existsSync(this.filePath)) {
      // assume we need to create it.
      settings = {};
    } else {
      settings = JSON.parse(fs.readFileSync(this.filePath).toString());
    }

    settings[key] = value;

    fs.writeFileSync(this.filePath, JSON.stringify(settings));

    console.log('Wrote setting to settings file', {
      filePath: this.filePath,
      key: key,
      value: value,
    });
  }

  getValue(key: string): string | undefined {
    let settings: any;
    if (!fs.existsSync(this.filePath)) {
      // assume we need to create it.
      settings = {};
    } else {
      settings = JSON.parse(fs.readFileSync(this.filePath).toString());
    }

    if (settings[key]) {
      return settings[key];
    }
    return undefined;
  }
}
