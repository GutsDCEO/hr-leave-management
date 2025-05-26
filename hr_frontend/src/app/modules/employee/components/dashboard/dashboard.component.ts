import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  leaveBalances = [
    { type: 'Annual Leave', days: 15, used: 5, remaining: 10 },
    { type: 'Sick Leave', days: 10, used: 2, remaining: 8 },
    { type: 'Casual Leave', days: 7, used: 1, remaining: 6 },
    { type: 'Unpaid Leave', days: 0, used: 0, remaining: 0 }
  ];

  recentRequests = [
    { id: 'REQ001', type: 'Annual Leave', startDate: '2023-06-01', endDate: '2023-06-05', status: 'Approved' },
    { id: 'REQ002', type: 'Sick Leave', startDate: '2023-06-10', endDate: '2023-06-11', status: 'Pending' },
    { id: 'REQ003', type: 'Casual Leave', startDate: '2023-05-25', endDate: '2023-05-25', status: 'Approved' }
  ];

  constructor(private router: Router) {}

  openLeaveRequestForm(): void {
    this.router.navigate(['/employee/leaves/request']);
  }
}
