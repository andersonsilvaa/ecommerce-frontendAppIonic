import { API_CONFIG } from './../../config/api.config';
import { CategoriaDto } from './../../models/categoria.dto';
import { CategoriaService } from './../../services/domain/categoria.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: CategoriaDto[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  ionViewDidLoad() {
    this.categoriaService.consultaTodos()
        .subscribe(response => {
          this.items = response;
        },
        error => {});
  }

  consultarProdutos(categoriaId : string) {
    this.navCtrl.push('ProdutosPage', {categoriaId: categoriaId});    
  }

}
