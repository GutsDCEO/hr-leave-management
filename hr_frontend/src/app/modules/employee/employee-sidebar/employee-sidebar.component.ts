import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatRippleModule
  ],
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.css']
})
export class EmployeeSidebarComponent {
  menuItems = [
    {
      path: '/employee/leaves/list',
      icon: 'event_note',
      label: 'My Leave'
    },
    {
      path: '/employee/attendance',
      icon: 'schedule',
      label: 'Attendance'
    },
    {
      path: '/employee/profile',
      icon: 'person',
      label: 'My Profile'
    },
    {
      path: '/employee/documents',
      icon: 'folder',
      label: 'Documents'
    }
  ];
}
