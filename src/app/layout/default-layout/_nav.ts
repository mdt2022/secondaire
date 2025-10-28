import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de bord',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'Nouveau'
    }
  }, 
  {
    title: true,
    name: 'Configuration'
  },
  {
    name: 'Administrateur',
    url: '/administrateur',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Rôle',
    url: '/administrateur/role',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Gestion des Classe',
    url: '/classe',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Affecter une Classe',
    url: '/classeecole',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Matière',
    url: '/matiere',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Gestions',
    title: true
  },
  {
    name: 'Supports',
    url: '/supports',
    iconComponent: { name: 'cil-puzzle' }    
  },
  {
    name: 'Eleves',
    url: '/eleve/eleve',
    iconComponent: { name: 'cil-puzzle' }    
  },
  {
    name: 'Enseignants',
    url: '/enseignant',
    iconComponent: { name: 'cil-cursor' }    
  },
  {
    name: 'Emplois du temps',
    url: '/temps',
    iconComponent: { name: 'cil-cursor' }    
  },
  {
    name: 'Frais Scolaire',
    url: '/frais',
    iconComponent: { name: 'cil-notes' }    
  },
  {
    name: 'Matières Enseignées',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/enseigner'
  },
  {
    name: 'Notes',
    iconComponent: { name: 'cil-star' },
    url: '/note'    
  },
  {
    name: 'Paiement',
    url: '/paiement',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Pointage',
    url: '/pointage',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
