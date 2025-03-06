import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { AdminService } from '../../service/admin.service';
import { Administrateur } from '../../model/admin.model';
import { Ecole } from '../../model/ecole.model';
import { Site } from '../../model/site.model';
import { Role } from '../../model/role.model';
import { EcoleService } from '../../service/ecole.service';
import { RoleService } from '../../service/role.service';
@Component({
  selector: 'app-administrateur',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent, 
    ColComponent,
    RowComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './administrateur.component.html',
  styleUrl: './administrateur.component.scss'
})
export class AdministrateurComponent implements OnInit {
  admins: Administrateur[] = [];
  ecoles: Ecole[] = [];
  roles: Role[] = [];
  adminForm: Administrateur = {
    id:0,
    nom: '',
    prenom: '',
    email: '',
    adresse: '', 
    telephone: '', 
    lieun: '', 
    datedn: '',
    photo: '', username: '', password:'',
    ecole: { idEcole: 0, nomEcole: '', descriptionEcole: '', categorie: '' },
    site: { id: 0, nom: '', adresse: '', signature:'', titre:'', responsable:'' },
    role: { id: 0, nom:'', description: '' }
  };
  isEditing = false;
 // Définir un rôle par défaut
  private readonly DEFAULT_ROLE: Role = {id: 1, nom: '', description: ''};
  private readonly DEFAULT_SITE: Site = { id: 1, nom: '', adresse: '', signature:'', titre:'', responsable:'' };
  private readonly DEFAULT_ECOLE: Ecole = { idEcole: 1, nomEcole: '', descriptionEcole: '', categorie: '' };
  constructor(
    private adminService: AdminService,
    private ecoleService: EcoleService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadEcoles();

    this.loadRoles();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmin().subscribe(data => {
      this.admins = data;
    });
  }

  loadEcoles(): void {
    this.ecoleService.getAllEcole().subscribe(data => {
      this.ecoles = data;
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  saveOrUpdate(): void {
    if (this.isEditing) {

      this.adminService.update(1,this.adminForm).subscribe(() => {

        console.log(this.adminForm.site.id+" +++++");
        this.loadAdmins();
        this.resetForm();
      });
    } else {
      this.adminService.save(this.adminForm).subscribe(() => {
        this.loadAdmins();
        this.resetForm();
      });
    }
  }

  edit(admin: Administrateur): void {
  // Vérifier si admin.role est défini
  if (!admin.role) {
    console.warn('Le rôle de l\'administrateur est null ou undefined. Utilisation du rôle par défaut.');
    admin.role = this.DEFAULT_ROLE; // Utiliser un rôle par défaut
  }
  if (!admin.site) {
    console.warn('Le site de l\'administrateur est null ou undefined. Utilisation du rôle par défaut.');
    admin.site = this.DEFAULT_SITE; // Utiliser un rôle par défaut
  }
  if (!admin.ecole) {
    console.warn('Le ecole de l\'administrateur est null ou undefined. Utilisation du rôle par défaut.');
    admin.ecole = this.DEFAULT_ECOLE; // Utiliser un rôle par défaut
  }
  const selectedRole = this.roles.find((role) => role.id === admin.role.id) || this.DEFAULT_ROLE;
  const setectedEcole = this.ecoles.find((ecole) => ecole.idEcole === admin.ecole.idEcole) || this.DEFAULT_ECOLE;
    // Vérifier si selectedRole est défini
  if (!selectedRole) {
    console.error("Rôle non trouvé pour l'administrateur :", admin);
    return;
  }

  if (!setectedEcole) {
    console.error("Ecole non trouvé pour l'administrateur :", admin);
    return;
  }
    this.adminForm = { ...admin, role: selectedRole, ecole: setectedEcole };

    this.isEditing = true;
  }

  deleteAdmin(id: number): void {
    this.adminService.delete(id).subscribe(() => {
      this.loadAdmins();
    });
  }

  resetForm(): void {
    this.adminForm = {
      id:0,
      nom: '',
      prenom: '',
      email: '',
      adresse: '', 
      telephone: '', 
      lieun: '', 
      datedn: '',
      photo: '', username: '', password:'',
      ecole: { idEcole: 0, nomEcole: '', descriptionEcole: '', categorie: '' },
      site: { id: 0, nom: '', adresse: '', signature:'', titre:'', responsable:'' },
      role: { id: 0, nom:'', description: '' }
    };
    this.isEditing = false;
  }

}
