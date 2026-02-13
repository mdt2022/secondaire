import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Matiere } from '../../../model/matiere';
import { NoteParMatiereDTO } from '../../../model/note-par-matiere-dto';
import { NoteService } from '../../../service/note.service';
import { EnseignerService } from '../../../service/enseigner.service';
import { PeriodeService } from '../../../service/periode.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';

@Component({
  selector: 'app-notes-matiere',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-matiere.component.html',
  styleUrls: ['./notes-matiere.component.scss']
})
export class NotesMatiereComponent implements OnInit {

  admin: any;
  ecoleId!: number;
  etablissement ='';

  periodes: any[] = [];
  annees: any[] = [];
  classes: any[] = [];
  matieres: Matiere[] = [];
  notes: NoteParMatiereDTO[] = [];

  loading = false;
  showTable = false;

  form = {
    anneeId: 0,
    classeId: 0,
    periodeId: 0,
    matiereId: 0
  };

  constructor(
    private noteService: NoteService,
    private enseignerService: EnseignerService,
    private periodeService: PeriodeService,
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.admin = JSON.parse(user);
      this.ecoleId = this.admin.administrateur.ecole.idEcole;
    }
this.etablissement = this.admin.administrateur.ecole.nomEcole;
    this.periodeService.getAll().subscribe(data => this.periodes = data);
    this.anneeService.getAll().subscribe(data => this.annees = data);
    this.classeService.getAllClasseParEcole(this.ecoleId)
      .subscribe(data => this.classes = data);
  }

  loadMatieres(): void {
    if (!this.form.anneeId || !this.form.classeId) {
      this.matieres = [];
      return;
    }

    this.enseignerService.getMatiereEcoleClasse([this.ecoleId, this.form.classeId, this.form.anneeId])
      .subscribe({
        next: (data: Matiere[]) => this.matieres = data,
        error: () => alert("Erreur lors du chargement des matières")
      });
  }

  rechercher(): void {
    if (!this.form.anneeId || !this.form.classeId || !this.form.periodeId || !this.form.matiereId) {
      alert("Veuillez sélectionner tous les champs");
      return;
    }

    this.loading = true;

this.noteService.getListeNotesParMatiere(
  this.ecoleId,
  this.form.classeId,
  this.form.anneeId,
  this.form.periodeId,
  this.form.matiereId
).subscribe({
  next: (data: NoteParMatiereDTO[]) => {
    console.log('Notes reçues', data);
    this.notes = data;
    this.showTable = true;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
    alert("Erreur lors du chargement des notes");
  }
});

  }

save(): void {
  if (!this.notes.length) return;

  const payload: NoteParMatiereDTO[] = this.notes.map(n => ({
    eleveId: n.eleveId,
    matricule: n.matricule,
    nom: n.nom,
    prenom: n.prenom,
    noteClasse: n.noteClasse ?? 0,
    noteCompo: n.noteCompo ?? 0,
    noteId: n.noteId
  }));

  this.noteService.saveNotesParMatiere(
    this.ecoleId,
    this.form.classeId,
    this.form.anneeId,
    this.form.periodeId,
    this.form.matiereId,
    payload
  ).subscribe({
    next: () => alert("Notes enregistrées avec succès"),
    error: (err) => {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  });
}



  moyenne(note: NoteParMatiereDTO): string {
    const nc = note.noteClasse || 0;
    const compo = note.noteCompo || 0;
    if (!nc && !compo) return "0.00";
    return ((nc + compo * 2) / 3).toFixed(2);
  }

  validateNote(value: number): number {
    if (value > 20) return 20;
    if (value < 0) return 0;
    return value;
  }

}
