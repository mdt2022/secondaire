import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheValideeComponent } from './fiche-validee.component';

describe('FicheValideeComponent', () => {
  let component: FicheValideeComponent;
  let fixture: ComponentFixture<FicheValideeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheValideeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheValideeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
