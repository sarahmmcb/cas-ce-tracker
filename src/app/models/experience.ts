import { Location } from './location';

export class Experience {
  public experienceId = 0;
  public userId = 0;
  public location: Location = new Location();
  public carryForward = false;
  public programTitle = '';
  public eventName? = '';
  public startDate = '';
  public endDate = '';
  public description? = '';
  public notes? = '';
  public categories: IExperienceCategory[] = [];
  public amounts: ExperienceAmount[] = [];
}

/**
 * CE Experience time amounts. A single experience
 * may have more than one of these if multiple units
 * are associated with each experience, i.e. hours and credits
 */
export class ExperienceAmount {
  public experienceAmountId = 0;
  public experienceId = 0;
  public unitId = 0;
  public amount = 0.0;
  public unitSingular? = '';
  public unitPlural? = '';
}

export interface IExperienceCategory {
  experienceCategoryId: number;
  experienceId: number;
  categoryId: number;
  categoryListId: number;
  displayName?: string;
}

export interface IUnit {
  unitId: number;
  parentUnitId: number;
  unitSingular: string;
  unitPlural: string;
  isDisabled: boolean;
  conversionFormula: string;
}

export interface IUpdateExperience {
  experienceId: number;
  startDate: string;
  endDate: string;
  carryForward: boolean;
  experienceCategories: number[];
  locationId: number;
  description: string | null | undefined;
  eventName: string | null | undefined;
  notes: string | null | undefined;
  programTitle: string | null | undefined;
  timeSpentChild: number;
  timeSpentParent: number;
}
