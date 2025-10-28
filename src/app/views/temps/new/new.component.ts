import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { Emploidutemps } from '../../../model/emploidutemps';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, CardModule, ButtonModule, TableModule
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {

  emplois: Emploidutemps[] = [];
  emploiForm!: FormGroup;
  editMode = false;
  currentId?: number;

  constructor(
    private fb: FormBuilder,
    private emploiService: EmploidutempsService
  ) {}

  ngOnInit(): void {
    //this.loadEmplois();

    this.emploiForm = this.fb.group({
      jour: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required],
      matiere: ['', Validators.required],
      professeur: ['', Validators.required],
      classe: ['', Validators.required],
      ecole: ['', Validators.required],
      anneeuv: ['', Validators.required]
    });
  }

  loadEmplois() {
    this.emploiService.getAll().subscribe((data) => {
      this.emplois = data;
    });
  }

  onSubmit() {
    const formValue = {
      ...this.emploiForm.value/*,
      matiere: { id: this.emploiForm.value.matiere },
      professeur: { id: this.emploiForm.value.professeur },
      classe: { id: this.emploiForm.value.classe },
      ecole: { id: this.emploiForm.value.ecole },
      anneeuv: { id: this.emploiForm.value.anneeuv }*/
    };

    if (this.editMode && this.currentId) {
      this.emploiService.update(this.currentId, formValue).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
    } else {
      this.emploiService.create(formValue).subscribe(() => {
        this.loadEmplois();
        this.resetForm();
      });
    }
  }

  edit(emploi: Emploidutemps) {
    this.editMode = true;
    this.currentId = emploi.id;
    this.emploiForm.patchValue({
      jour: emploi.jour,
      heuredebut: emploi.heuredebut,
      heurefin: emploi.heurefin,
      matiere: emploi.matiere,
      professeur: emploi.professeur,
      classe: emploi.classe,
      ecole: emploi.ecole,
      anneeuv: emploi.anneeuv
    });
  }

  delete(id: number) {
    if (confirm('Supprimer cet emploi du temps ?')) {
      this.emploiService.delete(id).subscribe(() => this.loadEmplois());
    }
  }

  resetForm() {
    this.emploiForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
