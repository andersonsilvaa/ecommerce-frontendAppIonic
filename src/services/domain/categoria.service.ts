import { CategoriaDto } from './../../models/categoria.dto';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CategoriaService {

    constructor(public http: HttpClient){
    }

    consultaTodos() : Observable<CategoriaDto[]> {
        return this.http.get<CategoriaDto[]>(`${API_CONFIG.baseUrl}/categorias`);
    }
}