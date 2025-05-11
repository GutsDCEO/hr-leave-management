// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: any): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.currentRole;

    // Check if the user's role matches the expected role
    if (userRole && userRole === expectedRole) {
      return true;
    }

    // Redirect to unauthorized page if roles do not match
    this.router.navigate(['/unauthorized']);
    return false;
  }
}