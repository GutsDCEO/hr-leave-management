import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AdminUserListItem, Page } from './models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
    constructor(private api: ApiService) { }

    listUsers(params: { page?: number; size?: number; sort?: string; q?: string; role?: string }): Observable<Page<AdminUserListItem>> {
        let httpParams = new HttpParams();
        if (params.page != null) httpParams = httpParams.set('page', params.page);
        if (params.size != null) httpParams = httpParams.set('size', params.size);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);
        if (params.q) httpParams = httpParams.set('q', params.q);
        if (params.role) httpParams = httpParams.set('role', params.role);

        return this.api.get<Page<AdminUserListItem>>('/api/admin/users', httpParams);
    }
}
