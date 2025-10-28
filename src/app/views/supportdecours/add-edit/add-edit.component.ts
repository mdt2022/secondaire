import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Classe } from '../../../model/classe';
import { ClasseService } from '../../../service/classe.service';
@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [   
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AddEditComponent implements OnInit {

  form!: FormGroup;
  selectedFile?: File;
  filenamePreview = '';
  id?: number;
  // optionnel: liste des classes (pour select)
  classes: Classe[] = [];

  constructor(
    private fb: FormBuilder,
    private service: SupportDeCoursService,
    private classeservice: ClasseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      classeId: [null, Validators.required], // utilise id de classe
      file: [null]
    });

    // charger classes si tu veux un select
    this.loadClasses();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.service.getById(this.id).subscribe(s => {
        this.form.patchValue({
          nom: s.nom,
          classeId: s.classe ? s.classe.id : null
        });
        this.filenamePreview = s.nomfichier || '';
      });
    }
  }
  loadClasses(){
    this.classeservice.getAll().subscribe({
      next: (data: any) => { this.classes = data }
    })
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // validation simple des types
    const allowed = ['application/pdf', 
                     'application/msword', 
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Type de fichier non autorisé. Autorisé : PDF, DOC, DOCX.');
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
    this.filenamePreview = file.name;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const nom = this.form.value.nom;
    const classeId = this.form.value.classeId;

    if (this.id) {
      this.service.updateWithFile(this.id, { nom, classeId, file: this.selectedFile })
        .subscribe(() => this.router.navigate(['/supports']));
    } else {
      this.service.createWithFile({ nom, classeId, file: this.selectedFile })
        .subscribe(() => this.router.navigate(['/supports']));
    }
  }

  removeSelectedFile() {
    this.selectedFile = undefined;
    this.filenamePreview = '';
    // vider input file html si nécessaire via ViewChild ou en réinitialisant le form control
  }
}
