export class CEData {
  unitLongName = '';
  unitShortName = '';
  categoryData = [] as CategoryData[];
  complianceStatus = '';
  nationalStandardId: number;
  title: string;
}

export enum ComplianceStatus {
  compliant = 'Compliant',
  nonCompliant = 'Non-Compliant',
  naic = 'Compliant - NAIC Statement of Actuarial Opinion',
  notActive = 'Not Currently Providing Actuarial Services'
}

export interface CategoryData {
  categoryId: number;
  displayName: string;
  minimum: number;
  maximum: number;
  amountCompleted: number;
}
