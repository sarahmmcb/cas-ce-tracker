import { Injectable } from '@angular/core';

import { CECredential, NationalStandard, Organization } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CEUserService {

  constructor() { }

  /**
   * Return possible actuarial credentials.
   *
   * @returns Array of credential objects.
   */
  public fetchCredentials(): CECredential[] {
    return [{
      credentialId: 1,
      organizationId: 1,
      longName: 'Fellow of the Casualty Actuarial Society',
      shortName: 'FCAS'
    }, {
      credentialId: 2,
      organizationId: 1,
      longName: 'Associate of the Casualty Actuarial Society',
      shortName: 'ACAS'
    }];
  }

  /**
  * Fetch possible national standards.
  *
  * @returns Array of national standard objects.
  */
  public fetchNationalStandards(): NationalStandard[] {
    return [{
      nationalStandardId: 1,
      owningOrganizationId: 2,
      longName: 'United States General Qualification Standard',
      shortName: 'USQS General'
    },{
      nationalStandardId: 2,
      owningOrganizationId: 2,
      longName: 'United States Specific Qualification Standard',
      shortName: 'USQS Specific'
    }];
  }

  /**
   * Fetch possible organizations.
   */
  public fetchOrganizations(): Organization[] {
    return [{
      organizationId: 1,
      longName: 'Casualty Actuarial Society',
      shortName: 'CAS'
    },{
      organizationId: 2,
      longName: 'American Academy of Actuaries',
      shortName: 'AAA'
    }];
  }
}
