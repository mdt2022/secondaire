import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClasseEcoleService } from '../../../service/classeecole.service';
import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { AuthService } from '../../../service/auth.service';
@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {
  emploiForm!: FormGroup;
  classes: any[] = [];
  annees: any[] = [];
  emploisTable: any[] = [];
  loading = false;
  classeNom = '';
  anneeNom = '';
  user: any;
  constructor(
    private fb: FormBuilder,
    private classeService: ClasseEcoleService,
    private anneeService: AnneeuvService,
    private emploiService: EmploidutempsService,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.user = this.authService.getAdminData();
    this.emploiForm = this.fb.group({
      classe: [''],
      anneeuv: ['']
    });
    this.loadClasses();
    this.loadAnnees();
  }
  loadClasses() {
    const ecoleId = this.user.administrateur.ecole.idEcole;
    this.classeService.getAllClasseParEcole(ecoleId)
      .subscribe(res => this.classes = res);
  }
  loadAnnees() {
    this.anneeService.getAll()
      .subscribe(res => this.annees = res);
  }
  resetForm(): void {
    this.emploiForm.reset();
    this.emploisTable = [];
  }
  onSubmit() {
    const classeId = this.emploiForm.value.classe;
    const anneeId = this.emploiForm.value.anneeuv;
    const classe = this.classes.find(c => c.id == classeId);
    const annee = this.annees.find(a => a.id == anneeId);
    this.classeNom = classe?.nom;
    this.anneeNom = annee?.nom;
    this.emploiService.getAll().subscribe(res => {
      const filtres = res.filter(e =>
        e.classe?.id == classeId &&
        e.anneeuv?.id == anneeId
      );
      this.emploisTable = this.buildTable(filtres);
    });
  }
  buildTable(data: any[]) {
    const map = new Map();
    data.forEach(e => {
      const heure = `${e.heuredebut} - ${e.heurefin}`;
      if (!map.has(heure)) {
        map.set(heure, {
          heure: heure,
          Lundi: null,
          Mardi: null,
          Mercredi: null,
          Jeudi: null,
          Vendredi: null,
          Samedi: null
        });
      }
      map.get(heure)[e.jour] = e;
    });
    return Array.from(map.values());
  }
  generatePDF() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text('EMPLOI DU TEMPS', 120, 15);
    doc.setFontSize(12);
    doc.text(`Classe : ${this.classeNom}`, 14, 25);
    doc.text(`Année scolaire : ${this.anneeNom}`, 14, 32);
    const body = this.emploisTable.map(row => [
      row.heure,
      row.Lundi?.matiere?.libelle || '',
      row.Mardi?.matiere?.libelle || '',
      row.Mercredi?.matiere?.libelle || '',
      row.Jeudi?.matiere?.libelle || '',
      row.Vendredi?.matiere?.libelle || '',
      row.Samedi?.matiere?.libelle || ''
    ]);
    autoTable(doc, {
      startY: 40,
      head: [['Horaire', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']],
      body: body,
      theme: 'grid',
      styles: {
        halign: 'center',
        minCellHeight: 20
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0
      }
    });
    doc.save('emploi.pdf');
  }
}
