import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../service/classe.service';
import { AuthService } from '../../service/auth.service';
import { Classe } from '../../model/classe.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ecole } from '../../model/ecole.model';
import { EcoleService } from '../../service/ecole.service';
import { User } from '../../model/user.model';
import { ClasseEcoleService } from '../../service/classeecole.service';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = []; // Liste des classes de l'école

  ecoles: Ecole[] = []; // ✅ Déclarer la variable pour éviter l'erreur
  isFormVisible: boolean = false;
  searchText: string = '';
  currentPage: number = 1;
  user!: User;
  selectedClasseId!: any;
  selectedEcoleId!: any;
  constructor(
    private classeService: ClasseService,
    private ecoleService: EcoleService,
    private classeEcoleService: ClasseEcoleService,
    private authService: AuthService
  ) {}

    ngOnInit(): void {
      this.user = this.authService.getUserFromLocalStorage()
      this.getClassesByEcole()
      this.getAllEcole()
      this. getAllClasse()

    }
    getClassesByEcole() {
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

    getAllClasse() {
      this.classeService.getAllClasse().subscribe(
        (data) => {
          this.classes = data; // ✅ Correction pour correspondre au template
        },
        (error) => {
          console.error('Erreur lors de la récupération des ecoles', error);
        }
      );
    }

    getAllEcole() {
      this.ecoleService.getAllEcole().subscribe(
        (data) => {
          this.ecoles = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des ecoles', error);
        }
      );
    }



    deleteClasse(id: number): void {
      if (confirm('Voulez-vous vraiment supprimer cette classe ?')) {
        ;
      }
    }
    filteredClasses(){
      return this.classes.filter(classe =>
        (classe.nom ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (classe.filiere ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (classe.description ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (classe.options ?? '').toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    affecterClasse(): void {
      console.log("Classe ID sélectionnée :", this.selectedClasseId);
      console.log("École ID sélectionnée :", this.selectedEcoleId);
      console.log("Toutes les classes :", this.classes);
      console.log("Toutes les écoles :", this.ecoles);

      const classe = this.classes.find(c => c.id === +this.selectedClasseId);
      const ecole = this.ecoles.find(e => e.idEcole === +this.selectedEcoleId);

      if (classe && ecole) {
        const classeEcole = {
          classe: classe,
          ecole: ecole
        };

        this.classeEcoleService.createClasseEcole(classeEcole).subscribe({
          next: (response) => {
            console.log('Classe affectée avec succès', response);
            this.getAllClasse();
            this.toggleForm();
          },
          error: (error) => {
            console.error('Erreur lors de l’affectation', error);
          }
        });
      } else {
        console.error("Classe ou école introuvable.");
      }
    }



    toggleForm(): void {
      this.isFormVisible = !this.isFormVisible;
    }
  }






