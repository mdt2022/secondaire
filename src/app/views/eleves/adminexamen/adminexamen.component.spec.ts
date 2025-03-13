import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminexamenComponent } from './adminexamen.component';

describe('AdminexamenComponent', () => {
  let component: AdminexamenComponent;
  let fixture: ComponentFixture<AdminexamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminexamenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminexamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
