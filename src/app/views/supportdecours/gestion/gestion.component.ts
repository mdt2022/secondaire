import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { ChapitreMeta, SupportDeCours, SupportDTO } from '../../../model/supportDeCours';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms'; // Import FormsModule
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
  backendUrl = environment.apiURL + '/uploads/supports/'; // URL directe vers les PDFs

  constructor(private svc: SupportDeCoursService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe((res: any) => {
      // Nettoyer le nom de fichier pour éviter les doublons de chemin
      this.supports = res.map((s: any) => {
        if (s.nomfichier) {
          const parts = s.nomfichier.split('/');
          s.nomfichier = parts[parts.length - 1]; // garde juste le nom du fichier
        }
        if (s.chapitres?.length) {
          s.chapitres = s.chapitres.map((c: any) => {
            if (c.fichier) {
              const p = c.fichier.split('/');
              c.fichier = p[p.length - 1]; // idem pour les chapitres
            }
            return c;
          });
        }
        return s;
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
