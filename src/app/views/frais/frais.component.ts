import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FraiscolaireService } from '../../service/fraiscolaireService';
import { Fraiscolaire } from '../../model/fraiscolaire';
import { EcoleService } from '../../service/ecole.service';
import { ClasseService } from '../../service/classe.service';
import { EleveService } from '../../service/eleve.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frais',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './frais.component.html',
  styleUrl: './frais.component.scss'
})
export class FraisComponent implements OnInit {

  fraisForm!: FormGroup;
  fraisList: Fraiscolaire[] = [];
  editMode = false;
  currentId?: number;

  ecoles: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  annees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private fraisService: FraiscolaireService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private eleveService: EleveService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {
    this.loadFrais();
    this.loadRelations();

    this.fraisForm = this.fb.group({
      ecole: [null, Validators.required],
      classe: [null, Validators.required],
      eleve: [null, Validators.required],
      anneeuv: [null, Validators.required],
      montant: [0, Validators.required],
      reduction: [0]
    });
  }

  loadFrais() {
    this.fraisService.getAll().subscribe(data => this.fraisList = data);
  }

  loadRelations() {
    this.ecoleService.getAll().subscribe(d => this.ecoles = d);
    this.classeService.getAll().subscribe(d => this.classes = d);
    this.eleveService.getAll().subscribe(d => this.eleves = d);
    this.anneeService.getAll().subscribe(d => this.annees = d);
  }

  onSubmit() {
    if (this.editMode && this.currentId) {
      this.fraisService.update(this.currentId, this.fraisForm.value).subscribe(() => {
        this.loadFrais();
        this.resetForm();
      });
    } else {
      this.fraisService.create(this.fraisForm.value).subscribe(() => {
        this.loadFrais();
        this.resetForm();
      });
    }
  }

  edit(frais: Fraiscolaire) {
    this.editMode = true;
    this.currentId = frais.id;
    this.fraisForm.patchValue(frais);
  }

  delete(id: number) {
    if(confirm('Supprimer ce frais scolaire ?')) {
      this.fraisService.delete(id).subscribe(() => this.loadFrais());
    }
  }

  resetForm() {
    this.fraisForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}