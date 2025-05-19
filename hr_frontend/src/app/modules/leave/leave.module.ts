import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Shared Modules
import { SharedModule } from '../../shared/shared.module';
import { LeaveSharedModule } from './shared/leave-shared.module';

// Components
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';

// Resolvers
import { LeaveResolver, LeaveListResolver } from './shared/leave.resolver';

const routes: Routes = [
  {
    path: '',
    component: LeaveManagementComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'list', 
        pathMatch: 'full' 
      },
      { 
        path: 'list', 
        component: LeaveListComponent,
        resolve: {
          leaveRequests: LeaveListResolver
        }
      },
      { 
        path: 'request', 
        component: LeaveRequestFormComponent 
      },
      { 
        path: 'request/:id', 
        component: LeaveRequestFormComponent,
        resolve: {
          leaveRequest: LeaveResolver
        }
      },
      { 
        path: ':id', 
        component: LeaveDetailComponent,
        resolve: {
          leaveRequest: LeaveResolver
        }
      },
    ]
  }
];

@NgModule({
  declarations: [
    LeaveManagementComponent,
    LeaveListComponent,
    LeaveRequestFormComponent,
    LeaveDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LeaveSharedModule,
    SharedModule
  ],
  providers: [
    LeaveResolver,
    LeaveListResolver
  ],
  exports: [
    LeaveManagementComponent
  ]
})
export class LeaveModule { }
