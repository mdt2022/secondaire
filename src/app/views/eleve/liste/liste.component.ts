import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { Eleveecole } from '../../../model/eleveecole';
import { EleveService } from '../../../service/eleve.service';
import { EcoleService } from '../../../service/ecole.service';
import { ClasseService } from '../../../service/classe.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AcademieService } from '../../../service/academie.service';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent implements OnInit {

  eleveecoleForm!: FormGroup;
  eleveecoleList: Eleveecole[] = [];
  editMode = false;
  currentId?: number;

  eleves: any[] = [];
  ecoles: any[] = [];
  classes: any[] = [];
  annees: any[] = [];
  academies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eleveecoleService: EleveecoleService,
    private eleveService: EleveService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private academieService: AcademieService
  ) {}

  ngOnInit(): void {
    this.loadEleveecoles();
    this.loadRelations();

    this.eleveecoleForm = this.fb.group({
      eleve: [null, Validators.required],
      ecole: [null, Validators.required],
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required],
      academie: [null]
    });
  }

  loadEleveecoles() {
    this.eleveecoleService.getAll().subscribe(d => this.eleveecoleList = d);
  }

  loadRelations() {
    this.eleveService.getAll().subscribe(d => this.eleves = d);
    this.ecoleService.getAll().subscribe(d => this.ecoles = d);
    this.classeService.getAll().subscribe(d => this.classes = d);
    this.anneeService.getAll().subscribe(d => this.annees = d);
    this.academieService.getAll().subscribe(d => this.academies = d);
  }

  onSubmit() {
    if(this.editMode && this.currentId){
      this.eleveecoleService.update(this.currentId, this.eleveecoleForm.value).subscribe(() => {
        this.loadEleveecoles();
        this.resetForm();
      });
    } else {
      this.eleveecoleService.create(this.eleveecoleForm.value).subscribe(() => {
        this.loadEleveecoles();
        this.resetForm();
      });
    }
  }

  edit(e: Eleveecole) {
    this.editMode = true;
    this.currentId = e.id;
    this.eleveecoleForm.patchValue(e);
  }

  delete(id: number) {
    if(confirm('Supprimer cette inscription ?')) {
      this.eleveecoleService.delete(id).subscribe(() => this.loadEleveecoles());
    }
  }

  resetForm() {
    this.eleveecoleForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
