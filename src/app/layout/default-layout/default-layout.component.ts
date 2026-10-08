import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthService } from '../../service/auth.service';
import { User } from '../../model/user';
import { PermissionService } from '../../service/permission.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  user!: User;
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

   ngOnInit(): void {
      this.user = this.authService.getUserFromLocalStorage();
      const roleName = this.user?.administrateur?.role?.nom?.trim().toUpperCase();
      this.navItems = navItems.filter(item => {
        const roleAllowed = !item.role || (!!roleName && item.role.some(role => role.toUpperCase() === roleName));
        const permissionAllowed = !item.permissionModule ||
          this.permissionService.canAccessModule(this.user, item.permissionModule);
        return roleAllowed && permissionAllowed;
      });
    }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
