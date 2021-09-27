import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GetstateService } from './getstate.service';

describe('GetstateService', () => {
  let service: GetstateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],

    });
    
  });

  beforeEach(() => {
    service = TestBed.inject(GetstateService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
