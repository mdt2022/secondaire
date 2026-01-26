import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';

import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  emploiForm!: FormGroup;

  classes: Classe[] = [];
  annees: Anneeuv[] = [];
  emplois: Emploidutemps[] = [];

  loading = false;
  resultat = false;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });

    const admin = this.authService.getAdminData();
    const idEcole = admin?.administrateur?.ecole?.idEcole;

    if (!idEcole) {
      console.error('École introuvable');
      return;
    }

    this.loadClasses(idEcole);
    this.loadAnnees();
  }

  loadClasses(idEcole: number): void {
    this.classeService.getAllClasseParEcole(idEcole).subscribe({
      next: data => this.classes = data,
      error: err => console.error(err)
    });
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error(err)
    });
  }

  rechercher(): void {
    if (this.emploiForm.invalid) return;

    // 🔥 conversion explicite en number
    const classeId = Number(this.emploiForm.value.classe);
    const anneeId = Number(this.emploiForm.value.anneeuv);

    this.loading = true;
    this.resultat = false;

    this.emploiService.getAll().subscribe({
      next: data => {
        console.log('Emplois reçus:', data);
        console.log('Classe sélectionnée:', classeId);
        console.log('Année sélectionnée:', anneeId);

        this.emplois = data.filter(e =>
          Number(e.classe?.id) === classeId &&
          Number(e.anneeuv?.id) === anneeId
        );

        this.loading = false;
        this.resultat = true;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }


  supprimer(id?: number): void {
    if (!id) return;

    if (confirm('Supprimer cet emploi du temps ?')) {
      this.emploiService.delete(id).subscribe(() => {
        this.rechercher();
      });
    }
  }

  reset(): void {
    this.emploiForm.reset();
    this.emplois = [];
    this.resultat = false;
  }

}
