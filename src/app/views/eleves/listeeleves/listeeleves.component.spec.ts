import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeelevesComponent } from './listeeleves.component';

describe('ListeelevesComponent', () => {
  let component: ListeelevesComponent;
  let fixture: ComponentFixture<ListeelevesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeelevesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeelevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
