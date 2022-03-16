import { TestBed } from '@angular/core/testing';

import { CEDataService } from './cedata.service';

describe('CEDataService', () => {
  let service: CEDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
