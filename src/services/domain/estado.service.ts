import { EstadoDto } from './../../models/estado.dto';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class EstadoService {

    constructor(public http: HttpClient){
    }

    consultaTodos() : Observable<EstadoDto[]> {
        return this.http.get<EstadoDto[]>(`${API_CONFIG.baseUrl}/estados`);
    }
}