import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatiereService } from '../../service/matiere.service';
import { Matiere } from '../../model/matiere';
import { CardModule, ButtonModule, TableModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CardModule, ButtonModule, TableModule],
  templateUrl: './matiere.component.html',
})
export class MatiereComponent implements OnInit {

  matieres: Matiere[] = [];
  matiereForm!: FormGroup;
  editMode = false;
  currentId?: number;

  constructor(private fb: FormBuilder, private matiereService: MatiereService) {}

  ngOnInit(): void {
    this.loadMatieres();

    this.matiereForm = this.fb.group({
      libelle: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0)]],
      horaire: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadMatieres() {
    this.matiereService.getAll().subscribe(data => this.matieres = data);
  }

  onSubmit() {
    if (this.editMode && this.currentId) {
      this.matiereService.update(this.currentId, this.matiereForm.value).subscribe(() => {
        this.loadMatieres();
        this.resetForm();
      });
    } else {
      this.matiereService.create(this.matiereForm.value).subscribe(() => {
        this.loadMatieres();
        this.resetForm();
      });
    }
  }

  edit(matiere: Matiere) {
    this.editMode = true;
    this.currentId = matiere.id;
    this.matiereForm.patchValue({
      libelle: matiere.libelle,
      coefficient: matiere.coefficient,
      horaire: matiere.horaire
    });
  }

  delete(id: number) {
    if (confirm('Supprimer cette matière ?')) {
      this.matiereService.delete(id).subscribe(() => this.loadMatieres());
    }
  }

  resetForm() {
    this.matiereForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
