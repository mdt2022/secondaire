import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEleveComponent } from './notes-eleve.component';

describe('NotesEleveComponent', () => {
  let component: NotesEleveComponent;
  let fixture: ComponentFixture<NotesEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesEleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotesEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
