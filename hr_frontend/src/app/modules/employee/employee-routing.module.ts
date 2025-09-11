import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { AuthGuard } from '../../core/guards/auth.guards';
import { RoleGuard } from '../../core/guards/role.guards';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'EMPLOYEE' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'leaves',
        loadChildren: () => import('../leave/leave.module').then(m => m.LeaveModule)
      },
      // Profile route moved to app.routes.ts
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
