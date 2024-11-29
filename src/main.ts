import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MockModule } from './app/mocks/mock.module';
import { withInterceptorsFromDi, provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app/app.routes';
import { CustomHttpInterceptorService } from './app/app.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, IonicModule.forRoot()),
        provideRouter(routes, withDebugTracing()),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CustomHttpInterceptorService,
          multi: true,
      }
    ]
})
  .catch(err => console.log(err));
