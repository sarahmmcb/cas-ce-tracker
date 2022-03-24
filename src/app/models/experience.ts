/**
 * Model for a CE Experience.
 */
export class CEExperience {
  public ceExperienceId = 0;
  public userId = 0;
  public location = '';
  public carryForward = false;
  public programTitle = '';
  public eventName? = '';
  public startDate = '';
  public endDate = '';
  public description? = '';
  public notes? = '';
  public categories: string[] = [];
  public amounts: CEExperienceAmount[] = [];
}

/**
 * CE Experience Amounts.
 */
export class CEExperienceAmount {
  public amount = 0;
  public unitSingular = '';
  public unitPlural = '';
}
