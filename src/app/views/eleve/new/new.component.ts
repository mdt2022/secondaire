import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EleveService } from '../../../service/eleve.service';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { EcoleService } from '../../../service/ecole.service';
import { ClasseService } from '../../../service/classe.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AcademieService } from '../../../service/academie.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent  implements OnInit {

  form!: FormGroup;
  ecoles: any[] = [];
  classes: any[] = [];
  annees: any[] = [];
  academies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eleveService: EleveService,
    private eleveecoleService: EleveecoleService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private academieService: AcademieService
  ) {}

  ngOnInit(): void {
    this.loadRelations();

    this.form = this.fb.group({
      eleve: this.fb.group({
        matricule: ['', Validators.required],
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        datedn: ['', Validators.required],
        lieudn: ['', Validators.required],
        prenompere: [''],
        prenommere: [''],
        nommere: [''],
        nationalite: [''],
        sexe: ['', Validators.required]
      }),
      ecole: [null, Validators.required],
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required],
      academie: [null]
    });
  }

  loadRelations() {
    this.ecoleService.getAll().subscribe(d => this.ecoles = d);
    this.classeService.getAll().subscribe(d => this.classes = d);
    this.anneeService.getAll().subscribe(d => this.annees = d);
    this.academieService.getAll().subscribe(d => this.academies = d);
  }

  onSubmit() {
    if (this.form.valid) {
      const eleveData = this.form.get('eleve')?.value;

      // 1️⃣ Créer l'élève
      this.eleveService.create(eleveData).subscribe(eleve => {
        // 2️⃣ Créer l'affectation à l'école
        const affectation = {
          eleve: eleve,
          ecole: this.form.value.ecole,
          classe: this.form.value.classe,
          anneeuv: this.form.value.anneeuv,
          academie: this.form.value.academie
        };
        this.eleveecoleService.create(affectation).subscribe(() => {
          alert('Élève enregistré et affecté avec succès !');
          this.form.reset();
        });
      });
    }
  }
}