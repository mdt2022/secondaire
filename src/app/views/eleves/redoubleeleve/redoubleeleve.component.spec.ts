import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedoubleeleveComponent } from './redoubleeleve.component';

describe('RedoubleeleveComponent', () => {
  let component: RedoubleeleveComponent;
  let fixture: ComponentFixture<RedoubleeleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedoubleeleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedoubleeleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
