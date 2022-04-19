/**
 * User object.
 */
export class User {
  public userId = 0;
  public firstName = '';
  public lastName = '';
  public email = '';
  public roles: Role[];
  public nationalStandard: NationalStandard;
  public organizations: Organization[];
}

/**
 * User Role, i.e. Chief actuary, Appointed actuary
 */
export class Role {
  public roleId = 0;
  public nationalStandardId = 0;
  public longName = '';
  public shortName = '';
}

/**
 * National Standard, i.e. USQS
 */
export class NationalStandard {
  public nationalStandardId = 0;
  public owningOrganizationId = 0;
  public longName = '';
  public shortName = '';
}

/**
 * Organization, i.e. CAS, AAA
 */
export class Organization {
  public organizationId = 0;
  public longName = '';
  public shortName = '';
}
