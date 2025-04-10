import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatiereService } from '../../service/matiere.service';
import { Matiere } from '../../model/matiere.model';
import { EnseignerService } from '../../service/enseigner.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Enseigner } from '../../model/enseigner.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';
import { Anneeuv } from '../../model/anneeuv.model';
import { Ecole } from '../../model/ecole.model';

@Component({
  selector: 'app-matieresenseignees',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './matieresenseignees.component.html',
  styleUrls: ['./matieresenseignees.component.scss']
})
export class MatieresenseigneesComponent implements OnInit {
  enseigners: Enseigner[] = [];
  ecole: any;

  currentPage: number = 1;
  user!: User;
  errorMessage!: string;

  constructor(
    private enseignerService: EnseignerService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
  
    if (this.user && this.user.administrateur && this.user.administrateur.ecole) {
      const ecoleId = this.user.administrateur.ecole.idEcole;
      const anneeId = this.user.parametre.anneepardefaut.id;
      console.log('École ID:', ecoleId);
      console.log('Année ID:', anneeId);
      this.getAllMatieres(); // <-- N'oublie pas d'appeler la méthode
    } else {
      console.error('Données utilisateur manquantes ou incorrectes :', this.user);
    } 
  }
  

  getAllMatieres(): void {

    this.user = this.authService.getUserFromLocalStorage();
      const ecoleId = this.user.administrateur.ecole.idEcole;
      const anneeId = this.user.parametre.anneepardefaut.id;
  
      if (ecoleId && anneeId) {
        this.enseignerService.getMatieresParEcoleEtAnnee(ecoleId, anneeId).pipe(
          catchError(error => {
            console.error('Erreur lors du chargement des matières:', error);
            this.errorMessage = 'Impossible de charger les matières. Veuillez réessayer plus tard.';
            return of([]); // Retourne un tableau vide en cas d'erreur
          })
        ).subscribe((data) => {
          if (data.length === 0) {
            console.log('Aucune matière trouvée pour cette école et année');
          } else {
            this.enseigners = data;
            console.log(data);
          }
        });
        
      } else {
        this.errorMessage = 'École ou année manquante dans les données utilisateur.';
      }
    
  }

  modifierMatiere(id: number): void {
    this.router.navigate([`/modifier-matiere/${id}`]);
  }

  supprimerMatiere(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matière ?')) {
      this.enseignerService.deleteEnseigner(id).subscribe(() => {
        this.getAllMatieres();  // Rafraîchir la liste après suppression
      });
    }
  }
}
