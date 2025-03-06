import { CommonModule } from '@angular/common'; // ✅ Importer CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-avance',
  standalone:true,
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
  empreintes: any[] =[];

filteredEmpreintes = [...this.empreintes];
searchTerm = '';
  ngOnInit(): void {
    // Charger les empreintes depuis localStorage
    this.empreintes = JSON.parse(localStorage.getItem('empreintes') || '[]');
    this.filteredEmpreintes = this.empreintes;
  }

  onSearch() {
    this.filteredEmpreintes = this.empreintes.filter(emp =>
        emp.enseignant.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.mois.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.anneeScolaire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.montant.toString().includes(this.searchTerm) ||
        emp.dateEmpreinte.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
}


}
