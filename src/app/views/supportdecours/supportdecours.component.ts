import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { Classe } from '../../model/classe';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-supportdecours',
  standalone: true,
  imports: [    
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './supportdecours.component.html',
  styleUrl: './supportdecours.component.scss'
})
export class SupportdecoursComponent implements OnInit {
  apiUrl = environment.apiURL+"/supports";
  classes: Classe[] = []
  user!: User
  

  constructor(
    private classeecoleservice: ClasseEcoleService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authservice.getAdminData()
    this.loadClasse()
  }
  loadClasse(){
    let ecole = this.user.administrateur.ecole.idEcole
    this.classeecoleservice.getAllClasseParEcole(ecole).subscribe({
      next: (data) => { this.classes = data },
      error: (err) => { console.log(err+" test de retour ") },
      complete: () => {}
    })
  }
}
