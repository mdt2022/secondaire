import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { Administrateur } from '../../model/administrateur';
import { AdministrateurService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrateur',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './administrateur.component.html',
  styleUrls: ['./administrateur.component.scss']
})
export class AdministrateurComponent implements OnInit {
  administrateurs: Administrateur[] = [];

  constructor(private adminService: AdministrateurService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.administrateurs = data;
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger les administrateurs', 'error')
    });
  }

Supprimer(id?: number) {
  if (!id) return;

  Swal.fire({
    title: 'Suppression',
    text: 'Voulez-vous vraiment supprimer cet administrateur ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminService.delete(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'L’administrateur a été supprimé avec succès',
            timer: 1500,
            showConfirmButton: false
          });
          this.getAll(); 
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de supprimer cet administrateur'
          });
        }
      });
    }
  });
}
}
