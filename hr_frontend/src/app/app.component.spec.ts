import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn: false
    });

    Object.defineProperty(authServiceSpy, 'isLoggedIn', {
      get: () => false,
      configurable: true
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AppComponent,
        NavbarComponent,
        SidebarComponent,
        RouterOutlet
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should show navbar when user is logged in', () => {
    Object.defineProperty(authService, 'isLoggedIn', {
      get: () => true,
      configurable: true
    });
    fixture.detectChanges();
    const navbar = fixture.nativeElement.querySelector('app-navbar');
    expect(navbar).toBeTruthy();
  });

  it('should show sidebar when user is logged in', () => {
    Object.defineProperty(authService, 'isLoggedIn', {
      get: () => true,
      configurable: true
    });
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('app-sidebar');
    expect(sidebar).toBeTruthy();
  });

  it('should not show navbar when user is not logged in', () => {
    Object.defineProperty(authService, 'isLoggedIn', {
      get: () => false,
      configurable: true
    });
    fixture.detectChanges();
    const navbar = fixture.nativeElement.querySelector('app-navbar');
    expect(navbar).toBeFalsy();
  });
});
