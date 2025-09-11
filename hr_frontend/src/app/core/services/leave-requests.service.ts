import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason: string;
}

export interface PageResponse {
  content: LeaveRequest[];
  totalPages: number;
  number: number;
  size: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestsService {

  private apiUrl = `${environment.apiUrl}/api/leaves`;
  private employeeApiUrl = `${environment.apiUrl}/api/employee/leaves`;

  constructor(private http: HttpClient) { }

  getLeaves(page = 0, size = 10, status?: string): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (status) params = params.set('status', status);

    return this.http.get<PageResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        console.log('Raw backend response:', response);
        // Check status values
        if (response.content && response.content.length > 0) {
          response.content.forEach(leave => {
            console.log(`Leave ID: ${leave.id}, Original status: ${leave.status}, Type: ${typeof leave.status}`);
          });
        }
      })
    );
  }

  approveLeaveRequest(id: number, reviewer: string = 'admin'): Observable<LeaveRequest> {
    // Using HttpParams for POST with parameters
    const params = new HttpParams().set('reviewer', reviewer);
    return this.http.post<LeaveRequest>(`${this.apiUrl}/${id}/approve`, null, { params });
  }

  rejectLeaveRequest(id: number, reviewer: string = 'admin', reason: string = 'Request rejected'): Observable<LeaveRequest> {
    // Using HttpParams for POST with parameters
    const params = new HttpParams()
      .set('reviewer', reviewer)
      .set('reason', reason);
    return this.http.post<LeaveRequest>(`${this.apiUrl}/${id}/reject`, null, { params });
  }

  // Method to get leave requests for the current employee
  getEmployeeLeaveRequests(page = 0, size = 10, status?: string): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (status) params = params.set('status', status);

    // In a real application, this would use the employee endpoint that automatically
    // filters for the current authenticated user
    // For now, we'll use the same endpoint as admin but in a real app this would be secured by role
    return this.http.get<PageResponse>(this.employeeApiUrl, { params }).pipe(
      tap(response => {
        console.log('Employee leave requests:', response);
      })
    );
  }

  // Method to get employee leave history with server-side filters
  getEmployeeLeaveHistory(query: {
    page: number;
    size: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
    sort?: string;
  }): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('sort', query.sort ?? 'startDate,desc');

    if (query.status) params = params.set('status', query.status);
    if (query.fromDate) params = params.set('fromDate', query.fromDate);
    if (query.toDate) params = params.set('toDate', query.toDate);

    return this.http.get<PageResponse>(`${this.employeeApiUrl}/history`, { params });
  }
}
