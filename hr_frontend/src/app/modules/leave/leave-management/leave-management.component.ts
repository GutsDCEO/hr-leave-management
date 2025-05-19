import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-leave-management',
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
        this.router.navigate(['/leaves/list']);
        break;
      case 1:
        this.router.navigate(['/leaves/request']);
        break;
    }
  }
}
