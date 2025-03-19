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
  user!: User
  constructor(
    private classeService: ClasseService,
    private ecoleService: EcoleService,

    private authService: AuthService
  ) {}

    ngOnInit(): void {
      this. getAllClasse()
      this.getAllEcole()
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
          this.ecoles = data; // ✅ Correction pour correspondre au template
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

    toggleForm(): void {
      this.isFormVisible = !this.isFormVisible;
    }
  }






