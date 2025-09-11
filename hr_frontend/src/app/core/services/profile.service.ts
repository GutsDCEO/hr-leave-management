import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    employeeId?: string;
    avatarUrl?: string;
    preferences?: {
        emailNotifications?: boolean;
        language?: string;
        theme?: string;
    };
}

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
    position?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface UpdatePreferencesDto {
    emailNotifications?: boolean;
    language?: string;
    theme?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private readonly baseUrl = `${environment.apiUrl}/api/users/me`;
    private profile$ = new ReplaySubject<UserProfile>(1);

    constructor(private http: HttpClient) { }

    getMe(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.baseUrl).pipe(
            tap(profile => this.profile$.next(profile))
        );
    }

    getMeCached(): Observable<UserProfile> {
        return this.profile$.asObservable();
    }

    updateProfile(dto: UpdateProfileDto): Observable<UserProfile> {
        return this.http.put<UserProfile>(this.baseUrl, dto).pipe(
            tap(profile => this.profile$.next(profile))
        );
    }

    changePassword(dto: ChangePasswordDto): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/change-password`, dto);
    }

    updatePreferences(dto: UpdatePreferencesDto): Observable<UserProfile> {
        return this.http.patch<UserProfile>(`${this.baseUrl}/preferences`, dto).pipe(
            tap(profile => this.profile$.next(profile))
        );
    }
}


