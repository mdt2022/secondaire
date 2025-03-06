import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnseignantService } from '../../../service/enseignant.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { Enseignant } from '../../../model/enseignant.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-nouvelle-empreinte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [EnseignantService, AnneeuvService], // ✅ Ajout des services
  templateUrl: './nouvelle-empreinte.component.html',
  styleUrl: './nouvelle-empreinte.component.scss'
})
export class NouvelleEmpreinteComponent implements OnInit {
  empreinteForm!: FormGroup;
  empreintes: any[] = [];
  empreintesEnregistrees: any[] = [];
  enseignants: Enseignant[] = [];
  anneesScolaires: Anneeuv[] = [];
  mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];



  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private anneeService: AnneeuvService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.empreinteForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(0)]],
      enseignant: ['', Validators.required],
      mois: ['', Validators.required],
      anneeScolaire: ['', Validators.required],
      dateEmpreinte: [this.getCurrentDate(), Validators.required]
    });

    this.getAllEnseignantsByEcole();
    this.getAllAnnee();
    this.empreintesEnregistrees = JSON.parse(localStorage.getItem('empreintes') || '[]');
  }

  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage(); // ✅ Récupérer l'utilisateur connecté
    const ecoleId = user?.ecole?.idEcole; // ✅ Extraire l'ID de l'école

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.enseignants = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  getAllAnnee() {
    this.anneeService.getAllAnnee().subscribe(
      (data) => {
        this.anneesScolaires = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }
  

  onSubmit() {
    if (this.empreinteForm.valid) {
      const formData = this.empreinteForm.value;
      console.log('Formulaire soumis :', formData);

      // Simuler l'enregistrement, par exemple en sauvegardant dans localStorage
      let empreintes = JSON.parse(localStorage.getItem('empreintes') || '[]');
      empreintes.push(formData);
      localStorage.setItem('empreintes', JSON.stringify(empreintes));

      // Rediriger vers la page de recherche après création réussie
      this.router.navigate(['/avance/avance']);
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }


}

