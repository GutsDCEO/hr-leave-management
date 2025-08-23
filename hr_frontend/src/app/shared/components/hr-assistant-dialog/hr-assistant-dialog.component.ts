import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HrAssistantComponent } from '../hr-assistant/hr-assistant.component';

@Component({
  selector: 'app-hr-assistant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    HrAssistantComponent
  ],
  template: `
    <div class="hr-assistant-dialog-container">
      <div class="dialog-header" mat-dialog-title>
        <span>HR Assistant</span>
        <button mat-icon-button (click)="close()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div mat-dialog-content class="dialog-content">
        <app-hr-assistant></app-hr-assistant>
      </div>
    </div>
  `,
  styles: [`
    .hr-assistant-dialog-container {
      padding: 0;
      margin: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      margin: 0;
    }

    .close-button {
      color: white;
    }

    .dialog-content {
      flex: 1;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    .dialog-content app-hr-assistant {
      height: 100%;
      display: block;
    }

    ::ng-deep .hr-assistant-dialog .mat-mdc-dialog-container {
      padding: 0;
    }

    ::ng-deep .hr-assistant-dialog .mat-mdc-dialog-content {
      padding: 0;
      margin: 0;
    }
  `]
})
export class HrAssistantDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<HrAssistantDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
