import { Component } from '@angular/core';
import { Enseigner } from '../../model/enseigner';
import { EnseignerService } from '../../service/enseigner.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-enseigner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // <-- AJOUTER ICI
  ],
  templateUrl: './enseigner.component.html',
  styleUrl: './enseigner.component.scss'
})
export class EnseignerComponent {
  user!: User
  enseignants: Enseigner[] = [];

  constructor(
    private service: EnseignerService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authservice.getAdminData()
    this.load();
  }

  load(): void {
    this.service.getAllForEcole(this.user.administrateur.ecole.idEcole).subscribe(data => (this.enseignants = data));
  }

  delete(id: number) {
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Voulez-vous vraiment supprimer cet enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => this.load());
      }
    });
  }
}
