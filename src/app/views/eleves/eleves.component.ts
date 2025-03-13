import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.scss'
})
export class ElevesComponent implements OnInit {
  etablissement = { id: 1, nom: 'Mon École' }; // EXEMPLE
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
