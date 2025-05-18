import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestsService {

  private apiUrl = 'http://localhost:8080/api/leaves'; // Adjust if needed

  constructor(private http: HttpClient) {}

  getLeaves(page = 0, size = 10, status?: string)  {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<any>(this.apiUrl, { params });
  }
}
