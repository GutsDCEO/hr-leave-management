// src/app/shared/components/toast/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private messageSubject = new BehaviorSubject<string>('');
    private typeSubject = new BehaviorSubject<ToastType>('success');
    private visibleSubject = new BehaviorSubject<boolean>(false);

    message$ = this.messageSubject.asObservable();
    type$ = this.typeSubject.asObservable();
    visible$ = this.visibleSubject.asObservable();

    showSuccess(message: string, duration: number = 6000): void {
        this.show(message, 'success', duration);
    }

    showError(message: string, duration: number = 6000): void {
        this.show(message, 'error', duration);
    }

    showWarning(message: string, duration: number = 6000): void {
        this.show(message, 'warning', duration);
    }

    showInfo(message: string, duration: number = 6000): void {
        this.show(message, 'info', duration);
    }

    hide(): void {
        this.visibleSubject.next(false);
    }

    private show(message: string, type: ToastType, duration: number): void {
        this.messageSubject.next(message);
        this.typeSubject.next(type);
        this.visibleSubject.next(true);
        
        setTimeout(() => {
            this.visibleSubject.next(false);
        }, duration);
    }
}