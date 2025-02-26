import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementsecondairesComponent } from './paiementsecondaires.component';

describe('PaiementsecondairesComponent', () => {
  let component: PaiementsecondairesComponent;
  let fixture: ComponentFixture<PaiementsecondairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementsecondairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementsecondairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
