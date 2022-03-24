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
  description: string;
  startYear: number;
  endYear: number;
  isProgressShown: boolean;
  isActive: boolean;
}

/**
 * Interface for a category list.
 */
export interface CategoryList {
  ceCategoryListId: number;
  name: string;
  displayOrder: number;
  isActive: boolean;
}
