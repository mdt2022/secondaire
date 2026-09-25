import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesMatiereComponent } from './notes-matiere.component';

describe('NotesMatiereComponent', () => {
  let component: NotesMatiereComponent;
  let fixture: ComponentFixture<NotesMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotesMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
