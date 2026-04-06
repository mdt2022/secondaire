import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { EleveecoleService } from '../../service/eleveecole.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eleve',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './eleve.component.html',
  styleUrl: './eleve.component.scss'
})
export class EleveComponent implements OnInit {

  classes: any[] = [];
  stats: any[] = [];
  totalEleves = 0;

  ecoleId!: number;
  anneeId!: number;

  constructor(
    private classeService: ClasseEcoleService,
    private eleveecoleService: EleveecoleService,
    private anneeService: AnneeuvService
  ) {}

  ngOnInit(): void {

  const user = JSON.parse(localStorage.getItem('user')!);

  this.ecoleId = user.administrateur.ecole.idEcole;

  this.anneeId = user.parametre.anneepardefaut.id;

  this.loadClasses();
}

  loadClasses() {
    this.classeService.getAllClasseParEcole(this.ecoleId)
      .subscribe(classes => {
        this.classes = classes;
        this.loadStats();
      });
  }

loadStats() {
  this.stats = [];
  this.totalEleves = 0;

  this.classes.forEach(classe => {

    this.eleveecoleService.getByClasseAndAnnee([
      this.anneeId.toString(),
      this.ecoleId.toString(),
      classe.id.toString()
    ]).subscribe(eleves => {

      const nombre = eleves.length;

      this.stats.push({
        nom: classe.nom,
        nombre: nombre
      });

      this.totalEleves += nombre;
    });
  });
}
}
