import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AdminComponent } from './modules/admin/admin.component';
import { EmployeeComponent } from './modules/employee/employee.component';
import { NoAuthGuard } from './core/guards/no_auth.guards';
import { LeaveRequestsManagementComponent } from './modules/admin/leave-requests-management/leave-requests-management.component';
import { AuthGuard } from './core/guards/auth.guards';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent , canActivate: [NoAuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'admin/leave-requests', component: LeaveRequestsManagementComponent , canActivate: [AuthGuard], data: { role: 'ADMIN' }},
    { path: '**', redirectTo: 'login' } // Fallback route
];
