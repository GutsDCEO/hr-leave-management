import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// Define types locally since we're having module resolution issues
// Define LeaveType enum - must match backend values
export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
  STUDY = 'STUDY',
  COMPASSIONATE = 'COMPASSIONATE',
  OTHER = 'OTHER'
}

enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

interface LeaveRequest {
  id?: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  attachmentUrl?: string;
  attachment?: File | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaveBalance {
  id?: string;
  employeeId: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays?: number;
  pendingDays?: number;
  fiscalYear: number;
}

// Import the real LeaveService
import { LeaveService } from '../shared/leave.service';

// Date format configuration
const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Using MY_DATE_FORMATS consistently throughout the component

interface LeaveRequestFormGroup {
  leaveType: FormControl<LeaveType | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  reason: FormControl<string | null>;
  attachment: FormControl<File | null>;
}

interface LeaveBalanceExtended extends LeaveBalance {
  remainingDays: number;
  pendingDays: number;
  totalDays: number;
  usedDays: number;
  fiscalYear: number;
  leaveType: LeaveType;
}

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  viewProviders: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  template: `
    <mat-card class="leave-request-card">
      <mat-card-header>
        <mat-card-title>New Leave Request</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="leave-request-form">
          <!-- Leave Type -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Leave Type</mat-label>
            <mat-select formControlName="leaveType" required>
              <mat-option *ngFor="let type of leaveTypes" [value]="type">
                {{ getLeaveTypeDisplay(type) }}
                <span class="remaining-days" *ngIf="getRemainingLeaveDays(type) >= 0">
                  ({{ getRemainingLeaveDays(type) }} days remaining)
                </span>
              </mat-option>
            </mat-select>
            <mat-error *ngIf="leaveForm.get('leaveType')?.hasError('required')">
              Leave type is required
            </mat-error>
          </mat-form-field>

          <!-- Start Date -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker (dateChange)="onDateChange('startDate')"></mat-datepicker>
            <mat-error *ngIf="leaveForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
            <mat-error *ngIf="leaveForm.get('startDate')?.hasError('invalidDate')">
              Please enter a valid date
            </mat-error>
            <mat-error *ngIf="leaveForm.get('startDate')?.hasError('weekendNotAllowed')">
              Weekends are not allowed
            </mat-error>
            <mat-error *ngIf="leaveForm.get('startDate')?.hasError('insufficientNotice')">
              Must submit at least 1 day in advance
            </mat-error>
          </mat-form-field>

          <!-- End Date -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker (dateChange)="onDateChange('endDate')"></mat-datepicker>
            <mat-error *ngIf="leaveForm.get('endDate')?.hasError('required')">
              End date is required
            </mat-error>
            <mat-error *ngIf="leaveForm.get('endDate')?.hasError('invalidDate')">
              Please enter a valid date
            </mat-error>
            <mat-error *ngIf="leaveForm.get('endDate')?.hasError('endBeforeStart')">
              End date must be after start date
            </mat-error>
          </mat-form-field>

          <!-- Duration -->
          <div class="duration-info" *ngIf="durationInDays > 0">
            <span>Duration: {{ durationInDays }} day{{ durationInDays > 1 ? 's' : '' }}</span>
          </div>

          <!-- Reason -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Reason</mat-label>
            <textarea matInput formControlName="reason" rows="3" required></textarea>
            <mat-error *ngIf="leaveForm.get('reason')?.hasError('required')">
              Reason is required
            </mat-error>
            <mat-error *ngIf="leaveForm.get('reason')?.hasError('minlength')">
              Reason must be at least 10 characters
            </mat-error>
            <mat-error *ngIf="leaveForm.get('reason')?.hasError('maxlength')">
              Reason cannot exceed 500 characters
            </mat-error>
          </mat-form-field>

          <!-- Attachment -->
          <div class="form-field">
            <input
              type="file"
              #fileInput
              style="display: none"
              (change)="onFileSelected($event)"
              accept="image/jpeg,image/png,application/pdf"
            >
            <button
              type="button"
              mat-stroked-button
              (click)="fileInput.click()"
              class="attachment-button"
            >
              <mat-icon>attach_file</mat-icon>
              {{ selectedFiles.length > 0 ? 'Change Attachment' : 'Add Attachment' }}
            </button>
            <div *ngIf="selectedFiles.length > 0" class="file-info">
              <span>{{ selectedFiles[0].name }}</span>
              <button
                type="button"
                mat-icon-button
                color="warn"
                (click)="selectedFiles = []; leaveForm.get('attachment')?.setValue(null)"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <mat-hint>Max file size: 5MB. Allowed types: JPG, PNG, PDF</mat-hint>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              mat-button
              (click)="onCancel()"
              [disabled]="submitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              mat-raised-button
              color="primary"
              [disabled]="!leaveForm.valid || submitting"
            >
              <span *ngIf="!submitting">Submit Request</span>
              <span *ngIf="submitting">
                <mat-spinner diameter="20"></mat-spinner>
                Submitting...
              </span>
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .leave-request-card {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1.5rem;
    }
    .leave-request-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-field {
      width: 100%;
    }
    .duration-info {
      margin-top: -1rem;
      margin-bottom: 0.5rem;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }
    .attachment-button {
      margin-bottom: 0.5rem;
    }
    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .remaining-days {
      color: #666;
      font-size: 0.8em;
      margin-left: 8px;
    }
  `]
})
export class LeaveRequestFormComponent implements OnInit {
  leaveForm: FormGroup<LeaveRequestFormGroup>;
  loading = false;
  submitting = false;
  leaveTypes = Object.values(LeaveType);
  today = new Date();
  minStartDate = new Date();
  minEndDate = new Date();
  leaveBalances: LeaveBalanceExtended[] = [];
  selectedFiles: File[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  durationInDays = 0;
  
  dateErrors = {
    required: 'This field is required',
    invalidDate: 'Please enter a valid date',
    startDateAfterEnd: 'Start date must be before end date',
    endDateBeforeStart: 'End date must be after start date',
    weekendNotAllowed: 'Weekends are not allowed',
    insufficientNotice: 'Must submit at least 1 day in advance'
  };

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>
  ) {
    // Set the locale for the date adapter
    this.dateAdapter.setLocale('en-GB'); // Use UK format (DD/MM/YYYY)
    this.leaveForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadLeaveBalances();
    this.setupFormListeners();
    // Set minimum start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minStartDate = tomorrow;
    this.minEndDate = new Date(tomorrow);
    
    // Initialize form with default values if needed
    this.leaveForm.patchValue({
      startDate: null,
      endDate: null
    });
  }

  private createForm(): FormGroup<LeaveRequestFormGroup> {
    const form = this.fb.group<LeaveRequestFormGroup>({
      leaveType: new FormControl<LeaveType | null>(null, [Validators.required]),
      startDate: new FormControl<Date | null>(null, [
        Validators.required,
        this.validateDate.bind(this),
        this.validateWeekend.bind(this)
      ]),
      endDate: new FormControl<Date | null>(null, [
        Validators.required,
        this.validateDate.bind(this),
        this.validateWeekend.bind(this)
      ]),
      reason: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]),
      attachment: new FormControl<File | null>(null, [
        this.validateFileType.bind(this),
        this.validateFileSize.bind(this)
      ])
    });

    // Add cross-field validation
    form.get('startDate')?.valueChanges.subscribe(() => {
      form.get('endDate')?.updateValueAndValidity();
    });

    form.get('endDate')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });

    return form;
  }

  private setupFormListeners(): void {
    // Update minEndDate when startDate changes
    this.leaveForm.get('startDate')?.valueChanges.subscribe((startDate: Date | null) => {
      if (startDate) {
        this.minEndDate = new Date(startDate);
        this.leaveForm.get('endDate')?.updateValueAndValidity();
      }
    });

    // Calculate duration when dates change
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDuration());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDuration());
  }

  private calculateDuration(): void {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      this.durationInDays = this.calculateWorkingDays(startDate, endDate);

      // Update end date if it's before start date
      if (startDate > endDate) {
        this.leaveForm.patchValue({
          endDate: startDate
        });
        this.durationInDays = 1;
      }
    } else {
      this.durationInDays = 0;
    }
  }

  private validateDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const date = new Date(control.value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    // For start date, ensure it's not in the past
    if (control === this.leaveForm?.get('startDate')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) {
        return { pastDate: true };
      }
    }
    
    // For end date, ensure it's not before start date
    if (control === this.leaveForm?.get('endDate') && this.leaveForm?.get('startDate')?.value) {
      const startDateValue = this.leaveForm.get('startDate')?.value;
      if (startDateValue) {
        const startDate = new Date(startDateValue);
        if (date < startDate) {
          return { endDateBeforeStart: true };
        }
      }
    }
    
    return null;
  }

  private validateWeekend(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const date = new Date(control.value);
    if (isNaN(date.getTime())) return null;

    const day = date.getDay();
    if (day === 0 || day === 6) {
      return { weekendNotAllowed: true };
    }

    // Check if date is at least 1 day in advance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return { insufficientNotice: true };
    }


    return null;
  }

  private validateFileType(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const file = control.value as File;
    if (!this.allowedFileTypes.includes(file.type)) {
      return { invalidFileType: true };
    }

    return null;
  }

  private validateFileSize(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const file = control.value as File;
    if (file.size > this.maxFileSize) {
      return { fileTooLarge: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Submit Leave Request',
        message: 'Are you sure you want to submit this leave request?',
        confirmText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.submitLeaveRequest();
      }
    });
  }

  private submitLeaveRequest(): void {
    if (this.leaveForm.invalid) return;

    this.submitting = true;

    const formValue = this.leaveForm.value;
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const leaveRequest = {
      type: formValue.leaveType!,
      startDate: formatDate(formValue.startDate!),
      endDate: formatDate(formValue.endDate!),
      reason: formValue.reason || ''
    };

    console.log('Submitting leave request:', leaveRequest);

    this.leaveService.createLeaveRequest(leaveRequest).subscribe({
      next: () => {
        this.snackBar.open('Leave request submitted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/leave/my-requests']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error submitting leave request:', error);
        let errorMessage = 'Failed to submit leave request';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Invalid request. Please check your input.';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.leaveForm.patchValue({ attachment: file });
      this.leaveForm.get('attachment')?.updateValueAndValidity();
    }
  }

  getLeaveTypeDisplay(type: string): string {
    if (!type) return '';
    // Add a space before capital letters and capitalize the first letter
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  getRemainingLeaveDays(leaveType: LeaveType): number {
    const balance = this.leaveBalances.find(b => b.leaveType === leaveType);
    return balance ? balance.remainingDays : 0;
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return '';
    const momentDate = new Date(date);
    return momentDate.toISOString().split('T')[0];
  }

  // Date validation function for the date picker
  // Custom date validation for the date picker
  onDateChange(field: 'startDate' | 'endDate') {
    const dateControl = this.leaveForm.get(field);
    if (!dateControl || !dateControl.value) return;
    
    const selectedDate = new Date(dateControl.value);
    const day = selectedDate.getDay();
    const isWeekend = day === 0 || day === 6;
    
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    selectedDate.setHours(0, 0, 0, 0);
    const isPastDate = selectedDate < today;
    
    if (isWeekend || isPastDate) {
      // Reset the invalid date
      dateControl.setValue(null);
      
      // Show error message
      const errorMessage = isWeekend ? 'Weekends are not allowed' : 'Cannot select past dates';
      this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
    }
    
    // Update end date validation if start date changes
    if (field === 'startDate' && this.leaveForm.get('endDate')?.value) {
      this.validateDateRange();
    }
  }
  
  // Validate that end date is after start date
  private validateDateRange() {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.leaveForm.get('endDate')?.setValue(null);
      this.snackBar.open('End date must be after start date', 'Close', { duration: 3000 });
    }
  }

  calculateWorkingDays(start: Date | null | undefined, end: Date | null | undefined): number {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Reset time part to avoid timezone issues
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate > endDate) return 0;

    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();
      // Count only weekdays (0 = Sunday, 6 = Saturday)
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return Math.max(1, count); // Ensure at least 1 day is returned
  }

  private loadLeaveBalances(): void {
    this.loading = true;
    this.leaveService.getMyLeaveBalance().subscribe({
      next: (response: any) => {
        const balances = Array.isArray(response) ? response : [response];
        this.leaveBalances = balances.map((balance: any) => ({
          ...balance,
          remainingDays: (balance.totalDays || 0) - (balance.usedDays || 0) - (balance.pendingDays || 0)
        }));
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading leave balances:', error);
        this.snackBar.open('Failed to load leave balances', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    if (this.leaveForm.dirty && !this.leaveForm.pristine) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirm Cancel',
          message: 'Are you sure you want to cancel? Any unsaved changes will be lost.',
          confirmText: 'Yes, Cancel',
          cancelText: 'No, Continue Editing',
          warn: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/leaves/list']).catch(err => {
            console.error('Navigation error:', err);
            // Fallback to root if navigation fails
            this.router.navigate(['/']);
          });
        }
      });
    } else {
      this.router.navigate(['/leaves/list']).catch(err => {
        console.error('Navigation error:', err);
        // Fallback to root if navigation fails
        this.router.navigate(['/']);
      });
    }
  }
}
