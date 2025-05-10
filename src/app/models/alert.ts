
export interface CEAlert {
  title: string;
  content: string;
  buttons: CEAlertButton[];
  type: string;
  routeOnClose?: string;
}

export enum CEAlertType {
  info = 'info',
  warning = 'warning',
  confirm = 'confirm',
  error = 'error'
}

export interface CEAlertButton {
  text: string;
  role: string;
  id: string;
  handler?: (input?: any) => any;
  action?: (input?: any) => any;
}

export enum CEAlertButtonRole {
  confirm = 'confirm',
  cancel = 'cancel'
}
