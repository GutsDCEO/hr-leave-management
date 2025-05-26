import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    // Material Modules
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  providers: [
    LeaveResolver,
    LeaveListResolver
  ]
})
export class LeaveModule { }
