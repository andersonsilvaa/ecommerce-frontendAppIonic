import { ImageUtilService } from './../image-util.service';
import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { ClienteDto } from '../../models/cliente.dto';

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient, 
        public storageService: StorageService,
        public imageUtilService: ImageUtilService){
    }

    consultaPorId(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    consultaPorEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    // Pega a imagem do cliente no serviço da amazon
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }

    salvar(obj : ClienteDto) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    uploadPicture(picture) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData : FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`, 
            formData,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}