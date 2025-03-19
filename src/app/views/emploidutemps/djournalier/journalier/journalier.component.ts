import { Component, OnInit } from '@angular/core';
import { Classe } from 'src/app/model/classe.model';
import { Emploidutemp } from 'src/app/model/emploidutemp.model';
import { EmploidutempService } from 'src/app/service/emploidutemp.service';
import { ClasseService } from '../../../../service/classe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journalier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journalier.component.html',
  styleUrl: './journalier.component.scss'
})
export class JournalierComponent implements OnInit {

    jour!: string ;
    annee!: number ;
    idEcole!: number ;
    classes: Classe[] = [];
    emplois: Emploidutemp[] = [];
  ecoleId!: number;
  todayDate: string = new Date().toLocaleDateString();

    constructor(private emploiService: EmploidutempService,
      private classeService: ClasseService,
    ) {}

    ngOnInit(): void {
      this.loadClasses();
      this.loadEmploiDuTemps();
    }

    loadClasses(): void {
      this.classeService.getClasseEcole(this.ecoleId).subscribe(classes => {
        this.classes = classes;
      });
    }

    loadEmploiDuTemps(): void {
      this.emploiService.getAllemploidutemps().subscribe(emplois => {
        this.emplois = emplois;
      });
    }

    generatePrintUrl(): string {
      return `/emploidutemps/imprimerjournalier/${this.jour}/${this.annee}`;
    }
  }
