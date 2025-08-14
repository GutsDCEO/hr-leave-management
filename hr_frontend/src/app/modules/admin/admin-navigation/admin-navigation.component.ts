// src/app/modules/admin/components/admin-navigation/admin-navigation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { DashboardService } from '@app/core/services/dashboard.service';


interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
  tooltip?: string;
}

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar class="admin-toolbar" color="primary">
      <!-- Brand/Logo Section -->
      <div class="brand-section">
        <mat-icon class="brand-icon">business</mat-icon>
        <span class="brand-title">HR Management</span>
      </div>

      <!-- Navigation Items -->
      <nav class="nav-items">
        <button
          *ngFor="let item of navItems"
          mat-button
          [routerLink]="item.path"
          routerLinkActive="active-nav-button"
          [matTooltip]="item.tooltip || ''"
          class="nav-button">
          <mat-icon [matBadge]="item.badge" [matBadgeHidden]="!item.badge" matBadgeColor="warn">
            {{ item.icon }}
          </mat-icon>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Spacer -->
      <div class="spacer"></div>

      <!-- Current Page Title -->
      <div class="page-title">
        <span>{{ currentPageTitle }}</span>
      </div>

      <!-- User Actions -->
      <div class="user-actions">
        <!-- Notifications -->
        <button mat-icon-button [matMenuTriggerFor]="notificationMenu" matTooltip="Notifications">
          <mat-icon [matBadge]="pendingRequests" [matBadgeHidden]="pendingRequests === 0" matBadgeColor="warn">
            notifications
          </mat-icon>
        </button>

        <!-- User Menu -->
        <button mat-icon-button [matMenuTriggerFor]="userMenu" matTooltip="Account">
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>

      <!-- Notification Menu -->
      <mat-menu #notificationMenu="matMenu" class="notification-menu">
        <div class="menu-header">
          <h3>Notifications</h3>
          <span class="notification-count">{{ pendingRequests }} pending</span>
        </div>
        
        <button mat-menu-item routerLink="/admin/leave-requests" *ngIf="pendingRequests > 0">
          <mat-icon>assignment</mat-icon>
          <span>{{ pendingRequests }} Leave Request{{ pendingRequests > 1 ? 's' : '' }} Pending</span>
        </button>
        <button mat-menu-item *ngIf="pendingRequests === 0" disabled>
          <mat-icon>check_circle</mat-icon>
          <span>All caught up!</span>
        </button>
      </mat-menu>

      <!-- User Menu -->
      <mat-menu #userMenu="matMenu">
        <div class="user-info">
          <mat-icon>admin_panel_settings</mat-icon>
          <div class="user-details">
            <span class="user-name">Admin User</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
        
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .admin-toolbar {
      height: 64px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0 24px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      margin-right: 40px;
    }

    .brand-icon {
      margin-right: 8px;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .nav-items {
      display: flex;
      gap: 8px;
    }

    .nav-button {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-button.active-nav-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }

    .nav-button mat-icon {
      margin-right: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-label {
      font-size: 14px;
      white-space: nowrap;
    }

    .spacer {
      flex: 1;
    }

    .page-title {
      margin-right: 24px;
      font-size: 1.1rem;
      font-weight: 500;
      opacity: 0.9;
    }

    .user-actions {
      display: flex;
      gap: 8px;
    }

    .user-actions button {
      color: rgba(255, 255, 255, 0.9);
    }

    .user-actions button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    /* Menu Styles */
    :host ::ng-deep .notification-menu {
      min-width: 300px;
      max-width: 400px;
    }

    .menu-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .menu-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .notification-count {
      background: #ff5722;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .user-info {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .user-role {
      font-size: 0.875rem;
      color: #666;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .brand-title,
      .page-title,
      .nav-label {
        display: none;
      }

      .admin-toolbar {
        padding: 0 16px;
      }

      .brand-section {
        margin-right: 16px;
      }

      .nav-button {
        padding: 8px 12px;
      }

      .nav-button mat-icon {
        margin-right: 0;
      }
    }
  `]
})
export class AdminNavigationComponent implements OnInit {
  currentPageTitle = 'Dashboard';
  pendingRequests = 0;

  navItems: NavItem[] = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      tooltip: 'View system overview and statistics'
    },
    {
      path: '/admin/leave-requests',
      label: 'Leave Requests',
      icon: 'assignment',
      tooltip: 'Manage employee leave requests'
    },
    {
      path: '/admin/employees',
      label: 'Employees',
      icon: 'people',
      tooltip: 'Manage employee accounts'
    }
  ];

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.updatePageTitle();
    this.loadPendingRequests();

    // Listen to route changes to update page title
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  private updatePageTitle(): void {
    const currentRoute = this.router.url;
    
    if (currentRoute.includes('dashboard')) {
      this.currentPageTitle = 'Dashboard';
    } else if (currentRoute.includes('leave-requests')) {
      this.currentPageTitle = 'Leave Requests';
    } else if (currentRoute.includes('employees')) {
      this.currentPageTitle = 'Employee Management';
    } else {
      this.currentPageTitle = 'Admin Panel';
    }
  }

  private loadPendingRequests(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.pendingRequests = stats.pendingLeaveRequests;
        // Update the badge in nav items
        const leaveRequestsNav = this.navItems.find(item => item.path === '/admin/leave-requests');
        if (leaveRequestsNav) {
          leaveRequestsNav.badge = this.pendingRequests > 0 ? this.pendingRequests : undefined;
        }
      },
      error: (error) => {
        console.error('Error loading pending requests:', error);
      }
    });
  }

  logout(): void {
    // Clear authentication tokens
    localStorage.removeItem('jwt_token');
    
    // Navigate to login
    this.router.navigate(['/login']);
  }
}