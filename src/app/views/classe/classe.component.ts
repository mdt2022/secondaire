import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classe',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // Liste des éléments
  elements = [
    { number: 1, description: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { number: 2, description: 'Helium', weight: 4.0026, symbol: 'He' },
    { number: 3, description: 'Lithium', weight: 6.941, symbol: 'Li' },
    { number: 4, description: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { number: 5, description: 'Boron', weight: 10.811, symbol: 'B' },
    { number: 6, description: 'Carbon', weight: 12.0107, symbol: 'C' },
    { number: 7, description: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { number: 8, description: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { number: 9, description: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { number: 10, description: 'Neon', weight: 20.1797, symbol: 'Ne' },
    { number: 11, description: 'Sodium', weight: 22.9897, symbol: 'Na' },
    { number: 12, description: 'Magnesium', weight: 24.305, symbol: 'Mg' },
    { number: 13, description: 'Aluminium', weight: 26.9815, symbol: 'Al' },
    { number: 14, description: 'Silicon', weight: 28.085, symbol: 'Si' },
    { number: 15, description: 'Phosphorus', weight: 30.9738, symbol: 'P' },
    { number: 16, description: 'Sulfur', weight: 32.065, symbol: 'S' },
    { number: 17, description: 'Chlorine', weight: 35.45, symbol: 'Cl' },
    { number: 18, description: 'Argon', weight: 39.948, symbol: 'Ar' },
    { number: 19, description: 'Potassium', weight: 39.098, symbol: 'K' },
    { number: 20, description: 'Calcium', weight: 40.078, symbol: 'Ca' }
  ];

  // Variables pour la pagination
  page: number = 1;
  pageSize: number = 5;  // Afficher 5 éléments par page
  filterTerm: string = '';  // Pour le filtre
  // Variable pour contrôler la visibilité du formulaire
  isFormVisible: boolean = false;

  // Calculer le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.filteredElements().length / this.pageSize);
  }
  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  // Obtenir les éléments filtrés
  filteredElements() {
    return this.elements.filter((element) =>
      element.description.toLowerCase().includes(this.filterTerm.toLowerCase())
    ).slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  // Fonction pour changer la page
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }
}
