import { Component, OnInit } from '@angular/core';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ChapitreMeta, SupportDeCours, SupportDTO } from '../../../model/supportDeCours';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [   
    RouterModule,
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AddEditComponent implements OnInit {
nom = '';
  typeSupport: 'COURS' | 'EXERCICE' = 'COURS';
  structureSupport: 'LIVRE' | 'CHAPITRE' = 'LIVRE';
  livreFile?: File | null;
  chapitres: ChapitreMeta[] = [];

  uploading = false;
  progress = 0;

  constructor(private svc: SupportDeCoursService) {}
  ngOnInit(): void {
    
  }
  onLivreSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) this.livreFile = input.files[0];
  }

  addEmptyChapitre() {
    this.chapitres.push({ titre: 'Nouveau chapitre', numero: this.chapitres.length + 1, contenu: '', file: null });
  }

  removeChapitre(i: number) {
    this.chapitres.splice(i,1);
    this.renumber();
  }

  renumber() { this.chapitres.forEach((c, i) => c.numero = i+1); }

  onDropChapterFile(e: DragEvent, index?: number) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (index === undefined) {
      this.chapitres.push({ titre: file.name, numero: this.chapitres.length + 1, contenu: '', file });
    } else {
      this.chapitres[index].file = file;
    }
  }

  onDragOver(e: DragEvent) { e.preventDefault(); }

  drop(event: CdkDragDrop<ChapitreMeta[]>) {
    moveItemInArray(this.chapitres, event.previousIndex, event.currentIndex);
    this.renumber();
  }

  submit() {
    const dto: SupportDTO = {
      nom: this.nom,
      typeSupport: this.typeSupport,
      structureSupport: this.structureSupport,
      chapitres: this.chapitres.map(c => ({ id: c.id, titre: c.titre, numero: c.numero, contenu: c.contenu, fichier: c.fichier }))
    };

    const chapitreFiles = this.chapitres.map(c => c.file ?? null);

    this.uploading = true;
    this.progress = 0;

    this.svc.createWithFiles(dto, this.livreFile ?? undefined, chapitreFiles, p => this.progress = p)
      .pipe(finalize(() => this.uploading = false))
      .subscribe({
        next: (r) => {
          console.log(r)
          this.reset();
        },
        error: (e) => {
          console.error(e);
          alert('Erreur');
        },
        complete: () =>{
          alert('Support créé');
        }
      });
  }

  reset() {
    this.nom = '';
    this.typeSupport = 'COURS';
    this.structureSupport = 'LIVRE';
    this.livreFile = null;
    this.chapitres = [];
    this.progress = 0;
  }
}
