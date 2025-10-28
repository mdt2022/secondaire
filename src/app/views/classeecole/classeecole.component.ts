import { Component, OnInit } from '@angular/core';
import { ClasseEcole } from '../../model/classeecole';
import { Classe } from '../../model/classe';
import { Ecole } from '../../model/ecole';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { ClasseService } from '../../service/classe.service';
import { EcoleService } from '../../service/ecole.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-classeecole',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './classeecole.component.html',
  styleUrl: './classeecole.component.scss'
})
export class ClasseecoleComponent implements OnInit {
  classeEcoles: ClasseEcole[] = [];
  classes: Classe[] = [];
  ecoles: Ecole[] = [];
  form!: FormGroup;
  editMode = false;
  currentId?: number;

  constructor(
    private fb: FormBuilder,
    private classeEcoleService: ClasseEcoleService,
    private classeService: ClasseService,
    private ecoleService: EcoleService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.form = this.fb.group({
      classe: ['', Validators.required],
      ecole: ['', Validators.required]
    });
  }

  loadData(): void {
    this.classeEcoleService.getAll().subscribe(data => this.classeEcoles = data);
    this.classeService.getAll().subscribe(data => this.classes = data);
    this.ecoleService.getAll().subscribe(data => this.ecoles = data);
  }

  save(): void {
    const selectedClasse = this.classes.find(c => c.id == this.form.value.classe);
    const selectedEcole = this.ecoles.find(e => e.idEcole == this.form.value.ecole);

    const ce: ClasseEcole = {
      classe: selectedClasse!,
      ecole: selectedEcole!
    };

    if (this.editMode && this.currentId) {
      this.classeEcoleService.update(this.currentId, ce).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    } else {
      this.classeEcoleService.create(ce).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    }
  }

  edit(ce: ClasseEcole): void {
    this.editMode = true;
    this.currentId = ce.id;
    this.form.patchValue({
      classe: ce.classe.id,
      ecole: ce.ecole.idEcole
    });
  }

  delete(id?: number): void {
    if (id && confirm('Supprimer cette association ?')) {
      this.classeEcoleService.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.currentId = undefined;
    this.form.reset();
  }
}
