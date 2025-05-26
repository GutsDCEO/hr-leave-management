import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { LeaveRequest, LeaveStatus, LeaveType } from '../leave-request.model';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss']
})
export class LeaveDetailComponent implements OnInit {
  loading = true;
  leaveRequest: LeaveRequest | null = null;
  leaveId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.leaveId = this.route.snapshot.paramMap.get('id');
    if (this.leaveId) {
      this.loadLeaveRequest(this.leaveId);
    } else {
      this.snackBar.open('Invalid leave request ID', 'Close', { duration: 3000 });
      this.router.navigate(['/leaves/list']);
    }
  }

  private loadLeaveRequest(id: string): void {
    this.loading = true;
    this.leaveService.getLeaveRequest(id).subscribe({
      next: (leaveRequest) => {
        this.leaveRequest = leaveRequest;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leave request:', error);
        this.snackBar.open('Failed to load leave request details', 'Close', { duration: 3000 });
        this.router.navigate(['/leaves/list']);
      }
    });
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

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  calculateWorkingDays(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }
  
  onBack(): void {
    this.location.back();
  }

  onCancelRequest(): void {
    if (!this.leaveId) return;
    
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.cancelLeaveRequest(this.leaveId).subscribe({
        next: () => {
          this.snackBar.open('Leave request cancelled successfully', 'Close', { duration: 3000 });
          if (this.leaveRequest) {
            this.leaveRequest.status = LeaveStatus.CANCELLED;
          }
        },
        error: (error) => {
          console.error('Error cancelling leave request:', error);
          this.snackBar.open('Failed to cancel leave request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canCancelRequest(): boolean {
    return this.leaveRequest?.status === LeaveStatus.PENDING || 
           this.leaveRequest?.status === LeaveStatus.APPROVED;
  }
}
