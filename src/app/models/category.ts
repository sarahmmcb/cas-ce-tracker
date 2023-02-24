/**
 * Interface for a Category.
 */
export interface ICategory {
  categoryId: number;
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
export interface ICategoryList {
  categoryListId: number;
  name: string;
  displayQuestion?: string;
  displayOrder?: number;
  categories?: ICategory[];
}
