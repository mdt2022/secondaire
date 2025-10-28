import { Component, OnInit } from '@angular/core';
import { Enseignant } from '../../model/enseignant';
import { EnseignantService } from '../../service/enseignant.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, ButtonModule, TableModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, CardModule, ButtonModule, TableModule, FormModule
  ],
  templateUrl: './enseignant.component.html',
  styleUrl: './enseignant.component.scss'
})
export class EnseignantComponent implements OnInit {

  enseignants: Enseignant[] = [];
  enseignantForm!: FormGroup;
  editMode = false;
  currentId?: number;
  selectedPhoto: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.loadEnseignants();

    this.enseignantForm = this.fb.group({
      matricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lieun: ['', Validators.required],
      datedn: ['', Validators.required],
      photo: [''],
      ecole: [null],
      tarif: [0, Validators.required]
    });
  }

  loadEnseignants() {
    this.enseignantService.getAll().subscribe(data => this.enseignants = data);
  }

  onSubmit() {
    const data = {...this.enseignantForm.value, photo: this.selectedPhoto};
    if (this.editMode && this.currentId) {
      this.enseignantService.update(this.currentId, data).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    } else {
      this.enseignantService.create(data).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    }
  }

  edit(enseignant: Enseignant) {
    this.editMode = true;
    this.currentId = enseignant.id;
     this.selectedPhoto = enseignant.photo || null;
    this.enseignantForm.patchValue({...enseignant});
  }

  delete(id: number) {
    if(confirm('Supprimer cet enseignant ?')) {
      this.enseignantService.delete(id).subscribe(() => this.loadEnseignants());
    }
  }

  resetForm() {
    this.enseignantForm.reset();
    this.editMode = false;
    this.currentId = undefined;
    this.selectedPhoto = null;
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = e => this.selectedPhoto = reader.result;
      reader.readAsDataURL(file);
    }
  }
}