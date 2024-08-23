
export interface ICategory {
  categoryId: number;
  nationalStandardId: number;
  categoryListId: number;
  name: string;
  displayName: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  isProgressShown?: boolean;
}

export interface ICategoryList {
  categoryListId: number;
  name: string;
  displayQuestion?: string;
  displayOrder?: number;
  categories?: ICategory[];
}

export interface IExperienceCategory {
  experienceCateggoryId: number;
  experienceId: number;
  categoryId: number;
  displayName?: string;
}
