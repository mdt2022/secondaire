import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeaexclureComponent } from './listeaexclure.component';

describe('ListeaexclureComponent', () => {
  let component: ListeaexclureComponent;
  let fixture: ComponentFixture<ListeaexclureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeaexclureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeaexclureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
