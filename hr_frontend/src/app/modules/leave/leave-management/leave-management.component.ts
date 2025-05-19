import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss']
})
export class LeaveManagementComponent implements OnInit {
  activeTab = 'list';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set active tab based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      if (url.includes('request')) {
        this.activeTab = 'request';
      } else {
        this.activeTab = 'list';
      }
    });
  }

  onTabChange(event: any): void {
    switch (event.index) {
      case 0:
        this.router.navigate(['/employee/leaves/list']);
        break;
      case 1:
        this.router.navigate(['/employee/leaves/request']);
        break;
    }
  }
}
