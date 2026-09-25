import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { Administrateur } from '../../model/administrateur';
import { AdministrateurService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user';

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
  user!: User
  constructor(
    private adminService: AdministrateurService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();  
    // 🔴 Sécurisation avec ?. pour éviter le crash de l'écran blanc
    const roleNom = this.user?.administrateur?.role?.nom || '';
    
    console.log("[LOG] Rôle détecté à l'initialisation :", roleNom);
    this.getAll(roleNom);
  }

  getAll(roleNom: string): void {
    this.adminService.getAll(roleNom).subscribe({
      next: (data) => {
        this.administrateurs = data;
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger les administrateurs', 'error')
    });
  }

Supprimer(id?: number) {
  const roleNom = this.user?.administrateur?.role?.nom || '';
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
          this.getAll(roleNom); 
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
toggleStatut(admin: any): void {
  const nouvelEtat = !admin.active;
  const actionText = nouvelEtat ? 'activer' : 'désactiver';
  const confirmationText = nouvelEtat ? 'réactivé' : 'désactivé';

  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment ${actionText} le compte de ${admin.prenom} ${admin.nom} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: nouvelEtat ? '#198754' : '#dc3545', // Vert pour activer, rouge pour bloquer
    cancelButtonColor: '#6c757d',
    confirmButtonText: `Oui, ${actionText} !`,
    cancelButtonText: 'Annuler',
    reverseButtons: true
  }).then((result) => {
    // Si l'utilisateur clique sur le bouton de confirmation
    if (result.isConfirmed) {
      
      this.adminService.changerStatut(admin.id, nouvelEtat).subscribe({
        next: (response) => {
          // Met à jour l'affichage localement sans recharger la page
          admin.active = nouvelEtat; 
          
          // Alerte de succès 🎉
          Swal.fire({
            title: 'Succès !',
            text: `Le compte a été ${confirmationText} avec succès.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error("Erreur lors du changement de statut", err);
          
          // Alerte d'erreur ❌
          Swal.fire({
            title: 'Erreur',
            text: "Une erreur est survenue lors de l'opération.",
            icon: 'error'
          });
        }
      });

    }
  });
}
}
