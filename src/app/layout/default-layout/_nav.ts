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
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Classe',
    url: '/classe/classe',

    iconComponent: { name: 'cil-puzzle' }
  },
  {
    name: 'Eleves',
    url: '/eleves/eleves',

    iconComponent: { name: 'cil-notes' }
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

    iconComponent: { name: 'cil-chart-pie' }
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

    iconComponent: { name: 'cil-star' }
  },
  {
    name: 'Pointages',
    url: '/pointages/pointages',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Professeurs',
    url: '/professeurs/professeurs',
    iconComponent: { name: 'cil-calculator' }
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
