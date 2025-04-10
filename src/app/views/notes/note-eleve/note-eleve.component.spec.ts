import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEleveComponent } from './note-eleve.component';

describe('NoteEleveComponent', () => {
  let component: NoteEleveComponent;
  let fixture: ComponentFixture<NoteEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoteEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
