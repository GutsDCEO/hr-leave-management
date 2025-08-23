// src/app/shared/components/toast/toast.component.ts
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    template: `
        <div *ngIf="toastService.visible$ | async" class="toast-container">
            <div class="toast" [ngClass]="toastService.type$ | async">
                <div class="toast-icon">
                    <i *ngIf="(toastService.type$ | async) === 'success'" class="fas fa-check"></i>
                    <i *ngIf="(toastService.type$ | async) === 'error'" class="fas fa-exclamation-triangle"></i>
                    <i *ngIf="(toastService.type$ | async) === 'warning'" class="fas fa-exclamation-circle"></i>
                    <i *ngIf="(toastService.type$ | async) === 'info'" class="fas fa-info-circle"></i>
                </div>
                <div class="toast-content">
                    <p class="toast-message">{{ toastService.message$ | async }}</p>
                </div>
                <button class="toast-close" (click)="closeToast()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="toast-progress"></div>
            </div>
        </div>
    `,
    styleUrls: ['./toast.component.css'],
    imports: [CommonModule]
})
export class ToastComponent {
    constructor(public toastService: ToastService) {}

    closeToast(): void {
        this.toastService.hide();
    }
}