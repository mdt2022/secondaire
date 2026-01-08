import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent implements OnInit {

  supports: any[] = [];
  backendUrl = environment.apiURL + '/uploads/supports/';

  matiereId!: number;
  classeId!: number;

  constructor(private svc: SupportDeCoursService, private route: ActivatedRoute) {}

  ngOnInit() {
    // récupérer l'ID matière depuis l'URL
    this.matiereId = Number(this.route.snapshot.paramMap.get('id'));

    // récupérer l'ID classe depuis queryParams
    this.route.queryParams.subscribe(params => {
      this.classeId = Number(params['classe']);
      this.loadSupports();
    });
  }

  loadSupports() {
    if (!this.matiereId || !this.classeId) return;

    this.svc.getByMatiereAndClasse(this.matiereId, this.classeId)
      .subscribe((res: any) => {
        this.supports = res.map((s: any) => {
          // Nettoyage nom fichier principal
          if (s.nomfichier) {
            const parts = s.nomfichier.split('/');
            s.nomfichier = parts[parts.length - 1];
          }
          // Nettoyage fichiers chapitres
          if (s.chapitres?.length) {
            s.chapitres = s.chapitres.map((c: any) => {
              if (c.fichier) {
                const parts = c.fichier.split('/');
                c.fichier = parts[parts.length - 1];
              }
              return c;
            });
          }
          return s;
        });
      });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Supprimer ce support ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.delete(id).subscribe(() => this.loadSupports());
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.supports, event.previousIndex, event.currentIndex);
    // ici, tu peux envoyer l'ordre mis à jour au backend si nécessaire
  }
}
