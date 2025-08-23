import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveRequestsService } from '../../core/services/leave-requests.service';

interface Activity {
  type: 'success' | 'warning' | 'info' | 'error';
  icon: string;
  message: string;
  time: string;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoading = false;
  totalEmployees = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  attendanceRate = 95;
  recentActivities: Activity[] = [];

  constructor(
    private router: Router,
    private leaveService: LeaveRequestsService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadRecentActivities();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load pending requests count with proper error handling
    // Use smaller page size (10) to avoid backend issues with large page sizes
    this.leaveService.getLeaves(0, 10, 'PENDING').subscribe({
      next: (data) => {
        this.pendingRequests = data.totalElements;
        this.isLoading = false;
        console.log('Admin dashboard: Successfully loaded pending requests count:', data.totalElements);
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
        
        // Set fallback data when backend is unavailable
        this.pendingRequests = 0; // Default to 0 pending requests
        this.isLoading = false;
        
        // Add error activity to recent activities
        this.addErrorActivity('Unable to load pending requests from server');
      }
    });

    // Mock data for other statistics (in a real app, these would come from services)
    this.totalEmployees = 45;
    this.approvedRequests = 23;
    this.attendanceRate = 95;
  }

  loadRecentActivities() {
    // Mock recent activities (in a real app, these would come from a service)
    this.recentActivities = [
      {
        type: 'success',
        icon: 'fas fa-check-circle',
        message: 'Leave request approved for John Doe',
        time: '2 minutes ago'
      },
      {
        type: 'warning',
        icon: 'fas fa-exclamation-triangle',
        message: 'New leave request from Jane Smith',
        time: '15 minutes ago'
      },
      {
        type: 'info',
        icon: 'fas fa-user-plus',
        message: 'New employee registered: Mike Johnson',
        time: '1 hour ago'
      },
      {
        type: 'success',
        icon: 'fas fa-chart-line',
        message: 'Monthly attendance report generated',
        time: '2 hours ago'
      }
    ];
  }

  refreshDashboard() {
    this.loadDashboardData();
    this.loadRecentActivities();
  }

  navigateToLeaveManagement() {
    this.router.navigate(['/admin/leave-requests']);
  }

  navigateToEmployeeDirectory() {
    this.router.navigate(['/admin/employees']);
  }

  navigateToReports() {
    this.router.navigate(['/admin/reports']);
  }

  navigateToSettings() {
    this.router.navigate(['/admin/settings']);
  }

  private addErrorActivity(message: string) {
    const errorActivity: Activity = {
      type: 'error',
      icon: 'fas fa-exclamation-circle',
      message: message,
      time: 'just now'
    };
    
    // Add to the beginning of the activities array
    this.recentActivities.unshift(errorActivity);
    
    // Keep only the last 10 activities
    if (this.recentActivities.length > 10) {
      this.recentActivities = this.recentActivities.slice(0, 10);
    }
  }
}
