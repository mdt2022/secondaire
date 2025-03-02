import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Enseignant } from '../../model/enseignant.model';
import { EnseignantService } from '../../service/enseignant.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './professeurs.component.html',
  styleUrl: './professeurs.component.scss'
})
export class ProfesseursComponent implements OnInit {
  enseignants: Enseignant[] = [];
  selectedEnseignant: Enseignant = {
    id: 0,
    matricule: '',
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    lieun: '',
    datedn: '',
    photo: '',
    ecole: { idEcole: 0, nomEcole: '', descriptionEcole: '', categorie: '' },
    tarif: 0
  };
 

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.loadEnseignants();
  }

  loadEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe(data => {
      this.enseignants = data;
    });
  }

  selectEnseignant(enseignant: Enseignant): void {
    this.selectedEnseignant = { ...enseignant };
  }

  saveEnseignant(): void {
    if (this.selectedEnseignant.id === 0) {
      this.enseignantService.createEnseignant(this.selectedEnseignant).subscribe(() => {
        this.loadEnseignants();
        this.selectedEnseignant = {
          id: 0,
          matricule: '',
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          lieun: '',
          datedn: '',
          photo: '',
          ecole: {  idEcole: 0, nomEcole: '', descriptionEcole: '', categorie: ''},
          tarif: 0
        };
      });
    } else {
      this.enseignantService.updateEnseignant(this.selectedEnseignant.id, this.selectedEnseignant).subscribe(() => {
        this.loadEnseignants();
        this.selectedEnseignant = {
          id: 0,
          matricule: '',
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          lieun: '',
          datedn: '',
          photo: '',
          ecole: {  idEcole: 0, nomEcole: '', descriptionEcole: '', categorie: '' },
          tarif: 0
        };
      });
    }
  }

  deleteEnseignant(id: number): void {
    this.enseignantService.deleteEnseignant(id).subscribe(() => {
      this.loadEnseignants();
    });
  }
}