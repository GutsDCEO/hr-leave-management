import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employee',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  leaveRequests = [
    { date: '2025-05-01', type: 'Annual Leave', status: 'Approved' },
    { date: '2025-04-15', type: 'Sick Leave', status: 'Pending' },
    { date: '2025-03-20', type: 'Casual Leave', status: 'Rejected' }
  ];
}

