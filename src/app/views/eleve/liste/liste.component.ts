import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EleveecoleService } from '../../../service/eleveecole.service';
import { Eleveecole } from '../../../model/eleveecole';
import { EleveService } from '../../../service/eleve.service';
import { EcoleService } from '../../../service/ecole.service';
import { ClasseService } from '../../../service/classe.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { AcademieService } from '../../../service/academie.service';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { ClasseEcole } from '../../../model/classeecole';
import { Classe } from '../../../model/classe';
import { Eleve } from '../../../model/eleve';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent implements OnInit {
  user!: User;
  eleveecoleForm!: FormGroup;
  eleveecoleList: Eleveecole[] = [];
  editMode = false;
  currentId?: number;
  loading: boolean = false; // ✅ indicateur de chargement
  resultat: boolean = false
  
  eleves: any[] = [];
  ecoles: any[] = [];
  classes: Classe[] = [];
  annees: any[] = [];
  academies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eleveecoleService: EleveecoleService,
    private eleveService: EleveService,
    private ecoleService: EcoleService,
    private classeService: ClasseService,
    private anneeService: AnneeuvService,
    private academieService: AcademieService,
    private authService: AuthService,
    private router: Router,
    private classeecoleService: ClasseEcoleService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAdminData();
    this.loadRelations();

    this.eleveecoleForm = this.fb.group({      
      classe: [null, Validators.required],
      anneeuv: [null, Validators.required]
    });
  }


  loadRelations() {
    this.anneeService.getAll().subscribe(d => this.annees = d);
    this.classeecoleService.getAllClasseParEcole(this.user.administrateur.ecole.idEcole).subscribe({
      next: (data) =>{
        this.classes = data
      }
    })
  }

  onSubmit() {
    this.loading = true
    const donnees = this.eleveecoleForm.value   
    const donnee: string[] = [donnees.anneeuv,this.user.administrateur.ecole.idEcole,donnees.classe];   
    //console.log('Données envoyées :', donnee); // 👀 Vérifie ici
    this.eleveecoleService.getByClasseAndAnnee(donnee).subscribe({
      next: (data) =>{ 
        this.eleves = data 
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des élèves :', err);
      },
      complete: () =>{ 
        this.loading = false
        this.resultat = true
      }
    })
  }

  async imprimerListe(): Promise<void> {
    if (this.eleves.length === 0) {
      Swal.fire('Liste vide', 'Aucun élève à imprimer.', 'info');
      return;
    }

    const { classe: classeId, anneeuv: anneeId } = this.eleveecoleForm.value;
    const classeNom = this.classes.find(classe => String(classe.id) === String(classeId))?.nom ?? '';
    const anneeNom = this.annees.find(annee => String(annee.id) === String(anneeId))?.nom ?? '';
    const descriptionEcole = this.user?.administrateur?.ecole?.descriptionEcole ?? '';
    const adresseEcole = this.user?.administrateur?.ecole?.adresseEcole ?? '';
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logo = await this.loadLogoForPdf();

    if (logo) doc.addImage(logo, 'PNG', 15, 10, 25, 25);
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    const descriptionLignes = doc.splitTextToSize(descriptionEcole.toUpperCase(), pageWidth - 75);
    doc.text(descriptionLignes, pageWidth / 2 + 10, 16, { align: 'center' });
    const titreY = Math.max(34, 16 + descriptionLignes.length * 7 + 4);
    doc.setFontSize(14);
    doc.text('Liste des élèves', pageWidth / 2, titreY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Classe : ${classeNom}    Année scolaire : ${anneeNom}`, pageWidth / 2, titreY + 7, { align: 'center' });

    autoTable(doc, {
      startY: titreY + 13,
      head: [['N°', 'Matricule', 'Nom', 'Prénom']],
      body: this.eleves.map((inscription, index) => [
        String(index + 1),
        inscription.eleve?.matricule ?? '',
        inscription.eleve?.nom ?? '',
        inscription.eleve?.prenom ?? ''
      ]),
      headStyles: { fillColor: [37, 99, 235] },
      styles: { font: 'helvetica', fontSize: 9 },
      margin: { bottom: 18 },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.text(adresseEcole, 15, doc.internal.pageSize.getHeight() - 8);
      }
    });

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  private loadLogoForPdf(): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
      const logo = new Image();
      logo.onload = () => resolve(logo);
      logo.onerror = () => resolve(null);
      logo.src = 'assets/logo.png';
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Supprimer cette inscription ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eleveecoleService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'L’inscription a été supprimée avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
            // Recharge la liste si nécessaire
            this.loadRelations();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer cette inscription.'
            });
          }
        });
      }
    });
  }

  resetForm() {
    this.eleveecoleForm.reset();
    this.editMode = false;
    this.currentId = undefined;
    this.resultat = false
  }
}
