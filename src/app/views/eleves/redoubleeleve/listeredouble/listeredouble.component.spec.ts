import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeredoubleComponent } from './listeredouble.component';

describe('ListeredoubleComponent', () => {
  let component: ListeredoubleComponent;
  let fixture: ComponentFixture<ListeredoubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeredoubleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeredoubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
