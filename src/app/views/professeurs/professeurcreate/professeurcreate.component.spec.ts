import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurcreateComponent } from './professeurcreate.component';

describe('ProfesseurcreateComponent', () => {
  let component: ProfesseurcreateComponent;
  let fixture: ComponentFixture<ProfesseurcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesseurcreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfesseurcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
