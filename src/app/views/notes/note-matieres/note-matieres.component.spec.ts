import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteMatieresComponent } from './note-matieres.component';

describe('NoteMatieresComponent', () => {
  let component: NoteMatieresComponent;
  let fixture: ComponentFixture<NoteMatieresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteMatieresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoteMatieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
