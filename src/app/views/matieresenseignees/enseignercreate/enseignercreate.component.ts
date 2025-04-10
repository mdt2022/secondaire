import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatiereService } from '../../../service/matiere.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { Matiere } from '../../../model/matiere.model';
import { Enseignant } from '../../../model/enseignant.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Classe } from '../../../model/classe.model';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { Enseigner } from '../../../model/enseigner.model';
import { EnseignerService } from '../../../service/enseigner.service';

@Component({
  selector: 'app-enseignercreate',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './enseignercreate.component.html',
  styleUrls: ['./enseignercreate.component.scss']
})
export class EnseignercreateComponent implements OnInit {
  form!: FormGroup;
  enseignants: Enseignant[] = [];
  matiere: Matiere[] = [];
  classes: Classe[] = [];
  retourAffectation: string = '';
  ecoleId!: number;
  user!: User;
  anneeId!: number;

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    private enseignerService: EnseignerService,
    private classeEcoleService: ClasseEcoleService, 
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      enseignant: ['', Validators.required],
      nombreclasse: ['', [Validators.required, Validators.min(1)]],
      matieresClasses: this.fb.array([]),
      ecole: ['']
    });

    this.user = this.authService.getUserFromLocalStorage();
    this.ecoleId = this.user?.administrateur?.ecole?.idEcole;
    this.anneeId = this.user?.parametre?.anneepardefaut?.id;

    this.form.get('ecole')?.setValue(this.ecoleId);

    this.getEnseignantsByEcole();
    this.getAllMatieres();
    this.getClassesByEcole();
  }

  getClassesByEcole(): void {
    this.classeEcoleService.getClassesByEcole(this.ecoleId).subscribe((data) => {
      this.classes = data;
    });
  }

  getEnseignantsByEcole(): void {
    this.enseignantService.getEnseignantsByEcole(this.ecoleId).subscribe((data) => {
      this.enseignants = data;
    });
  }

  getAllMatieres(): void {
    this.matiereService.getAllMatieres().subscribe((data) => {
      this.matiere = data;
    });
  }

  get matieresClasses(): FormArray {
    return this.form.get('matieresClasses') as FormArray;
  }

  affecter(): void {
    const nombreClasse = +this.form.get('nombreclasse')?.value;
    this.matieresClasses.clear();
    for (let i = 0; i < nombreClasse; i++) {
      this.matieresClasses.push(this.fb.group({
        classe: ['', Validators.required],
        matiere1: ['', Validators.required],
        matiere2: ['', Validators.required],
        matiere3: ['', Validators.required],
        matiere4: ['', Validators.required],
        matiere5: ['', Validators.required],
        matiere6: ['', Validators.required]
      }));
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const enseignantId = +formValue.enseignant;
      const ecoleId = +formValue.ecole;

      formValue.matieresClasses.forEach((item: any) => {
        const classeId = +item.classe;

        for (let i = 1; i <= 6; i++) {
          const matiereKey = 'matiere' + i;
          const matiereId = +item[matiereKey];

          if (matiereId) {
            const matiereObj = this.matiere.find(m => m.id === matiereId);

            const enseigner: Enseigner = {
              id: 0,
              enseignant: {
                id: enseignantId,
                matricule: '',
                nom: '',
                prenom: '',
                adresse: '',
                telephone: '',
                email: '',
                lieun: '',
                datedn: '',
                photo: '',
                ecole: {
                  idEcole: ecoleId,
                  nomEcole: '',
                  descriptionEcole: '',
                  categorie: ''
                },
                tarif: 0
              },
              classe: {
                id: classeId,
                nom: '',
                description: '',
                filiere: '',
                options: ''
              },
              ecole: {
                idEcole: ecoleId,
                nomEcole: '',
                descriptionEcole: '',
                categorie: ''
              },
              matiere: {
                id: matiereId,
                libelle: matiereObj?.libelle || '',
                coefficient: matiereObj?.coefficient || 0,
                horaire: matiereObj?.horaire || 0
              },
              anneeuv: {
                id: this.anneeId,
                nom: '',
                debutannee: '',
                finannee: ''
              }
            };

            console.log('Envoi de l\'affectation :', enseigner);

            this.enseignerService.createEnseigner(enseigner).subscribe({
              next: () => {
                this.retourAffectation = 'Matière affectée avec succès !';
              },
              error: (err) => {
                console.error(err);
                this.retourAffectation = 'Erreur lors de l’enregistrement.';
              }
            });
          }
        }
      });
    } else {
      this.retourAffectation = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
