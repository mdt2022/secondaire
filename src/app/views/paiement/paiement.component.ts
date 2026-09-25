import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PaiementService } from '../../service/paiement.service';
import { AnneeuvService } from '../../service/anneeuv.service';
import { EleveecoleService } from '../../service/eleveecole.service';
import { ClasseEcoleService } from '../../service/classeecole.service';
import { AuthService } from '../../service/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit {

  form!: FormGroup;
  annees: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  paiements: any[] = [];

  editMode = false;
  currentId: number | null = null;

  ecoleId!: number;

  page: number = 1;
  pageSize: number = 5;

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private eleveService: EleveecoleService,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.ecoleId = this.auth.getEcoleId()!;

    this.form = this.fb.group({
      anneeId: ['', Validators.required],
      classeId: ['', Validators.required],
      eleveId: ['', Validators.required],
      numerorecu: ['', Validators.required],
      montant: ['', Validators.required],
      enlettre: [''],
      datepaie: ['', Validators.required],
      motif: ['', Validators.required]
    });

    this.loadAnnees();
    this.loadClasses();

    this.form.get('anneeId')?.valueChanges.subscribe(() => this.loadEleves());
    this.form.get('classeId')?.valueChanges.subscribe(() => this.loadEleves());
  }

  loadAnnees() {
    this.anneeService.getAll().subscribe(res => this.annees = res);
  }

  loadClasses() {
    this.classeService.getAllClasseParEcole(this.ecoleId).subscribe(res => this.classes = res);
  }

  loadEleves() {
    const anneeId = this.form.value.anneeId;
    const classeId = this.form.value.classeId;
    if (!anneeId || !classeId) { this.eleves = []; return; }

    const body = [anneeId.toString(), this.ecoleId.toString(), classeId.toString()];

    this.eleveService.getByClasseAndAnnee(body).subscribe({
      next: res => this.eleves = res.map(e => e.eleve),
      error: err => { console.error("Erreur chargement élèves", err); this.eleves = []; }
    });
  }

  search() {
    const v = this.form.value;
    this.paiementService.search(this.ecoleId, v.classeId, v.anneeId, v.eleveId, v.numerorecu)
      .subscribe({
        next: res => {
          this.paiements = res;
          Swal.fire('Recherche terminée', `${res.length} paiement(s) trouvé(s)`, 'success');
        },
        error: err => Swal.fire('Erreur', 'Impossible de récupérer les paiements', 'error')
      });
  }

  save() {
    if (this.form.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }

    const v = this.form.value;
    const data = {
      numerorecu: v.numerorecu,
      montant: v.montant,
      enlettre: v.enlettre,
      datepaie: v.datepaie,
      motif: v.motif,
      ecole: { idEcole: this.ecoleId },
      classe: { id: v.classeId },
      anneeuv: { id: v.anneeId },
      eleve: { id: v.eleveId }
    };

    if (this.editMode && this.currentId) {
      this.paiementService.update(this.currentId, data).subscribe({
        next: () => {
          Swal.fire('Modifié', 'Paiement mis à jour avec succès', 'success');
          this.reset();
        },
        error: () => Swal.fire('Erreur', 'Impossible de modifier le paiement', 'error')
      });
    } else {
      this.paiementService.create(data).subscribe({
        next: () => {
          Swal.fire('Enregistré', 'Paiement ajouté avec succès', 'success');
          this.reset();
        },
        error: () => Swal.fire('Erreur', 'Impossible d’ajouter le paiement', 'error')
      });
    }
  }

  edit(p: any) {
    this.editMode = true;
    this.currentId = p.id;
    this.form.patchValue({
      anneeId: p.anneeuv.id,
      classeId: p.classe.id,
      eleveId: p.eleve.id,
      numerorecu: p.numerorecu,
      montant: p.montant,
      enlettre: p.enlettre,
      datepaie: p.datepaie,
      motif: p.motif
    });
    this.loadEleves();
  }

  delete(id: number) {
    Swal.fire({
      title: 'Supprimer ce paiement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.paiementService.delete(id).subscribe({
          next: () => {
            Swal.fire('Supprimé', 'Le paiement a été supprimé', 'success');
            this.search();
          },
          error: () => Swal.fire('Erreur', 'Impossible de supprimer le paiement', 'error')
        });
      }
    });
  }

  reset() {
    this.editMode = false;
    this.currentId = null;
    this.form.reset();
    this.paiements = [];
    this.page = 1;
  }
}
