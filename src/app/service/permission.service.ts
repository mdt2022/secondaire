import { Injectable, inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionModules = [
  { code: 'DASHBOARD', label: 'Tableau de bord' },
  { code: 'CONFIGURATION', label: 'Configuration' },
  { code: 'AVANCES', label: 'Avances' },
  { code: 'ADMINISTRATEURS', label: 'Administrateurs' },
  { code: 'CLASSES', label: 'Classes' },
  { code: 'AFFECTATIONS_CLASSES', label: 'Affectations de classes' },
  { code: 'MATIERES', label: 'Matières' },
  { code: 'SUPPORTS', label: 'Supports de cours' },
  { code: 'ELEVES', label: 'Élèves et inscriptions' },
  { code: 'ENSEIGNANTS', label: 'Enseignants' },
  { code: 'EMPLOIS_DU_TEMPS', label: 'Emplois du temps' },
  { code: 'FRAIS_SCOLAIRES', label: 'Frais scolaires' },
  { code: 'MATIERES_ENSEIGNEES', label: 'Matières enseignées' },
  { code: 'NOTES', label: 'Notes' },
  { code: 'PAIEMENTS', label: 'Paiements' },
  { code: 'POINTAGES', label: 'Pointages' }
] as const;

export const permissionActions = [
  { code: 'READ', label: 'Consulter' },
  { code: 'CREATE', label: 'Créer' },
  { code: 'UPDATE', label: 'Modifier' },
  { code: 'DELETE', label: 'Supprimer' }
] as const;

type PermissionUser = {
  administrateur?: {
    role?: {
      nom?: string;
      permissions?: string[];
      permissionsConfigured?: boolean;
    };
  };
};

const legacyModules = [
  'DASHBOARD',
  'SUPPORTS',
  'ELEVES',
  'ENSEIGNANTS',
  'EMPLOIS_DU_TEMPS',
  'FRAIS_SCOLAIRES',
  'MATIERES_ENSEIGNEES',
  'NOTES',
  'PAIEMENTS',
  'POINTAGES'
];

const routeModules: Record<string, string> = {
  dashboard: 'DASHBOARD',
  pages: 'ADMINISTRATEURS',
  avance: 'AVANCES',
  administrateur: 'ADMINISTRATEURS',
  classe: 'CLASSES',
  classeecole: 'AFFECTATIONS_CLASSES',
  matiere: 'MATIERES',
  supports: 'SUPPORTS',
  eleve: 'ELEVES',
  enseignant: 'ENSEIGNANTS',
  temps: 'EMPLOIS_DU_TEMPS',
  frais: 'FRAIS_SCOLAIRES',
  enseigner: 'MATIERES_ENSEIGNEES',
  note: 'NOTES',
  paiement: 'PAIEMENTS',
  pointage: 'POINTAGES'
};

@Injectable({ providedIn: 'root' })
export class PermissionService {
  canAccessModule(user: PermissionUser | null, moduleCode: string, action = 'READ'): boolean {
    const role = user?.administrateur?.role;
    if (!role) return false;
    const roleName = role.nom?.trim().toUpperCase();
    if (moduleCode === 'ROLES') return roleName === 'DEV' || roleName === 'TEST';
    if (moduleCode === 'CONFIGURATION' && (roleName === 'DEV' || roleName === 'TEST')) return true;

    if (role.permissionsConfigured !== true) {
      if (roleName === 'DEV') return true;
      return legacyModules.includes(moduleCode);
    }

    return role.permissions?.includes(`${moduleCode}:${action}`) ?? false;
  }

  moduleForUrl(url: string): string | null {
    const segments = url.split('?')[0].split('/').filter(Boolean);
    if (segments[0] === 'configuration') {
      if (!segments[1]) return 'CONFIGURATION';
      if (segments[1] === 'role') return 'ROLES';
      const configurationModules: Record<string, string> = {
        avance: 'AVANCES',
        administrateur: 'ADMINISTRATEURS',
        classe: 'CLASSES',
        classeecole: 'AFFECTATIONS_CLASSES',
        matiere: 'MATIERES'
      };
      return segments[1] ? configurationModules[segments[1]] ?? null : null;
    }
    if (segments[0] === 'administrateur' && segments[1] === 'role') return 'ROLES';
    return segments[0] ? routeModules[segments[0]] ?? null : null;
  }

  canAccessUrl(user: PermissionUser | null, url: string): boolean {
    const moduleCode = this.moduleForUrl(url);
    return moduleCode === null || this.canAccessModule(user, moduleCode);
  }
}

export const permissionGuard: CanActivateChildFn = (_route, state) => {
  const auth = inject(AuthService);
  const permissions = inject(PermissionService);
  const router = inject(Router);
  const user = auth.getUserFromLocalStorage() as PermissionUser | null;

  if (permissions.canAccessUrl(user, state.url)) return true;
  return router.createUrlTree(['/acces-refuse']);
};
