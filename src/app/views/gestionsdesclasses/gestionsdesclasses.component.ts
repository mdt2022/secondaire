import { Component, OnInit } from '@angular/core';
import { Classe } from '../../model/classe.model';
import { GestiondesclassesService } from '../../service/gestiondesclasses.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionsdesclasses',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './gestionsdesclasses.component.html',
  styleUrl: './gestionsdesclasses.component.scss'
})
export class GestionsdesclassesComponent implements OnInit {
  Math = Math;
  classes: Classe[] = [];
  selectedClasse: Classe = { id: 0, nom: '', description: '', filiere: '', options: '' };
  searchText: string = '';
  currentPage: number = 1;

  constructor(private classeService: GestiondesclassesService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getAllClasses().subscribe(data => {
      this.classes = data;
    });
  }

  selectClasse(classe: Classe): void {
    this.selectedClasse = { ...classe };
  }

  saveClasse(): void {
    if (this.selectedClasse.id === 0) {
      this.classeService.createClasse(this.selectedClasse).subscribe(() => {
        this.loadClasses();
        this.selectedClasse = { id: 0, nom: '', description: '', filiere: '', options: '' };
      });
    } else {
      this.classeService.updateClasse(this.selectedClasse.id, this.selectedClasse).subscribe(() => {
        this.loadClasses();
        this.selectedClasse = { id: 0, nom: '', description: '', filiere: '', options: '' };
      });
    }
  }

  deleteClasse(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) { 
          this.classeService.deleteClasse(id).subscribe(() => { this.loadClasses(); });
        }
      }
  );
  }
  filteredClasses(): any[] {
    return this.classes.filter(classe =>
      classe.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      classe.filiere.toLowerCase().includes(this.searchText.toLowerCase()) ||
      classe.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
      classe.options.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  onSearch(event: Event){}
}
