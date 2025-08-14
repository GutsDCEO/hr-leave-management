// src/app/modules/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { LeaveRequestsManagementComponent } from './leave-requests-management/leave-requests-management.component';
import { EmployeesListComponent } from './employee-management/employees-list/employees-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardOverviewComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'leave-requests',
    component: LeaveRequestsManagementComponent,
    data: { title: 'Leave Requests Management' }
  },
  {
    path: 'employees',
    component: EmployeesListComponent,
    data: { title: 'Employee Management' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }