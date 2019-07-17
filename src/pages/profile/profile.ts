import { ClienteDto } from './../../models/cliente.dto';
import { ClienteService } from './../../services/domain/cliente.service';
import { StorageService } from './../../services/storage.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDto;
  picture: string;
  profileImage;
  cameraLigada: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storageService: StorageService,
    public clienteService: ClienteService,
    public camera: Camera) {
  }

  ionViewDidLoad() {
    this.carregarDados();
  }

  carregarDados(){
    let usuarioLogado = this.storageService.getUsuarioLogado();
    if(usuarioLogado && usuarioLogado.email){
      this.clienteService.consultaPorEmail(usuarioLogado.email)
        .subscribe(response => {
          this.cliente = response as ClienteDto;
          this.getImageCliente();
        },
        error => {
          if(error.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        });
    }else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  // Verifica se existe imagem do cliente no serviço da amazon
  // Se existe adiciona no cliente a imagem
  // Se não existe a imagem o sistema mostrará automaticamente a imagem padrão
  getImageCliente() {
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
    },
    error => {});
  }

  // https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee
  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => fulfill(reader.result);
        reader.readAsDataURL(blob);
    })
  }

  getImagemDaCamera() {
    this.cameraLigada = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraLigada = false;
    }, (err) => {
      this.cameraLigada = false;
    });
  }

  getImagemDaGaleria() {

    this.cameraLigada = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraLigada = false;
    }, (err) => {
      this.cameraLigada = false;
    });
  }

  enviarImagem() {
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.carregarDados();
        this.getImageCliente();
      },
      error => {
      });
  }

  descartarImagem() {
    this.picture = null;
  }

}
