import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListepassageComponent } from './listepassage.component';

describe('ListepassageComponent', () => {
  let component: ListepassageComponent;
  let fixture: ComponentFixture<ListepassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListepassageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListepassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
