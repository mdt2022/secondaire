import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissioneleveComponent } from './admissioneleve.component';

describe('AdmissioneleveComponent', () => {
  let component: AdmissioneleveComponent;
  let fixture: ComponentFixture<AdmissioneleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissioneleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissioneleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
