import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { LeaveRequestsService, LeaveRequest as ApiLeaveRequest } from '../../../core/services/leave-requests.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerToggle } from '@angular/material/datepicker';

// Interface to map API response to our component's data structure
interface LeaveRequest {
  id?: number | string;
  startDate: string | Date;
  endDate: string | Date;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason?: string;
  requestedAt?: string | Date;
  reviewedAt?: string | Date;
  employeeName?: string;
  // Added for display purposes
  requestDate?: string | Date;
}

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatOptionModule,
    MatDatepickerToggle,
    MatNativeDateModule,
    MatCardModule
  ],
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  dataSource: LeaveRequest[] = [];
  loading = false;
  displayedColumns: string[] = ['startDate', 'endDate', 'type', 'status', 'requestDate', 'actions'];
  statusFilter = '';
  typeFilter = '';
  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;
  totalPages = 0;
  currentPage = 0;

  constructor(private router: Router, private leaveService: LeaveRequestsService) { }

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  private formatLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadLeaveRequests(page = 0): void {
    this.loading = true;
    const fromDate = this.startDateFilter ? this.formatLocalDate(this.startDateFilter) : undefined;
    const toDate = this.endDateFilter ? this.formatLocalDate(this.endDateFilter) : undefined;

    this.leaveService.getEmployeeLeaveHistory({
      page,
      size: 10,
      status: this.statusFilter || undefined,
      fromDate,
      toDate,
      sort: 'startDate,desc'
    }).subscribe({
      next: (response) => {
        // Convert API response to our component's data structure
        const mapped = response.content.map(item => {
          return {
            id: item.id,
            startDate: item.startDate,
            endDate: item.endDate,
            type: item.type,
            status: item.status?.toUpperCase() as any,
            reason: item.reason,
            employeeName: item.employeeName,
            // Map requestedAt to requestDate for display
            requestDate: item.startDate
          };
        });
        // Optional client-side type filter
        this.dataSource = this.typeFilter ? mapped.filter(x => x.type === this.typeFilter) : mapped;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
        console.log('Employee leave requests loaded:', this.dataSource);
      },
      error: (error) => {
        console.error('Error loading employee leave requests:', error);
        this.loading = false;
        // Show error message
        // For now we'll just log it, but in a real app you might show a notification
      }
    });
  }

  applyFilters(): void {
    this.loadLeaveRequests(0);
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.typeFilter = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.loadLeaveRequests(0);
  }

  onNewRequest(): void {
    this.router.navigate(['/employee/leaves/request']);
  }

  onViewDetails(id: string | number): void {
    this.router.navigate(['/employee/leaves', id]);
  }

  onEditRequest(id: string | number): void {
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
