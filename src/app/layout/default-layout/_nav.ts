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
    iconComponent: { name: 'cil-clock' }
  },
  {
    name: 'Classe',
    url: '/classe/classe',

    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Eleves',
    url: '/eleves/eleves',

    iconComponent: { name: 'cil-group' }
  },
  {
    name: 'Emploi du temps',
    url: '/emploidutemps/emploidutemps',

    iconComponent: { name: 'cil-calendar' }
  },
  {
    name: 'Frai du secondaire',
    url: '/fraisecondaire/fraisecondaire',

    iconComponent: { name: 'cil-credit-card' }
  },
  {
    name: 'Matières',
    url: '/matieres/matieres',

    iconComponent: { name: 'cil-book' }
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

    iconComponent: { name: 'cil-money' }
  },
  {
    name: 'Pointages',
    url: '/pointages/pointages',

    iconComponent: { name: 'cil-check-circle' }
  },
  {
    name: 'Professeurs',
    url: '/professeurs/professeurs',

    iconComponent: { name: 'cil-teacher' }
  },
  {
    title: true,
    name: 'Configurations'
  },
  {
    name: 'Gestion des classes',
    url: '/gestionsdesclasses/gestionsdesclasses',
    iconComponent: { name: 'cil-chalkboard' }

  }, 
  {
    name: 'Administrateurs',
    url: '/administrateur/administrateur',
    iconComponent: { name: 'cil-chalkboard' }

  }
];
