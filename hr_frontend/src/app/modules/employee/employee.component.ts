import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaveRequestFormComponent } from '../leave/leave-request-form/leave-request-form.component';
import { LeaveService } from '../leave/shared/leave.service';
import { LeaveBalance, LeaveRequest, LeaveStatus, LeaveType } from '../leave/models/leave.model';

interface LeaveBalanceDisplay extends LeaveBalance {
  remainingDays: number;
  usedPercentage: number;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule // For mat-menu and matMenuTriggerFor
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  loading = true;
  leaveBalances: LeaveBalanceDisplay[] = [];
  recentRequests: LeaveRequest[] = [];
  
  // Table columns
  displayedColumns: string[] = ['startDate', 'endDate', 'type', 'status', 'actions'];
  
  // Status colors for badges
  statusColors: { [key: string]: string } = {
    [LeaveStatus.PENDING]: 'bg-warning',
    [LeaveStatus.APPROVED]: 'bg-success',
    [LeaveStatus.REJECTED]: 'bg-danger',
    [LeaveStatus.CANCELLED]: 'bg-secondary'
  };

  constructor(
    private dialog: MatDialog,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Load leave balances
    this.leaveService.getMyLeaveBalance().subscribe({
      next: (response: any) => {
        // Handle both array and single object responses
        const balances = Array.isArray(response) ? response : [response];
        this.leaveBalances = balances.map(balance => ({
          ...balance,
          remainingDays: balance.totalDays - (balance.usedDays || 0) - (balance.pendingDays || 0),
          usedPercentage: balance.totalDays > 0 
            ? Math.round(((balance.usedDays || 0) / balance.totalDays) * 100) 
            : 0
        }));
        this.loadRecentRequests();
      },
      error: (error) => {
        console.error('Error loading leave balance:', error);
        this.snackBar.open('Failed to load leave balance', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private loadRecentRequests(): void {
    console.log('Loading recent leave requests...');
    this.loading = true;
    
    this.leaveService.getMyLeaveRequests({
      page: 1,
      limit: 5,
      sort: 'createdAt,desc' // Get the most recent requests first
    }).subscribe({
      next: (response: { data: LeaveRequest[], total: number }) => {
        try {
          console.log('Leave requests loaded successfully:', response);
          
          if (response && Array.isArray(response.data)) {
            this.recentRequests = response.data.map((request: any) => ({
              ...request,
              startDate: request.startDate ? new Date(request.startDate) : null,
              endDate: request.endDate ? new Date(request.endDate) : null,
              status: request.status || 'PENDING',
              type: request.type || 'ANNUAL',
              reason: request.reason || ''
            }));
            
            console.log('Mapped leave requests:', this.recentRequests);
          } else {
            console.warn('Unexpected response format:', response);
            this.recentRequests = [];
          }
        } catch (error: any) {
          console.error('Error processing leave requests:', error);
          this.snackBar.open('Error processing leave requests', 'Close', { duration: 3000 });
          this.recentRequests = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load leave requests:', error);
        this.snackBar.open('Failed to load leave requests. Please try again later.', 'Close', { duration: 5000 });
        this.recentRequests = [];
        this.loading = false;
      }
    });
  }

  openLeaveRequestForm(): void {
    const dialogRef: MatDialogRef<LeaveRequestFormComponent> = this.dialog.open(LeaveRequestFormComponent, {
      width: '600px',
      data: {
        leaveBalances: this.leaveBalances
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'success') {
        this.snackBar.open('Leave request submitted successfully!', 'Close', { duration: 3000 });
        this.loadDashboardData();
      } else if (result === 'error') {
        this.snackBar.open('Failed to submit leave request', 'Close', { duration: 3000 });
      }
    });
  }

  cancelRequest(requestId: string): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.cancelLeaveRequest(requestId).subscribe({
        next: () => {
          this.snackBar.open('Leave request cancelled successfully', 'Close', { duration: 3000 });
          this.loadDashboardData();
        },
        error: (error: any) => {
          console.error('Error cancelling leave request:', error);
          this.snackBar.open('Failed to cancel leave request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getLeaveTypeDisplay(type: string): string {
    if (!type) return 'N/A';
    return type.charAt(0) + type.slice(1).toLowerCase();
  }
}
