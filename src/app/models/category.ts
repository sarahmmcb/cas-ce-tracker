/**
 * Interface for a Category.
 */
export interface CECategory {
  ceCategoryId: number;
  parentCategoryId: number;
  nationalStandardId: number;
  categoryListId: number;
  name: string;
  displayName: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  isProgressShown?: boolean;
}

/**
 * Interface for a category list.
 */
export interface CECategoryList {
  ceCategoryListId: number;
  name: string;
  displayQuestion?: string;
  displayOrder?: number;
  categories?: CECategory[];
}
