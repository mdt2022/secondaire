import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../../service/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-classe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-classe.component.html',
  styleUrl: './note-classe.component.scss'
})
export class NoteClasseComponent {
  noteForm!: FormGroup;
  annees: any[] = [];
  classes: any[] = [];
  matieres: any[] = [];
  periodes: any[] = [];
  eleves: any[] = [];

  constructor(private fb: FormBuilder, private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      anneeuv: [''],
      classe: [''],
      matiere: [''],
      periode: ['']
    });

    // this.chargerListes();
  }

  // chargerListes() {
  //   this.noteService.getAnnees().subscribe(data => this.annees = data);
  //   this.noteService.getClasses().subscribe(data => this.classes = data);
  //   this.noteService.getMatieres().subscribe(data => this.matieres = data);
  //   this.noteService.getPeriodes().subscribe(data => this.periodes = data);
  // }

  chargerEleves() {
    const idClasse = this.noteForm.value.classe;
    // this.noteService.getElevesParClasse(idClasse).subscribe(data => {
    //   this.eleves = data;
    //   this.ajouterChampsNotes();
    // });
  }

  ajouterChampsNotes() {
    this.eleves.forEach((eleve, i) => {
      this.noteForm.addControl('note_classe_' + i, this.fb.control(''));
      this.noteForm.addControl('note_compo_' + i, this.fb.control(''));
    });
  }

  onSubmit() {
    const payload = {
      ...this.noteForm.value,
      eleves: this.eleves.map((eleve, i) => ({
        id: eleve.id,
        note_classe: this.noteForm.value['note_classe_' + i],
        note_compo: this.noteForm.value['note_compo_' + i]
      }))
    };

    // this.noteService.enregistrerNotes(payload).subscribe(res => {
    //   alert("Notes enregistrées avec succès !");
    // });
  }
}