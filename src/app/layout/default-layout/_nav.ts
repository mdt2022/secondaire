import { INavData } from '@coreui/angular';


export interface INavDataExtended extends INavData {
  role?: string[]; // Ajoute la propriété "role"
  permissionModule?: string;
}


export const navItems: INavDataExtended[] = [
  {
    name: 'Tableau de bord',
    url: '/dashboard',
    permissionModule: 'DASHBOARD',
    iconComponent: { 
      name: 'cil-speedometer'
    }
  },
    {
    name: 'Supports',
    url: '/supports',
    permissionModule: 'SUPPORTS',
    iconComponent: { name: 'cil-puzzle' }    
  },
  {
    name: 'Eleves',
    url: '/eleve/eleve',
    permissionModule: 'ELEVES',
    iconComponent: { name: 'cil-puzzle' }    
  },
  {
    name: 'Enseignants',
    url: '/enseignant',
    permissionModule: 'ENSEIGNANTS',
    iconComponent: { name: 'cil-cursor' }    
  },
  {
    name: 'Emplois du temps',
    url: '/temps',
    permissionModule: 'EMPLOIS_DU_TEMPS',
    iconComponent: { name: 'cil-cursor' }    
  },
  {
    name: 'Frais Scolaire',
    url: '/frais',
    permissionModule: 'FRAIS_SCOLAIRES',
    iconComponent: { name: 'cil-notes' }    
  },
  {
    name: 'Matières Enseignées',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/enseigner',
    permissionModule: 'MATIERES_ENSEIGNEES'
  },
  {
    name: 'Notes',
    iconComponent: { name: 'cil-star' },
    url: '/note',
    permissionModule: 'NOTES'
  },
  {
    name: 'Paiement',
    url: '/paiement',
    permissionModule: 'PAIEMENTS',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Pointage',
    url: '/pointage',
    permissionModule: 'POINTAGES',
    iconComponent: { name: 'cil-calculator' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  }, 
  {
    name: 'Gestions',
    title: true
  },
  {
    name: 'Configuration',
    url: '/configuration',
    iconComponent: { name: 'cil-settings' },
    role: ['DEV' , 'test']
  },
  {
    name: 'Administrateur',
    url: '/administrateur/listes',
    permissionModule: 'ADMINISTRATEURS',
    iconComponent: { name: 'cil-user-follow' },
    role: ['DEV']
  },

  // {
  //   title: true,
  //   name: 'Extras',
  //   role: ['DEV', 'test']
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   role: ['DEV'],
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // }
];
