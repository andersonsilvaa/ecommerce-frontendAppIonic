import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDto } from "../../models/pedido.dto";

@Injectable()
export class PedidoService {

    constructor(public http: HttpClient) {
    }

    salvar(obj: PedidoDto) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}