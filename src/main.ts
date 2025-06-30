import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app/app.routes';
import { jsonIntercepter } from './app/core/interceptors/jsonInterceptor';
import { authIntercepter } from './app/core/interceptors/authInterceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, IonicModule.forRoot()),
        provideRouter(routes, withDebugTracing()),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(
          withInterceptors([jsonIntercepter, authIntercepter])
        ),
    ]
})
  .catch(err => console.log(err));
