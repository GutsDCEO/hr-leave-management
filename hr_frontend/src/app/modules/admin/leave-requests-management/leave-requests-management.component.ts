import { Component, OnInit } from '@angular/core';
import { LeaveRequestsService, LeaveRequest } from '../../../core/services/leave-requests.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-requests-management',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './leave-requests-management.component.html',
  styleUrls: ['./leave-requests-management.component.css']
})
export class LeaveRequestsManagementComponent implements OnInit {
  leaves: LeaveRequest[] = [];
  totalPages = 0;
  currentPage = 0;
  statusFilter: string | undefined;
  loading = false;
  actionInProgress = false;

  constructor(
    private leaveService: LeaveRequestsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves(page = 0) {
    this.loading = true;
    this.leaveService.getLeaves(page, 10, this.statusFilter).subscribe({
      next: (data) => {
        // Make sure we're processing the statuses correctly
        this.leaves = data.content.map(leave => {
          // Ensure status is a string and uppercase for consistent comparison
          if (leave.status) {
            leave.status = leave.status.toString().toUpperCase();
          }
          console.log(`Leave ID: ${leave.id}, Status: ${leave.status}`);
          return leave;
        });
        
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leave requests', error);
        this.loading = false;
        this.toast.showError('Failed to load leave requests. Please try again.');
      }
    });
  }

  onPageChange(newPage: number) {
    this.loadLeaves(newPage);
  }

  onStatusChange(newStatus: string) {
    this.statusFilter = newStatus;
    this.loadLeaves(0);
  }

  approveLeave(leaveId: number) {
    if (this.actionInProgress) return;
    
    this.actionInProgress = true;
    // Pass 'admin' as the reviewer parameter
    this.leaveService.approveLeaveRequest(leaveId, 'admin').subscribe({
      next: (updatedLeave) => {
        // Update the leave request in the local array
        const index = this.leaves.findIndex(leave => leave.id === leaveId);
        if (index !== -1) {
          this.leaves[index].status = 'APPROVED';
        }
        this.actionInProgress = false;
        this.toast.showSuccess('Leave request approved successfully!');
        console.log('Leave request approved successfully');
      },
      error: (error) => {
        console.error('Error approving leave request', error);
        this.actionInProgress = false;
        this.toast.showError('Failed to approve leave request. Please try again.');
      }
    });
  }

  rejectLeave(leaveId: number) {
    if (this.actionInProgress) return;
    
    this.actionInProgress = true;
    // Pass 'admin' as the reviewer and a reason for the rejection
    this.leaveService.rejectLeaveRequest(leaveId, 'admin', 'Request rejected by admin').subscribe({
      next: (updatedLeave) => {
        // Update the leave request in the local array
        const index = this.leaves.findIndex(leave => leave.id === leaveId);
        if (index !== -1) {
          this.leaves[index].status = 'REJECTED';
        }
        this.actionInProgress = false;
        this.toast.showSuccess('Leave request rejected successfully!');
        console.log('Leave request rejected successfully');
      },
      error: (error) => {
        console.error('Error rejecting leave request', error);
        this.actionInProgress = false;
        this.toast.showError('Failed to reject leave request. Please try again.');
      }
    });
  }
}
