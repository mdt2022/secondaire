import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdmissionService } from '../../../service/admission.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';

@Component({
  selector: 'app-admis',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admis.component.html',
  styleUrls: ['./admis.component.scss']
})
export class AdmisComponent implements OnInit {

  classes: any[] = [];
  annees: any[] = [];
  admissions: any[] = [];

  classeId!: number;
  anneeId!: number;
  examen!: string;
  sessionId!: number;
  ecoleId!: number;

 //  filtre texte
searchText: string = '';

admissionsFiltres: any[] = [];
admissionsPaged: any[] = [];

currentPage: number = 1;
pageSize: number = 10;
totalPages: number = 1;

  constructor(
    private admissionService: AdmissionService,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.ecoleId = user.administrateur.ecole.idEcole;

    this.classeService.getAllClasseParEcole(this.ecoleId)
      .subscribe(res => this.classes = res);

    this.anneeService.getAll()
      .subscribe(res => this.annees = res);
  }

  changerPage(page: number) {
  if (page < 1 || page > this.totalPages) return;

  this.currentPage = page;

  const start = (page - 1) * this.pageSize;
  const end = start + this.pageSize;

  this.admissionsPaged = this.admissionsFiltres.slice(start, end);
}
filtrer() {
  const txt = this.searchText.toLowerCase();

  this.admissionsFiltres = this.admissions.filter(a => {
    const eleve = a.eleveecole.eleve;
    return (
      eleve.matricule.toLowerCase().includes(txt) ||
      eleve.nom.toLowerCase().includes(txt) ||
      eleve.prenom.toLowerCase().includes(txt)
    );
  });

  this.totalPages = Math.ceil(this.admissionsFiltres.length / this.pageSize);
  this.changerPage(1);
}

rechercher() {
  const filtres = {
    ecole: this.ecoleId,
    anneeuv: this.anneeId || null,
    classe: this.classeId || null,
    examen: this.examen || null,
    session: this.sessionId || null
  };

  this.admissionService.rechercherAdmissions(filtres)
    .subscribe(res => {
      this.admissions = res;
      this.filtrer();
    });
}
}