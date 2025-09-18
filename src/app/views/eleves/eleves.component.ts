import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Classe } from '../../model/classe.model';
import { Ecole } from '../../model/ecole.model';
import { ClasseService } from '../../service/classe.service';
import { EleveService } from '../../service/eleve.service';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';
import { ClasseecoleService } from '../../service/classeecole.service';
import { ClasseDTO } from '../../dto/ClasseDTO.dto';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './eleves.component.html',
  styleUrls: ['./eleves.component.scss']
})
export class ElevesComponent implements OnInit {  
  totalEleves: number = 0;
  classedots: ClasseDTO[] = []
  user!: User;
  today = new Date();
  getColorForClass(classeNom: string): string {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
    const hash = Array.from(classeNom).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }
  refreshStats(){}

  constructor(
    private classeecoleService: ClasseecoleService, 
    private eleveService: EleveService, 
    private authService: AuthService,
    private router: Router  // Injection du Router ici
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.user = this.authService.getUserFromLocalStorage();
    console.log(this.user);
  
    const ecole = this.user.administrateur.ecole.idEcole;
    const ecoleId = this.user.administrateur.ecole.idEcole;
    const an = this.user.parametre.anneepardefaut.id;
    this.eleveService.getNombreEleveClasseEcole(ecoleId).subscribe({
      next: (data) =>{ this.classedots = data}
    });
  }
  

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
