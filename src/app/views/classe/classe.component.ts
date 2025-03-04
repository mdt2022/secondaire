import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../service/classe.service';
import { AuthService } from '../../service/auth.service';
import { Classe } from '../../model/classe.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ecole } from 'src/app/model/ecole.model';
import { EcoleService } from '../../service/ecole.service';

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

  constructor(
    private classeService: ClasseService,
    private ecoleService: EcoleService,

    private authService: AuthService
  ) {}

    ngOnInit(): void {
            this.getAllEcole();
      this.getAllClasse();
      this.getClasseEcole();

    }

    getAllEcole() {
      this.ecoleService.getAllEcole().subscribe(
        (data) => {
          this.ecoles = data; // ✅ Correction pour correspondre au template
        },
        (error) => {
          console.error('Erreur lors de la récupération des ecoles', error);
        }
      );
    }

    getAllClasse() {
     this.classeService.getAllClasse().subscribe(
      (data)=>{
        this.classes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des classes', error);
      }
    );
    }

    getClasseEcole() {
      const user = this.authService.getUserFromLocalStorage(); // ✅ Récupérer l'utilisateur connecté
      const ecoleId = user?.ecole?.idEcole; // ✅ Extraire l'ID de l'école

      if (ecoleId) {
        this.classeService.getClasseEcole(ecoleId).subscribe(
          (data) => {
            this.classes = data; // ✅ Stocker les classes récupérées
            console.log("Classes après mise à jour :", this.classes);
            this.classes.forEach((classe, index) => {
              console.log(`Classe ${index + 1}:`, classe);
            });
          },
          (error) => {
            console.error('Erreur lors de la récupération des classes', error);
          }
        );
      } else {
        console.error("Impossible de récupérer l'ID de l'école.");
      }
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

    toggleForm(): void {
      this.isFormVisible = !this.isFormVisible;
    }
  }






