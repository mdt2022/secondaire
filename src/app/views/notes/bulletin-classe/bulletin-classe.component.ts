import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../../service/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulletin-classe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bulletin-classe.component.html',
  styleUrl: './bulletin-classe.component.scss'
})
export class BulletinClasseComponent {

  formBulletin!: FormGroup;
  periodes: any[] = [];
  annees: any[] = [];
  classes: any[] = [];
  listeBulletins: any[] = [];
  etablissement: string = '';
  eleve: any;

  constructor(
    private fb: FormBuilder,
    private bulletinService: NoteService,
    // private etablissementService: EtablissementService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // this.loadPeriodes();
    // this.loadAnnees();
    // this.loadClasses();
    // this.loadEtablissement();
  }

  initForm(): void {
    this.formBulletin = this.fb.group({
      periode: [''],
      annee: [''],
      classe: ['']
    });
  }

  // loadPeriodes(): void {
  //   // Exemple de chargement
  //   this.bulletinService.getPeriodes().subscribe(data => {
  //     this.periodes = data;
  //   });
  // }

  // loadAnnees(): void {
  //   this.bulletinService.getAnnees().subscribe(data => {
  //     this.annees = data;
  //   });
  // }

  // loadClasses(): void {
  //   this.bulletinService.getClasses().subscribe(data => {
  //     this.classes = data;
  //   });
  // }

  // loadEtablissement(): void {
  //   this.etablissementService.getEtablissement().subscribe(data => {
  //     this.etablissement = data.nom;
  //   });
  // }

  chargerBulletins(): void {
    const formValues = this.formBulletin.value;
    // if (formValues.periode && formValues.annee && formValues.classe) {
    //   this.bulletinService
    //     .getBulletinsClasse(formValues.periode, formValues.annee, formValues.classe)
    //     .subscribe((data: any[]) => {
    //       this.listeBulletins = data;
    //     });
    // }
  }

  generateImprimerUrl(eleve: any): string {
    const { periode, annee, classe } = this.formBulletin.value;
    return `/note/ImprimerBulletin/${periode}/${classe}/${annee}`;
  }

  generateListeNotesUrl(eleve: any): string {
    const { periode, annee, classe } = this.formBulletin.value;
    return `/note/ListeDesNotes/${periode}/${classe}/${annee}`;
  }
}
