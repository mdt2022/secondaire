import { Component, OnInit } from '@angular/core';
import { Administrateur } from '../../model/administrateur';
import { AdministrateurService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
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
  user!: User
  constructor(
    private adminService: AdministrateurService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();  
    // 🔴 Sécurisation avec ?. pour éviter le crash de l'écran blanc
    const roleNom = this.user?.administrateur?.role?.nom || '';
    
    console.log("[LOG] Rôle détecté à l'initialisation :", roleNom);
    this.adminService.getAll(roleNom).subscribe({
      next: res => this.administrateurs = res
    });
  }    
}
