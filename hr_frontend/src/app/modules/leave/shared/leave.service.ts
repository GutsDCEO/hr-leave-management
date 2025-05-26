import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LeaveRequest, LeaveBalance, LeaveType, LeaveStatus } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/api/leaves`;

  constructor(private http: HttpClient) {}

  // Get all leave requests for the current user
  getMyLeaveRequests(params?: any): Observable<{ data: LeaveRequest[], total: number }> {
    console.log('Fetching leave requests with params:', params);
    const url = `${environment.apiUrl}/api/leaves`; // Updated endpoint
    console.log('API URL:', url);
    
    // Log the token that will be sent with the request
    const token = localStorage.getItem('jwt_token');
    console.log('JWT Token being sent:', token ? 'Token exists' + (token.length > 20 ? ' (truncated) ' + token.substring(0, 20) + '...' : '') : 'No token found');
    
    return this.http.get<any>(url, { 
      params,
      observe: 'response' // Get full HTTP response
    }).pipe(
      map(response => {
        console.log('Raw API response status:', response.status);
        console.log('Raw API response headers:', response.headers);
        const responseBody = response.body;
        console.log('Raw API response body:', responseBody);
        
        // Handle different response formats
        let data: LeaveRequest[] = [];
        let total = 0;
        
        if (Array.isArray(responseBody)) {
          // If response is an array
          data = responseBody;
          total = responseBody.length;
        } else if (responseBody && Array.isArray(responseBody.data)) {
          // If response has a data array
          data = responseBody.data;
          total = responseBody.total || responseBody.data.length;
        } else if (responseBody?.content && Array.isArray(responseBody.content)) {
          // If response is a page with content array (Spring Data format)
          data = responseBody.content;
          total = responseBody.totalElements || responseBody.content.length;
        } else if (responseBody?.results && Array.isArray(responseBody.results)) {
          // If response has a results array
          data = responseBody.results;
          total = responseBody.count || responseBody.results.length;
        } else if (responseBody) {
          // If we get an object but can't parse it, log a warning
          console.warn('Unexpected response format:', responseBody);
          // Try to extract any potential error message
          if (responseBody.message) {
            throw new Error(responseBody.message);
          }
        }
        
        if (data.length === 0) {
          console.log('No leave requests found in the response');
        } else {
          console.log(`Processed ${data.length} leave requests`);
        }
        
        return { data, total };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getMyLeaveRequests:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url,
          headers: error.headers
        });
        
        let errorMessage = 'Failed to load leave requests';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to view leave requests.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Get a specific leave request by ID
  getLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${environment.apiUrl}/api/employee/leaves/${id}`);
  }

  // Create a new leave request
  createLeaveRequest(leaveData: {
    startDate: string | Date;
    endDate: string | Date;
    type: string;
    reason?: string;
  }): Observable<LeaveRequest> {
    // Format dates to YYYY-MM-DD format
    const formatDate = (date: string | Date): string => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    const payload = {
      startDate: formatDate(leaveData.startDate),
      endDate: formatDate(leaveData.endDate),
      type: leaveData.type,
      reason: leaveData.reason || ''
    };

    console.log('Submitting leave request with payload:', payload);
    
    return this.http.post<LeaveRequest>(`${environment.apiUrl}/api/employee/leaves`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error submitting leave request:', error);
          let errorMessage = 'An error occurred while submitting the leave request.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid request. Please check your input.';
          } else if (error.status === 401) {
            errorMessage = 'Please log in to submit a leave request.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to perform this action.';
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your connection.';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Update an existing leave request
  updateLeaveRequest(id: string, leaveRequest: Partial<LeaveRequest>): Observable<LeaveRequest> {
    console.log('Updating leave request:', { id, leaveRequest });
    return this.http.put<LeaveRequest>(`${environment.apiUrl}/api/employee/leaves/${id}`, leaveRequest)
      .pipe(
        catchError(error => {
          console.error('Error updating leave request:', error);
          throw error;
        })
      );
  }

  // Cancel a leave request
  cancelLeaveRequest(id: string): Observable<void> {
    console.log('Canceling leave request:', id);
    return this.http.patch<void>(`${environment.apiUrl}/api/employee/leaves/${id}/cancel`, {})
      .pipe(
        catchError(error => {
          console.error('Error canceling leave request:', error);
          throw error;
        })
      );
  }

  // Get leave balance for the current user
  getMyLeaveBalance(): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${environment.apiUrl}/api/employee/leaves/balance`);
  }

  // Get leave requests for team members (for managers)
  getTeamLeaveRequests(params?: any): Observable<{ data: LeaveRequest[], total: number }> {
    return this.http.get<{ data: LeaveRequest[], total: number }>(`${this.apiUrl}/team`, { params });
  }

  // Approve/Reject leave request (for managers)
  updateLeaveStatus(id: string, status: LeaveStatus, comment?: string): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.apiUrl}/${id}/status`, { status, comment });
  }

  // Get leave types
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.apiUrl}/types`);
  }

  // Get leave calendar events
  getLeaveCalendar(startDate: Date, endDate: Date): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<any[]>(`${this.apiUrl}/calendar`, { params });
  }
}
