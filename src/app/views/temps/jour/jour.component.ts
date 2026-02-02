import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { Emploidutemps } from '../../../model/emploidutemps';
import { Anneeuv } from '../../../model/anneeuv';

@Component({
  selector: 'app-jour',
  standalone: true, 
  imports: [
    CommonModule,          
    ReactiveFormsModule   
  ],
  templateUrl: './jour.component.html',
  styleUrl: './jour.component.scss'
})
export class JourComponent implements OnInit {

  emploiForm!: FormGroup;

  emplois: Emploidutemps[] = [];
  emploisParClasse: {
    classe: string;
    emplois: Emploidutemps[];
  }[] = [];

  annees: Anneeuv[] = [];

  jours: string[] = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi'
  ];
anneeuv: any;

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private anneeService: AnneeuvService
  ) { }

  ngOnInit(): void {
    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });

    this.loadAnnees();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe({
      next: data => this.annees = data,
      error: err => console.error(err)
    });
  }

  onSubmit(): void {
    if (this.emploiForm.invalid) return;

    const { jour, anneeuv } = this.emploiForm.value;

    this.emploiService.getAll().subscribe({
      next: data => {
        this.emplois = data.filter(e =>
          e.jour === jour &&
          e.anneeuv?.id === anneeuv
        );
        this.groupByClasse();
      },
      error: err => console.error(err)
    });
  }

  private groupByClasse(): void {
    const map = new Map<string, Emploidutemps[]>();

    this.emplois.forEach(e => {
      const classeNom = e.classe?.nom;
      if (!classeNom) return;

      if (!map.has(classeNom)) {
        map.set(classeNom, []);
      }
      map.get(classeNom)!.push(e);
    });

    this.emploisParClasse = Array.from(map.entries()).map(
      ([classe, emplois]) => ({ classe, emplois })
    );
  }
}
