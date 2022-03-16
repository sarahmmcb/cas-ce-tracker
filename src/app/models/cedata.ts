/**
 * Interface for data to be fed into the
 * Compliance graphic
 */
export interface CEData {
  title: string;
  unitLongName: string;
  unitShortName: string;
  categoryGroups: CategoryGroup[];
  complianceStatus: ComplianceStatus;
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
 * Interface for Category Group.
 */
export interface CategoryGroup {
  categories: CategoryData[];
}

/**
 * Interface for Category Data.
 */
export interface CategoryData {
  displayName: string;
  min: number;
  max: number;
  amount: number;
}
