import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AuthService } from '../../../service/auth.service';

import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  emploiForm!: FormGroup;

  classes: Classe[] = [];
  annees: Anneeuv[] = [];

  emploisTable: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      classe: [null],
      anneeuv: [null]
    });

    this.loadAnnees();
    this.loadClassesByEcole();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe(res => {
      this.annees = res;
    });
  }

  loadClassesByEcole(): void {
    const data = this.authService.getAdminData();

    console.log('ADMIN CONNECTÉ ', data);

    const ecoleId = data?.administrateur?.ecole?.idEcole;

    console.log('ECOLE ID ', ecoleId);

    if (!ecoleId) {
      console.error(' Aucun idEcole trouvé');
      return;
    }

    this.classeService.getAllClasseParEcole(ecoleId).subscribe(res => {
      console.log('CLASSES ', res);
      this.classes = res;
    });
  }


  onSubmit(): void {
    const { classe, anneeuv } = this.emploiForm.value;

    if (!classe || !anneeuv) {
      alert('Veuillez sélectionner la classe et l’année');
      return;
    }

    this.loading = true;

    this.emploiService.getAll().subscribe({
      next: (res) => {
        const filtres = res.filter(e =>
          e.classe !== null &&
          e.anneeuv !== null &&
          e.classe.id === classe &&
          e.anneeuv.id === anneeuv
        );

        this.emploisTable = this.buildTable(filtres);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  buildTable(emplois: Emploidutemps[]) {
    const map = new Map<string, any>();

    emplois.forEach(e => {
      const key = `${e.heuredebut} - ${e.heurefin}`;

      if (!map.has(key)) {
        map.set(key, {
          heure: key,
          Lundi: null,
          Mardi: null,
          Mercredi: null,
          Jeudi: null,
          Vendredi: null,
          Samedi: null
        });
      }

      map.get(key)[e.jour] = e;
    });

    return Array.from(map.values());
  }

  resetForm(): void {
    this.emploiForm.reset();
    this.emploisTable = [];
  }
  getEmploi(row: any): any {
    return row.Lundi || row.Mardi || row.Mercredi || row.Jeudi || row.Vendredi || row.Samedi;
  }

  deleteEmploi(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      return;
    }

    this.emploiService.delete(id).subscribe(() => {
      this.onSubmit(); 
    });
  }

}
