import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storageService: StorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let usuarioLogado = this.storageService.getUsuarioLogado();

        let N = API_CONFIG.baseUrl.length;
        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl;

        if (usuarioLogado && requestToAPI) {
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + usuarioLogado.token)});
            return next.handle(authReq);
        }
        else {
            return next.handle(req);
        }
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};