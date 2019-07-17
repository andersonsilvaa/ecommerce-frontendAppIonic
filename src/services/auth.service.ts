import { CarrinhoService } from './domain/carrinho.service';
import { CrendenciaisDto } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { LocalUser } from '../models/local_user';
import { StorageService } from './storage.service';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storageService: StorageService,
        public carrinhoService: CarrinhoService){}

    authenticate(credenciais: CrendenciaisDto) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            credenciais,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue : string) {
        let token = authorizationValue.substring(7);
        let user : LocalUser = {
            token: token,
            email: this.jwtHelper.decodeToken(token).sub
        };
        this.storageService.setUsuarioLogado(user);
        this.carrinhoService.criarOuLimparCarrinho();
    }

    logout() {
        this.storageService.setUsuarioLogado(null);
    }
}