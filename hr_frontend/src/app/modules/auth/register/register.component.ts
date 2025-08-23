import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showAdminCode: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
      ]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      adminCode: ['']
    });
  }

  onAdminClick(): void {
    this.showAdminCode = !this.showAdminCode;
    if (this.showAdminCode) {
      this.registerForm.get('adminCode')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('adminCode')?.clearValidators();
    }
    this.registerForm.get('adminCode')?.updateValueAndValidity();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    const { email, password, firstName, lastName, adminCode } = this.registerForm.value;
    
    // Determine role based on admin code
    let role = 'EMPLOYEE'; // default role
    if (this.showAdminCode && adminCode) {
      role = 'ADMIN';
    }
    
    const payload = { 
      email, 
      password, 
      firstName, 
      lastName, 
      role,
      adminCode: this.showAdminCode && adminCode ? adminCode : undefined
    };
    
    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.showSuccess('Registration successful! Welcome to our platform.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        this.toast.showError(err?.error?.message || err?.error || 'Registration failed. Please try again.');
      }
    });
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least one digit, one lowercase, one uppercase letter and one special character (@#$%^&+=)';
    }
    return '';
  }
}
