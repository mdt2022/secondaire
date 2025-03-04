import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemaineprofComponent } from './semaineprof.component';

describe('SemaineprofComponent', () => {
  let component: SemaineprofComponent;
  let fixture: ComponentFixture<SemaineprofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemaineprofComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SemaineprofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
