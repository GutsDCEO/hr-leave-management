// src/app/shared/components/navbar/navbar.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { getPermissionsForRoles, RolePermissions } from '../../../shared/utils/role.utils';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarComponent {
    permissions: RolePermissions;
    router: any;

    constructor(public authService: AuthService) {
        this.permissions = getPermissionsForRoles(this.authService.currentRole);
        
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }   

}