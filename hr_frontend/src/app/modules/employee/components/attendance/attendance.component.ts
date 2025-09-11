import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="attendance-page">
      <h2>Attendance</h2>
      <p>Attendance page placeholder. Implement details next.</p>
    </div>
  `,
    styles: [`
    .attendance-page { padding: 16px; }
    h2 { margin: 0 0 12px 0; }
  `]
})
export class AttendanceComponent { }


