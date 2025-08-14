// src/app/app.routes.ts - Final version with layout wrapper
import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { EmployeeComponent } from './modules/employee/employee.component';
import { NoAuthGuard } from './core/guards/no_auth.guards';

import { DashboardOverviewComponent } from './modules/admin/dashboard-overview/dashboard-overview.component';
import { LeaveRequestsManagementComponent } from './modules/admin/leave-requests-management/leave-requests-management.component';
import { EmployeesListComponent } from './modules/admin/employee-management/employees-list/employees-list.component';
import { EmployeeLeaveRequestsComponent } from './modules/employee/components/leave-requests/leave-requests.component';
import { AuthGuard } from './core/guards/auth.guards';
import { AdminLayoutComponent } from './modules/admin/admin-layout/admin-layout.component.spec';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'register', component: RegisterComponent },
    
    // Admin routes with layout wrapper
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { role: 'ADMIN' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardOverviewComponent },
            { path: 'leave-requests', component: LeaveRequestsManagementComponent },
            { path: 'employees', component: EmployeesListComponent }
        ]
    },
    
    // Employee routes
    { path: 'employee', component: EmployeeComponent },
    { 
        path: 'employee/leave-requests', 
        component: EmployeeLeaveRequestsComponent, 
        canActivate: [AuthGuard], 
        data: { role: 'EMPLOYEE' } 
    },
    
    { path: '**', redirectTo: 'login' } // Fallback route
];