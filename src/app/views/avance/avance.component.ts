import { Enseignant } from './../../model/enseignant.model';
import { Anneeuv } from './../../model/anneeuv.model';
import { EnseignantService } from './../../service/enseignant.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AnneeuvService } from './../../service/anneeuv.service';
import { AuthService } from './../../service/auth.service';

@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './avance.component.html',
  styleUrls: ['./avance.component.scss']
})
export class AvanceComponent implements OnInit {
  listeProf: Enseignant[] = [];
  searchForm: FormGroup;
  empreintes: any[] = [];
  filteredEmpreintes: any[] = [];
  enseignants : Enseignant[] = [];
  moisOptions = [
    { nom: 'Janvier' },
    { nom: 'Février' },
    { nom: 'Mars' },
    { nom: 'Avril' },
    { nom: 'Mai' },
    { nom: 'Juin' },
    { nom: 'Juillet' },
    { nom: 'Août' },
    { nom: 'Septembre' },
    { nom: 'Octobre' },
    { nom: 'Novembre' },
    { nom: 'Décembre' }
  ];
  
  anneesScolaires: Anneeuv[] = [];
  isSearched: boolean = false;

  constructor(private fb: FormBuilder,
    private anneeService: AnneeuvService,
    private authService: AuthService,
    private enseignantService: EnseignantService
  ) {
    this.searchForm = this.fb.group({
      enseignant: [''],
      mois: [''],
      anneeScolaire: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmpreintes()
    this.loadAnnees();
    this.getAllEnseignantsByEcole();
  }
  getAllEnseignantsByEcole() {
    const user = this.authService.getUserFromLocalStorage();
    const ecoleId = user?.administrateur?.ecole?.idEcole;

    if (ecoleId) {
      this.enseignantService.getEnseignantsByEcole(ecoleId).subscribe(
        (data) => {
          this.listeProf = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des enseignants', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }
  loadAnnees() {
    this.anneeService.getAllAnnee().subscribe((data) => {
      this.anneesScolaires = data;
    });
  }
  loadEmpreintes(): void {
    const storedEmpreintes = localStorage.getItem('empreintes');
    if (storedEmpreintes) {
      this.empreintes = JSON.parse(storedEmpreintes);  // Charger les données depuis localStorage
      this.filteredEmpreintes = [...this.empreintes];   // Afficher toutes les empreintes au début
    } else {
      this.empreintes = [];  // Si aucune donnée n'est trouvée, tableau vide
      this.filteredEmpreintes = [];
    }
  }
  onSearch(): void {
    const { enseignant, mois, anneeScolaire } = this.searchForm.value;
    
    // Filtrer les empreintes selon les critères
    this.filteredEmpreintes = this.empreintes.filter(emp =>
      (!enseignant || emp.enseignant === enseignant) &&
      (!mois || emp.mois === mois) &&
      (!anneeScolaire || emp.anneeScolaire === anneeScolaire)
    );
  
    // Marquer que la recherche a été effectuée
    this.isSearched = true;
  }
  

  deleteEmpreinte(index: number): void {
    this.empreintes.splice(index, 1);
    this.filteredEmpreintes = [...this.empreintes];

    localStorage.setItem('empreintes', JSON.stringify(this.empreintes));
  }
}
