import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptorFn } from './app/core/interceptors/JwtInterceptor';

// Import compiler for development mode to support JIT compilation if needed
import { isDevMode } from '@angular/core';
if (isDevMode()) {
  import('@angular/compiler');
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withInterceptors([jwtInterceptorFn])
    )
  ]
})
  .catch((err) => console.error(err));
