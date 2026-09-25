import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesClasseComponent } from './notes-classe.component';

describe('NotesClasseComponent', () => {
  let component: NotesClasseComponent;
  let fixture: ComponentFixture<NotesClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotesClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
