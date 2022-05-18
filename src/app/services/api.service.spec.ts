import { TestBed } from '@angular/core/testing';

import { CEApiService } from './api.service';

describe('ApiService', () => {
  let service: CEApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
