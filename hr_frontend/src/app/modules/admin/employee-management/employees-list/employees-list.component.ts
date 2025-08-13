import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AdminUsersService } from '../admin-users.service';
import { AdminUserListItem, Page } from '../models/admin-user.model';

@Component({
    selector: 'app-employees-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, FormsModule],
    templateUrl: './employees-list.component.html',
    styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
    displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'role'];
    data: AdminUserListItem[] = [];
    total = 0;
    pageIndex = 0;
    pageSize = 10;
    q = '';
    role = '';
    loading = false;

    constructor(private users: AdminUsersService) { }

    ngOnInit(): void {
        this.load();
    }

    load() {
        this.loading = true;
        this.users.listUsers({ page: this.pageIndex, size: this.pageSize, q: this.q || undefined, role: this.role || undefined, sort: 'firstName,asc' })
            .subscribe({
                next: (page: Page<AdminUserListItem>) => {
                    this.data = page.content;
                    this.total = page.totalElements;
                    this.loading = false;
                },
                error: () => { this.loading = false; }
            });
    }

    onPage(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.load();
    }
}
