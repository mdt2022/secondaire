import { Component, OnInit } from '@angular/core';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ChapitreMeta, SupportDTO, SupportDeCours } from '../../../model/supportDeCours';
import { finalize } from 'rxjs';
import { Classe } from '../../../model/classe';
import { Matiere } from '../../../model/matiere';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { EnseignerService } from '../../../service/enseigner.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, DragDropModule],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  user!: User;

  nom = '';
  classe_id: number | null = null;
  matiere_id: number | null = null;
  typeSupport: 'COURS' | 'EXERCICE' = 'COURS';
  structureSupport: 'LIVRE' | 'CHAPITRE' = 'LIVRE';
  livreFile?: File | null;
  chapitres: ChapitreMeta[] = [];
  classes: Classe[] = [];
  matieres: Matiere[] = [];

  uploading = false;
  progress = 0;
  supportId?: number;

  constructor(
    private svc: SupportDeCoursService,
    private classeecoleservice: ClasseEcoleService,
    private authservice: AuthService,
    private enseignerservice: EnseignerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.authservice.getAdminData();
    this.getAllClasse();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supportId = +id;
      this.loadSupport(this.supportId);
    }
  }

  loadSupport(id: number) {
    this.svc.getById(id).subscribe({
      next: (s: SupportDeCours) => {
        this.nom = s.nom;
        this.classe_id = s.classe?.id ?? null;
        this.matiere_id = s.matiere?.id ?? null;
        this.typeSupport = s.type;
        this.structureSupport = s.structure;

        if (this.structureSupport === 'CHAPITRE') {
          this.chapitres = (s.chapitres ?? []).map((c: ChapitreMeta) => ({
            id: c.id,
            titre: c.titre,
            numero: c.numero,
            contenu: c.contenu,
            fichier: c.fichier ?? undefined, // <-- correction ici
            file: null
          }));
        }
      },
      error: err => console.error('Erreur chargement support:', err)
    });
  }

  getAllClasse() {
    const userid = this.user.administrateur.ecole.idEcole;
    this.classeecoleservice.getAllClasseParEcole(userid).subscribe({
      next: (data: Classe[]) => this.classes = Array.isArray(data) ? data : [],
      error: err => console.error("Erreur chargement classes :", err)
    });
  }

  ChargeMatiere(idclasse: number | null) {
    if (!idclasse) return;
    const idecole = this.user.administrateur.ecole.idEcole;
    this.getAllMatiere([idecole, idclasse]);
  }

  getAllMatiere(donnees: number[]) {
    this.enseignerservice.getMatiereEcoleClasse(donnees).subscribe({
      next: (data: Matiere[]) => this.matieres = Array.isArray(data) ? data : [],
      error: err => console.error("Erreur chargement matières :", err)
    });
  }

  onLivreSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) this.livreFile = input.files[0];
  }

  addEmptyChapitre() {
    this.chapitres.push({ titre: 'Nouveau chapitre', numero: this.chapitres.length + 1, contenu: '', file: null });
  }

  removeChapitre(i: number) {
    this.chapitres.splice(i, 1);
    this.renumber();
  }

  renumber() {
    this.chapitres.forEach((c, i) => c.numero = i + 1);
  }

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

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  drop(event: CdkDragDrop<ChapitreMeta[]>) {
    moveItemInArray(this.chapitres, event.previousIndex, event.currentIndex);
    this.renumber();
  }

submit() {

  if (!this.classe_id || !this.matiere_id) {
    alert(' Classe et matière obligatoires');
    return;
  }

  // ✅ DTO PROPRE
  const dto: SupportDTO = {
    nom: this.nom,
    type: this.typeSupport,
    structure: this.structureSupport,
    classeId: this.classe_id,
    matiereId: this.matiere_id,
    chapitres: this.chapitres.map(c => ({
      id: c.id,
      titre: c.titre,
      numero: c.numero,
      contenu: c.contenu,
      
    }))
  };

  // ✅ EXTRACTION DES FICHIERS DES CHAPITRES
  const chapitresFiles: File[] = this.chapitres
    .filter(c => c.file)
    .map(c => c.file!);

  console.log('DTO envoyé ', dto);
  console.log('Fichiers chapitres ', chapitresFiles);

  this.uploading = true;
  this.progress = 0;

  this.svc.createWithFiles(dto, this.livreFile ?? undefined, chapitresFiles, p => {
    this.progress = p;
  })
  .pipe(finalize(() => this.uploading = false))
  .subscribe({
    next: () => {
      alert('Support créé avec succès');
      this.reset();
    },
    error: err => {
      console.error(err);
      alert(' Erreur lors de la création');
    }
  });
}

  reset() {
    this.nom = '';
    this.classe_id = null;
    this.matiere_id = null;
    this.typeSupport = 'COURS';
    this.structureSupport = 'LIVRE';
    this.livreFile = null;
    this.chapitres = [];
    this.progress = 0;
  }
}
