import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { Administrateur } from '../../model/administrateur';
import { AdministrateurService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-administrateur',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent, 
    CardHeaderComponent, 
    CardBodyComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './administrateur.component.html',
  styleUrl: './administrateur.component.scss'
})
export class AdministrateurComponent implements OnInit{
  administrateurs: Administrateur[] = []
  //initiation
  ngOnInit(): void{
    this.getAll()
  }
  //constructeur
  constructor(private adminService: AdministrateurService){}
  //retour des administrateur
  getAll(){
    this.adminService.getAll().subscribe({
      next: (data) =>{
        this.administrateurs = data
      }
    })
  }
  //supprission
  Supprimer(){
    alert("Supprimer !!")
  }

}
