import { TestBed } from '@angular/core/testing';

import { JwtStoreService } from './jwt-store.service';

describe('JwtStoreService', () => {
  let service: JwtStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
