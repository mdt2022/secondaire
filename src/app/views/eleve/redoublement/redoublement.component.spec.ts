import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedoublementComponent } from './redoublement.component';

describe('RedoublementComponent', () => {
  let component: RedoublementComponent;
  let fixture: ComponentFixture<RedoublementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedoublementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedoublementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
