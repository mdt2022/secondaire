import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePointageComponent } from './liste-pointage.component';

describe('ListePointageComponent', () => {
  let component: ListePointageComponent;
  let fixture: ComponentFixture<ListePointageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePointageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListePointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
