// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  // Core metrics
  totalEmployees: number;
  pendingLeaveRequests: number;
  approvedLeaveRequestsThisMonth: number;
  rejectedLeaveRequestsThisMonth: number;
  totalLeaveRequestsThisMonth: number;
  approvalRateThisMonth: number;
  
  // Enhanced metrics
  totalLeaveRequestsToday: number;
  approvedLeaveRequestsToday: number;
  averageProcessingTimeHours: number;
  
  // Analytics data
  monthlyTrends: MonthlyTrend[];
  leaveTypeDistribution: LeaveTypeStats[];
  recentActivities: RecentActivity[];
  systemHealth: SystemHealth;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: number;
}

export interface LeaveTypeStats {
  leaveType: string;
  count: number;
  percentage: number;
}

export interface RecentActivity {
  id: number;
  activityType: 'APPROVAL' | 'REJECTION' | 'REQUEST' | 'CANCELLATION';
  employeeName: string;
  leaveType: string;
  description: string;
  timestamp: string;
}

export interface SystemHealth {
  databaseHealthy: boolean;
  apiServicesRunning: boolean;
  emailServiceAvailable: boolean;
  totalSystemUptime: number;
  lastBackupTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/api/admin/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Get comprehensive dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get dashboard statistics for a specific date range
   */
  getDashboardStatsForRange(startDate: string, endDate: string): Observable<DashboardStats> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<DashboardStats>(`${this.API_URL}/stats/range`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get system health status only
   */
  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.API_URL}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Simple health check
   */
  ping(): Observable<string> {
    return this.http.get(`${this.API_URL}/ping`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Dashboard service error:', error);
    return throwError(() => new Error('Dashboard service error: ' + (error.message || 'Unknown error')));
  }
}