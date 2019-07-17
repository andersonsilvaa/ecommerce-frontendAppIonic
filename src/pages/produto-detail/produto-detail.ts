import { CarrinhoService } from './../../services/domain/carrinho.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDto } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  item: ProdutoDto;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public carrinhoService: CarrinhoService) {
  }

  ionViewDidLoad() {
    let produtoId = this.navParams.get('produtoId');
    this.produtoService.consultaPorId(produtoId)
      .subscribe(response => {
        this.item = response;
        this.getImageUrlIfExists();
      },
      error => {});
  }

  getImageUrlIfExists() {
    this.produtoService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.item.id}.jpg`;
      },
      error => {});
  }
  
  adicionarNoCarrinho(produto: ProdutoDto) {
    this.carrinhoService.adicionarProduto(produto);
    this.navCtrl.setRoot('CarrinhoPage');
  }
}