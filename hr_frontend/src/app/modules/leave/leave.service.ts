import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { LeaveRequest } from './leave-request.model';
import { LeaveBalance } from './leave-balance.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/api/leaves`;

  constructor(private http: HttpClient) { }

  // Submit a new leave request
  submitLeaveRequest(leaveRequest: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}`, leaveRequest);
  }

  // Get all leave requests for the current user
  getLeaveRequests(params?: any): Observable<{ data: LeaveRequest[], total: number }> {
    return this.http.get<{ data: LeaveRequest[], total: number }>(this.apiUrl, { params });
  }

  // Get leave request by ID
  getLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/${id}`);
  }

  // Cancel a leave request
  cancelLeaveRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get leave balance for the current user
  getLeaveBalance(): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${this.apiUrl}/balance`);
  }

  // Check for overlapping leaves
  checkOverlappingLeaves(startDate: string, endDate: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/overlapping`, {
      params: { startDate, endDate }
    });
  }

  // Check if user has sufficient leave balance
  checkLeaveBalance(leaveType: string, days: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/balance/check`, {
      params: { leaveType, days: days.toString() }
    });
  }
}
