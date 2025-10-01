import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Classe } from '../../../model/classe.model';
import { Anneeuv } from '../../../model/anneeuv.model';
import { User } from '../../../model/user.model';
import { ClasseecoleService } from '../../../service/classeecole.service';
import { EleveService } from '../../../service/eleve.service'
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AuthService } from '../../../service/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Eleve } from '../../../model/eleve.model';

@Component({
  selector: 'app-listeeleves',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './listeeleves.component.html',
  styleUrls: ['./listeeleves.component.scss']
})
export class ListeelevesComponent implements OnInit {
  studentForm: FormGroup;
  classes: Classe[] = [];
  anneeuvs: Anneeuv[] = [];
  user!: User
  eleves: Eleve[] = [];
  constructor(private fb: FormBuilder,
    private classeecoleService: ClasseecoleService,
    private eleveService: EleveService,
    private anneeuvService: AnneeuvService,
    private authService: AuthService
  ) {    
      this.studentForm = this.fb.group({
        classe: [null],
        anneeuv: [null]
      });
    
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage()
    this.loadData()
  }

  loadData(){
    this.anneeuvService.getAllAnnee().subscribe({
      next: (data) => { this.anneeuvs = data }
    })
    this.classeecoleService.getClasseEcole(this.user.administrateur.ecole.idEcole).subscribe({
      next: (data) => { this.classes = data }
    })
  }
  
  rechercher(): void {
    this.eleveService.getAllEleveecole(this.studentForm.value.anneeuv, ''+this.user.administrateur.ecole.idEcole, this.studentForm.value.classe).subscribe({
      next: (data) => { this.eleves = data}
    })
  }
}
