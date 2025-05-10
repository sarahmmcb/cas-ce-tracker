import { TestBed } from '@angular/core/testing';

import { CEAlertService } from './alert.service';

describe('AlertService', () => {
  let service: CEAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
