import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CarrinhoItem } from '../../models/carrinho-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CarrinhoService } from '../../services/domain/carrinho.service';
import { ProdutoDto } from '../../models/produto.dto';

@IonicPage()
@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html',
})
export class CarrinhoPage {

  itens: CarrinhoItem[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public carrinhoService: CarrinhoService,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let carrinho = this.carrinhoService.getCarrinho();
    this.itens = carrinho.itens;
    this.loadImageUrls();
  }

  loadImageUrls() {
    for (var i=0; i<this.itens.length; i++) {
      let item = this.itens[i];
      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => {
          item.produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
        },
        error => {});
    }
  }  

  removerItem(produto: ProdutoDto) {
    this.itens = this.carrinhoService.removerProduto(produto).itens;
  }

  aumentarQuantidade(produto: ProdutoDto) {
    this.itens = this.carrinhoService.aumentarQuantidade(produto).itens;
  }

  diminuirQuantidade(produto: ProdutoDto) {
    this.itens = this.carrinhoService.diminuirQuantidade(produto).itens;
  }

  total() : number {
    return this.carrinhoService.total();
  }  

  continuarComprando() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  finalizarPedido() {
    this.navCtrl.push('EnderecoPage');
  }
}