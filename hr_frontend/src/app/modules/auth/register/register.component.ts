import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showAdminCode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      adminCode: ['']
    });
  }

  onAdminClick(): void {
    this.showAdminCode = true;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { email, password, firstName, lastName, adminCode } = this.registerForm.value;
    const payload: any = { email, password, firstName, lastName };
    if (this.showAdminCode && adminCode) {
      payload['adminCode'] = adminCode;
    }
    this.authService.register(payload).subscribe({
      next: () => {
        this.toast.showSuccess('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.showError(err?.error || 'Registration failed');
      }
    });
  }
}
