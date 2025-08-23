// src/app/shared/components/navbar/navbar.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { getPermissionsForRoles, RolePermissions } from '../../../shared/utils/role.utils';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HrAssistantDialogComponent } from '../hr-assistant-dialog/hr-assistant-dialog.component';

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

    constructor(
        public authService: AuthService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.permissions = getPermissionsForRoles(this.authService.currentRole);
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    openHRAssistant() {
        this.dialog.open(HrAssistantDialogComponent, {
            width: '800px',
            height: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            panelClass: 'hr-assistant-dialog'
        });
    }
}