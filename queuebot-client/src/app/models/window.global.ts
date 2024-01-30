export interface WindowWithElectron extends Window {
  settings?: {
    setValue: any;
    getValue: any;
    openTwitchLogin: any;
  };
  login?: {
    openTwitchLogin: any;
    onProtocolHandle: any;
  };
  songs?: {
    processSong: any;
  };
}
