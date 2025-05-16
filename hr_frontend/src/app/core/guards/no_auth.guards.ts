import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      // Redirect based on role
      const role = this.authService.currentRole;
      if (role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (role === 'EMPLOYEE') {
        this.router.navigate(['/employee']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }
    return true;
  }
}