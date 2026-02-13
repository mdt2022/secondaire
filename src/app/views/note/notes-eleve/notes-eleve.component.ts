import { Component, OnInit } from '@angular/core';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { EnseignerService } from '../../../service/enseigner.service';
import { PeriodeService } from '../../../service/periode.service';
import { NoteService } from '../../../service/note.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-notes-eleve',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './notes-eleve.component.html',
  styleUrl: './notes-eleve.component.scss'
})
export class NotesEleveComponent implements OnInit {
 periodes: any[] = [];
  annees: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  matieres: any[] = [];

  periodeId: number | null = null;
  anneeId: number | null = null;
  classeEcoleId: number | null = null;
  eleveEcoleId: number | null = null;
  matiereId: number | null = null;

  noteClasse: number | null = null;
  noteCompo: number | null = null;

  message: string = '';
  success: boolean = true;

  ecoleId: number | null = null;

  etablissement = '';


  constructor(
    private periodeService: PeriodeService,
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private eleveService: EleveecoleService,
    private enseignerService: EnseignerService,
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  this.ecoleId = this.authService.getEcoleId();
  if (!this.ecoleId) {
    console.error('École non trouvée');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user')!);
    this.etablissement = user.administrateur.ecole.nomEcole;

  this.periodeService.getAll().subscribe(data => this.periodes = data);
  this.anneeService.getAll().subscribe(data => this.annees = data);
  this.classeService.getAllClasseParEcole(this.ecoleId).subscribe(data => this.classes = data);
}


  chargerEleves() {
if (this.anneeId == null || this.classeEcoleId == null || this.ecoleId == null) return;

this.eleveService
  .getByClasseAndAnnee([String(this.anneeId), String(this.ecoleId), String(this.classeEcoleId)])
  .subscribe(data => this.eleves = data);

}


 chargerMatieres() {
  if (this.ecoleId == null || this.classeEcoleId == null) return;

this.enseignerService
  .getMatiereEcoleClasse([this.ecoleId, this.classeEcoleId])
  .subscribe(data => this.matieres = data);
 }

  enregistrerNote() {
    if (!this.eleveEcoleId || !this.matiereId || this.noteClasse === null || this.noteCompo === null
        || !this.periodeId || !this.anneeId) {
      this.message = 'Veuillez remplir tous les champs';
      this.success = false;
      return;
    }

    const payload = {
      periodeId: this.periodeId,
      anneeId: this.anneeId,
      classeEcoleId: this.classeEcoleId,
      eleveEcoleId: this.eleveEcoleId,
      matiereId: this.matiereId,
      noteClasse: this.noteClasse,
      noteCompo: this.noteCompo
    };

this.noteService.saveNoteEleve(payload).subscribe({
  next: (res: any) => {
    console.log("SUCCESS:", res);

    if (res.message) {
      this.message = res.message;
    } else {
      this.message = 'Note enregistrée avec succès';
    }

    this.success = true;
    this.noteClasse = null;
    this.noteCompo = null;
  },

  error: (err) => {
    console.log("ERROR:", err);

    if (err.error?.error) {
      this.message = err.error.error;
    }
    else if (err.error?.message) {
      this.message = err.error.message;
    }
    else if (typeof err.error === 'string') {
      this.message = err.error;
    }
    else {
      this.message = 'Erreur serveur interne';
    }

    this.success = false;
  }
});
  }
}
