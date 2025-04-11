import { ClasseService } from './../../../service/classe.service';
import { AuthService } from './../../../service/auth.service';
import { AnneeuvService } from './../../../service/anneeuv.service';
import { User } from './../../../model/user.model';
import { Classe } from './../../../model/classe.model';
import { Anneeuv } from './../../../model/anneeuv.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { Eleve } from '../../../model/eleve.model';
import { EleveService } from '../../../service/eleve.service';
import { EleveEcole } from '../../../model/eleveecole.model';
import { EleveEcoleService } from '../../../service/eleveecole.service';
import { NgxPaginationModule } from 'ngx-pagination';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-listeeleves',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './listeeleves.component.html',
  styleUrls: ['./listeeleves.component.scss']
})
export class ListeelevesComponent implements OnInit {
  studentForm: FormGroup;
  classes: Classe[] = [];
  anneesScolaires: Anneeuv[] = [];
  user!: User;
  eleves: EleveEcole[] = [];
  afficherListe = false;
  page: number = 1;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  itemsPerPage: number = 10;
  searchText: string = '';



  constructor(private fb: FormBuilder,
    private classeEcoleService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private eleveEcoleService: EleveEcoleService,
    private authService: AuthService) {
    this.studentForm = this.fb.group({
      classe: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getClassesByEcole();
    this.getAllAnnee()
  }


  getClassesByEcole() {
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;

    if (ecoleId) {
      this.classeEcoleService.getClassesByEcole(ecoleId).subscribe({
        next: (data) => {
          this.classes = data;
          console.log("Classes après mise à jour :", this.classes);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes', error);
        }
      });
    } else {
      console.error("Impossible de récupérer l'ID de l'école.");
    }
  }
  getAllAnnee() {
    this.anneeService.getAllAnnee().subscribe(
      (data) => {
        this.anneesScolaires = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des années', error);
      }
    );
  }

  rechercher(): void {
    if (this.studentForm.valid) {
      const { classe, anneeuv } = this.studentForm.value;
      const ecoleId = this.authService.getUserFromLocalStorage().administrateur.ecole.idEcole;

      this.eleveEcoleService.getAllEleveecole(anneeuv, ecoleId, classe).subscribe({
        next: (data: EleveEcole[]) => {
          this.eleves = data;
          this.afficherListe = true;
          console.log("Liste des élèves :", this.eleves);
        },
        error: (err: any) => {
          console.error("Erreur lors de la récupération des élèves", err);
          this.afficherListe = false;
        }
      });

    }
  }
  imprimerListe(): void {
  window.print();
}

exporterExcel(): void {
  // const worksheetData = this.eleves.map((eleve, index) => ({
  //   'N°': index + 1,
  //   'Matricule': eleve.eleve.matricule,
  //   'Prénom': eleve.eleve.prenom,
  //   'Nom': eleve.eleve.nom,
  //   'Classe': eleve.classe.nom,
  //   'Année scolaire': eleve.anneeuv.nom,
  // }));

  // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
  // const workbook: XLSX.WorkBook = {
  //   Sheets: { 'Liste des élèves': worksheet },
  //   SheetNames: ['Liste des élèves']
  // };

  // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  // const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // FileSaver.saveAs(data, 'liste_eleves.xlsx');
}


voirDetail(id: number): void {
  console.log("Voir les détails de l'élève ID :", id);
}

modifierEleve(id: number): void {
  console.log("Modification de l'élève ID :", id);
}

supprimerEleve(id: number): void {
  console.log("Suppression de l'élève ID :", id);
}

sortBy(column: string): void {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.eleves.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (column) {
      case 'matricule':
        valueA = a.eleve.matricule;
        valueB = b.eleve.matricule;
        break;
      case 'prenom':
        valueA = a.eleve.prenom;
        valueB = b.eleve.prenom;
        break;
      case 'nom':
        valueA = a.eleve.nom;
        valueB = b.eleve.nom;
        break;
      case 'classe':
        valueA = a.classe.nom;
        valueB = b.classe.nom;
        break;
      case 'annee':
        valueA = a.anneeuv.nom;
        valueB = b.anneeuv.nom;
        break;
      case 'index':
        valueA = a.id;
        valueB = b.id;
        break;
      default:
        return 0;
    }

    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

filteredEleves() {
  return this.eleves.filter(eleve =>
    (eleve.eleve.matricule && eleve.eleve.matricule.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (eleve.eleve.prenom && eleve.eleve.prenom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (eleve.eleve.nom && eleve.eleve.nom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (eleve.classe && eleve.classe.nom.toLowerCase().includes(this.searchText.toLowerCase())) ||
    (eleve.anneeuv && eleve.anneeuv.nom.toLowerCase().includes(this.searchText.toLowerCase()))
  );
}

}
