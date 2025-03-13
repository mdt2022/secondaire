import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassageeleveComponent } from './passageeleve.component';

describe('PassageeleveComponent', () => {
  let component: PassageeleveComponent;
  let fixture: ComponentFixture<PassageeleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassageeleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassageeleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
