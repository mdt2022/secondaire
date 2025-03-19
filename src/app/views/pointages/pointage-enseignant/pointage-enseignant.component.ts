import { Component, OnInit } from '@angular/core';
// import { Avance} from '../../../model/avance.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pointage } from '../../../model/pointage.model';
import { Enseignant } from '../../../model/enseignant.model';
import {Emploidutemp} from '../../../model/emploidutemp.model';
import { Matiere } from '../../../model/matiere.model';

@Component({
  selector: 'app-pointage-enseignant',
  standalone: true,
  imports: [CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule],
  templateUrl: './pointage-enseignant.component.html',
  styleUrl: './pointage-enseignant.component.scss'
})
export class PointageEnseignantComponent implements OnInit{

    searchForm: FormGroup;
    enseignants: Enseignant[] = []; 
    avances: any[] = [];
    pointages: Pointage[] = [];
    emplois: Emploidutemp[] = [];
    matieres: Matiere[] = [];

    tableData: any[] = [];
    totalNet = 0;
    totalAvances = 0;

    constructor(private fb: FormBuilder) {
      this.searchForm = this.fb.group({
        datedebut: [this.getToday()],
        datefin: [this.getToday()]
      });
    }

    ngOnInit(): void {
    }

    getToday(): string {
      const today = new Date();
      return today.toLocaleDateString('fr-FR');
    }

    onSubmit(): void {
      const { datedebut, datefin } = this.searchForm.value;
      this.generateTable(datedebut, datefin);
    }

    generateTable(dated: string, datef: string): void {
      this.tableData = [];
      this.totalNet = 0;
      this.totalAvances = 0;

      this.enseignants.forEach(ens => {
        const avanceTotal = this.avances
          .filter(a => a.enseignantId === ens.id && !a.paie)
          .reduce((sum, a) => sum + a.montant, 0);

        const pointagesFiltered = this.pointages.filter(p =>
          p.enseignant.id === ens.id &&
          this.dateInRange(p.datevalider, dated, datef)
        );

        let totalHeure = 0;
        pointagesFiltered.forEach(p => {
          const emploi = this.emplois.find(e => e.id === p.emploidutemp.id);
          const matiere = this.matieres.find(m => m.id === emploi?.matiere.id);
          totalHeure += matiere?.horaire || 0;
        });

        const montantBrut = totalHeure * ens.tarif;
        const montantNet = montantBrut - avanceTotal;

        this.tableData.push({
          datevalider: dated,
          prenom: ens.prenom,
          nom: ens.nom,
          totalHeure,
          tarif: ens.tarif,
          montantBrut,
          avance: avanceTotal,
          montantNet
        });

        this.totalNet += montantNet;
        this.totalAvances += avanceTotal;
      });
    }

    dateInRange(dateStr: string, start: string, end: string): boolean {
      const parse = (d: string) => {
        const [day, month, year] = d.split('/').map(Number);
        return new Date(year, month - 1, day);
      };
      const date = parse(dateStr);
      return date >= parse(start) && date <= parse(end);
    }

    imprimer(): void {
      window.print();
    }
  }
