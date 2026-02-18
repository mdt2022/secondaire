import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../../service/note.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { MatiereService } from '../../../service/matiere.service';
import { PeriodeService } from '../../../service/periode.service';
import { AuthService } from '../../../service/auth.service';
import { EnseignerService } from '../../../service/enseigner.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-notes-classe',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notes-classe.component.html',
  styleUrl: './notes-classe.component.scss'
})
export class NotesClasseComponent implements OnInit {

  form!: FormGroup;
  eleves: any[] = [];
  elevesCharges = false;

  annees: any[] = [];
  classes: any[] = [];
  matieres: any[] = [];
  periodes: any[] = [];

  doublons: string[] = [];
  loadingEleves = false;
  etablissement = '';
  ecoleId: number | null = null;
  classeEcoleId: number | null = null;



  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private eleveService: EleveecoleService,
    private anneeService: AnneeuvService,
    private classeService: ClasseEcoleService,
    private matiereService: MatiereService,
    private periodeService: PeriodeService,
    private authService: AuthService,
    private enseignerService: EnseignerService
  ) {}

  ngOnInit(): void {

    const ecoleId = this.authService.getEcoleId();
    if (!ecoleId) {
      console.error('École non trouvée');
      return;
    }
     const user = JSON.parse(localStorage.getItem('user')!);
    this.etablissement = user.administrateur.ecole.nomEcole;

    this.form = this.fb.group({
      ecoleId: [ecoleId, Validators.required],
      anneeId: [null, Validators.required],
      classeId: [null, Validators.required],
      matiereId: [null, Validators.required],
      periodeId: [null, Validators.required],
      notes: this.fb.array([])
    });

    this.loadAnnees();
    this.loadClasses(ecoleId);
    this.loadMatieres();
    this.loadPeriodes();
  }

  get notes(): FormArray {
    return this.form.get('notes') as FormArray;
  }

  loadAnnees() {
    this.anneeService.getAll().subscribe(data => this.annees = data);
  }

  loadClasses(ecoleId: number) {
    this.classeService.getAllClasseParEcole(ecoleId).subscribe({
      next: data => this.classes = data,
      error: err => console.error(err)
    });
  }

 loadMatieres() {
  if (!this.ecoleId || !this.classeEcoleId) {
    this.matieres = [];
    return;
  }

  this.enseignerService
    .getMatiereEcoleClasse([this.ecoleId, this.classeEcoleId])
    .subscribe({
      next: data => this.matieres = data,
      error: err => {
        console.error('Erreur chargement matières', err);
        this.matieres = [];
      }
    });
}


  loadPeriodes() {
    this.periodeService.getAll().subscribe(data => this.periodes = data);
  }

  chargerEleves() {

    const { anneeId, ecoleId, classeId } = this.form.value;
    if (!anneeId || !classeId || !ecoleId) return;

    this.loadingEleves = true;
    this.elevesCharges = false;
    this.notes.clear();

    this.eleveService
      .getByClasseAndAnnee([anneeId, ecoleId, classeId])
      .subscribe({
        next: eleves => {

          this.eleves = eleves;

          eleves.forEach(e => {
            this.notes.push(this.fb.group({
              eleveEcoleId: [e.id, Validators.required],
              noteClasse: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
              noteCompo: [null, [Validators.required, Validators.min(0), Validators.max(20)]]
            }));
          });

          this.elevesCharges = eleves.length > 0;
          this.loadingEleves = false;
        },
        error: err => {
          console.error(err);
          this.loadingEleves = false;
        }
      });
  }

  onAnneeOuClasseChange() {
  const { anneeId, classeId, ecoleId } = this.form.value;

  this.ecoleId = ecoleId;
  this.classeEcoleId = classeId;

  if (anneeId && classeId && ecoleId) {
    this.chargerEleves();
    this.loadMatieres();
  } else {
    this.eleves = [];
    this.matieres = [];
    this.notes.clear();
  }
}


enregistrer() {

  if (this.form.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulaire incomplet',
      text: 'Veuillez remplir correctement toutes les notes.',
      confirmButtonText: 'OK'
    });
    return;
  }

  this.noteService.saveNotesClasse(this.form.value).subscribe({
    next: (res: any) => {

      this.doublons = res.doublons || [];

      let message = `Notes enregistrées : ${res.notesEnregistrees || 0}`;

      if (this.doublons.length) {
        message += `\nDoublons ignorés pour : ${this.doublons.join(', ')}`;
      }

      Swal.fire({
        icon: 'success',
        title: res.message || 'Opération réussie',
        html: message.replace(/\n/g, '<br/>'), // retour à la ligne
        confirmButtonText: 'OK'
      });

      // Recharger les élèves pour mise à jour
      this.chargerEleves();
    },
    error: err => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.error?.error || 'Erreur lors de l’enregistrement',
        confirmButtonText: 'OK'
      });
    }
  });
}

}
