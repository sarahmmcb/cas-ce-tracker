import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HttpMockApiInterceptor } from './mock.interceptor';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpMockApiInterceptor,
      multi: true
    }
  ]
})
export class MockModule { }
