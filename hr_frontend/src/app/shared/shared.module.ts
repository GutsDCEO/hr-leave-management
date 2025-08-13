import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ConfirmDialogComponent // Import the standalone component
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ConfirmDialogComponent // Export it to make it available to other modules
  ]
})
export class SharedModule { }
