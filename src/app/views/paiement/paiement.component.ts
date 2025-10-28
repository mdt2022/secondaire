import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../../service/paiement.service';
import { Paiement } from '../../model/paiement';
import { EcoleService } from '../../service/ecole.service';
import { ClasseService } from '../../service/classe.service';
import { EleveService } from '../../service/eleve.service';
import { AnneeuvService } from '../../service/anneeuv.service';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss'
})
export class PaiementComponent implements OnInit {

  paiementForm!: FormGroup;
  paiementList: Paiement[] = [];
  editMode = false;
  currentId?: number;

  ecoles: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  annees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private eleveService: EleveService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.loadRelations();

    this.paiementForm = this.fb.group({
      ecole: [null, Validators.required],
      classe: [null, Validators.required],
      eleve: [null, Validators.required],
      anneeuv: [null, Validators.required],
      montant: [0, Validators.required],
      enlettre: [''],
      motif: [''],
      numerorecu: ['']
    });
  }

  loadPaiements() {
    this.paiementService.getAll().subscribe(data => this.paiementList = data);
  }

  loadRelations() {
    this.ecoleService.getAll().subscribe(d => this.ecoles = d);
    this.classeService.getAll().subscribe(d => this.classes = d);
    this.eleveService.getAll().subscribe(d => this.eleves = d);
    this.anneeService.getAll().subscribe(d => this.annees = d);
  }

  onSubmit() {
    if(this.editMode && this.currentId){
      this.paiementService.update(this.currentId, this.paiementForm.value).subscribe(() => {
        this.loadPaiements();
        this.resetForm();
      });
    } else {
      this.paiementService.create(this.paiementForm.value).subscribe(() => {
        this.loadPaiements();
        this.resetForm();
      });
    }
  }

  edit(p: Paiement) {
    this.editMode = true;
    this.currentId = p.id;
    this.paiementForm.patchValue(p);
  }

  delete(id: number) {
    if(confirm('Supprimer ce paiement ?')) {
      this.paiementService.delete(id).subscribe(() => this.loadPaiements());
    }
  }

  resetForm() {
    this.paiementForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}