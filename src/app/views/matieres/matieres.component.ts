import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Matiere } from '../../model/matiere.model';
import { HttpClientModule } from '@angular/common/http';
import { MatiereService } from '../../service/matiere.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.scss']
})
export class MatieresComponent implements OnInit {
  matieres: Matiere[] = [];
  currentPage = 1;

  constructor(private matiereService: MatiereService, private router: Router) {}

  ngOnInit(): void {
    this.getAllMatieres();
  }

  getAllMatieres(): void {
    this.matiereService.getAllMatieres().subscribe({
      next: (data) => this.matieres = data,
      error: (error) => console.error('Erreur lors de la récupération des matières', error)
    });
  }

  modifierMatiere(id: number): void {
    this.router.navigate(['/matierecreation', id]);
  }

  supprimerMatiere(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matière ?')) {
      this.matiereService.deleteMatiere(id).subscribe({
        next: () => {
          this.matieres = this.matieres.filter(m => m.id !== id);
        },
        error: (err) => console.error("Erreur lors de la suppression", err)
      });
    }
  }
}
