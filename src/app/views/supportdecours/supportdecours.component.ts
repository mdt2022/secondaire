import { Component, OnInit } from '@angular/core';
import { SupportDeCours } from '../../model/supportDeCours';
import { SupportDeCoursService } from '../../service/supportDeCours.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supportdecours',
  standalone: true,
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './supportdecours.component.html',
  styleUrl: './supportdecours.component.scss'
})
export class SupportdecoursComponent implements OnInit {
  apiUrl = environment.apiURL+"/supports";
  supports: SupportDeCours[] = [];
  

  constructor(private service: SupportDeCoursService) {}

  ngOnInit(): void {
    this.loadSupports();
  }

  loadSupports() {
    this.service.getAll().subscribe(data => {
      this.supports = data.map(s => ({
      ...s,
      classe: s.classe || { nom: '-' }
    }));;
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce support ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            this.loadSupports();
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'Le support a été supprimé avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer le support.'
            });
          }
        });
      }
    });
  }
}
