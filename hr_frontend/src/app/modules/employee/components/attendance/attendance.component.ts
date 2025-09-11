import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Attendance {
    id: number;
    attendanceDate: string;
    clockIn: string;
    clockOut?: string;
}

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
    private readonly baseUrl = `${environment.apiUrl}/api/attendance`;
    private attendanceRecordsSubject = new BehaviorSubject<Attendance[]>([]);
    public attendanceRecords: Attendance[] = [];

    isClockedIn: boolean = false;
    isLoading: boolean = false;
    isLoadingHistory: boolean = false;
    statusMessage: string | null = null;
    statusType: 'success' | 'error' | null = null;


    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.attendanceRecordsSubject.subscribe(records => {
            this.attendanceRecords = records;
            // Check if the user is clocked in
            if (records.length > 0) {
                const today = new Date().toISOString().slice(0, 10);
                const latestRecord = records[0];
                this.isClockedIn = latestRecord.attendanceDate === today && !latestRecord.clockOut;
            }
        });
        this.loadAttendanceHistory();
    }

    loadAttendanceHistory(): void {
        this.isLoadingHistory = true;
        this.http.get<Attendance[]>(`${this.baseUrl}/my-attendance`).pipe(
            catchError(error => {
                this.showStatusMessage('Failed to load attendance history.', 'error');
                this.isLoadingHistory = false;
                return throwError(() => new Error(error));
            })
        ).subscribe(records => {
            this.attendanceRecordsSubject.next(records);
            this.isLoadingHistory = false;
        });
    }

    clockIn(): void {
        this.isLoading = true;
        this.http.post<Attendance>(`${this.baseUrl}/clock-in`, {}).pipe(
            catchError(error => {
                this.showStatusMessage(error.error || 'Failed to clock in.', 'error');
                this.isLoading = false;
                return throwError(() => new Error(error));
            })
        ).subscribe(newRecord => {
            const records = this.attendanceRecordsSubject.getValue();
            this.attendanceRecordsSubject.next([newRecord, ...records]);
            this.isClockedIn = true;
            this.isLoading = false;
            this.showStatusMessage('Clock in successful!', 'success');
        });
    }

    clockOut(): void {
        this.isLoading = true;
        this.http.post<Attendance>(`${this.baseUrl}/clock-out`, {}).pipe(
            catchError(error => {
                this.showStatusMessage(error.error || 'Failed to clock out.', 'error');
                this.isLoading = false;
                return throwError(() => new Error(error));
            })
        ).subscribe(updatedRecord => {
            const records = this.attendanceRecordsSubject.getValue();
            const updatedRecords = records.map(record =>
                record.id === updatedRecord.id ? updatedRecord : record
            );
            this.attendanceRecordsSubject.next(updatedRecords);
            this.isClockedIn = false;
            this.isLoading = false;
            this.showStatusMessage('Clock out successful!', 'success');
        });
    }

    private showStatusMessage(message: string, type: 'success' | 'error'): void {
        this.statusMessage = message;
        this.statusType = type;
        setTimeout(() => {
            this.statusMessage = null;
            this.statusType = null;
        }, 5000);
    }
}
