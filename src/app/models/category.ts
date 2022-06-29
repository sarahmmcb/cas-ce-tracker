/**
 * Interface for a Category.
 */
export interface ICECategory {
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
export interface ICECategoryList {
  ceCategoryListId: number;
  name: string;
  displayQuestion?: string;
  displayOrder?: number;
  categories?: ICECategory[];
}
