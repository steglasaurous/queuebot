export interface WindowWithElectron extends Window {
  settings?: {
    setValue: any;
    getValue: any;
  };
}
