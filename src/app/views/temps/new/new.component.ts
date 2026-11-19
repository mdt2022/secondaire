import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { EnseignerService } from '../../../service/enseigner.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AuthService } from '../../../service/auth.service';
import { EleveecoleService } from '../../../service/eleveecole.service';

import { Emploidutemps } from '../../../model/emploidutemps';
import { Enseigner } from '../../../model/enseigner';
import { Enseignant } from '../../../model/enseignant';
import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { User } from '../../../model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit {

  emploiForm!: FormGroup;

  enseignes: Enseigner[] = [];
  enseignants: Enseignant[] = [];
  classes: Classe[] = [];
  anneeuvs: Anneeuv[] = [];

  editMode = false;
  currentId?: number;
  user!: User;

  effectifClasse: number | null = null;
  verificationEffectifEnCours = false;
  verificationEffectifErreur = false;
  private verificationEffectifId = 0;

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private emploiService: EmploidutempsService,
    private enseignerService: EnseignerService,
    private enseignantService: EnseignantService,
    private classeService: ClasseEcoleService,
    private anneeuvService: AnneeuvService,
    private authService: AuthService,
    private eleveecoleService: EleveecoleService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();

    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required],
      matiere: ['', Validators.required],
      enseignant: ['', Validators.required],
      classe: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadDonnees();

    const emploiToEdit = history.state?.emploi as Emploidutemps | undefined;
    if (emploiToEdit) {
      this.edit(emploiToEdit);
    }
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) {
      this.emploiForm.markAllAsTouched();
      Swal.fire('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    const f = this.emploiForm.value;

    const matiereId = Number(f.matiere);
    const professeurId = Number(f.enseignant);
    const classeId = Number(f.classe);
    const anneeuvId = Number(f.anneeuv);

    const payload = {
      jour: f.jour,
      heuredebut: f.heuredebut,
      heurefin: f.heurefin,
      matiere: { id: matiereId },
      professeur: { id: professeurId },
      classe: { id: classeId },
      anneeuv: { id: anneeuvId },
      ecole: { idEcole: this.user.administrateur.ecole.idEcole }
    } as Partial<Emploidutemps>;

    const idEcole = this.user.administrateur.ecole.idEcole;
    this.emploiService.parJour(f.jour, anneeuvId, idEcole).subscribe({
      next: emploisDuJour => {
        const doublon = emploisDuJour.some(emploi =>
          emploi.id !== this.currentId && this.estDoublon(emploi, payload)
        );
        if (doublon) {
          Swal.fire(
            'Emploi déjà existant',
            'Un emploi du temps identique existe déjà pour ce professeur, cette classe, cette matière, ce jour et ces horaires.',
            'warning'
          );
          return;
        }

        this.verifierEffectifEtEnregistrer(payload, anneeuvId, classeId, idEcole);
      },
      error: err => {
        console.error('Erreur vérification doublon emploi du temps', err);
        Swal.fire(
          'Vérification impossible',
          'Impossible de vérifier si cet emploi du temps existe déjà. Aucun emploi du temps n’a été enregistré.',
          'error'
        );
      }
    });
  }

  private verifierEffectifEtEnregistrer(
    payload: Partial<Emploidutemps>,
    anneeuvId: number,
    classeId: number,
    idEcole: number
  ): void {
    if (!this.editMode) {
      this.verificationEffectifEnCours = true;
      this.eleveecoleService.getByClasseAndAnnee([
        String(anneeuvId),
        String(idEcole),
        String(classeId)
      ]).subscribe({
        next: inscriptions => {
          this.verificationEffectifEnCours = false;
          this.effectifClasse = inscriptions.length;
          if (inscriptions.length === 0) {
            Swal.fire('Classe sans élèves', 'Impossible de créer un emploi du temps pour une classe sans élève inscrit durant cette année.', 'warning');
            return;
          }
          this.enregistrer(payload);
        },
        error: () => {
          this.verificationEffectifEnCours = false;
          this.verificationEffectifErreur = true;
          Swal.fire('Vérification impossible', 'L’effectif de la classe n’a pas pu être vérifié. Aucun emploi du temps n’a été créé.', 'error');
        }
      });
      return;
    }

    this.enregistrer(payload);
  }

  private estDoublon(emploi: Emploidutemps, candidat: Partial<Emploidutemps>): boolean {
    const normaliserHeure = (heure: string): string => heure?.split(':').slice(0, 2).join(':');

    return emploi.jour === candidat.jour
      && normaliserHeure(emploi.heuredebut) === normaliserHeure(candidat.heuredebut ?? '')
      && normaliserHeure(emploi.heurefin) === normaliserHeure(candidat.heurefin ?? '')
      && Number(emploi.matiere?.id) === Number(candidat.matiere?.id)
      && Number(emploi.professeur?.id) === Number(candidat.professeur?.id)
      && Number(emploi.classe?.id) === Number(candidat.classe?.id)
      && Number(emploi.anneeuv?.id) === Number(candidat.anneeuv?.id);
  }

  private enregistrer(payload: Partial<Emploidutemps>): void {
    const req = this.editMode && this.currentId
      ? this.emploiService.update(this.currentId, payload as Emploidutemps)
      : this.emploiService.create(payload as Emploidutemps);

    req.subscribe({
      next: () => {
        this.resetForm();
        Swal.fire('Succès', 'L’emploi du temps a été enregistré.', 'success');
        this.backToList();
      },
      error: (err) => {
        console.error('Erreur API :', err);
        Swal.fire('Erreur', 'Impossible d’enregistrer l’emploi du temps.', 'error');
      }
    });
  }

  verifierEffectifClasse(): void {
    const classeId = Number(this.emploiForm.get('classe')?.value);
    const anneeuvId = Number(this.emploiForm.get('anneeuv')?.value);
    const idEcole = this.user.administrateur.ecole.idEcole;
    const verificationId = ++this.verificationEffectifId;

    this.effectifClasse = null;
    this.verificationEffectifEnCours = false;
    this.verificationEffectifErreur = false;
    if (!classeId || !anneeuvId) return;

    this.verificationEffectifEnCours = true;
    this.eleveecoleService.getByClasseAndAnnee([
      String(anneeuvId),
      String(idEcole),
      String(classeId)
    ]).subscribe({
      next: inscriptions => {
        if (verificationId !== this.verificationEffectifId) return;
        this.effectifClasse = inscriptions.length;
        this.verificationEffectifEnCours = false;
        if (inscriptions.length === 0) {
          Swal.fire('Classe sans élèves', 'Aucun élève n’est inscrit dans cette classe pour l’année sélectionnée.', 'warning');
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Effectif vérifié : ${inscriptions.length} élève(s).`,
            showConfirmButton: false,
            timer: 2500
          });
        }
      },
      error: () => {
        if (verificationId !== this.verificationEffectifId) return;
        this.verificationEffectifErreur = true;
        this.verificationEffectifEnCours = false;
        Swal.fire('Vérification impossible', 'L’effectif de la classe n’a pas pu être vérifié.', 'error');
      }
    });
  }

  loadDonnees(): void {
    const idEcole = this.user.administrateur.ecole.idEcole;

    this.enseignantService.getEnseignantEcole(idEcole).subscribe(d => this.enseignants = d);
    this.enseignerService.getAllForEcole(idEcole).subscribe(d => this.enseignes = d);
    this.classeService.getAllClasseParEcole(idEcole).subscribe(d => this.classes = d);
    this.anneeuvService.getAll().subscribe(d => this.anneeuvs = d);
  }

  edit(e: Emploidutemps): void {
    this.editMode = true;
    this.currentId = e.id;

    this.emploiForm.patchValue({
      jour: e.jour,
      heuredebut: e.heuredebut,
      heurefin: e.heurefin,
      matiere: e.matiere?.id,
      enseignant: e.professeur?.id,
      classe: e.classe?.id,
      anneeuv: e.anneeuv?.id
    });
  }

  resetForm(): void {
    this.verificationEffectifId++;
    this.emploiForm.reset();
    this.editMode = false;
    this.currentId = undefined;
    this.effectifClasse = null;
    this.verificationEffectifEnCours = false;
    this.verificationEffectifErreur = false;
  }

  backToList(): void {
    this.router.navigate(['/emploidutemps/liste']);
  }
}
