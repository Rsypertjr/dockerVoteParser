import { TestBed } from '@angular/core/testing';

import { ParseVotesService } from './parse-votes.service';

describe('ParseVotesService', () => {
  let service: ParseVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseVotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
