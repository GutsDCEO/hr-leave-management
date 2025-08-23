import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { getPermissionsForRoles, RolePermissions } from "../../utils/role.utils";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],

})
export class SidebarComponent implements OnInit {
    currentRole: string | null = null;
    
    router: any;

    constructor(public authService: AuthService) {}
    
    ngOnInit() {
        this.authService.currentUser$.subscribe(user => {
          this.currentRole = user?.role || null;
        });
      }

    

}