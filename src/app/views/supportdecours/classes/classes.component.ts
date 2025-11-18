import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnseignerService } from '../../../service/enseigner.service';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { Matiere } from '../../../model/matiere';
@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit{
  idclasse!: number
  user!: User
  matieres: Matiere[] = []

  constructor(
    private route: ActivatedRoute,
    private enseignerservice: EnseignerService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.idclasse = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.authservice.getAdminData()
    this.loadMatieres()
  }
  loadMatieres(){
    //ecole classe
    let donnees = [
      this.user.administrateur.ecole.idEcole,this.idclasse
    ]
    this.enseignerservice.getMatiereEcoleClasse(donnees).subscribe({
      next: (data) => { this.matieres = data },
      error: () => {},
      complete: () => {}
    })
  }

}
