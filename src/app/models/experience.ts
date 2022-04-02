import { CECategory } from './category';
import { CELocation } from './location';

/**
 * Model for a CE Experience.
 */
export class CEExperience {
  public ceExperienceId = 0;
  public userId = 0;
  public location: CELocation = new CELocation();
  public carryForward = true;
  public programTitle = '';
  public eventName? = '';
  public startDate = '';
  public endDate = '';
  public description? = '';
  public notes? = '';
  public categories: CECategory[] = [];
  public amounts: CEExperienceAmount[] = [];
}

/**
 * CE Experience time amounts.
 */
export class CEExperienceAmount {
  public ceExperienceAmountId = 0;
  public ceExperienceId = 0;
  public ceUnitId = 0;
  public amount = 0.0;
}

/**
 * CE Experience Units.
 */
export interface CEUnit {
  ceUnitId: number;
  parentUnitId: number;
  unitSingular: string;
  unitPlural: string;
  isDisabled: boolean;
  conversionFormula: string;
}

/**
 * Interface for the DTO for adding
 * or updating a DTO.
 */
export interface AddExDTO {
  [key: string]: any;
  ceDate?: string;
  carryForward?: boolean;
  ceLocationId?: number;
  description?: string;
  eventName?: string;
  notes?: string;
  programTitle?: string;
  timeSpentChild?: number;
  timeSpentParent?: number;
}
