import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ProfileService, UserProfile } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatTab,
    MatTabGroup
  ]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  preferencesForm!: FormGroup;
  avatarUrl: string = 'assets/default-avatar.png';
  isEditing: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private profileService: ProfileService) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      department: [''],
      position: [''],
      employeeId: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      emailNotifications: [true],
      language: ['en'],
      theme: ['light']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value === confirmPassword.value
      ? null 
      : { passwordMismatch: true };
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;
    this.profileService.getMe().subscribe({
      next: (profile: UserProfile) => {
        this.profileForm.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          department: profile.department || '',
          position: profile.position || '',
          employeeId: profile.employeeId || ''
        });
        this.avatarUrl = profile.avatarUrl || this.avatarUrl;
        if (profile.preferences) {
          this.preferencesForm.patchValue({
            emailNotifications: profile.preferences.emailNotifications ?? true,
            language: profile.preferences.language ?? 'en',
            theme: profile.preferences.theme ?? 'light'
          });
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile data';
        this.loading = false;
      }
    });
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
        this.snackBar.open('Profile picture updated!', 'Close', { duration: 3000 });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.disable();
    } else {
      this.profileForm.enable();
    }
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile update:', this.profileForm.value);
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      this.isEditing = false;
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
        return;
      }
      console.log('Password update:', this.passwordForm.value);
      this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      this.passwordForm.reset();
    }
  }

  onPreferencesSubmit(): void {
    if (this.preferencesForm.valid) {
      console.log('Preferences update:', this.preferencesForm.value);
      this.snackBar.open('Preferences updated successfully!', 'Close', { duration: 3000 });
    }
  }
}
