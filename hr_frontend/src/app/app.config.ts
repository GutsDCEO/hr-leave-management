import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptorFn } from './core/interceptors/JwtInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptorFn])
    ),
    provideAnimations(),
    importProvidersFrom(MaterialModule, BrowserAnimationsModule)
  ]
};
