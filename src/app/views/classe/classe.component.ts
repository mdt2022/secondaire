import { Component, OnInit } from '@angular/core';
import { Classe } from '../../model/classe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClasseService } from '../../service/classe.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.scss'
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = [];
  classeForm!: FormGroup;
  editMode = false;
  currentId?: number;

  constructor(private classeService: ClasseService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadClasses();

    this.classeForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      filiere: [''],
      options: ['']
    });
  }

  loadClasses(): void {
    this.classeService.getAll().subscribe(data => this.classes = data);
  }

  save(): void {
    const classe: Classe = this.classeForm.value;

    if (this.editMode && this.currentId) {
      this.classeService.update(this.currentId, classe).subscribe(() => {
        this.loadClasses();
        this.resetForm();
      });
    } else {
      this.classeService.create(classe).subscribe(() => {
        this.loadClasses();
        this.resetForm();
      });
    }
  }

  edit(classe: Classe): void {
    this.editMode = true;
    this.currentId = classe.id;
    this.classeForm.patchValue(classe);
  }

  delete(id?: number): void {
    if (id && confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      this.classeService.delete(id).subscribe(() => this.loadClasses());
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.currentId = undefined;
    this.classeForm.reset();
  }
}
