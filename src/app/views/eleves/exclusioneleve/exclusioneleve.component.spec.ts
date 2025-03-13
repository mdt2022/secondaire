import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusioneleveComponent } from './exclusioneleve.component';

describe('ExclusioneleveComponent', () => {
  let component: ExclusioneleveComponent;
  let fixture: ComponentFixture<ExclusioneleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusioneleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExclusioneleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
