import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PermissionService } from '../../service/permission.service';

type ConfigurationLink = {
  title: string;
  url: string;
  icon: string;
  color: string;
};

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  private readonly links: ConfigurationLink[] = [
    {
      title: 'Rôles et permissions',
      url: '/configuration/role',
      icon: 'bi bi-shield-lock',
      color: 'dark'
    },
    {
      title: 'Avances',
            url: '/configuration/avance',
      icon: 'bi bi-cash-stack',
      color: 'warning'
    },
    {
      title: 'Gestion des classes',
      url: '/configuration/classe',
      icon: 'bi bi-people',
      color: 'primary'
    },
    {
      title: 'Affecter une classe',
      url: '/configuration/classeecole',
      icon: 'bi bi-diagram-3',
      color: 'info'
    },
    {
      title: 'Matières',
      url: '/configuration/matiere',
      icon: 'bi bi-mortarboard',
      color: 'primary'
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly permissionService: PermissionService
  ) {}

  get availableLinks(): ConfigurationLink[] {
    const user = this.authService.getUserFromLocalStorage();
    return this.links.filter(link => this.permissionService.canAccessUrl(user, link.url));
  }
}
