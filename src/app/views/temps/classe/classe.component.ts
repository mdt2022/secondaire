import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { AuthService } from '../../../service/auth.service';

import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';
import { Enseignant } from '../../../model/enseignant';
import { Matiere } from '../../../model/matiere';

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
  enseignants: Enseignant[] = [];
  matieres: Matiere[] = [];

  emploisTable: any[] = [];
  loading = false;
  user: any;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    console.log('USER RAW:', this.user);

    // Initialisation du formulaire
    this.emploiForm = this.fb.group({
      jour: [''],
      heuredebut: [''],
      heurefin: [''],
      matiere: [''],
      enseignant: [''],
      classe: [''],
      anneeuv: ['']
    });

    console.log('USER FINAL:', this.user);

    this.loadAnnees();
    this.loadClassesByEcole();
    this.loadEnseignantsByEcole();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe(res => this.annees = res);
  }

  loadClassesByEcole(): void {
    const ecoleId = this.user?.administrateur?.ecole?.idEcole;
    if (!ecoleId) return console.error('Aucun idEcole trouvé');

    this.classeService.getAllClasseParEcole(ecoleId).subscribe(res => this.classes = res);
  }

  loadEnseignantsByEcole(): void {
    const ecoleId = this.user?.administrateur?.ecole?.idEcole;
    if (!ecoleId) return console.error('Aucun idEcole trouvé');

    this.enseignantService.getEnseignantEcole(ecoleId).subscribe(res => this.enseignants = res);
  }


  onSubmit(): void {
    const { classe, anneeuv } = this.emploiForm.value;
    if (!classe || !anneeuv) {
      alert('Veuillez sélectionner la classe et l’année');
      return;
    }

    const payload: any = {
      jour: this.emploiForm.value.jour,
      heuredebut: this.emploiForm.value.heuredebut,
      heurefin: this.emploiForm.value.heurefin,
      matiere: { id: this.emploiForm.value.matiere },
      professeur: { id: this.emploiForm.value.enseignant },
      classe: { id: classe },
      anneeuv: { id: anneeuv },
      ecole: { idEcole: this.user.administrateur.ecole.idEcole }
    };

    this.loading = true;
    this.emploiService.getAll().subscribe({
      next: (res) => {
        const filtres = res.filter(e => Number(e.classe?.id) === Number(classe) &&
          Number(e.anneeuv?.id) === Number(anneeuv));
        this.emploisTable = this.buildTable(filtres);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des emplois :', err);
        this.loading = false;
      }
    });
  }

  buildTable(emplois: Emploidutemps[]) {
    const map = new Map<string, any>();
    emplois.forEach(e => {
      const key = `${e.heuredebut} - ${e.heurefin}`;
      if (!map.has(key)) {
        map.set(key, { heure: key, Lundi: null, Mardi: null, Mercredi: null, Jeudi: null, Vendredi: null, Samedi: null });
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
    if (!confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) return;
    this.emploiService.delete(id).subscribe(() => this.onSubmit());
  }
}
