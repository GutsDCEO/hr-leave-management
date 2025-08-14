// src/app/modules/admin/dashboard-overview/dashboard-overview.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { Subscription, timer } from 'rxjs';
import { 
  DashboardService, 
  DashboardStats, 
  MonthlyTrend, 
  LeaveTypeStats,
  RecentActivity 
} from '../../../core/services/dashboard.service';

interface ChartDataItem {
  name: string;
  value: number;
  series?: { name: string; value: number }[];
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxChartsModule
    
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  
  // Component state
  dashboardStats?: DashboardStats;
  loading = true;
  error: string | null = null;
  lastUpdated = new Date();

  // Chart data
  monthlyTrendsChartData: ChartDataItem[] = [];
  leaveTypesChartData: ChartDataItem[] = [];

  // Chart configuration
  chartView: [number, number] = [700, 300];
  pieChartView: [number, number] = [400, 300];
  colorScheme = {
    // Changed This
    name: 'custom', // Name of the color scheme
  selectable: true, // Whether the colors can be selected
  group: 'Ordinal', // Group type, can be 'Ordinal' or 'Linear'
    domain: ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#607D8B']
  };

  

  // Subscriptions
  private refreshSubscription?: Subscription;
  private autoRefreshSubscription?: Subscription;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.autoRefreshSubscription?.unsubscribe();
  }

  /**
   * Load dashboard statistics from the backend
   */
  loadDashboardStats(): void {
    this.loading = true;
    this.error = null;

    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.prepareChartData(stats);
        this.lastUpdated = new Date();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardStats();
  }

  /**
   * Set up auto-refresh every 5 minutes
   */
  private setupAutoRefresh(): void {
    this.autoRefreshSubscription = timer(300000, 300000).subscribe(() => {
      if (!this.loading) {
        this.loadDashboardStats();
      }
    });
  }

  /**
   * Prepare chart data from dashboard stats
   */
  private prepareChartData(stats: DashboardStats): void {
    this.prepareMonthlyTrendsData(stats.monthlyTrends);
    this.prepareLeaveTypesData(stats.leaveTypeDistribution);
  }

  /**
   * Prepare monthly trends chart data
   */
  private prepareMonthlyTrendsData(trends: MonthlyTrend[]): void {
    const approvedData: ChartDataItem[] = [];
    const rejectedData: ChartDataItem[] = [];
    const pendingData: ChartDataItem[] = [];

    trends.forEach(trend => {
      const monthName = trend.month;
      approvedData.push({ name: monthName, value: trend.approved });
      rejectedData.push({ name: monthName, value: trend.rejected });
      pendingData.push({ name: monthName, value: trend.pending });
    });

    this.monthlyTrendsChartData = [
      {
        name: 'Approved', series: approvedData,
        value: 0
      },
      {
        name: 'Rejected', series: rejectedData,
        value: 0
      },
      {
        name: 'Pending', series: pendingData,
        value: 0
      }
    ];
  }

  /**
   * Prepare leave types chart data
   */
  private prepareLeaveTypesData(distribution: LeaveTypeStats[]): void {
    this.leaveTypesChartData = distribution.map(item => ({
      name: this.formatLeaveType(item.leaveType),
      value: item.count
    }));
  }

  /**
   * Format leave type for display
   */
  private formatLeaveType(leaveType: string): string {
    return leaveType.toLowerCase().replace(/^\w/, c => c.toUpperCase());
  }

  /**
   * Get activity icon based on activity type
   */
  getActivityIcon(activityType: string): string {
    switch (activityType) {
      case 'APPROVAL':
        return 'check_circle';
      case 'REJECTION':
        return 'cancel';
      case 'REQUEST':
        return 'event';
      case 'CANCELLATION':
        return 'event_busy';
      default:
        return 'info';
    }
  }

  /**
   * Get activity icon CSS class based on activity type
   */
  getActivityIconClass(activityType: string): string {
    switch (activityType) {
      case 'APPROVAL':
        return 'approval';
      case 'REJECTION':
        return 'rejection';
      case 'REQUEST':
        return 'request';
      case 'CANCELLATION':
        return 'cancellation';
      default:
        return 'request';
    }
  }

  /**
   * Format uptime hours to readable format
   */
  formatUptime(hours: number): string {
    if (hours < 24) {
      return `${Math.floor(hours)} hours`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    
    if (days === 1) {
      return `1 day, ${remainingHours}h`;
    }
    
    return `${days} days, ${remainingHours}h`;
  }

  /**
   * Generate report action
   */
  generateReport(): void {
    // Implement report generation logic
    console.log('Generating report...');
    // You can add navigation to a reports component or open a dialog
  }

  /**
   * Open system settings action
   */
  openSettings(): void {
    // Implement settings navigation logic
    console.log('Opening system settings...');
    // You can add navigation to a settings component or open a dialog
  }

  /**
   * Chart select event handler
   */
  onChartSelect(event: any): void {
    console.log('Chart selection:', event);
    // Handle chart selection events if needed
  }

  /**
   * Chart activate event handler
   */
  onChartActivate(event: any): void {
    console.log('Chart activate:', event);
    // Handle chart activation events if needed
  }

  /**
   * Chart deactivate event handler
   */
  onChartDeactivate(event: any): void {
    console.log('Chart deactivate:', event);
    // Handle chart deactivation events if needed
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByActivityId(index: number, activity: RecentActivity): number {
    return activity.id;
  }
}