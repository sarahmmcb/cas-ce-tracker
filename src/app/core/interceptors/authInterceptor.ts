import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";

export function authIntercepter(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthService).accessToken;
    request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${authToken}`)});

    return next(request);
}
