import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(customHeaders?: { [header: string]: string }): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', ...customHeaders });
    // JWT token is typically added by an HTTP interceptor (JwtInterceptor), so not added here directly
    return headers;
  }

  get<T>(endpoint: string, params?: HttpParams, headers?: { [header: string]: string }): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(headers),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any, headers?: { [header: string]: string }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any, headers?: { [header: string]: string }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, headers?: { [header: string]: string }): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Optionally, add more robust error handling here
    return throwError(() => error);
  }
}
