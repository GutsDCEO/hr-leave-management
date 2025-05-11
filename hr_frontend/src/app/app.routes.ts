import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AdminComponent } from './modules/admin/admin.component';
import { EmployeeComponent } from './modules/employee/employee.component';
import { ManagerComponent } from './modules/manager/manager.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'manager', component: ManagerComponent },
    { path: '**', redirectTo: 'login' } // Fallback route
];
