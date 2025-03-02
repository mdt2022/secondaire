import { TestBed } from '@angular/core/testing';

import { GestiondesclassesService } from './gestiondesclasses.service';

describe('GestiondesclassesService', () => {
  let service: GestiondesclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestiondesclassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
