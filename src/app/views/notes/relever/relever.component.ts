import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-relever',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './relever.component.html',
  styleUrl: './relever.component.scss'
})
export class ReleverComponent {
  // releveForm = this.fb.group({
  //   classe: [''],
  //   periode: [''],
  //   anneeuv: ['']
  // });
  
  classes: any[] = [];
  periodes: any[] = [];
  annees: any[] = [];
  
  etablissement: string = 'Nom établissement';
  resultats: any = null;
  releveForm!: FormGroup;
  
  // constructor(private fb: FormBuilder, private releveService: ReleveService) {}
  
  ngOnInit(): void {
    this.chargerDonnees();
  }
  
  chargerDonnees() {
    // À remplacer par appels API si tu veux
    this.classes = [/* ... */];
    this.periodes = [/* ... */];
    this.annees = [/* ... */];
  }
  
  produireReleve() {
    // const formValue = this.releveForm.value;
    // this.releveService.getReleve(formValue).subscribe((data) => {
    //   this.resultats = data;
    // });
  }
  
  imprimerReleve() {
    // const formValue = this.releveForm.value;
    // this.releveService.imprimerReleve(formValue).subscribe((reponse) => {
    //   // peut-être ouvrir une fenêtre PDF
    //   window.open(reponse.urlPDF, '_blank');
    // });
  }
}  