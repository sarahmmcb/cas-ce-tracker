import { TestBed } from '@angular/core/testing';

import { CEExperienceService } from './experience.service';

describe('ExperienceService', () => {
  let service: CEExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
