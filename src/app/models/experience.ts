import { ICECategory } from './category';
import { ICELocation } from './location';

export class ICEExperience {
  public ceExperienceId = 0;
  public userId = 0;
  public location: ICELocation = new ICELocation();
  public carryForward = false;
  public programTitle = '';
  public eventName? = '';
  public startDate = '';
  public endDate = '';
  public description? = '';
  public notes? = '';
  public categories: ICECategory[] = [];
  public amounts: ICEExperienceAmount[] = [];
}

/**
 * CE Experience time amounts. A single experience
 * may have more than one of these if multiple units
 * are associated with each experience, i.e. hours and credits
 */
export class ICEExperienceAmount {
  public ceExperienceAmountId = 0;
  public ceExperienceId = 0;
  public ceUnitId = 0;
  public amount = 0.0;
  public unitSingular? = '';
  public unitPlural? = '';
}

export interface ICEUnit {
  ceUnitId: number;
  parentUnitId: number;
  unitSingular: string;
  unitPlural: string;
  isDisabled: boolean;
  conversionFormula: string;
}

export interface IUpdateExperience {
  ceExperienceId: number;
  ceDate?: string;
  carryForward?: boolean;
  categories: number[];
  ceLocationId?: number;
  description?: string;
  eventName?: string;
  notes?: string;
  programTitle?: string;
  timeSpentChild?: number;
  timeSpentParent?: number;
}
