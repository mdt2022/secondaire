import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de Bord',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'Nouveau'
    }
  },
  {
    title: true,
    name: 'Secondaires'
  },
  {
    name: 'Avance',
    url: '/avance/avance',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Classe',
    url: '/classe/classe',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Eleves',
    url: '/eleves/eleves',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Emploi du temps',
    url: '/emploidutemps/emploidutemps',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Frai du secondaire',
    url: '/fraisecondaire/fraisecondaire',

    iconComponent: { name: 'cil-credit-card' }
  },
  {
    name: 'Matières',
    url: '/matieres/matieres',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Matières enseignées',
    url: '/matieresenseignees/matieresenseignees',

    iconComponent: { name: 'cil-bookmark' }
  },
  {
    name: 'Notes',
    url: '/notes/notes',

    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Paiements secondaires',
    url: '/paiementsecondaires/paiementsecondaires',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Pointages',
    url: '/pointages/pointages',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Professeurs',
    url: '/professeurs/professeurs',
    iconComponent: { name: 'cil-list' }
  },
  {
    title: true,
    name: 'Configurations'
  },
  {
    name: 'Role',
    url: '/roles/roles',
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Gestion des classes',
    url: '/gestionsdesclasses/gestionsdesclasses',
    iconComponent: { name: 'cil-pencil' }
  }, 
  {
    name: 'Administrateurs',
    url: '/administrateur/administrateur',
    iconComponent: { name: 'cil-pencil' }
  }
];
