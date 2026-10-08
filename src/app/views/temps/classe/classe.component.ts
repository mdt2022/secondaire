import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { EnseignantService } from '../../../service/enseignant.service';
import { AuthService } from '../../../service/auth.service';

import { Classe } from '../../../model/classe';
import { Anneeuv } from '../../../model/anneeuv';
import { Emploidutemps } from '../../../model/emploidutemps';
import { Enseignant } from '../../../model/enseignant';
import { Matiere } from '../../../model/matiere';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  emploiForm!: FormGroup;

  classes: Classe[] = [];
  annees: Anneeuv[] = [];
  enseignants: Enseignant[] = [];
  matieres: Matiere[] = [];

  emploisTable: any[] = [];
  loading = false;
  rechercheEffectuee = false;
  user: any;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private enseignantService: EnseignantService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    console.log('USER RAW:', this.user);

    // Initialisation du formulaire
    this.emploiForm = this.fb.group({
      jour: [''],
      heuredebut: [''],
      heurefin: [''],
      matiere: [''],
      enseignant: [''],
      classe: [''],
      anneeuv: ['']
    });

    console.log('USER FINAL:', this.user);

    this.loadAnnees();
    this.loadClassesByEcole();
    this.loadEnseignantsByEcole();
  }

  loadAnnees(): void {
    this.anneeService.getAll().subscribe(res => this.annees = res);
  }

  loadClassesByEcole(): void {
    const ecoleId = this.user?.administrateur?.ecole?.idEcole;
    if (!ecoleId) return console.error('Aucun idEcole trouvé');

    this.classeService.getAllClasseParEcole(ecoleId).subscribe(res => this.classes = res);
  }

  loadEnseignantsByEcole(): void {
    const ecoleId = this.user?.administrateur?.ecole?.idEcole;
    if (!ecoleId) return console.error('Aucun idEcole trouvé');

    this.enseignantService.getEnseignantEcole(ecoleId).subscribe(res => this.enseignants = res);
  }


  onSubmit(): void {
    const { classe, anneeuv } = this.emploiForm.value;
    if (!classe || !anneeuv) {
      Swal.fire('Sélection requise', 'Veuillez sélectionner la classe et l’année.', 'warning');
      return;
    }

    this.rechercheEffectuee = false;
    const payload: any = {
      jour: this.emploiForm.value.jour,
      heuredebut: this.emploiForm.value.heuredebut,
      heurefin: this.emploiForm.value.heurefin,
      matiere: { id: this.emploiForm.value.matiere },
      professeur: { id: this.emploiForm.value.enseignant },
      classe: { id: classe },
      anneeuv: { id: anneeuv },
      ecole: { idEcole: this.user.administrateur.ecole.idEcole }
    };

    this.loading = true;
    this.emploiService.getAll().subscribe({
      next: (res) => {
        const filtres = res.filter(e => Number(e.classe?.id) === Number(classe) && Number(e.anneeuv?.id) === Number(anneeuv));
        this.emploisTable = this.buildTable(filtres);
        this.rechercheEffectuee = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des emplois :', err);
        this.loading = false;
      }
    });
  }

  buildTable(emplois: Emploidutemps[]) {
    const map = new Map<string, any>();
    emplois.forEach(e => {
      const key = `${e.heuredebut} - ${e.heurefin}`;
      if (!map.has(key)) {
        map.set(key, { heure: key, Lundi: null, Mardi: null, Mercredi: null, Jeudi: null, Vendredi: null, Samedi: null });
      }
      map.get(key)[e.jour] = e;
    });
    return Array.from(map.values()).sort((a, b) => {
      const [debutA, finA] = a.heure.split(' - ').map((heure: string) => this.minutesDepuisMinuit(heure));
      const [debutB, finB] = b.heure.split(' - ').map((heure: string) => this.minutesDepuisMinuit(heure));
      return debutA - debutB || finA - finB;
    });
  }

  private minutesDepuisMinuit(heure: string): number {
    const [heures, minutes] = heure.split(':').map(Number);
    return heures * 60 + minutes;
  }

  async printEmploi(): Promise<void> {
    if (this.emploisTable.length === 0) {
      Swal.fire('Aucun emploi du temps', 'Recherchez une classe avant de lancer l’impression.', 'info');
      return;
    }

    const { classe, anneeuv } = this.emploiForm.value;
    const classeNom = this.classes.find(item => Number(item.id) === Number(classe))?.description ?? '';
    const anneeNom = this.annees.find(item => Number(item.id) === Number(anneeuv))?.nom ?? '';
    const descriptionEcole = this.user?.administrateur?.ecole?.descriptionEcole ?? '';
    const adresseEcole = this.user?.administrateur?.ecole?.adresseEcole ?? '';
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = await this.loadLogoForPdf();

    if (logo) doc.addImage(logo, 'PNG', 15, 10, 25, 25);
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    const descriptionLignes = doc.splitTextToSize(descriptionEcole.toUpperCase(), pageWidth - 75);
    doc.text(descriptionLignes, pageWidth / 2 + 10, 16, { align: 'center' });
    const titreY = Math.max(34, 16 + descriptionLignes.length * 8 + 5);
    doc.setFontSize(16);
    doc.text('Emploi du temps par classe', pageWidth / 2, titreY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Classe : ${classeNom}    Année scolaire : ${anneeNom}`, pageWidth / 2, titreY + 7, { align: 'center' });

    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const body = this.emploisTable.map(row => [
      row.heure,
      ...jours.map(jour => row[jour]?.matiere?.libelle ?? '')
    ]);

    autoTable(doc, {
      startY: titreY + 13,
      head: [['Horaire', ...jours]],
      body,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: [40, 100, 180] },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.text(adresseEcole, 15, pageHeight - 8);
        doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 10, pageHeight - 6, { align: 'right' });
      }
    });

    const nomFichier = String(classeNom || 'classe').replace(/[^a-zA-Z0-9-]/g, '-');
    const anneeFichier = String(anneeNom || 'annee').replace(/[^a-zA-Z0-9-]/g, '-');
    doc.save(`emploi-du-temps-${nomFichier}-${anneeFichier}.pdf`);
  }

  private loadLogoForPdf(): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
      const logo = new Image();
      logo.onload = () => resolve(logo);
      logo.onerror = () => resolve(null);
      logo.src = 'assets/logo.png';
    });
  }

  resetForm(): void {
    this.emploiForm.reset();
    this.emploisTable = [];
    this.rechercheEffectuee = false;
  }

  getEmploi(row: any): any {
    return row.Lundi || row.Mardi || row.Mercredi || row.Jeudi || row.Vendredi || row.Samedi;
  }

  deleteEmploi(id: number): void {
    Swal.fire({
      title: 'Supprimer cet emploi du temps ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.emploiService.delete(id).subscribe({
        next: () => {
          Swal.fire('Supprimé', 'L’emploi du temps a été supprimé.', 'success');
          this.onSubmit();
        },
        error: err => {
          console.error(err);
          Swal.fire('Erreur', 'Impossible de supprimer cet emploi du temps.', 'error');
        }
      });
    });
  }
}
