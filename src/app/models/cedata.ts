export class CEData {
  unitLongName = '';
  unitShortName = '';
  categoryGroups = [] as CategoryGroup[];
  complianceStatus = '';
}

export enum ComplianceStatus {
  compliant = 'Compliant',
  nonCompliant = 'Non-Compliant',
  naic = 'Compliant - NAIC Statement of Actuarial Opinion',
  notActive = 'Not Currently Providing Actuarial Services'
}

// categories are grouped into two types: General and Specific
export interface CategoryGroup {
  nationalStandardId: number;
  title: string;
  categories: CategoryData[];
}

export interface CategoryData {
  categoryId: number;
  displayName: string;
  minimum: number;
  maximum: number;
  amountCompleted: number;
}
