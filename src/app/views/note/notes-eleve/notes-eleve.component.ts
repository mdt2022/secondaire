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
import Swal from 'sweetalert2';


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
    .subscribe({
      next: data => {
        this.eleves = data;

        if (this.eleves.length > 0) {
          this.eleveEcoleId = this.eleves[0].id;
        }

        this.chargerMatieres();
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les élèves',
          confirmButtonText: 'OK'
        });
      }
    });
}

chargerMatieres() {
  if (this.ecoleId == null || this.classeEcoleId == null) return;

  this.enseignerService
    .getMatiereEcoleClasse([this.ecoleId, this.classeEcoleId])
    .subscribe({
      next: data => {
        this.matieres = data;

        if (this.matieres.length > 0) {
          this.matiereId = this.matieres[0].id;
        }
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les matières',
          confirmButtonText: 'OK'
        });
      }
    });
}


enregistrerNote() {
  if (!this.eleveEcoleId || !this.matiereId || this.noteClasse === null || this.noteCompo === null
      || !this.periodeId || !this.anneeId) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez remplir tous les champs',
      confirmButtonText: 'OK'
    });
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
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: res.message || 'Note enregistrée avec succès',
        confirmButtonText: 'OK'
      });
      this.noteClasse = null;
      this.noteCompo = null;
    },
    error: (err) => {
      console.error(err);
      let errorMsg = 'Erreur serveur interne';
      if (err.error?.error) errorMsg = err.error.error;
      else if (err.error?.message) errorMsg = err.error.message;
      else if (typeof err.error === 'string') errorMsg = err.error;

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMsg,
        confirmButtonText: 'OK'
      });
    }
  });
}

}
