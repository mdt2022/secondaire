import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemaineComponent } from './semaine.component';

describe('SemaineComponent', () => {
  let component: SemaineComponent;
  let fixture: ComponentFixture<SemaineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemaineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
