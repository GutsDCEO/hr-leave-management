import { LeaveRequest, LeaveType, LeaveStatus, LeaveTypeConfig, LEAVE_TYPES_CONFIG } from '../models/leave.model';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveUtils {
  constructor(private datePipe: DatePipe) {}

  /**
   * Calculate the number of working days between two dates
   * @param startDate Start date
   * @param endDate End date (inclusive)
   * @param holidays Array of holiday dates
   * @returns Number of working days
   */
  calculateWorkingDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
    if (!startDate || !endDate) return 0;
    
    // Make sure we have Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure start date is before or equal to end date
    if (start > end) return 0;
    
    // Calculate the difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    let workingDays = 0;
    const currentDate = new Date(start);
    
    // Iterate through each day and check if it's a working day
    for (let i = 0; i < diffDays; i++) {
      const day = currentDate.getDay();
      
      // Check if it's a weekend (0 = Sunday, 6 = Saturday)
      if (day !== 0 && day !== 6) {
        // Check if it's a holiday
        const isHoliday = holidays.some(holiday => {
          return holiday.toDateString() === currentDate.toDateString();
        });
        
        if (!isHoliday) {
          workingDays++;
        }
      }
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workingDays;
  }

  /**
   * Format a date range as a string
   * @param startDate Start date
   * @param endDate End date
   * @returns Formatted date range string
   */
  formatDateRange(startDate: Date | string | null, endDate: Date | string | null): string {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const format = 'MMM d, y';
    const startStr = this.datePipe.transform(start, format) || '';
    const endStr = this.datePipe.transform(end, format) || '';
    
    if (!startStr || !endStr) return '';
    
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  }

  /**
   * Get the display name for a leave type
   * @param leaveType Leave type
   * @returns Display name
   */
  getLeaveTypeName(leaveType: LeaveType): string {
    return LEAVE_TYPES_CONFIG[leaveType]?.name || leaveType;
  }

  /**
   * Get the configuration for a leave type
   * @param leaveType Leave type
   * @returns Leave type configuration
   */
  getLeaveTypeConfig(leaveType: LeaveType): LeaveTypeConfig {
    return LEAVE_TYPES_CONFIG[leaveType] || {
      type: leaveType,
      name: leaveType,
      description: '',
      requiresApproval: true,
      isPaid: false
    };
  }

  /**
   * Get the status color for a leave request
   * @param status Leave status
   * @returns Color code
   */
  getStatusColor(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'primary';
      case LeaveStatus.PENDING:
        return 'accent';
      case LeaveStatus.REJECTED:
        return 'warn';
      case LeaveStatus.CANCELLED:
        return '';
      default:
        return '';
    }
  }

  /**
   * Check if a leave request can be cancelled
   * @param leaveRequest Leave request
   * @returns True if the request can be cancelled
   */
  canCancelLeave(leaveRequest: LeaveRequest): boolean {
    if (!leaveRequest) return false;
    
    const status = leaveRequest.status;
    return status === LeaveStatus.PENDING || status === LeaveStatus.APPROVED;
  }

  /**
   * Check if a leave request can be edited
   * @param leaveRequest Leave request
   * @returns True if the request can be edited
   */
  canEditLeave(leaveRequest: LeaveRequest): boolean {
    if (!leaveRequest) return false;
    return leaveRequest.status === LeaveStatus.PENDING;
  }

  /**
   * Validate a leave request
   * @param leaveRequest Leave request to validate
   * @returns Array of error messages, empty if valid
   */
  validateLeaveRequest(leaveRequest: Partial<LeaveRequest>): string[] {
    const errors: string[] = [];
    
    if (!leaveRequest.leaveType) {
      errors.push('Leave type is required');
    }
    
    if (!leaveRequest.startDate) {
      errors.push('Start date is required');
    }
    
    if (!leaveRequest.endDate) {
      errors.push('End date is required');
    }
    
    if (leaveRequest.startDate && leaveRequest.endDate) {
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      
      if (start > end) {
        errors.push('End date must be after start date');
      }
      
      if (leaveRequest.leaveType) {
        const config = this.getLeaveTypeConfig(leaveRequest.leaveType);
        
        if (config.maxConsecutiveDays) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          if (diffDays > config.maxConsecutiveDays) {
            errors.push(`Maximum ${config.maxConsecutiveDays} consecutive days allowed for ${config.name}`);
          }
        }
      }
    }
    
    if (!leaveRequest.reason?.trim()) {
      errors.push('Reason is required');
    }
    
    return errors;
  }
}
