import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatieresenseigneesComponent } from './matieresenseignees.component';

describe('MatieresenseigneesComponent', () => {
  let component: MatieresenseigneesComponent;
  let fixture: ComponentFixture<MatieresenseigneesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatieresenseigneesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatieresenseigneesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
