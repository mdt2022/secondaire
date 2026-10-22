import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  const service = new PermissionService();

  it('uses the configured module permission to authorize an application route', () => {
    const user = {
      administrateur: {
        role: {
          nom: 'Gestion',
          permissionsConfigured: true,
          permissions: ['ADMINISTRATEURS:READ']
        }
      }
    };

    expect(service.canAccessUrl(user, '/administrateur/listes')).toBeTrue();
    expect(service.canAccessUrl(user, '/enseignant')).toBeFalse();
  });

  it('requires the read permission to open a module screen', () => {
    const user = {
      administrateur: {
        role: {
          nom: 'Gestion',
          permissionsConfigured: true,
          permissions: ['ENSEIGNANTS:CREATE']
        }
      }
    };

    expect(service.canAccessUrl(user, '/enseignant')).toBeFalse();
  });

  it('allows DEV and TEST roles to access configuration', () => {
    for (const nom of ['DEV', 'TEST']) {
      const user = {
        administrateur: {
          role: { nom, permissionsConfigured: true, permissions: [] }
        }
      };

      expect(service.canAccessUrl(user, '/configuration')).toBeTrue();
    }
  });

  it('requires configuration access to manage schools', () => {
    const configuredUser = {
      administrateur: {
        role: {
          nom: 'Gestion',
          permissionsConfigured: true,
          permissions: ['CONFIGURATION:READ']
        }
      }
    };
    const unprivilegedUser = {
      administrateur: {
        role: {
          nom: 'Gestion',
          permissionsConfigured: true,
          permissions: ['MATIERES:READ']
        }
      }
    };

    expect(service.canAccessUrl(configuredUser, '/configuration/ecole')).toBeTrue();
    expect(service.canAccessUrl(unprivilegedUser, '/configuration/ecole')).toBeFalse();
  });
});
