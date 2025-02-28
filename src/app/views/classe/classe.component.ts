import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../service/classe.service';
import { AuthService } from '../../service/auth.service';
import { Classe } from '../../model/classe.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = []; // Liste des classes de l'école
  ecoles: any[] = []; // ✅ Déclarer la variable pour éviter l'erreur
  page: number = 1;
  pageSize: number = 5;
  filterTerm: string = '';
  isFormVisible: boolean = false;

  constructor(
    private classeService: ClasseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getClasseEcole();
  }

  getClasseEcole() {
    const user = this.authService.getUserFromLocalStorage(); // ✅ Récupérer l'utilisateur connecté
    const ecoleId = user?.ecole?.idEcole; // ✅ Extraire l'ID de l'école

    if (ecoleId) {
      this.classeService.getClasseEcole(ecoleId).subscribe(
        (data) => {
          this.classes = data; // ✅ Stocker les classes récupérées
          console.log(data);
        },
        (error) => {
          console.error('Erreur lors de la récupération des classes', error);
        }
      );
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }

  filteredClasses() {
    return this.classes
      .filter((classe) =>
        classe.nom.toLowerCase().includes(this.filterTerm.toLowerCase())
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClasses().length / this.pageSize);
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }
}
