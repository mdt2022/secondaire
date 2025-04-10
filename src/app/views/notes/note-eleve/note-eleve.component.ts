import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../../service/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-eleve',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-eleve.component.html',
  styleUrl: './note-eleve.component.scss'
})
export class NoteEleveComponent {

  noteForm!: FormGroup;
  annees: any[] = [];
  periodes: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  matieres: any[] = [];

  constructor(private fb: FormBuilder, private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      periode: [''],
      anneeuv: [''],
      classe: [''],
      eleve: [''],
      matiere: [''],
      note_classe: [''],
      note_compo: ['']
    });

    // this.chargerListes();
  }

  // chargerListes() {
  //   this.noteService.getAnnees().subscribe(data => this.annees = data);
  //   this.noteService.getPeriodes().subscribe(data => this.periodes = data);
  //   this.noteService.getClasses().subscribe(data => this.classes = data);
  // }

  chargerElevesEtMatieres() {
    const idClasse = this.noteForm.value.classe;
    // if (idClasse) {
    //   this.noteService.getElevesParClasse(idClasse).subscribe(data => this.eleves = data);
    //   this.noteService.getMatieresParClasse(idClasse).subscribe(data => this.matieres = data);
    // }
  }

  afficherMatieres() {
    this.chargerElevesEtMatieres();
  }

  onSubmit() {
    const payload = this.noteForm.value;
    // this.noteService.enregistrerNoteIndividuelle(payload).subscribe(() => {
    //   alert("Note enregistrée avec succès !");
    //   this.noteForm.reset();
    // });
  }
}
