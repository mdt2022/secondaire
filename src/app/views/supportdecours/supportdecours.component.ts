import { Component, OnInit } from '@angular/core';
import { SupportDeCours } from '../../model/supportDeCours';
import { SupportDeCoursService } from '../../service/supportDeCours.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-supportdecours',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './supportdecours.component.html',
  styleUrl: './supportdecours.component.scss'
})
export class SupportdecoursComponent implements OnInit {
  apiUrl = environment.apiURL+"/supports";
  supports: SupportDeCours[] = [];

  constructor(private service: SupportDeCoursService) {}

  ngOnInit(): void {
    this.loadSupports();
  }

  loadSupports() {
    this.service.getAll().subscribe(data => {
      this.supports = data.map(s => ({
      ...s,
      classe: s.classe || { nom: '-' }
    }));;
    });
  }

  delete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce support ?')) {
      this.service.delete(id).subscribe(() => this.loadSupports());
    }
  }
}
