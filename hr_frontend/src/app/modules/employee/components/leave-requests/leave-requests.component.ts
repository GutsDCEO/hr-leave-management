import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestsService, LeaveRequest } from '../../../../core/services/leave-requests.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-leave-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css']
})
export class EmployeeLeaveRequestsComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  statusFilter: string | undefined;
  loading = false;
  displayedColumns: string[] = ['dates', 'type', 'status', 'reason', 'requestDate', 'details'];

  // Methods to get counts by status
  getStatusCount(status: string): number {
    return this.leaves.filter(leave => leave.status?.toString().toUpperCase() === status).length;
  }

  get pendingCount(): number {
    return this.getStatusCount('PENDING');
  }

  get approvedCount(): number {
    return this.getStatusCount('APPROVED');
  }

  get rejectedCount(): number {
    return this.getStatusCount('REJECTED');
  }

  constructor(private leaveService: LeaveRequestsService) {}

  ngOnInit() {
    this.loadMyLeaves(0);
  }

  loadMyLeaves(page = 0) {
    this.loading = true;
    // We'll use a method to get only the current employee's leave requests
    this.leaveService.getEmployeeLeaveRequests(page, this.pageSize, this.statusFilter).subscribe({
      next: (data) => {
        // Make sure we're processing the statuses correctly
        this.leaves = data.content.map(leave => {
          // Ensure status is a string and uppercase for consistent comparison
          if (leave.status) {
            leave.status = leave.status.toString().toUpperCase();
          }
          return leave;
        });
        
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.totalElements = data.totalElements;
        this.loading = false;
        console.log('Employee leave requests loaded:', this.leaves);
      },
      error: (error) => {
        console.error('Error loading leave requests', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.loadMyLeaves(event.pageIndex);
  }

  onStatusChange(status: string) {
    this.statusFilter = status || undefined;
    this.loadMyLeaves(0); // Reset to first page when filter changes
  }
  
  // View details of a leave request
  viewDetails(leaveId: number) {
    // This would navigate to a details view in a full implementation
    console.log('View details for leave request:', leaveId);
  }
  
  // Get CSS class for status badge
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
  
  // Format leave type for display
  formatLeaveType(type: string): string {
    if (!type) return '';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Helper function to format date range for display
  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
}
