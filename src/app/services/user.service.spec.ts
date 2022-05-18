import { TestBed } from '@angular/core/testing';

import { CEUserService } from './user.service';

describe('UserService', () => {
  let service: CEUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
