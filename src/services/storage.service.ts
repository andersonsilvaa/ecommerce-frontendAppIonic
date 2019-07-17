import { CarrinhoDto } from '../models/carrinho.dto';
import { STORAGE_KEYS } from './../config/storage_keys.config';
import { LocalUser } from './../models/local_user';
import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

    // Recupera o usuario logado
    getUsuarioLogado(): LocalUser{
        let usuarioLogado = localStorage.getItem(STORAGE_KEYS.localUser);

        if(usuarioLogado==null){
            return null;
        }else{
            return JSON.parse(usuarioLogado);
        }
    }

    // Adiciona o usuario logado 
    setUsuarioLogado(obj : LocalUser){
        if(obj==null){
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }else{
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }

    getCarrinho() : CarrinhoDto {
        let str = localStorage.getItem(STORAGE_KEYS.carrinho);
        if (str != null) {
            return JSON.parse(str);
        }
        else {
            return null;
        }
    }
    
    setCarrinho(obj : CarrinhoDto) {
        if (obj != null) {
            localStorage.setItem(STORAGE_KEYS.carrinho, JSON.stringify(obj));
        } 
        else {
            localStorage.removeItem(STORAGE_KEYS.carrinho);
        }
    }
}