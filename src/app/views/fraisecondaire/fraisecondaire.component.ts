import { FraiscolaireService } from './../../service/fraiscolaire.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Fraiscolaire } from '../../model/fraiscolaire.model';
import { AnneeuvService } from '../../service/anneeuv.service';
import { Anneeuv } from '../../model/anneeuv.model';
import { Classe } from '../../model/classe.model';
import { ClasseService } from '../../service/classe.service';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user.model';
import { Ecole } from '../../model/ecole.model';
import { ClasseEcoleService } from '../../service/classeecole.service';
@Component({
  selector: 'app-fraisecondaire',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './fraisecondaire.component.html',
  styleUrl: './fraisecondaire.component.scss'
})
export class FraisecondaireComponent implements OnInit {
  fraisScolaireForm: FormGroup;
  searchForm: FormGroup;
  classes: Classe[] = [];
  annees: Anneeuv[] = [];
  ecole: Ecole[] = [];
  fraisScolaires: Fraiscolaire[] = [];
  search: any;
  user!: User;
  totalMontant: number = 0;
  totalReduction: number = 0;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fraiscolaireService: FraiscolaireService,
    private anneeService: AnneeuvService,
    private authService: AuthService,
    private classeEcoleService: ClasseEcoleService


  ) {
    this.fraisScolaireForm = this.fb.group({
      classe: ['', Validators.required],
      annee: ['', Validators.required],
      montant: ['', Validators.required],
      reduction: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      classe: ['', Validators.required],
      annee: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAnnees();
    this.getClasseEcole();
  }


  loadAnnees() {
    this.anneeService.getAllAnnee().subscribe((data) => {
      this.annees = data;
    });
  }
  getClasseEcole() {
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
  searchFraisScolaires() {

    if (this.searchForm.valid) {
      const { classe, annee } = this.searchForm.value;

      this.fraiscolaireService.getAllFrai().subscribe((data: Fraiscolaire[]) => {
        console.log("Données reçues :", data);

        this.fraisScolaires = data.filter(frais =>
          frais.classe?.id == classe && frais.anneeuv?.id == annee
        );

        if (this.fraisScolaires.length === 0) {
          console.warn("Aucun frais scolaire trouvé pour ces critères !");
        }
          this.totalMontant = this.fraisScolaires.reduce((sum, frais) => sum + frais.montant, 0);
          this.totalReduction = this.fraisScolaires.reduce((sum, frais) => sum + frais.reduction, 0);
      }, error => {
        console.error("Erreur lors de la récupération des frais scolaires", error);
      });
    }
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
