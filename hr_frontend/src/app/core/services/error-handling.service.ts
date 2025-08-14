// src/app/core/services/error-handling.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorMessage {
  title: string;
  message: string;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Handle HTTP errors and show appropriate user messages
   */
  handleHttpError(error: HttpErrorResponse): ErrorMessage {
    let errorMessage: ErrorMessage;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
        action: 'Retry'
      };
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = {
            title: 'Bad Request',
            message: 'The request was invalid. Please check your input.',
            action: 'Correct Input'
          };
          break;
        case 401:
          errorMessage = {
            title: 'Unauthorized',
            message: 'Your session has expired. Please log in again.',
            action: 'Login'
          };
          break;
        case 403:
          errorMessage = {
            title: 'Forbidden',
            message: 'You do not have permission to access this resource.',
            action: 'Contact Admin'
          };
          break;
        case 404:
          errorMessage = {
            title: 'Not Found',
            message: 'The requested resource could not be found.',
            action: 'Go Back'
          };
          break;
        case 500:
          errorMessage = {
            title: 'Server Error',
            message: 'An internal server error occurred. Please try again later.',
            action: 'Retry'
          };
          break;
        case 503:
          errorMessage = {
            title: 'Service Unavailable',
            message: 'The service is temporarily unavailable. Please try again later.',
            action: 'Retry Later'
          };
          break;
        default:
          errorMessage = {
            title: 'Unknown Error',
            message: `An unexpected error occurred (${error.status}). Please try again.`,
            action: 'Retry'
          };
      }
    }

    // Show snackbar notification
    this.showErrorSnackbar(errorMessage.title, errorMessage.message);
    
    return errorMessage;
  }

  /**
   * Show success message
   */
  showSuccess(message: string, action: string = 'Close', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Show info message
   */
  showInfo(message: string, action: string = 'Close', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Show warning message
   */
  showWarning(message: string, action: string = 'Close', duration: number = 7000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Show error snackbar
   */
  private showErrorSnackbar(title: string, message: string, duration: number = 10000): void {
    this.snackBar.open(`${title}: ${message}`, 'Dismiss', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Handle dashboard-specific errors
   */
  handleDashboardError(error: any): void {
    console.error('Dashboard error:', error);
    
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.showErrorSnackbar(
        'Dashboard Error',
        'Failed to load dashboard data. Please refresh the page.'
      );
    }
  }

  /**
   * Handle leave request operation errors
   */
  handleLeaveRequestError(error: any, operation: string): void {
    console.error(`Leave request ${operation} error:`, error);
    
    if (error instanceof HttpErrorResponse) {
      const errorMessage = this.handleHttpError(error);
      // Don't show duplicate snackbar
    } else {
      this.showErrorSnackbar(
        'Leave Request Error',
        `Failed to ${operation} leave request. Please try again.`
      );
    }
  }
}