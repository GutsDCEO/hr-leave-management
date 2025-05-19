import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { LeaveRequest, LeaveStatus, LeaveType, LeaveRequestParams } from '../leave-request.model';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  displayedColumns: string[] = ['startDate', 'endDate', 'type', 'status', 'actions'];
  dataSource: MatTableDataSource<LeaveRequest> = new MatTableDataSource<LeaveRequest>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filterForm') filterForm!: NgForm;

  loading = false;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  
  // Filters
  statusFilter: LeaveStatus | '' = '';
  typeFilter: LeaveType | '' = '';
  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;

  constructor(
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.loading = true;
    console.log('Loading leave requests...');
    
    const params: any = {
      page: this.pageIndex + 1,
      limit: this.pageSize
    };

    // Add filters if they exist
    if (this.statusFilter) {
      params.status = this.statusFilter;
    }
    if (this.startDateFilter) {
      params.startDate = this.startDateFilter.toISOString();
    }
    if (this.endDateFilter) {
      params.endDate = this.endDateFilter.toISOString();
    }
    if (this.typeFilter) {
      params.type = this.typeFilter;
    }

    console.log('API Params:', JSON.stringify(params, null, 2));

    this.leaveService.getLeaveRequests(params).subscribe({
      next: (response: { data: LeaveRequest[]; total: number }) => {
        console.log('API Response:', response);
        this.dataSource = new MatTableDataSource(response.data);
        this.totalItems = response.total;
        this.loading = false;
        console.log('Data source set with', response.data.length, 'items');
      },
      error: (error: any) => {
        console.error('Error loading leave requests:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        this.snackBar.open('Failed to load leave requests', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLeaveRequests();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadLeaveRequests();
  }

  clearFilters(): void {
    // Reset all filter values
    this.statusFilter = '';
    this.typeFilter = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
    
    // Reset pagination to first page
    this.pageIndex = 0;
    this.pageSize = 10;
    
    // Reset the form if it exists (for template-driven forms)
    if (this.filterForm) {
      this.filterForm.resetForm({
        status: '',
        type: '',
        startDate: null,
        endDate: null
      });
    }
    
    // Reload leave requests with cleared filters
    this.loadLeaveRequests();
  }

  viewLeaveRequest(id: string): void {
    this.router.navigate(['/leaves', id]);
  }

  cancelLeaveRequest(id: string): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.cancelLeaveRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Leave request cancelled successfully', 'Close', { duration: 3000 });
          this.loadLeaveRequests();
        },
        error: (error) => {
          console.error('Error cancelling leave request:', error);
          this.snackBar.open('Failed to cancel leave request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusBadgeClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'badge-success';
      case LeaveStatus.REJECTED:
        return 'badge-danger';
      case LeaveStatus.PENDING:
        return 'badge-warning';
      case LeaveStatus.CANCELLED:
        return 'badge-secondary';
      default:
        return 'badge-light';
    }
  }

  getLeaveTypeDisplay(type: LeaveType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }
}
