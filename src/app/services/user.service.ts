import { Injectable } from '@angular/core';

import {
  CECredential,
  CEUser,
  NationalStandard,
  Organization,
} from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: CEUser;

  constructor() {}

  public fetchCredentials(): CECredential[] {
    return [
      {
        credentialId: 1,
        organizationId: 1,
        longName: 'Fellow of the Casualty Actuarial Society',
        shortName: 'FCAS',
      },
      {
        credentialId: 2,
        organizationId: 1,
        longName: 'Associate of the Casualty Actuarial Society',
        shortName: 'ACAS',
      },
    ];
  }

  public fetchNationalStandards(): NationalStandard[] {
    return [
      {
        nationalStandardId: 1,
        owningOrganizationId: 2,
        longName: 'United States General Qualification Standard',
        shortName: 'USQS General',
      },
      {
        nationalStandardId: 2,
        owningOrganizationId: 2,
        longName: 'United States Specific Qualification Standard',
        shortName: 'USQS Specific',
      },
    ];
  }

  public fetchOrganizations(): Organization[] {
    return [
      {
        organizationId: 1,
        longName: 'Casualty Actuarial Society',
        shortName: 'CAS',
      },
      {
        organizationId: 2,
        longName: 'American Academy of Actuaries',
        shortName: 'AAA',
      },
    ];
  }
}
