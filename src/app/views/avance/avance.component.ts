import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
  empreintes: any[] = [];
  filteredEmpreintes: any[] = [...this.empreintes];
  searchTerm: string = '';

  ngOnInit(): void {
    this.empreintes = JSON.parse(localStorage.getItem('empreintes') || '[]');
    this.filteredEmpreintes = [...this.empreintes];
  }

  onSearch(): void {
    this.filteredEmpreintes = this.empreintes.filter(emp =>
      emp.enseignant.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.mois.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.anneeScolaire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.montant.toString().includes(this.searchTerm) ||
      emp.dateEmpreinte.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Méthode pour supprimer une empreinte
  deleteEmpreinte(index: number): void {
    // Supprimer l'élément à l'index spécifié
    this.empreintes.splice(index, 1);
    this.filteredEmpreintes = [...this.empreintes]; // Mettre à jour filteredEmpreintes

    // Mettre à jour localStorage avec les empreintes restantes
    localStorage.setItem('empreintes', JSON.stringify(this.empreintes));
  }
}
