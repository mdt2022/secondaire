import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { ClasseService } from '../../../service/classe.service';
import { CommonModule } from '@angular/common';
import { AnneeuvService } from '../../../service/anneeuv.service';
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
  selectedIds: number[] = [];
  classes: any[] = [];
  annees: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private eleveEcoleService: EleveecoleService,
    private classeService: ClasseService,
    private anneeuvService: AnneeuvService
  ) {}

  ngOnInit() {
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
    this.classeService.getAll().subscribe({next: data => this.classes = data})
  }
  getAllAnnee(){
    this.anneeuvService.getAll().subscribe({next: data =>{ this.annees = data}})
  }

  chargerEleves() {
    const { classeActuelle, anneeActuelle } = this.promoForm.value;
    let donnees = []
    donnees[0] = anneeActuelle
    donnees[1] = 20
    donnees[2] = classeActuelle
    
    if (classeActuelle && anneeActuelle) {
      this.eleveEcoleService.getByClasseAndAnnee(donnees).subscribe({
        next: (data) => (this.eleves = data),
        error: (err) => console.error(err)
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
    return this.selectedIds.includes(id);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.selectedIds = this.eleves.map(e => e.id);
    } else {
      this.selectedIds = [];
    }
  }

  promouvoir() {
    const { classeSuivante, anneeSuivante } = this.promoForm.value;
    this.eleveEcoleService.promouvoir(this.selectedEleves, classeSuivante, anneeSuivante).subscribe({
      next: () => alert('Promotion effectuée avec succès ✅'),
      error: (err) => console.error(err)
    });
  }
}