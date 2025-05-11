import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: EmployeeDashboardComponent }
        ]),
        EmployeeDashboardComponent
    ]
})
export class EmployeeModule { }
