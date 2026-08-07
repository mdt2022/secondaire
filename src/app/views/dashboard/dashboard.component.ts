import { Component, OnInit } from '@angular/core';
import { Administrateur } from '../../model/administrateur';
import { AdministrateurService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  administrateurs: Administrateur[] = []
  constructor(
    private adminService: AdministrateurService
  ) {}
  ngOnInit(): void {
    this.adminService.getAll().subscribe(
      res => this.administrateurs = res
    );
  }    
}
