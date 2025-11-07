import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EleveService } from '../../../service/eleve.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { ClasseService } from '../../../service/classe.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AcademieService } from '../../../service/academie.service';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  user!: User;
  form!: FormGroup;
  classes: any[] = [];
  annees: any[] = [];
  academies: any[] = [];
  loading: boolean = false;
  editMode: boolean = false;
  currentId?: number; // ID de l'affectation si édition

  constructor(
    private fb: FormBuilder,
    private eleveService: EleveService,
    private eleveecoleService: EleveecoleService,
    private classeecoleService: ClasseEcoleService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private authService: AuthService,
    private academieService: AcademieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.loadRelations();

    this.form = this.fb.group({
      eleve: this.fb.group({
        matricule: ['', Validators.required],
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        datedn: ['', Validators.required],
        lieudn: ['', Validators.required],
        prenompere: [''],
        prenommere: [''],
        nommere: [''],
        nationalite: [''],
        sexe: ['', Validators.required]
      }),
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required],
      academie: [null]
    });

    // Vérifie si on est en mode édition
    const affectationId = this.route.snapshot.paramMap.get('id');
    if (affectationId) {
      this.editMode = true;
      this.currentId = Number(affectationId);
      this.loadAffectation(this.currentId);
    }
  }

  loadRelations() {
    this.classeecoleService.getAllClasseParEcole(this.user.administrateur.ecole.idEcole)
      .subscribe(data => this.classes = data);
    this.anneeService.getAll().subscribe(data => this.annees = data);
    this.academieService.getAll().subscribe(data => this.academies = data);
  }

  // Charger l'affectation existante pour édition
  loadAffectation(id: number) {
    this.eleveecoleService.getById(id).subscribe({
      next: (affectation) => {
        //console.log(affectation.classe.nom+"mdt++++")
        // Classe
        const classe = this.classes.find(c => c.id === affectation.classe.id) || null;
        // Année
        const annee = this.annees.find(a => a.id === affectation.anneeuv.id) || null;
        // Académie
        const academie = this.academies.find(ac => ac.id === affectation.academie.id) || null;
        // Patch les valeurs dans le formulaire
        this.form.patchValue({
          eleve: {
            matricule: affectation.eleve.matricule,
            nom: affectation.eleve.nom,
            prenom: affectation.eleve.prenom,
            datedn: affectation.eleve.datedn,
            lieudn: affectation.eleve.lieudn,
            prenompere: affectation.eleve.prenompere,
            prenommere: affectation.eleve.prenommere,
            nommere: affectation.eleve.nommere,
            nationalite: affectation.eleve.nationalite,
            sexe: affectation.eleve.sexe
          },
          classe: classe,
          anneeuv: annee,
          academie: academie
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les données pour l’édition.'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const eleveData = this.form.get('eleve')?.value;
    
    const affectationData = {
      ecole: this.user.administrateur.ecole,
      classe: this.form.value.classe,
      anneeuv: this.form.value.anneeuv,
      academie: this.form.value.academie
    };

    if (this.editMode && this.currentId) {
        const payload = {
          eleve: { ...eleveData, id: eleveData.id }, // inclure l'ID de l'élève
          ecole: affectationData.ecole,
          classe: affectationData.classe,
          anneeuv: affectationData.anneeuv,
          academie: affectationData.academie
        };
      // Mode édition
      this.eleveecoleService.update(this.currentId, payload).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Modifié !',
            text: 'L’élève et son affectation ont été mis à jour avec succès.',
            timer: 2500,
            showConfirmButton: false
          });
          this.router.navigate(['/eleveecole']); // Retour à la liste
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de mettre à jour.' });
        }
      });
    } else {
      // Mode création
      this.eleveService.create(eleveData).subscribe({
        next: (eleve) => {
          this.eleveecoleService.create({ eleve, ...affectationData }).subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: '✅ Élève enregistré et affecté avec succès !',
                timer: 2500,
                showConfirmButton: false
              });
              this.form.reset();
            },
            error: (err) => {
              this.loading = false;
              Swal.fire({ icon: 'error', title: 'Erreur', text: 'Erreur lors de l’affectation.' });
            }
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Erreur', text: 'Erreur lors de l’enregistrement de l’élève.' });
        }
      });
    }
  }
}
