export interface WindowWithElectron extends Window {
  settings?: {
    setValue: any;
    getValue: any;
    openTwitchLogin: any;
  };
  login?: {
    openTwitchLogin: any;
  };
  songs?: {
    processSong: any;
  };
}
