/**
 * Type for an alert.
 */
export interface CEAlert {
  title: string;
  content: string;
  buttons: CEAlertButton[];
  type: CEAlertType;
}

/**
 * Enum of alert types.
 */
export enum CEAlertType {
  info = 'info',
  warning = 'warning',
  confirm = 'confirm',
  error = 'error'
}

/**
 * Interface for an alert button.
 */
export interface CEAlertButton {
  text: string;
  role: string;
  id: string;
  handler?: (input?: any) => any;
}
