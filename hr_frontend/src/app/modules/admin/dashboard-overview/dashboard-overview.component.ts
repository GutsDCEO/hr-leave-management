import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule, NgxChartsModule],
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit {

  dashboardStats?: DashboardStats;
  leaveStatsChartData: any[] = [];
  loading = true;

  // Chart options
  view: [number, number] = [700, 300];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe(stats => {
      this.dashboardStats = stats;
      this.prepareChartData(stats);
      this.loading = false;
    });
  }

  prepareChartData(stats: DashboardStats): void {
    this.leaveStatsChartData = [
      { name: 'Approved', value: stats.approvedLeavesThisMonth },
      { name: 'Rejected', value: stats.rejectedLeavesThisMonth },
      { name: 'Pending', value: stats.pendingLeaves }
    ];
  }

  onChartSelect(event: any): void {
    console.log('Chart event:', event);
  }
}
