import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { CommonModule } from '@angular/common';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
@Component({
  selector: 'app-passage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './passage.component.html',
  styleUrl: './passage.component.scss'
})
export class PassageComponent implements OnInit {
  promoForm!: FormGroup;
  eleves: any[] = [];
  selectedEleves: number[] = [];
  classes: any[] = [];
  annees: any[] = [];
  user!: User;
  loading: boolean = false
  currentYear: number = new Date().getFullYear();


  constructor(
    private fb: FormBuilder, 
    private eleveEcoleService: EleveecoleService,
    private classeecoleService: ClasseEcoleService,
    private anneeuvService: AnneeuvService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getAdminData()
    this.getAllClasse()
    this.getAllAnnee()
    this.promoForm = this.fb.group({
      classeActuelle: [null],
      anneeActuelle: [null],
      classeSuivante: [null],
      anneeSuivante: [null]
    });
  }
  getAllClasse(){
    this.classeecoleService.getAllClasseParEcole(this.user.administrateur.ecole.idEcole).subscribe({next: data => this.classes = data})
  }
  getAllAnnee(){
    this.anneeuvService.getAll().subscribe({next: data =>{ this.annees = data}})
  }

  chargerEleves() {
    this.loading = true
    const { classeActuelle, anneeActuelle } = this.promoForm.value;
    let donnees = []
    donnees[0] = anneeActuelle
    donnees[1] = this.user.administrateur.ecole.idEcole
    donnees[2] = classeActuelle
    
    if (classeActuelle && anneeActuelle) {
      this.eleveEcoleService.getByClasseAndAnnee(donnees).subscribe({
        next: (data) => (this.eleves = data),
        error: (err) => console.error(err),
        complete: () => {this.loading = false}
      });
    }
  }

  toggleSelection(eleveId: number, event: any) {
    if (event.target.checked) {
      this.selectedEleves.push(eleveId);
    } else {
      this.selectedEleves = this.selectedEleves.filter((id) => id !== eleveId);
    }
  }
  

  isSelected(id: number): boolean {
    return this.selectedEleves.includes(id);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.selectedEleves = this.eleves.map(e => e.id);
    } else {
      this.selectedEleves = [];
    }
  }

  promouvoir() {
    const { classeSuivante, anneeSuivante } = this.promoForm.value;
    if (this.selectedEleves.length === 0) {
      alert("Veuillez sélectionner au moins un élève !");
      return;
    }

    if (!classeSuivante || !anneeSuivante) {
      alert("Veuillez choisir la classe et l'année suivante !");
      return;
    }
    this.eleveEcoleService.promouvoir(this.selectedEleves, classeSuivante, anneeSuivante).subscribe({
      next: (res) => {
        alert(res.message);
        this.selectedEleves = [];
        this.eleves = [];
      },
      error: (err) => console.error(err)
    });
  }
}