import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteClasseComponent } from './note-classe.component';

describe('NoteClasseComponent', () => {
  let component: NoteClasseComponent;
  let fixture: ComponentFixture<NoteClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoteClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
