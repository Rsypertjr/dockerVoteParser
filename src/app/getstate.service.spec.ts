import { TestBed } from '@angular/core/testing';

import { GetstateService } from './getstate.service';

describe('GetstateService', () => {
  let service: GetstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
