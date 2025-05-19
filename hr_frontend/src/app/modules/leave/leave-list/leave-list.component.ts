import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// Simple interfaces
interface LeaveRequest {
  id?: string;
  startDate: string | Date;
  endDate: string | Date;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason?: string;
}

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  dataSource: LeaveRequest[] = [];
  loading = false;
  displayedColumns: string[] = ['startDate', 'endDate', 'type', 'status', 'actions'];
  statusFilter = '';
  typeFilter = '';
  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.dataSource = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000),
          type: 'ANNUAL_LEAVE',
          status: 'PENDING',
          reason: 'Vacation'
        },
        {
          id: '2',
          startDate: new Date(Date.now() - 86400000 * 5),
          endDate: new Date(Date.now() - 86400000 * 2),
          type: 'SICK_LEAVE',
          status: 'APPROVED',
          reason: 'Medical checkup'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    this.loadLeaveRequests();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.typeFilter = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.loadLeaveRequests();
  }

  onNewRequest(): void {
    this.router.navigate(['/employee/leaves/request']);
  }

  onViewDetails(id: string): void {
    this.router.navigate(['/employee/leaves', id]);
  }

  onEditRequest(id: string): void {
    this.router.navigate(['/employee/leaves/request', id]);
  }

  getStatusBadgeClass(status: string): string {
    return status.toLowerCase();
  }

  getLeaveTypeDisplay(type: string): string {
    if (!type) return '';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
