// src/app/shared/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { getPermissionsForRoles, RolePermissions } from '../../../shared/utils/role.utils';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav>
      <div *ngIf="authService.isLoggedIn; else loggedOut">
        <!-- Dashboard Link -->
        <a *ngIf="permissions.canViewDashboard" routerLink="/dashboard">Dashboard</a>
        
        <!-- Admin Links -->
        <a *ngIf="permissions.canManageUsers" routerLink="/admin/users">Manage Users</a>
        
        <!-- Employee Links -->
        <a *ngIf="permissions.canClockInOut" routerLink="/attendance">Clock In/Out</a>
        
        <!-- Common Actions -->
        <button (click)="authService.logout()">Logout</button>
      </div>
      <ng-template #loggedOut>
        <a routerLink="/login">Login</a>
      </ng-template>
    </nav>
  `,
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
    permissions: RolePermissions;

    constructor(public authService: AuthService) {
        this.permissions = getPermissionsForRoles(this.authService.currentRole);
    }
}