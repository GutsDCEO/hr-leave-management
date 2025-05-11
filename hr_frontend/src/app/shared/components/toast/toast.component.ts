// src/app/shared/components/toast/toast.component.ts
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    template: `
        <div *ngIf="toastService.visible$ | async" class="toast" [ngClass]="toastService.type$ | async">
            {{ toastService.message$ | async }}
        </div>
    `,
    styleUrls: ['./toast.component.css'],
    imports: [CommonModule]
})
export class ToastComponent {
    constructor(public toastService: ToastService) {}
}