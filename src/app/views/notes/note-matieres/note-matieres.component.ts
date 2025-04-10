import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-matieres',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-matieres.component.html',
  styleUrl: './note-matieres.component.scss'
})
export class NoteMatieresComponent {

  noteForm: FormGroup;
  formNotes: FormGroup;

  periodes = [
    { id: 1, libelle: 'Trimestre 1' },
    { id: 2, libelle: 'Trimestre 2' }
  ];
  annees = [
    { id: 2023, nom: '2023-2024' },
    { id: 2024, nom: '2024-2025' }
  ];
  classes = [
    { id: 1, nom: '6ème A' },
    { id: 2, nom: '5ème B' }
  ];
  matieres = []; // Dynamique selon classe

  notes: any[] = [];

  etablissement = 'Lycée Exemple';
  classe: any;
  periode: any;
  matiere: any;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      periode: ['0'],
      anneeuv: [''],
      classe: [''],
      matiere: ['']
    });

    this.formNotes = this.fb.group({});
  }

  ngOnInit(): void {}

  chargerMatieres(): void {
    const idClasse = this.noteForm.value.classe;
    if (idClasse) {
      // Simulation : à remplacer par un appel au backend
      this.matieres = [
       
      ];
    }
  }

  afficherNotes(): void {
    const formValues = this.noteForm.value;

    // Validation simple
    if (!formValues.classe || !formValues.periode || !formValues.matiere) {
      alert("Veuillez sélectionner une période, classe et matière.");
      return;
    }

    // Simule les données des élèves pour les notes
    this.notes = [
      {
        id: 1,
        eleve: 101,
        matricule: 'A001',
        nom: 'Traoré',
        prenom: 'Aminata',
        note_classe: 14,
        note_compo: 15
      },
      {
        id: 2,
        eleve: 102,
        matricule: 'B002',
        nom: 'Koné',
        prenom: 'Ismaël',
        note_classe: 12,
        note_compo: 13.5
      }
    ];

    // Mise à jour des entêtes affichés
    this.classe = this.classes.find(c => c.id === +formValues.classe);
    this.periode = this.periodes.find(p => p.id === +formValues.periode);
    // this.matiere = this.matieres.find(m => m.id === +formValues.matiere);

    // Construction dynamique de formNotes
    this.rebuildFormNotes(formValues);
  }

  rebuildFormNotes(formValues: any): void {
    this.formNotes = this.fb.group({
      periode: [formValues.periode],
      matiere: [formValues.matiere],
      classe: [formValues.classe],
      anneeuv: [formValues.anneeuv],
      ecole: [1] // fixe ou dynamique
    });

    this.notes.forEach((note, i) => {
      this.formNotes.addControl('eleve' + i, this.fb.control(note.eleve));
      this.formNotes.addControl('id' + i, this.fb.control(note.id));
      this.formNotes.addControl('note_classe' + i, this.fb.control(note.note_classe));
      this.formNotes.addControl('note_compo' + i, this.fb.control(note.note_compo));
    });
  }

  onSubmit(): void {
    console.log('Formulaire des notes soumis :', this.formNotes.value);
    // Envoyer au backend ici
  }
}
