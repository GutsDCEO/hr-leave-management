import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestFormComponent } from '../leave-request-form/leave-request-form.component';

@Injectable({
  providedIn: 'root'
})
export class LeaveGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuthAndPermissions(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.checkAuthAndPermissions(childRoute);
  }

  private checkAuthAndPermissions(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: route.url } });
      return false;
    }

    // Check if user has required role if specified in route data
    const requiredRole = route.data['role'] as string;
    if (requiredRole) {
      const userRole = this.authService.currentRole;
      const hasRole = userRole === requiredRole;
      
      if (!hasRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LeaveFormGuard implements CanDeactivate<LeaveRequestFormComponent> {
  canDeactivate(
    component: LeaveRequestFormComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // If form is not dirty, allow deactivation
    if (!component.leaveForm?.dirty) {
      return true;
    }

    // If form is dirty, show confirmation dialog
    return component.confirmLeave();
  }
}
