// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model'; // Adjust the path as necessary
import { environment } from '../../../environments/environment'; // Adjust the path as necessary
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //Backend server address is stored in environment.ts
  private apiUrl = environment.apiUrl;

  //currentUserSubject holds the current user's information to track if the user is logged or not
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  //window is used to redirect the user to the login page
  window: any;

  //constructor is used to inject the http and router services which means it checks browser storage for existing login token
  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  // Initialize auth state by decoding the stored token
  // 1- Looks for saved JWT token in browser storage
  // 2- If found, decodes it and sets current user
  // 3- If not found, sets current user to null
  private initializeAuthState(): void {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
  }

  //  Sends user's sign-up info (name, email, password) to my backend
  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, payload);
  }


  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          // 1- Stores received token in browser storage
          localStorage.setItem('jwt_token', response.token);
          // 2- Decodes token and sets current user
          const user = this.decodeToken(response.token);
          // 3- Update current user container
          this.currentUserSubject.next(user);
        })
      ).pipe(
        tap(() => {
          // 4- After successful login, navigate to the home page (or dashboard)
          this.router.navigate(['/']);
        })
      );
  }

  // Decode token to get User (email + role)
  private decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Extract role as a string (no longer an array)
      return {
        email: payload.sub,
        role: payload.role // "ADMIN", "EMPLOYEE", etc.
      };
    } catch (e) {
      return null;
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  

  logout(): void {
    localStorage.removeItem('jwt_token')

    this.currentUserSubject.next(null);
    window.location.replace('/login');
    
  }

  // Get the User object (includes role)
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Derive role from the User object
  get currentRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch (e) {
      console.error('Error validating token:', e);
      this.logout();
      return false;
    }
  }
}