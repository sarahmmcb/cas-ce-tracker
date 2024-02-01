import { ICategory } from './category';
import { ILocation } from './location';

export class IExperience {
  public ceExperienceId = 0;
  public userId = 0;
  public location: ILocation = new ILocation();
  public carryForward = false;
  public programTitle = '';
  public eventName? = '';
  public startDate = '';
  public endDate = '';
  public description? = '';
  public notes? = '';
  public categories: ICategory[] = [];
  public amounts: IExperienceAmount[] = [];
}

/**
 * CE Experience time amounts. A single experience
 * may have more than one of these if multiple units
 * are associated with each experience, i.e. hours and credits
 */
export class IExperienceAmount {
  public experienceAmountId = 0;
  public experienceId = 0;
  public unitId = 0;
  public amount = 0.0;
  public unitSingular? = '';
  public unitPlural? = '';
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
  date: string;
  carryForward: boolean;
  categories: number[];
  locationId: number;
  description: string | null | undefined;
  eventName: string | null | undefined;
  notes: string | null | undefined;
  programTitle: string | null | undefined;
  timeSpentChild: number;
  timeSpentParent: number;
}
