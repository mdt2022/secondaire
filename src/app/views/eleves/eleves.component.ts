import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.scss'
})
export class ElevesComponent implements OnInit {
  etablissement = { id: 1, nom: 'Mon École' }; // À remplacer par une récupération depuis un service
  classes: any[] = [];
  totalEleves: number = 0;
  router: any;

  constructor() {}

  ngOnInit() {
  }

 

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

 
}
