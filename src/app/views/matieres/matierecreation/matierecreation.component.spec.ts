import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatierecreationComponent } from './matierecreation.component';

describe('MatierecreationComponent', () => {
  let component: MatierecreationComponent;
  let fixture: ComponentFixture<MatierecreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatierecreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatierecreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
