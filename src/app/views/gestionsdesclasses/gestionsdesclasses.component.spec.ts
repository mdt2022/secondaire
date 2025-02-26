import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionsdesclassesComponent } from './gestionsdesclasses.component';

describe('GestionsdesclassesComponent', () => {
  let component: GestionsdesclassesComponent;
  let fixture: ComponentFixture<GestionsdesclassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionsdesclassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionsdesclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
