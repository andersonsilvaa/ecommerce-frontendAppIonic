import { CidadeDto } from './../../models/cidade.dto';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CidadeService {

    constructor(public http: HttpClient){
    }

    consultaCidadesPorEstado(estadoId: string) : Observable<CidadeDto[]> {
        return this.http.get<CidadeDto[]>(`${API_CONFIG.baseUrl}/estados/${estadoId}/cidades`);
    }
}