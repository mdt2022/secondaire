import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Classe } from '../../model/classe.model';
import { Ecole } from '../../model/ecole.model';
import { ClasseService } from '../../service/classe.service';
import { EleveService } from '../../service/eleve.service';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';

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
  classes: any[] = []; // On va enrichir les classes avec nombreEleves
  totalEleves: number = 0;
  user!: User;

  constructor(
    private classeService: ClasseService, 
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
    this.classeService.getClasseEcole(ecoleId).subscribe(classes => {
      let total = 0;
      const tempClasses: any[] = [];
  
      let completedRequests = 0;
  
      classes.forEach(classe => {
        
        this.eleveService.getAllEleveecole(an.toString(), ecole.toString(), classe.id.toString()).subscribe(eleves => {
          console.log(eleves);
          tempClasses.push({ ...classe, nombreEleves: eleves.length });
          total += eleves.length;
          completedRequests++;
  
          if (completedRequests === classes.length) {
            this.classes = tempClasses;
            this.totalEleves = total;
          }
        });
      });
    });
  }
  

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
