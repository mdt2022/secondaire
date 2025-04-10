import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Matiere } from '../../../model/matiere.model';
import { Enseignant } from '../../../model/enseignant.model';
import { Classe } from '../../../model/classe.model';
import { EmploidutempService } from '../../../service/emploidutemp.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { ClasseService } from '../../../service/classe.service';
import { MatiereService } from '../../../service/matiere.service';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClasseEcoleService } from '../../../service/classeecole.service';

@Component({
  selector: 'app-creationemploidutemps',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './creationemploidutemps.component.html',
  styleUrl: './creationemploidutemps.component.scss'
})
export class CreationemploidutempsComponent implements OnInit {
  emploiForm!: FormGroup;

  annees: Anneeuv[] = [];
  matieres: Matiere[] = [];
  professeurs: Enseignant[] = [];
  classes: Classe[] = [];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempService,
    private anneeuvService: AnneeuvService,
    private matiereService: MatiereService,
    private classeEcoleService: ClasseEcoleService,
    private enseignantService: EnseignantService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      annee: ['', Validators.required],
      jour: ['', Validators.required],
      matiere: ['', Validators.required],
      professeur: ['', Validators.required],
      classe: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required]
    });

    this.loadData();
  }

  loadData() {
    this.anneeuvService.getAllAnnee().subscribe(data => this.annees = data);
    this.matiereService.getAllMatieres().subscribe(data => this.matieres = data);

    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user.administrateur.ecole.idEcole;

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe({
        next: (data) => { this.professeurs = data; },
        error: (err) => { console.error("Erreur enseignants", err); }
      });

      this.classeEcoleService.getClassesByEcole(ecoleId).subscribe({
        next: (data) => { this.classes = data; },
        error: (err) => { console.error("Erreur classes", err); }
      });
    } else {
      console.error("ID école introuvable !");
    }
  }

  onSubmit() {
    if (this.emploiForm.valid) {
      this.isLoading = true;

      const formValues = this.emploiForm.value;

      const selectedAnnee = this.annees.find(a => a.id === +formValues.annee);
    const selectedMatiere = this.matieres.find(m => m.id === +formValues.matiere);
    const selectedProfesseur = this.professeurs.find(p => p.id === +formValues.professeur);
    const selectedClasse = this.classes.find(c => c.id === +formValues.classe);
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

      const emploi: any = {
      anneeuv: selectedAnnee,
      matiere: selectedMatiere,
      professeur: selectedProfesseur,
      classe: selectedClasse,
      jour: formValues.jour,
      heuredebut: formValues.heuredebut,
      heurefin: formValues.heurefin,
      ecole: { idEcole: ecoleId }
      };

      this.emploiService.createEmploi(emploi).subscribe({
        next: (data) => {
          console.log("Enregistré avec succès", data);
          alert("Emploi du temps enregistré !");
          this.router.navigate(['/emploidutemps/emploidutemps']);
        },
        error: (err) => {
          console.error("Erreur:", err);
          alert("Erreur lors de l'enregistrement !");
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    } else {
      alert("Veuillez remplir tous les champs !");
    }
  }
}
