/**
 * Interface for a CE rule.
 */
export interface CERule {
  ceRuleId: number;
  ceCategoryId: number;
  ceUnitTypeId: number;
  name: string;
  startYear: number;
  endYear: number;
  yearSpan: number;
  isActive: number;
}

/**
 * Interface for a CE Rule Condition.
 */
export interface CERuleCondition {
  ceRuleConditionId: number;
  ceRuleId: number;
  ceCategoryId: number;
  ceTypeId: number;
  goal: number;
  maxAmount: number;
  isTask: boolean;
  isDoubleCounted: boolean;
  yearSpan: number;
  startYear: number;
  endYear: number;
  isActive: boolean;
}
