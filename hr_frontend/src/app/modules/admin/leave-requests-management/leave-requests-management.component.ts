import { Component, OnInit } from '@angular/core';
import { LeaveRequestsService } from '../../../core/services/leave-requests.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-requests-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-requests-management.component.html',
  styleUrls: ['./leave-requests-management.component.css']
})
export class LeaveRequestsManagementComponent implements OnInit {
  leaves: any[] = [];
  totalPages = 0;
  currentPage = 0;
  statusFilter: string | undefined;

  constructor(private leaveService: LeaveRequestsService) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves(page = 0) {
    this.leaveService.getLeaves(page, 10, this.statusFilter).subscribe(data => {
      this.leaves = data.content;
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
    });
  }

  onPageChange(newPage: number) {
    this.loadLeaves(newPage);
  }

  onStatusChange(newStatus: string) {
    this.statusFilter = newStatus;
    this.loadLeaves(0);
  }
}
