import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleverComponent } from './relever.component';

describe('ReleverComponent', () => {
  let component: ReleverComponent;
  let fixture: ComponentFixture<ReleverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
