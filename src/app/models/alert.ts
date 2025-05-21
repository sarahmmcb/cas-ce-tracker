
export interface Alert {
  title: string;
  content: string;
  buttons: AlertButton[];
  type: string;
  routeOnClose?: string;
}

export enum AlertType {
  info = 'info',
  warning = 'warning',
  confirm = 'confirm',
  error = 'error'
}

export interface AlertButton {
  text: string;
  role: string;
  id: string;
  handler?: (input?: any) => any;
  action?: (input?: any) => any;
}

export enum AlertButtonRole {
  confirm = 'confirm',
  cancel = 'cancel'
}
