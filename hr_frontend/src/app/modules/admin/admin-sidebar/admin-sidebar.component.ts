import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestsService } from '../../../core/services/leave-requests.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  pendingCount = 0;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveRequestsService
  ) {}

  ngOnInit() {
    this.loadPendingCount();
  }

  loadPendingCount() {
    this.leaveService.getLeaves(0, 100, 'PENDING').subscribe({
      next: (data) => {
        this.pendingCount = data.totalElements;
      },
      error: (error) => {
        console.error('Error loading pending count:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
} 