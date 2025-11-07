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
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { ClasseEcole } from '../../../model/classeecole';
import { Classe } from '../../../model/classe';
import { Eleve } from '../../../model/eleve';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent implements OnInit {
  user!: User;
  eleveecoleForm!: FormGroup;
  eleveecoleList: Eleveecole[] = [];
  editMode = false;
  currentId?: number;
  
  eleves: Eleveecole[] = [];
  ecoles: any[] = [];
  classes: Classe[] = [];
  annees: any[] = [];
  academies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eleveecoleService: EleveecoleService,
    private eleveService: EleveService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private academieService: AcademieService,
    private authService: AuthService,
    private router: Router,
    private classeecoleService: ClasseEcoleService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.loadRelations();

    this.eleveecoleForm = this.fb.group({      
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });
  }


  loadRelations() {
    this.anneeService.getAll().subscribe(d => this.annees = d);
    this.classeecoleService.getAllClasseParEcole(this.user.administrateur.ecole.idEcole).subscribe({
      next: (data) =>{
        this.classes = data
      }
    })
  }

  onSubmit() {
    const donnees = this.eleveecoleForm.value   
    const donnee: string[] = [donnees.anneeuv,this.user.administrateur.ecole.idEcole,donnees.classe];
   
    //console.log('Données envoyées :', donnee); // 👀 Vérifie ici
    this.eleveecoleService.getByClasseAndAnnee(donnee).subscribe({
      next: (data) =>{ 
        this.eleves = data 
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des élèves :', err);
      }
    })
  }

  delete(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Supprimer cette inscription ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eleveecoleService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'L’inscription a été supprimée avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
            // Recharge la liste si nécessaire
            this.loadRelations();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer cette inscription.'
            });
          }
        });
      }
    });
  }

  resetForm() {
    this.eleveecoleForm.reset();
    this.editMode = false;
    this.currentId = undefined;
  }
}
