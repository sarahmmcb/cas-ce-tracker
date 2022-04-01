import { CECategory } from './category';
import { CELocation } from './location';

/**
 * Model for a CE Experience.
 */
export class CEExperience {
  public ceExperienceId = 0;
  public userId = 0;
  public location: CELocation;
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
 * CE Experience Amounts.
 */
export class CEExperienceAmount {
  public nationalStandardCEUnitId = 0;
  public parentUnitId = 0;
  public amount? = 0;
  public unitSingular = '';
  public unitPlural = '';
  public isDisabled = false;
  public conversionFormula = '';
}
