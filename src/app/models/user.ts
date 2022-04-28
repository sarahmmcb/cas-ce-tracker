/**
 * User object.
 */
export class CEUser {
  public userId = 0;
  public firstName = '';
  public lastName = '';
  public email = '';
  public title = '';
  public nationalStandard: NationalStandard;
  public organizations?: Organization[];
  public credentials?: CECredential[];
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

/**
 * Credential object, i.e. FCAS, ACAS
 */
export class CECredential {
  public credentialId = 0;
  public organizationId = 0;
  public longName = '';
  public shortName = '';
}
