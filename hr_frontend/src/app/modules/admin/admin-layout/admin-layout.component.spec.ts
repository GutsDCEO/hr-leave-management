// src/app/modules/admin/components/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminNavigationComponent
  ],
  template: `
    <div class="admin-layout">
      <!-- Top Navigation -->
      <app-admin-navigation></app-admin-navigation>
      
      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer (Optional) -->
      <footer class="admin-footer">
        <div class="footer-content">
          <span>&copy; 2024 HR Management System. All rights reserved.</span>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    .main-content {
      flex: 1;
      overflow-x: auto;
      padding-top: 0; /* Navigation already has proper spacing */
    }

    .admin-footer {
      background: #fff;
      border-top: 1px solid #e0e0e0;
      padding: 16px 24px;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #666;
    }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-link {
      color: #666;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-link:hover {
      color: #2196f3;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-footer {
        padding: 12px 16px;
      }

      .footer-content {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .footer-links {
        gap: 16px;
      }
    }
  `]
})
export class AdminLayoutComponent {}