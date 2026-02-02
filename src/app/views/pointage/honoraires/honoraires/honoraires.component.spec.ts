import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorairesComponent } from './honoraires.component';

describe('HonorairesComponent', () => {
  let component: HonorairesComponent;
  let fixture: ComponentFixture<HonorairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HonorairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HonorairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
