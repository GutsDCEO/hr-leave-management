// src/app/shared/components/toast/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private messageSubject = new BehaviorSubject<string>('');
    private typeSubject = new BehaviorSubject<'success' | 'error'>('success');
    private visibleSubject = new BehaviorSubject<boolean>(false);

    message$ = this.messageSubject.asObservable();
    type$ = this.typeSubject.asObservable();
    visible$ = this.visibleSubject.asObservable();

    showSuccess(message: string, duration: number = 6000): void {
        this.messageSubject.next(message);
        this.typeSubject.next('success');
        this.visibleSubject.next(true);
        setTimeout(() => this.visibleSubject.next(false), duration);
    }

    showError(message: string): void {
        this.messageSubject.next(message);
        this.typeSubject.next('error');
        this.visibleSubject.next(true);
        setTimeout(() => this.visibleSubject.next(false), 3000);
    }
}