import { Component } from '@angular/core';
import { NoteService } from '../../service/note.service';
import { Note } from '../../model/note.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {

  notes: Note[] = [];  // Liste des notes
  annee: any;  // Année scolaire
  currentPage: number = 1;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.getNotes();  // Récupère les notes
    this.annee = { nom: '2025/2026' };  // Exemple d'année, vous pouvez la récupérer via un service
  }

  getNotes(): void {
    this.noteService.getAllEnseignant(this.search).subscribe((data: Note[]) => {
      this.notes = data;
    });
  }
  search(search: any) {
    throw new Error('Method not implemented.');
  }

  modifierNote(id: number): void {
    // Logique pour modifier une note
  }

  supprimerNote(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette note ?')) {
      // Logique pour supprimer une note
    }
  }
}
