import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteService } from '../../../service/note.service';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulletin-eleve',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bulletin-eleve.component.html',
  styleUrl: './bulletin-eleve.component.scss'
})
export class BulletinEleveComponent {

  etablissement = 'Mon Établissement'; // à remplacer dynamiquement si besoin
  formBulletin: FormGroup;

  annees: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  periodes: any[] = [];

  notes: any[] = [];
  totalMoyenneCoef: number = 0;
  moyenneGenerale: number = 0;
  appreciation: string = '';

  constructor(
    private fb: FormBuilder,
    private bulletinService: NoteService,
    private router: Router
  ) {
    this.formBulletin = this.fb.group({
      anneeuv: ['', Validators.required],
      classe: ['', Validators.required],
      eleve: ['', Validators.required],
      periode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.chargerAnnees();
    // this.chargerClasses();
    // this.chargerPeriodes();
  }

  // chargerAnnees() {
  //   this.bulletinService.getAnnees().subscribe(data => {
  //     this.annees = data;
  //   });
  // }

  // chargerClasses() {
  //   this.bulletinService.getClasses().subscribe(data => {
  //     this.classes = data;
  //   });
  // }

  // chargerPeriodes() {
  //   this.bulletinService.getPeriodes().subscribe(data => {
  //     this.periodes = data;
  //   });
  // }

  chargerEleves() {
    const classeId = this.formBulletin.get('classe')?.value;
    // if (classeId) {
    //   this.bulletinService.getElevesParClasse(classeId).subscribe(data => {
    //     this.eleves = data;
    //   });
    // }
  }

  produireBulletin() {
    // if (this.formBulletin.valid) {
    //   const params = this.formBulletin.value;
    //   this.bulletinService.getNotesBulletin(params).subscribe((data: any) => {
    //     this.notes = data.notes;
    //     this.totalMoyenneCoef = data.tmoycoef;
    //     this.moyenneGenerale = data.moyg;
    //     this.appreciation = data.appreciation;
    //   });
    // }
  }

  imprimerBulletin() {
    // if (this.formBulletin.valid) {
    //   const params = this.formBulletin.value;
    //   this.bulletinService.imprimerBulletin(params).subscribe(() => {
    //     alert("Bulletin imprimé !");
    //   });
    // }
  }

  modifierNote(noteId: number) {
    this.router.navigate(['/note/edit', noteId]);
  }

  supprimerNote(noteId: number) {
    // if (confirm('Voulez-vous vraiment supprimer cette note ?')) {
    //   this.bulletinService.supprimerNote(noteId).subscribe(() => {
    //     this.produireBulletin(); // Rafraîchir les notes
    //   });
    // }
  }
}
