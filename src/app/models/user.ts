
export class User {
  public id = 0;
  public firstName = '';
  public lastName = '';
  public email = '';
  public userName = '';
  public accountStatus: AccountStatus;
  public title = '';
  public canSignSAO = false;
  public credentials = [] as Credential[];
  public nationalStandard = new NationalStandard();
}

export class UserData {
  public title = '';
  public canSignSAO = false;
  public credentials = [] as Credential[];
  public nationalStandard = new NationalStandard();
}

export enum AccountStatus {
  Active,
  Closed,
  Locked,
  Blocked,
  Unknown
}

export class NationalStandard {
  public nationalStandardId = 0;
  public owningOrganizationId = 0;
  public longName = '';
  public shortName = '';
}

export class Organization {
  public organizationId = 0;
  public longName = '';
  public shortName = '';
}

export class Credential {
  public credentialId = 0;
  public organizationId = 0;
  public longName = '';
  public shortName = '';
}
