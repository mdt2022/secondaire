import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FraiscolaireService } from '../../../service/fraiscolaire.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { User } from '../../../model/user.model';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AuthService } from '../../../service/auth.service';
import { EleveService } from '../../../service/eleve.service';
import { Fraiscolaire } from '../../../model/fraiscolaire.model';
import { Parametre } from '../../../model/parametre.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { Classe } from '../../../model/classe.model';
import { Eleve } from '../../../model/eleve.model';

@Component({
  selector: 'app-enregistrer-frai',
  standalone: true,
  imports:[
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './enregistrer-frai.component.html',
  styleUrl: './enregistrer-frai.component.scss'
})
export class EnregistrerFraiComponent implements OnInit {
  fraisForm!: FormGroup;
  classes: Classe[] = [];
  eleves: Eleve[] = [];
  annees: Anneeuv[] = [];
  user!: User;

  constructor(private fb: FormBuilder, private fraisService: FraiscolaireService,
    private anneeService: AnneeuvService,
    private router: Router,
    private authService: AuthService,
    private classeEcoleService: ClasseEcoleService,
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.fraisForm = this.fb.group({
      classe: ['', Validators.required],
      annee: ['', Validators.required],
      eleve: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      reduction: [0, [Validators.min(0)]]
    });
    this.loadAnnees();
    this.loadClasses();
  }

  loadAnnees() {
    this.anneeService.getAllAnnee().subscribe((data) => {
      this.annees = data;
    });
  }

  loadClasses() {
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;

    if (ecoleId) {
      this.classeEcoleService.getClassesByEcole(ecoleId).subscribe({
        next: (data) => {
          this.classes = data;
          console.log("Classes après mise à jour :", this.classes);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes', error);
        }
      });
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  onClasseChange() {
    const classeId = this.fraisForm.value.classe;
    const anneeId = this.user.parametre.anneepardefaut.id;
    const ecoleId = this.user.administrateur.ecole.idEcole;

    if (classeId && anneeId && ecoleId) {
      this.eleveService.getAllEleveecole(
        anneeId.toString(),
        ecoleId.toString(),
        classeId.toString()
      ).subscribe({
        next: (eleves) => {
          console.log("Élèves reçus :", eleves);
          this.eleves = eleves;
        },
        error: (err) => {
          console.error("Erreur lors du chargement des élèves", err);
        }
      });
    } else {
      this.eleves = [];
      console.log("Élèves vide : ", this.eleves);
    }
  }

  onSubmit(): void {
    const formData = this.fraisForm.value;

    console.log('Form data soumis :', formData);
    console.log('Élève ID :', formData.eleve);
    console.log('Classe ID :', formData.classe);
    console.log('Année ID :', formData.annee);

    const selectedEleve = this.eleves.find(eleve => eleve.id);
    const selectedClasse = this.classes.find(classe => classe.id);
    const selectedAnnee = this.annees.find(annee => annee.id);

    console.log('Élève trouvé :', selectedEleve);
    console.log('Classe trouvée :', selectedClasse);
    console.log('Année trouvée :', selectedAnnee);

    if (!selectedEleve || !selectedClasse || !selectedAnnee) {
      console.error('Données manquantes pour éléve, la classe ou année');
      return;
    }

    // Création de l'objet Fraiscolaire avec les objets complets
    const fraiscolaire: Fraiscolaire = {
      id: 0,
      ecole: this.user.administrateur.ecole,
      classe: selectedClasse,
      eleve: selectedEleve,
      anneeuv: this.user.parametre.anneepardefaut,
      montant: formData.montant,
      reduction: formData.reduction,

    };

    console.log('Frais envoyé :', fraiscolaire);

    // Envoi de la requête pour créer le frais scolaire
    this.fraisService.createFraiscolaire(fraiscolaire).subscribe({
      next: (res) => {
        console.log('Frais enregistré avec succès !', res);
      },
      error: (err) => {
        console.error('Erreur à l’enregistrement :', err);
      }
    });
  }




  navigateTo(route: string) {


  }
}
