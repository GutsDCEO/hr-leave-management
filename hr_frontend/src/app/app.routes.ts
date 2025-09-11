import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AdminComponent } from './modules/admin/admin.component';
import { EmployeeComponent } from './modules/employee/employee.component';
import { NoAuthGuard } from './core/guards/no_auth.guards';
import { LeaveRequestsManagementComponent } from './modules/admin/leave-requests-management/leave-requests-management.component';
import { EmployeeLeaveRequestsComponent } from './modules/employee/components/leave-requests/leave-requests.component';
import { AuthGuard } from './core/guards/auth.guards';
import { HrAssistantPageComponent } from './shared/components/hr-assistant/hr-assistant-page.component';
import { LeaveListComponent } from './modules/leave/leave-list/leave-list.component';
import { LeaveManagementComponent } from './modules/leave/leave-management/leave-management.component';
import { LeaveRequestFormComponent } from './modules/leave/leave-request-form/leave-request-form.component';
import { LeaveDetailComponent } from './modules/leave/leave-detail/leave-detail.component';
import { ProfileComponent } from './modules/employee/components/profile/profile.component';
import { AttendanceComponent } from './modules/employee/components/attendance/attendance.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'admin/leave-requests', component: LeaveRequestsManagementComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
    { path: 'employee/leave-requests', component: EmployeeLeaveRequestsComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/profile', component: ProfileComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/leaves', component: LeaveManagementComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/leaves/list', component: LeaveListComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/leaves/request', component: LeaveRequestFormComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/leaves/request/:id', component: LeaveRequestFormComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/leaves/:id', component: LeaveDetailComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    { path: 'employee/attendance', component: AttendanceComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYEE' } },
    {
        path: 'hr-assistant',
        component: HrAssistantPageComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: 'login' } // Fallback route
];
