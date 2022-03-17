/**
 * Interface for a Category.
 */
export interface CECategory {
  cECategoryId: number;
  parentCategoryId: number;
  nationalStandardId: number;
  categoryListId: number;
  name: string;
  displayName: string;
  description: string;
  startYear: number;
  endYear: number;
  isProgressShown: boolean;
  isActive: boolean;
}

/**
 * Interface for a category list.
 */
