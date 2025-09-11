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
    // Corrected base URL to align with backend endpoint
    private readonly baseUrl = `${environment.apiUrl}/api/user/profile`;
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
        // Updated to use the new endpoint structure, assuming a change-password endpoint under /api/user/
        return this.http.post<void>(`${environment.apiUrl}/api/user/change-password`, dto);
    }

    updatePreferences(dto: UpdatePreferencesDto): Observable<UserProfile> {
        // Updated to use the new endpoint structure, assuming a preferences endpoint under /api/user/
        return this.http.patch<UserProfile>(`${environment.apiUrl}/api/user/preferences`, dto).pipe(
            tap(profile => this.profile$.next(profile))
        );
    }
}


