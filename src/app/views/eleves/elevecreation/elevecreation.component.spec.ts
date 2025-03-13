import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevecreationComponent } from './elevecreation.component';

describe('ElevecreationComponent', () => {
  let component: ElevecreationComponent;
  let fixture: ComponentFixture<ElevecreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElevecreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElevecreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
