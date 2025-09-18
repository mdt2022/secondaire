import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Matiere } from '../../model/matiere.model';
import { HttpClientModule } from '@angular/common/http';
import { MatiereService } from '../../service/matiere.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.scss']
})
export class MatieresComponent implements OnInit {
  
 ngOnInit(): void {
     
 }
}
