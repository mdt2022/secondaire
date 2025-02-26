import { TestBed } from '@angular/core/testing';

import { EcoleService } from './ecole.service';

describe('EcoleService', () => {
  let service: EcoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
