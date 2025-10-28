import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportdecoursComponent } from './supportdecours.component';

describe('SupportdecoursComponent', () => {
  let component: SupportdecoursComponent;
  let fixture: ComponentFixture<SupportdecoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportdecoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportdecoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
