import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraisecondaireComponent } from './fraisecondaire.component';

describe('FraisecondaireComponent', () => {
  let component: FraisecondaireComponent;
  let fixture: ComponentFixture<FraisecondaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraisecondaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FraisecondaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
