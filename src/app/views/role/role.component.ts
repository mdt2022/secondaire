import { Component, OnInit } from '@angular/core';
import { Role } from '../../model/role.model';
import { RoleService } from '../../service/role.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role',
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
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
 
  roles: Role[] = [];  // Liste des rôles
  role: Role = { id: 0, nom: '', description: '' };  // Le rôle actuellement sélectionné (création ou modification)
  isEditMode: boolean = false;  // Flag pour savoir si nous sommes en mode édition
  permissions: any[] = [];
  selectedRole: any = null;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.getRoles();  // Récupérer la liste des rôles au démarrage
  }

  selectRole(role: any) {
    this.selectedRole = role;
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedRole?.permissions?.some((p: any) => p.id === permissionId) ?? false;
  }
  
  togglePermission(permissionId: number) {
    if (!this.selectedRole) return;
    const index = this.selectedRole.permissions.findIndex((p: any) => p.id === permissionId);
    if (index >= 0) {
      this.selectedRole.permissions.splice(index, 1);
    } else {
      this.selectedRole.permissions.push({ id: permissionId });
    }
  }
  saveChanges() {
    if (!this.selectedRole) return;
    const permissionIds = this.selectedRole.permissions.map((p: any) => p.id);
    this.roleService.updateRolePermissions(this.selectedRole.id, permissionIds).subscribe(() => {
      alert('Permissions mises à jour !');
    });
  }

  // Récupérer la liste des rôles
  getRoles(): void {
    this.roleService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  // Activer le mode édition et charger les données du rôle
  editRole(id: number): void {
    this.isEditMode = true;  // Passer en mode édition
    this.roleService.getRoleById(id).subscribe((role) => {
      this.role = role;  // Charger les données du rôle dans le formulaire
    });
  }

  // Activer le mode création (réinitialiser le formulaire)
  createRole(): void {
    this.isEditMode = false;  // Passer en mode création
    this.role = { id: 0, nom: '', description: '' };  // Réinitialiser les données du rôle
  }

  // Sauvegarder ou créer un rôle selon le mode
  saveRole(): void {
    if (this.isEditMode) {
      this.roleService.updateRole(this.role.id, this.role).subscribe(() => {
        this.getRoles();  // Recharger la liste des rôles après mise à jour
        this.isEditMode = false;  // Désactiver le mode édition
      });
    } else {
      this.roleService.createRole(this.role).subscribe(() => {
        this.getRoles();  // Recharger la liste des rôles après création
        this.isEditMode = false;  // Désactiver le mode création
      });
    }
  }

  // Supprimer un rôle
  deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe(() => {
      this.getRoles();  // Recharger la liste des rôles après suppression
    });
  }
  
}
