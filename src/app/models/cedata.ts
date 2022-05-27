/**
 * Interface for data to be fed into the
 * Compliance graphic
 */
export class CEData {
  title = '';
  unitLongName = '';
  unitShortName = '';
  categoryGroups: [];
  complianceStatus: '';
}

/**
 * Possible Compliance Statuses.
 * These should eventually be moved to a database.
 */
export enum ComplianceStatus {
  compliant = 'Compliant',
  nonCompliant = 'Non-Compliant',
  naic = 'Compliant - NAIC Statement of Actuarial Opinion',
  notActive = 'Not Currently Providing Actuarial Services'
}

/**
 * Interface for group of categories on
 * on the CEData graphic.
 * Ex. 'General' and 'Specific'.
 */
export interface CategoryGroup {
  categories: CategoryData[];
}

/**
 * Interface for CE data for each
 * category on the CEData graphic.
 */
export interface CategoryData {
  displayName: string;
  goal: number;
  amountCompleted: number;
  percentCompleted: number;
}
