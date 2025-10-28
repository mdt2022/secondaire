import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignerComponent } from './enseigner.component';

describe('EnseignerComponent', () => {
  let component: EnseignerComponent;
  let fixture: ComponentFixture<EnseignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnseignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
