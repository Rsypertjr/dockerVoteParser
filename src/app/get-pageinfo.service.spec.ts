import { TestBed } from '@angular/core/testing';

import { GetPageinfoService } from './get-pageinfo.service';

describe('GetPageifoService', () => {
  let service: GetPageinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPageinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
