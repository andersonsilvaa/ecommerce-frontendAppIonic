import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDto } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDto[] = [];
  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.carregarDados();
  }

  carregarDados() {
    let categoriaId = this.navParams.get('categoriaId');
    let loader = this.presentLoading();
    this.produtoService.consultaPorCategoria(categoriaId, this.page, 10)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        loader.dismiss();
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      });
  }

  loadImageUrls(start: number, end: number) {
    for (var i=start; i<=end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});
    }
  }  

  detalharProduto(produtoId : string) {
    this.navCtrl.push('ProdutoDetailPage', {produtoId: produtoId});
  }

  // apresenta a mensagem de loading
  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  // atualiza os dados quando o usuário puxar a tela para baixo
  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.carregarDados();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.carregarDados();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}