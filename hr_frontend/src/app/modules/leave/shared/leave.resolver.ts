import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LeaveRequest } from '../models/leave.model';
import { LeaveService } from './leave.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveResolver implements Resolve<LeaveRequest | null> {
  constructor(private leaveService: LeaveService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<LeaveRequest | null> {
    const id = route.paramMap.get('id');
    
    if (!id) {
      return of(null);
    }

    return this.leaveService.getLeaveRequest(id).pipe(
      catchError(error => {
        console.error('Error fetching leave request:', error);
        return of(null);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class LeaveListResolver implements Resolve<{ data: LeaveRequest[]; total: number } | null> {
  constructor(private leaveService: LeaveService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ data: LeaveRequest[]; total: number } | null> {
    // You can add query parameters here if needed
    const params = {
      page: '1',
      limit: '10',
      status: 'ALL'
    };

    return this.leaveService.getMyLeaveRequests(params).pipe(
      catchError(error => {
        console.error('Error fetching leave requests:', error);
        return of(null);
      })
    );
  }
}
