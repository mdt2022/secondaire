import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignercreateComponent } from './enseignercreate.component';

describe('EnseignercreateComponent', () => {
  let component: EnseignercreateComponent;
  let fixture: ComponentFixture<EnseignercreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignercreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnseignercreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
